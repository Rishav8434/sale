package com.realnest.controller;

import com.realnest.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@Tag(name = "Analytics & Intelligence", description = "High-scale metrics, revenue, conversion rates, and retention")
public class AnalyticsController {

    @GetMapping("/overview")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get platform overview KPIs, conversion metrics, and city distributions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOverviewMetrics() {
        Map<String, Object> metrics = Map.of(
                "kpis", Map.of(
                        "totalUsers", 1042850,
                        "dailyActiveUsers", 108420,
                        "monthlyActiveUsers", 845200,
                        "totalPropertiesListed", 10245000,
                        "conversionRate", "4.82%",
                        "grossMerchandiseValue", "$48,920,000",
                        "monthlyRevenue", "$342,500"
                ),
                "topCities", List.of(
                        Map.of("city", "Beverly Hills", "share", 32, "activeListings", 1420),
                        Map.of("city", "Manhattan", "share", 28, "activeListings", 2150),
                        Map.of("city", "Seattle", "share", 18, "activeListings", 980),
                        Map.of("city", "Pune", "share", 12, "activeListings", 1840),
                        Map.of("city", "Aspen", "share", 10, "activeListings", 420)
                ),
                "revenueTrend", List.of(
                        Map.of("month", "Jan", "revenue", 210000),
                        Map.of("month", "Feb", "revenue", 245000),
                        Map.of("month", "Mar", "revenue", 280000),
                        Map.of("month", "Apr", "revenue", 312000),
                        Map.of("month", "May", "revenue", 342500)
                ),
                "categoryBreakdown", List.of(
                        Map.of("category", "Villa", "count", 45),
                        Map.of("category", "Apartment", "count", 35),
                        Map.of("category", "Penthouse", "count", 15),
                        Map.of("category", "Commercial", "count", 5)
                )
        );

        return ResponseEntity.ok(ApiResponse.success(metrics));
    }
}
