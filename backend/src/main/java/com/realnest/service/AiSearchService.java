package com.realnest.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface AiSearchService {

    /**
     * Parses unstructured natural language search queries into structured database filter criteria.
     * Example input: "Show me 3BHK under 80 lakh near metro in Pune"
     */
    StructuredSearchCriteria parseNaturalLanguageQuery(String userQuery);

    /**
     * Generates rich architectural sales descriptions using LLM generative capabilities.
     */
    String generatePropertyDescription(String title, String category, int bedrooms, BigDecimal price, String location, List<String> amenities);

    /**
     * Estimates fair market valuation based on historical city transaction data and physical specs.
     */
    BigDecimal predictFairPrice(String city, String category, BigDecimal sqft, int bedrooms);

    /**
     * Analyzes fraud risk on incoming listings (pricing anomalies, stolen photos, duplicate content).
     */
    double calculateFraudRiskScore(String title, String description, BigDecimal price, String location);

    record StructuredSearchCriteria(
            String keyword,
            String city,
            String category,
            String listingType,
            Integer bedrooms,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            List<String> amenities,
            String targetPoi,
            String naturalLanguageSummary
    ) {}
}