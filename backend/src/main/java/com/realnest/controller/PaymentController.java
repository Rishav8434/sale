package com.realnest.controller;

import com.realnest.dto.response.ApiResponse;
import com.realnest.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/payments")
@Tag(name = "Monetization & Payments", description = "Stripe, Razorpay, subscriptions, and GST compliant invoices")
public class PaymentController {

    @GetMapping("/plans")
    @Operation(summary = "Get available agent and seller subscription tiers")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSubscriptionPlans() {
        List<Map<String, Object>> plans = List.of(
                Map.of(
                        "id", "AGENT_STARTER",
                        "name", "Agent Starter",
                        "price", 49.00,
                        "currency", "USD",
                        "maxListings", 10,
                        "aiCredits", 100,
                        "features", List.of("10 Active Listings", "Standard Search Placement", "Basic AI Copywriter")
                ),
                Map.of(
                        "id", "AGENT_PRO",
                        "name", "Broker Pro",
                        "price", 149.00,
                        "currency", "USD",
                        "maxListings", 50,
                        "aiCredits", 500,
                        "features", List.of("50 Active Listings", "Top Search Boost", "3D Virtual Tours Support", "AI Valuation Engine")
                ),
                Map.of(
                        "id", "AGENCY_ENTERPRISE",
                        "name", "Agency Enterprise",
                        "price", 399.00,
                        "currency", "USD",
                        "maxListings", 250,
                        "aiCredits", 2500,
                        "features", List.of("Unlimited Listings", "Featured Homepage Sliders", "Dedicated Support", "Custom Drone Media Pipeline")
                )
        );

        return ResponseEntity.ok(ApiResponse.success(plans));
    }

    @PostMapping("/checkout-session")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Initiate a Stripe or Razorpay checkout session")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createCheckoutSession(
            @RequestBody CheckoutRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        String transactionId = "txn_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String invoiceNumber = "INV-2026-" + (int)(Math.random() * 90000 + 10000);

        Map<String, Object> session = Map.of(
                "checkoutUrl", "https://checkout.realnest.io/pay/" + transactionId,
                "transactionId", transactionId,
                "invoiceNumber", invoiceNumber,
                "gateway", request.getGateway() != null ? request.getGateway() : "STRIPE",
                "amount", request.getAmount(),
                "status", "INITIATED"
        );

        return ResponseEntity.ok(ApiResponse.success("Checkout session created successfully", session));
    }

    @Data
    public static class CheckoutRequest {
        private String planId;
        private BigDecimal amount;
        private String gateway; // "STRIPE" or "RAZORPAY"
    }
}
