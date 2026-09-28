package com.realnest.config;

import com.realnest.entity.Property;
import com.realnest.entity.PropertyType;
import com.realnest.entity.Role;
import com.realnest.entity.User;
import com.realnest.repository.PropertyRepository;
import com.realnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0 || propertyRepository.count() < 10) {
            log.info("Bootstrapping RealNest X curated global estate registry...");

            // 1. Create Default Admin User
            User admin = userRepository.findByEmail("admin@realnest.io").orElseGet(() -> {
                User u = User.builder()
                        .name("Lord Alexander Wright")
                        .email("admin@realnest.io")
                        .password(passwordEncoder.encode("Password@123"))
                        .role(Role.ROLE_ADMIN)
                        .build();
                return userRepository.save(u);
            });
            log.info("Admin Account Active: admin@realnest.io / Password@123");

            // 2. Create Diverse Global Private Clients
            User sophia = userRepository.findByEmail("sophia@realnest.io").orElseGet(() -> {
                User u = User.builder()
                        .name("Sophia Kensington")
                        .email("sophia@realnest.io")
                        .password(passwordEncoder.encode("Password@123"))
                        .role(Role.ROLE_CUSTOMER)
                        .build();
                return userRepository.save(u);
            });

            User marcus = userRepository.findByEmail("marcus@realnest.io").orElseGet(() -> {
                User u = User.builder()
                        .name("Marcus Vance")
                        .email("marcus@realnest.io")
                        .password(passwordEncoder.encode("Password@123"))
                        .role(Role.ROLE_CUSTOMER)
                        .build();
                return userRepository.save(u);
            });

            User elena = userRepository.findByEmail("elena@realnest.io").orElseGet(() -> {
                User u = User.builder()
                        .name("Elena Rostova")
                        .email("elena@realnest.io")
                        .password(passwordEncoder.encode("Password@123"))
                        .role(Role.ROLE_CUSTOMER)
                        .build();
                return userRepository.save(u);
            });

            User arjun = userRepository.findByEmail("arjun@realnest.io").orElseGet(() -> {
                User u = User.builder()
                        .name("Arjun Singhania")
                        .email("arjun@realnest.io")
                        .password(passwordEncoder.encode("Password@123"))
                        .role(Role.ROLE_CUSTOMER)
                        .build();
                return userRepository.save(u);
            });

            // If we already have seeded properties, don't duplicate
            if (propertyRepository.count() < 10) {
                propertyRepository.deleteAll();

                List<Property> properties = List.of(
                        Property.builder()
                                .title("The Promontory Modernist Glass Pavilion")
                                .description("Cantilevered concrete and structural steel residence poised above Sunset Strip. Features 14-foot motorized thermal glazing, 60-foot heated infinity edge pool, sommelier cellar, and uninterrupted Pacific-to-skyline views.")
                                .price(new BigDecimal("18500000.00"))
                                .type(PropertyType.SALE)
                                .location("Trousdale Estates, Beverly Hills, CA")
                                .imageUrl("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(sophia)
                                .build(),

                        Property.builder()
                                .title("Central Park South Triplex Tower Penthouse")
                                .description("Iconic 48th-floor aerie with 360-degree Central Park vistas. Private biometric elevator vestibule, double-height grand salon, private terrace, custom Calacatta marble hearths, and full hotel services.")
                                .price(new BigDecimal("34500.00"))
                                .type(PropertyType.RENT)
                                .location("Manhattan, New York")
                                .imageUrl("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(marcus)
                                .build(),

                        Property.builder()
                                .title("Broad Beach Oceanfront Sanctuary")
                                .description("Direct sea-level frontage with private stairs to Broad Beach sand. Designed with bleached teak decking, courtyard plunge pool, outdoor wood-fired kitchen, and automated ocean-facing storm shutters.")
                                .price(new BigDecimal("14200000.00"))
                                .type(PropertyType.SALE)
                                .location("Malibu, California")
                                .imageUrl("https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(sophia)
                                .build(),

                        Property.builder()
                                .title("Villa Bellagio Classical Waterfront Estate")
                                .description("Historical 18th-century neoclassical lakefront villa featuring private stone pier, boat slip, manicured cypress alley, frescoed vaulted ceilings, and guest cloister.")
                                .price(new BigDecimal("22800000.00"))
                                .type(PropertyType.SALE)
                                .location("Lake Como, Lombardy, Italy")
                                .imageUrl("https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(elena)
                                .build(),

                        Property.builder()
                                .title("Higashiyama Restored Hinoki Machiya")
                                .description("Centuries-old Kyoto heritage residence reconstructed with fragrant Hinoki cypress, sunken stone ofuro bath, private moss zen courtyard, and concealed underfloor hydronic heating.")
                                .price(new BigDecimal("6800.00"))
                                .type(PropertyType.RENT)
                                .location("Kyoto, Japan")
                                .imageUrl("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(sophia)
                                .build(),

                        Property.builder()
                                .title("Charming Historic Beacon Hill Brownstone")
                                .description("Museum-grade restored 1894 townhouse featuring original mahogany woodwork, 7 carved fireplaces, private rooftop terrace with gas fire bowl, and bespoke library.")
                                .price(new BigDecimal("4850000.00"))
                                .type(PropertyType.SALE)
                                .location("Boston, Massachusetts")
                                .imageUrl("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(marcus)
                                .build(),

                        Property.builder()
                                .title("Red Mountain Ski-In Chalet & Spa")
                                .description("Custom timber and stone alpine compound with direct ski-in/ski-out access to Aspen Mountain. Includes indoor heated lap pool, oxygen-enriched sleeping suites, and 4-car heated subterranean gallery.")
                                .price(new BigDecimal("16900000.00"))
                                .type(PropertyType.SALE)
                                .location("Aspen, Colorado")
                                .imageUrl("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(elena)
                                .build(),

                        Property.builder()
                                .title("Scandinavian Waterfront Glass Residence")
                                .description("Award-winning minimalist architecture surrounded by Pacific Northwest pines and Puget Sound waters. Triple-pane argon glazing, geothermal loop, and private deep-water dock.")
                                .price(new BigDecimal("5900000.00"))
                                .type(PropertyType.SALE)
                                .location("Mercer Island, Seattle, WA")
                                .imageUrl("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(marcus)
                                .build(),

                        Property.builder()
                                .title("The Horizon Sky Villa & Cantilever Terrace")
                                .description("Ultra-prime luxury duplex penthouse in Koregaon Park with private cantilevered glass lap pool, 22-foot double-height living pavilion, Italian marble flooring, and concierge valet.")
                                .price(new BigDecimal("1250000.00"))
                                .type(PropertyType.SALE)
                                .location("Koregaon Park, Pune, India")
                                .imageUrl("https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(arjun)
                                .build(),

                        Property.builder()
                                .title("Worli Sea Face Glass Penthouse")
                                .description("Panoramic Arabian Sea vistas from the 55th floor. Fully customized by renowned Milanese interior architects, private sky deck, automated climate control, and separate service quarters.")
                                .price(new BigDecimal("9500.00"))
                                .type(PropertyType.RENT)
                                .location("Worli, Mumbai, India")
                                .imageUrl("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(arjun)
                                .build(),

                        Property.builder()
                                .title("Caldera Cliffside Cave Villa with Sunset Deck")
                                .description("Sculptural whitewashed Cycladic architecture carved into the Oia cliffside. Infinity plunge pool suspended over the Aegean Sea, minimalist curved walls, and private helipad transfer service.")
                                .price(new BigDecimal("4200000.00"))
                                .type(PropertyType.SALE)
                                .location("Oia, Santorini, Greece")
                                .imageUrl("https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(elena)
                                .build(),

                        Property.builder()
                                .title("Mayfair Belgravia Heritage Mansion")
                                .description("Grade II listed Georgian palatial residence with private mews house, passenger elevator, private spa with Turkish hammam, ballroom salon, and access to private gated garden square.")
                                .price(new BigDecimal("29500000.00"))
                                .type(PropertyType.SALE)
                                .location("Mayfair, London, UK")
                                .imageUrl("https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(marcus)
                                .build(),

                        Property.builder()
                                .title("Haussmannian Grand Apartment on Avenue Montaigne")
                                .description("Classic Parisian grandeur featuring 12-foot gilded ceilings, herringbone parquet, original marble fireplaces, view of the Eiffel Tower, and 24-hour uniformed conciergerie.")
                                .price(new BigDecimal("14500.00"))
                                .type(PropertyType.RENT)
                                .location("Paris 8th, France")
                                .imageUrl("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(sophia)
                                .build(),

                        Property.builder()
                                .title("Sydney Harbour Point Architectural Pavilion")
                                .description("Unrivaled architectural masterpiece overlooking Sydney Opera House and Harbour Bridge. Direct private deep-water jetty, floor-to-ceiling acoustic glass, and infinity harbor pool.")
                                .price(new BigDecimal("26500000.00"))
                                .type(PropertyType.SALE)
                                .location("Point Piper, Sydney, Australia")
                                .imageUrl("https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(marcus)
                                .build(),

                        Property.builder()
                                .title("The Palm Jumeirah Signature Frond Villa")
                                .description("Custom beachfront palace with private white-sand beach, infinity pool overlooking Dubai Marina skyline, gold-accented master suites, and bespoke smart home automation.")
                                .price(new BigDecimal("21000000.00"))
                                .type(PropertyType.SALE)
                                .location("Palm Jumeirah, Dubai, UAE")
                                .imageUrl("https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80")
                                .approved(false) // Pending review for admin moderation test!
                                .owner(arjun)
                                .build(),

                        Property.builder()
                                .title("Lake Zurich Minimalist Concrete & Timber Villa")
                                .description("Swiss architectural masterpiece perched over Lake Zurich. Thermal solar array, private funicular to lakeside bathing house, and polished exposed aggregate finishes.")
                                .price(new BigDecimal("11800000.00"))
                                .type(PropertyType.SALE)
                                .location("Gold Coast, Zurich, Switzerland")
                                .imageUrl("https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80")
                                .approved(false) // Pending review for admin moderation test!
                                .owner(elena)
                                .build(),

                        Property.builder()
                                .title("Star Island Tropical Modernist Compound")
                                .description("Gated Biscayne Bay estate with 100-foot yacht dock, cascading water features, exterior coral stone terraces, and detached 2-bedroom guest pavilion.")
                                .price(new BigDecimal("19500000.00"))
                                .type(PropertyType.SALE)
                                .location("Star Island, Miami Beach, FL")
                                .imageUrl("https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(sophia)
                                .build(),

                        Property.builder()
                                .title("Luberon Lavender Bastide & Olive Domain")
                                .description("17th-century restored French stone bastide set within 25 private acres of lavender fields and centuries-old olive trees. Includes heated stone pool and private wine cellar.")
                                .price(new BigDecimal("8200000.00"))
                                .type(PropertyType.SALE)
                                .location("Gordes, Provence, France")
                                .imageUrl("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80")
                                .approved(true)
                                .owner(marcus)
                                .build()
                );

                propertyRepository.saveAll(properties);
                log.info("RealNest X bootstrap complete! Successfully seeded {} global architectural estates.", properties.size());
            }
        }
    }
}
