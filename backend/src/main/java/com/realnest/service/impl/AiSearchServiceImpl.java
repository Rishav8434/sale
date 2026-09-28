package com.realnest.service.impl;

import com.realnest.service.AiSearchService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
public class AiSearchServiceImpl implements AiSearchService {

    @Override
    public StructuredSearchCriteria parseNaturalLanguageQuery(String query) {
        if (!StringUtils.hasText(query)) {
            return new StructuredSearchCriteria(null, null, null, null, null, null, null, List.of(), null, "Empty search query");
        }

        String lower = query.toLowerCase(Locale.ROOT);

        // 1. Extract Bedrooms (e.g., "3bhk", "3 bhk", "3 bed", "4 bedroom")
        Integer bedrooms = null;
        Pattern bedPattern = Pattern.compile("(\\d+)\\s*(?:bhk|bed|bedroom|br)", Pattern.CASE_INSENSITIVE);
        Matcher bedMatcher = bedPattern.matcher(lower);
        if (bedMatcher.find()) {
            bedrooms = Integer.parseInt(bedMatcher.group(1));
        }

        // 2. Extract Category (Villa, Apartment, Studio, Penthouse, Loft, Office)
        String category = null;
        if (lower.contains("villa")) category = "VILLA";
        else if (lower.contains("penthouse")) category = "PENTHOUSE";
        else if (lower.contains("apartment") || lower.contains("flat") || lower.contains("bhk")) category = "APARTMENT";
        else if (lower.contains("studio")) category = "STUDIO";
        else if (lower.contains("office")) category = "OFFICE";
        else if (lower.contains("loft")) category = "LOFT";

        // 3. Extract Listing Type (Rent vs Sale)
        String listingType = null;
        if (lower.contains("rent") || lower.contains("lease") || lower.contains("/mo") || lower.contains("monthly")) {
            listingType = "RENT";
        } else if (lower.contains("buy") || lower.contains("sale") || lower.contains("purchase")) {
            listingType = "SALE";
        }

        // 4. Extract Price Limits (e.g. "under 80 lakh", "below 2.5m", "under $1.5M", "under 5000")
        BigDecimal maxPrice = null;
        BigDecimal minPrice = null;

        // Pattern for Lakhs (e.g., "80 lakh", "1.2 crore")
        Pattern lakhPattern = Pattern.compile("(?:under|below|max|upto)?\\s*(\\d+(?:\\.\\d+)?)\\s*(lakh|lac|cr|crore)", Pattern.CASE_INSENSITIVE);
        Matcher lakhMatcher = lakhPattern.matcher(lower);
        if (lakhMatcher.find()) {
            double val = Double.parseDouble(lakhMatcher.group(1));
            String unit = lakhMatcher.group(2).toLowerCase();
            if (unit.startsWith("cr")) {
                maxPrice = BigDecimal.valueOf(val * 10_000_000);
            } else {
                maxPrice = BigDecimal.valueOf(val * 100_000);
            }
        }

        // Pattern for Millions / Thousands / USD (e.g. "under 2.5m", "under $1,500,000", "< 3M")
        if (maxPrice == null) {
            Pattern millionPattern = Pattern.compile("(?:under|below|max|upto|less than)?\\s*\\$?([\\d,]+(?:\\.\\d+)?)\\s*(m|million|k)?", Pattern.CASE_INSENSITIVE);
            Matcher millionMatcher = millionPattern.matcher(lower);
            if (millionMatcher.find()) {
                try {
                    String numStr = millionMatcher.group(1).replace(",", "");
                    double val = Double.parseDouble(numStr);
                    String multiplier = millionMatcher.group(2);
                    if ("m".equalsIgnoreCase(multiplier) || "million".equalsIgnoreCase(multiplier)) {
                        maxPrice = BigDecimal.valueOf(val * 1_000_000);
                    } else if ("k".equalsIgnoreCase(multiplier)) {
                        maxPrice = BigDecimal.valueOf(val * 1_000);
                    } else if (val > 100) {
                        maxPrice = BigDecimal.valueOf(val);
                    }
                } catch (Exception ignored) {}
            }
        }

        // 5. Extract City / Geo Location
        String city = null;
        List<String> knownCities = List.of(
                "pune", "mumbai", "bangalore", "delhi", "hyderabad",
                "beverly hills", "new york", "san francisco", "seattle", "malibu", "aspen", "boston", "miami", "austin", "california"
        );
        for (String c : knownCities) {
            if (lower.contains(c)) {
                city = StringUtils.capitalize(c);
                break;
            }
        }

        // 6. Extract POI Preference (e.g. "near metro", "near hospital", "near school", "beachfront")
        String targetPoi = null;
        if (lower.contains("metro")) targetPoi = "METRO";
        else if (lower.contains("hospital")) targetPoi = "HOSPITAL";
        else if (lower.contains("school")) targetPoi = "SCHOOL";
        else if (lower.contains("beach") || lower.contains("ocean")) targetPoi = "BEACH";
        else if (lower.contains("park")) targetPoi = "PARK";

        // 7. Extract Amenities (e.g. "with pool", "gym", "pet friendly", "parking")
        List<String> amenities = new ArrayList<>();
        if (lower.contains("pool") || lower.contains("swimming")) amenities.add("SWIMMING_POOL");
        if (lower.contains("gym") || lower.contains("fitness")) amenities.add("GYM");
        if (lower.contains("pet")) amenities.add("PET_FRIENDLY");
        if (lower.contains("parking") || lower.contains("garage")) amenities.add("PARKING");

        String summary = String.format("Parsed: %s%s%s%s%s%s",
                bedrooms != null ? bedrooms + " BHK, " : "",
                city != null ? "in " + city + ", " : "",
                maxPrice != null ? "budget up to $" + maxPrice + ", " : "",
                listingType != null ? "for " + listingType + ", " : "",
                targetPoi != null ? "near " + targetPoi + ", " : "",
                !amenities.isEmpty() ? "with " + String.join(", ", amenities) : ""
        ).replaceAll(", $", "");

        return new StructuredSearchCriteria(
                query,
                city,
                category,
                listingType,
                bedrooms,
                minPrice,
                maxPrice,
                amenities,
                targetPoi,
                summary
        );
    }

    @Override
    public String generatePropertyDescription(String title, String category, int bedrooms, BigDecimal price, String location, List<String> amenities) {
        String amenityList = (amenities != null && !amenities.isEmpty())
                ? String.join(", ", amenities)
                : "designer finishes, high ceilings, and concierge security";

        return String.format(
                "Welcome to %s, an exquisite %s residence situated in the premier enclave of %s. " +
                "Spanning thoughtfully curated living spaces with %d lavish bedrooms, this property seamlessly balances modern opulence with everyday functionality. " +
                "Key amenities include %s. Ideal for discerning buyers seeking prestige, elevated acoustics, and immediate capital appreciation.",
                title, category != null ? category.toLowerCase() : "luxury", location, Math.max(1, bedrooms), amenityList
        );
    }

    @Override
    public BigDecimal predictFairPrice(String city, String category, BigDecimal sqft, int bedrooms) {
        double baseRatePerSqft = 450.0; // Baseline USD / sqft
        if (city != null) {
            String c = city.toLowerCase();
            if (c.contains("new york") || c.contains("beverly hills") || c.contains("san francisco")) {
                baseRatePerSqft = 1200.0;
            } else if (c.contains("seattle") || c.contains("miami") || c.contains("malibu")) {
                baseRatePerSqft = 850.0;
            } else if (c.contains("pune") || c.contains("bangalore")) {
                baseRatePerSqft = 120.0; // In USD equivalent
            }
        }

        double area = sqft != null ? sqft.doubleValue() : (bedrooms > 0 ? bedrooms * 750.0 : 1200.0);
        double bedroomPremium = bedrooms * 25000.0;
        double predicted = (area * baseRatePerSqft) + bedroomPremium;
        return BigDecimal.valueOf(Math.round(predicted));
    }

    @Override
    public double calculateFraudRiskScore(String title, String description, BigDecimal price, String location) {
        double risk = 0.05; // 5% baseline
        if (price != null && price.compareTo(BigDecimal.valueOf(100)) < 0) {
            risk += 0.70; // Unrealistic price anomaly
        }
        if (description != null && (description.contains("wire funds") || description.contains("western union") || description.contains("bitcoin"))) {
            risk += 0.85; // Scam flag
        }
        return Math.min(1.0, risk);
    }
}
