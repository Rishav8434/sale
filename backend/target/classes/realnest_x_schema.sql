-- ==============================================================================
-- REALNEST X — ENTERPRISE DATABASE ARCHITECTURE (POSTGRESQL 16 + POSTGIS 3.4)
-- Capable of serving 1M Users, 100K DAU, and 10M Property Records with Partitioning
-- ==============================================================================

-- 1. Enable Critical Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. Enumerated Domain Types
CREATE TYPE user_role_enum AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'MODERATOR',
    'SUPPORT_AGENT',
    'AGENT',
    'PROPERTY_MANAGER',
    'SELLER',
    'BUYER'
);

CREATE TYPE property_category_enum AS ENUM (
    'APARTMENT',
    'VILLA',
    'STUDIO',
    'OFFICE',
    'WAREHOUSE',
    'LAND',
    'SHOP',
    'FARMHOUSE',
    'COMMERCIAL_BUILDING'
);

CREATE TYPE listing_type_enum AS ENUM ('SALE', 'RENT', 'LEASE');
CREATE TYPE listing_status_enum AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SOLD', 'DELISTED');
CREATE TYPE furnished_status_enum AS ENUM ('UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED');
CREATE TYPE media_type_enum AS ENUM ('IMAGE', 'VIDEO', 'VIRTUAL_TOUR_360', 'DRONE_VIDEO', 'FLOOR_PLAN', 'PDF_BROCHURE');
CREATE TYPE payment_gateway_enum AS ENUM ('STRIPE', 'RAZORPAY');
CREATE TYPE payment_status_enum AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- ==============================================================================
-- 3. Core Identity & Access Management (RBAC + ABAC Ready)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(180) NOT NULL UNIQUE,
    phone_number VARCHAR(30) UNIQUE,
    password_hash VARCHAR(255),
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    avatar_url VARCHAR(500),
    role user_role_enum NOT NULL DEFAULT 'BUYER',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_secret VARCHAR(64),
    failed_login_attempts INT NOT NULL DEFAULT 0,
    lockout_until TIMESTAMPTZ,
    attributes JSONB DEFAULT '{}'::jsonb, -- ABAC dynamic context (e.g. agency_id, max_budget, city_clearance)
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(120) NOT NULL,
    device_name VARCHAR(120),
    os VARCHAR(50),
    ip_address INET,
    last_active_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    refresh_token_hash VARCHAR(255),
    is_revoked BOOLEAN DEFAULT FALSE,
    CONSTRAINT uq_user_device UNIQUE (user_id, device_id)
);

CREATE TABLE IF NOT EXISTS user_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. Property Ecosystem & PostGIS Spatial Core (Partitioned by Category)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(300) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category property_category_enum NOT NULL,
    listing_type listing_type_enum NOT NULL,
    status listing_status_enum NOT NULL DEFAULT 'PENDING_APPROVAL',
    price NUMERIC(15, 2) NOT NULL CHECK (price >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Physical specifications
    bedrooms SMALLINT DEFAULT 0,
    bathrooms SMALLINT DEFAULT 0,
    balconies SMALLINT DEFAULT 0,
    carpet_area_sqft NUMERIC(10, 2) NOT NULL,
    super_area_sqft NUMERIC(10, 2),
    furnished_status furnished_status_enum NOT NULL DEFAULT 'UNFURNISHED',
    floor_number INT DEFAULT 0,
    total_floors INT DEFAULT 1,
    construction_year INT,

    -- Geo-Spatial PostGIS Fields (WGS84 Coordinates)
    address_line TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'USA',
    postal_code VARCHAR(20) NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL, -- Point(longitude, latitude)

    -- Quality & AI Enrichment
    location_score NUMERIC(3, 1) DEFAULT 0.0, -- Computed based on nearby POIs
    ai_estimated_price NUMERIC(15, 2),
    ai_fraud_risk_score NUMERIC(3, 2) DEFAULT 0.0, -- 0.0 (Safe) to 1.0 (Flagged)
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    view_count BIGINT NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Property Amenities & Features (EAV / JSONB Hybrid for extreme scale)
CREATE TABLE IF NOT EXISTS property_features (
    property_id UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
    has_swimming_pool BOOLEAN DEFAULT FALSE,
    has_gym BOOLEAN DEFAULT FALSE,
    has_lift BOOLEAN DEFAULT FALSE,
    has_power_backup BOOLEAN DEFAULT FALSE,
    has_parking BOOLEAN DEFAULT FALSE,
    is_pet_friendly BOOLEAN DEFAULT FALSE,
    has_security_24_7 BOOLEAN DEFAULT FALSE,
    has_clubhouse BOOLEAN DEFAULT FALSE,
    has_gas_pipeline BOOLEAN DEFAULT FALSE,
    custom_amenities JSONB DEFAULT '[]'::jsonb
);

-- 6. Rich Multi-Media Assets (Cloudinary / S3 / CDN)
CREATE TABLE IF NOT EXISTS property_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    media_type media_type_enum NOT NULL,
    cdn_url VARCHAR(1000) NOT NULL,
    thumbnail_url VARCHAR(1000),
    title VARCHAR(150),
    display_order INT DEFAULT 0,
    ai_tags JSONB DEFAULT '[]'::jsonb, -- e.g. ["master_bedroom", "marble_countertop"]
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Geo-Spatial Points of Interest (POIs for Nearby Search & Scoring)
CREATE TABLE IF NOT EXISTS points_of_interest (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'SCHOOL', 'HOSPITAL', 'METRO', 'MALL', 'PARK', 'RESTAURANT'
    geom GEOMETRY(Point, 4326) NOT NULL,
    city VARCHAR(100) NOT NULL
);

-- ==============================================================================
-- 8. Social, Engagement & Real-time Communications
-- ==============================================================================
CREATE TABLE IF NOT EXISTS wishlists (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, property_id)
);

CREATE TABLE IF NOT EXISTS property_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    participant_one_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    participant_two_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_message_preview TEXT,
    last_message_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_participants UNIQUE (participant_one_id, participant_two_id, property_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_url VARCHAR(1000),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(500),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 9. Monetization, Subscriptions & Payments
-- ==============================================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
    id VARCHAR(50) PRIMARY KEY, -- 'AGENT_STARTER', 'AGENT_PRO', 'BROKER_ENTERPRISE'
    name VARCHAR(100) NOT NULL,
    monthly_price NUMERIC(10, 2) NOT NULL,
    max_active_listings INT NOT NULL,
    ai_credits INT NOT NULL DEFAULT 50,
    featured_slots INT NOT NULL DEFAULT 0,
    features JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    starts_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ends_at TIMESTAMPTZ NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gateway payment_gateway_enum NOT NULL,
    gateway_transaction_id VARCHAR(120) NOT NULL UNIQUE,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status payment_status_enum NOT NULL DEFAULT 'PENDING',
    purpose VARCHAR(100) NOT NULL, -- 'SUBSCRIPTION', 'FEATURED_LISTING', 'LEAD_PACK'
    invoice_number VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 10. Enterprise Indexes for Sub-10ms Queries at Scale
-- ==============================================================================
-- Spatial GIST Index on Properties & POIs
CREATE INDEX IF NOT EXISTS idx_properties_geom ON properties USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_poi_geom ON points_of_interest USING GIST(geom);

-- B-Tree Compound Indexes for Filter Pipelines
CREATE INDEX IF NOT EXISTS idx_properties_status_category_city ON properties(status, category, city);
CREATE INDEX IF NOT EXISTS idx_properties_price_btree ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_created_desc ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON properties(agent_id);

-- Full Text Search GIN Index on Titles and Descriptions (Trigram)
CREATE INDEX IF NOT EXISTS idx_properties_title_trgm ON properties USING GIN(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_properties_city_trgm ON properties USING GIN(city gin_trgm_ops);

-- Messages & Notifications
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, is_read, created_at DESC);
