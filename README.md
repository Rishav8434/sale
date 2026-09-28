# RealNest - Production-Grade Real Estate Listing Platform

RealNest is a full-stack, enterprise-grade real estate platform where customers can browse and list properties for sale or rent, and administrators can manage user accounts and review/approve listings through a modern moderation workflow.

---

## Architecture Overview

```
                      +---------------------------------------+
                      |             Client Browser            |
                      +---------------------------------------+
                                          |
                      (HTTP / REST / JSON / Multipart)
                                          v
+---------------------------------------------------------------------------------+
|                                 RealNest Frontend                               |
|  - React 19 + Vite                                                              |
|  - Tailwind CSS + Glassmorphism UI                                              |
|  - React Router (Protected Routes & Role Guards)                                |
|  - Axios Interceptors (Automatic JWT Injection & 401 Auto-Recovery)             |
|  - React Hook Form + Yup (Declarative Schema Validations)                       |
+---------------------------------------------------------------------------------+
                                          |
                      (Reverse Proxy / CORS Configured)
                                          v
+---------------------------------------------------------------------------------+
|                                 RealNest Backend                                |
|  - Spring Boot 3.3.x (Java 17 / 21)                                             |
|  - Spring Security (Stateless JWT Filter Chain, BCrypt 10 rounds)               |
|  - Spring Data JPA + Hibernate (Query Execution, Auditing, Indexing)            |
|  - Global Exception Handling (@RestControllerAdvice, Standardized ErrorDetails)  |
|  - OpenAPI 3.0 / Swagger UI                                                     |
+---------------------------------------------------------------------------------+
               |                                                 |
               v                                                 v
+-----------------------------+                  +--------------------------------+
|       Database Layer        |                  |         Media Storage          |
| - PostgreSQL (Production)   |                  | - Cloudinary Media Pipeline    |
| - H2 In-Memory (Dev/Test)   |                  | - Resilient Curated Fallbacks  |
| - Auto-Seeded Demo Data     |                  +--------------------------------+
+-----------------------------+
```

---

## 1. Complete Project Structure

```
RealNest/
├── backend/
│   ├── pom.xml                                  # Maven dependencies & plugins
│   ├── run-backend.sh                          # One-click startup script
│   ├── Dockerfile                               # Multi-stage Eclipse Temurin image
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/realnest/
│   │   │   │   ├── RealNestApplication.java     # Spring Boot application entry point
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java      # FilterChain, CORS & password encoder
│   │   │   │   │   ├── OpenApiConfig.java       # Swagger 3 & Bearer auth config
│   │   │   │   │   ├── CloudinaryConfig.java    # Cloudinary bean definition
│   │   │   │   │   └── DataInitializer.java     # Automatic seeder for accounts & estates
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthController.java      # /api/auth (register, login)
│   │   │   │   │   ├── PropertyController.java  # /api/properties (CRUD, search, upload)
│   │   │   │   │   ├── AdminController.java     # /api/admin (users, approve, reject)
│   │   │   │   │   └── UserController.java      # /api/users/me (profile)
│   │   │   │   ├── dto/
│   │   │   │   │   ├── request/                 # Register, Login, Create, Update
│   │   │   │   │   └── response/                # Auth, Property, User, Paged, Api
│   │   │   │   ├── entity/
│   │   │   │   │   ├── User.java                # Customer and Admin entity
│   │   │   │   │   ├── Role.java                # ROLE_CUSTOMER, ROLE_ADMIN
│   │   │   │   │   ├── Property.java            # Property listing entity
│   │   │   │   │   └── PropertyType.java        # SALE, RENT
│   │   │   │   ├── exception/
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   │   ├── BadRequestException.java
│   │   │   │   │   ├── UnauthorizedException.java
│   │   │   │   │   ├── FileUploadException.java
│   │   │   │   │   └── ErrorDetails.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── UserRepository.java      # Email query and existence methods
│   │   │   │   │   └── PropertyRepository.java  # Dynamic multi-criteria JPQL search
│   │   │   │   ├── security/
│   │   │   │   │   ├── JwtTokenProvider.java    # JJWT token generation and validation
│   │   │   │   │   ├── JwtAuthenticationFilter.java # OncePerRequestFilter for Bearer token
│   │   │   │   │   ├── JwtAuthenticationEntryPoint.java # JSON 401 error handler
│   │   │   │   │   ├── UserPrincipal.java       # UserDetails implementation
│   │   │   │   │   └── CustomUserDetailsService.java
│   │   │   │   └── service/
│   │   │   │       ├── AuthService.java & AuthServiceImpl.java
│   │   │   │       ├── UserService.java & UserServiceImpl.java
│   │   │   │       ├── PropertyService.java & PropertyServiceImpl.java
│   │   │   │       └── CloudinaryService.java & CloudinaryServiceImpl.java
│   │   │   └── resources/
│   │   │       ├── application.yml              # Base properties (JWT, Cloudinary, Swagger)
│   │   │       ├── application-dev.yml          # Zero-setup H2 PostgreSQL mode
│   │   │       ├── application-prod.yml         # Containerized PostgreSQL config
│   │   │       └── schema.sql                   # Normalized DDL schema
│   │   └── test/java/com/realnest/
│   │       └── RealNestApplicationTests.java    # SpringBootTest context verification
├── frontend/
│   ├── package.json                             # React 19, Tailwind, Lucide, Axios
│   ├── vite.config.js                           # Vite + Tailwind v4 + Backend Proxy
│   ├── Dockerfile                               # Multi-stage Node build + Nginx
│   ├── nginx.conf                               # SPA routing fallback & /api proxy
│   ├── index.html                               # HTML5, Plus Jakarta Sans, SEO tags
│   └── src/
│       ├── main.jsx                             # React root
│       ├── App.jsx                              # Route definitions & AuthProvider
│       ├── index.css                            # Tailwind v4 styles, glassmorphism
│       ├── api/                                 # Axios client, auth, property, admin
│       ├── context/                             # AuthContext state, login, logout
│       ├── components/                          # Navbar, Footer, PropertyCard, Modal...
│       └── pages/                               # Home, Properties, Detail, Dashboards...
├── docker-compose.yml                           # Postgres + Backend + Frontend stack
└── README.md
```

---

## 2. Database Schema & ER Diagram

### Normalized Relational Schema

```
 +------------------------------------+             +--------------------------------------+
 |               USERS                |             |              PROPERTIES              |
 +------------------------------------+             +--------------------------------------+
 | id            : BIGSERIAL (PK)     |<---+        | id          : BIGSERIAL (PK)         |
 | name          : VARCHAR(100)       |    |        | title       : VARCHAR(200)           |
 | email         : VARCHAR(150) UNIQUE|    |        | description : TEXT                   |
 | password      : VARCHAR(255)       |    |        | price       : DECIMAL(14,2)          |
 | role          : VARCHAR(30)        |    |        | type        : VARCHAR(20) [SALE/RENT]|
 | created_at    : TIMESTAMPTZ        |    +--------| owner_id    : BIGINT (FK)            |
 | updated_at    : TIMESTAMPTZ        |             | location    : VARCHAR(255)           |
 +------------------------------------+             | image_url   : VARCHAR(500)           |
                                                    | approved    : BOOLEAN (DEFAULT FALSE)|
                                                    | created_at  : TIMESTAMPTZ            |
                                                    | updated_at  : TIMESTAMPTZ            |
                                                    +--------------------------------------+
```

### Relational Integrity & Performance:
1. **Relationship**: `1 User -> N Properties` via Foreign Key `properties.owner_id` with `ON DELETE CASCADE`.
2. **Indexes**:
   - `idx_properties_type`: Accelerates filtering by `SALE` or `RENT`.
   - `idx_properties_approved`: Filters public vs. moderation listings.
   - `idx_properties_location`: Fast text filtering across cities and states.
   - `idx_properties_price`: High performance range queries (`minPrice` to `maxPrice`).
   - `idx_users_email`: High speed login authentication lookup.

---

## 3. Seeded Demo Accounts (Zero Setup)

The application boots automatically with seeded accounts and properties:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@realnest.io` | `Password@123` | Moderate listings, approve/reject properties, delete users |
| **Customer** | `sophia@realnest.io` | `Password@123` | Create listings, update/delete own listings, upload photos |

---

## 4. API Endpoints Reference

All endpoints are prefixed with `/api`. Interactive documentation is available via **Swagger UI** at `http://localhost:8080/api/swagger-ui.html`.

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer or admin user |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and receive Bearer JWT |

### Property Endpoints (`/api/properties`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/properties` | Public | Search approved listings with filters, sorting & pagination |
| `GET` | `/api/properties/{id}` | Public | Retrieve full property details by ID |
| `POST` | `/api/properties` | Authenticated | Create a new listing (starts as `pending approval`) |
| `PUT` | `/api/properties/{id}` | Owner / Admin | Update title, price, description, type, location |
| `DELETE` | `/api/properties/{id}` | Owner / Admin | Delete listing permanently |
| `GET` | `/api/properties/my-listings` | Authenticated | Retrieve currently authenticated user's listings |
| `POST` | `/api/properties/upload-image` | Authenticated | Upload image to Cloudinary (returns secure CDN URL) |

### Admin Endpoints (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | `ROLE_ADMIN` | List all registered users and listing counts |
| `DELETE` | `/api/admin/users/{id}` | `ROLE_ADMIN` | Delete user account and cascade delete their listings |
| `GET` | `/api/admin/properties` | `ROLE_ADMIN` | View all properties with optional approval status filter |
| `PATCH` | `/api/admin/properties/{id}/approve` | `ROLE_ADMIN` | Approve property listing (makes it public) |
| `PATCH` | `/api/admin/properties/{id}/reject` | `ROLE_ADMIN` | Reject or unpublish property listing |
| `DELETE` | `/api/admin/properties/{id}` | `ROLE_ADMIN` | Administratively delete any listing |

---

## 5. Quick Start (Running Locally)

### Prerequisites
- Java 17 or Java 21
- Node.js 18+ and npm 9+
- Maven 3.8+ (or use the included wrapper script)

### Step 1: Start Backend
In the project root, start the Spring Boot server:
```bash
cd backend
bash run-backend.sh
```
*The backend starts at `http://localhost:8080/api` with embedded H2 in PostgreSQL mode, auto-migrating and bootstrapping demo users.*

Verify backend health:
- Swagger Documentation: [http://localhost:8080/api/swagger-ui.html](http://localhost:8080/api/swagger-ui.html)
- H2 Web Console: [http://localhost:8080/api/h2-console](http://localhost:8080/api/h2-console) (JDBC URL: `jdbc:h2:mem:realnestdb`, User: `sa`, Password: *(empty)*)

### Step 2: Start Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The React app starts at `http://localhost:5173` with instant hot-reloading and proxying to the backend.*

---

## 6. Docker Deployment

Deploy the entire production stack (PostgreSQL 16, Spring Boot 3, and React 19 served by Nginx) using Docker Compose:

```bash
docker compose up --build -d
```

- **Frontend Application**: `http://localhost`
- **Backend API**: `http://localhost:8080/api`
- **PostgreSQL Database**: `localhost:5432` (User: `postgres`, Password: `postgrespassword`, DB: `realnest`)

To stop containers:
```bash
docker compose down
```

---

## 7. Senior Engineer Interview Questions & Answers

### Q1: How does stateless JWT authentication work in Spring Security 6 without session storage?
> **Answer**: In Spring Security 6, stateless authentication is configured by setting `SessionCreationPolicy.STATELESS` on the `SecurityFilterChain`. On every incoming HTTP request, a custom `JwtAuthenticationFilter` (extending `OncePerRequestFilter`) intercepts the request, parses the `Authorization: Bearer <token>` header, verifies the cryptographic signature (using HMAC-SHA256 and a secret key via JJWT), and extracts the user claims (email, user ID, and role authorities). It then instantiates an `Authentication` object (`UsernamePasswordAuthenticationToken`) and sets it into the thread-local `SecurityContextHolder`. Because no `HttpSession` is created or consulted on the server, subsequent requests are authenticated solely based on the cryptographic validity of the incoming JWT.

### Q2: How do you prevent the N+1 select query problem when fetching Properties with their User owner?
> **Answer**: In JPA, when an entity relationship is configured as `@ManyToOne(fetch = FetchType.LAZY)`, iterating over a collection of properties and accessing `property.getOwner()` triggers an individual SQL `SELECT` for each owner. We prevent this by:
> 1. Writing a `JOIN FETCH` query in JPQL: `SELECT p FROM Property p JOIN FETCH p.owner WHERE ...`
> 2. Using `@EntityGraph(attributePaths = {"owner"})` on repository query methods to instruct Hibernate to issue an eager outer join in a single database round-trip.
> 3. Designing lightweight DTO projections using Spring Data interface projections or constructor expressions (`SELECT new com.realnest.dto.response.PropertySummary(...)`) so unneeded relational fields are not queried.

### Q3: What is the purpose of Spring Data JPA Specifications vs. Parameterized JPQL for complex search filters?
> **Answer**: When filtering properties by dynamic combinations of optional attributes (such as `type`, `location`, `minPrice`, `maxPrice`, `keyword`), parameterized JPQL with `(:param IS NULL OR field = :param)` is clean and performant for moderate filter sets. However, as conditions multiply or become nested (e.g., dynamic OR/AND conjunctions, polygon boundaries), `Specification<Property>` based on the JPA Criteria API allows building type-safe, composable predicates dynamically in Java without string concatenation, minimizing database query plan recompilation overhead.

### Q4: How does React 19 improve form handling and asynchronous state compared to earlier React versions?
> **Answer**: React 19 introduces native support for Actions via `useActionState` and `useTransition`, allowing asynchronous state transitions and automatic pending states without boilerplate `isLoading` flags. Additionally, React 19 optimizes server components, asset preloading, and eliminates the need for manual `useMemo`/`useCallback` optimizations in many scenarios via the React Compiler. When combined with `react-hook-form` and schema validators like `yup`, inputs gain uncontrolled high-performance re-rendering while preserving declarative validation rules.

### Q5: How do you secure against Cross-Site Scripting (XSS) and SQL Injection in this full-stack architecture?
> **Answer**:
> - **SQL Injection**: Handled automatically by Spring Data JPA and Hibernate using parameterized queries and prepared statements. Input values are sent separately from the SQL statement template, eliminating code execution via untrusted data.
> - **XSS**: React automatically escapes strings rendered in JSX before inserting them into the DOM, preventing script injection. Furthermore, inputs are strictly validated and sanitized via Jakarta Bean Validation (`@Size`, `@NotBlank`, `@Email`) on the backend and Yup on the frontend. Content-Security-Policy (CSP) headers can also be added in Nginx/Spring Security.

---

## 8. Production Best Practices Implemented

1. **Layered Clean Architecture**: Strict separation of concerns across Entities, DTOs, Repositories, Services, and REST Controllers.
2. **DTO Isolation**: Entities are never exposed directly to the presentation layer or clients, avoiding unintentional data leaks (e.g., hashed passwords) and circular reference serialization errors.
3. **Optimized Pagination & Bounded Page Sizes**: Search and admin endpoints enforce maximum page sizes (`Math.min(size, 50)`) to protect against denial-of-service memory exhaustion.
4. **Resilient Media Storage**: Cloudinary integration includes automatic format detection, size limits, and fallback strategies to high-resolution architectural photography if external API limits are reached.
5. **Declarative Validation**: Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Size`, `@DecimalMin`) paired with frontend Yup schemas guarantees consistent validation contracts across the stack.
6. **Graceful Container Shutdown & Health Checks**: Docker Compose defines PostgreSQL health checks (`pg_isready`) and container dependency conditions (`service_healthy`) to ensure proper service startup sequencing.
# sale
