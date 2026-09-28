package com.realnest.controller;

import com.realnest.dto.request.PropertyCreateRequest;
import com.realnest.dto.request.PropertyUpdateRequest;
import com.realnest.dto.response.ApiResponse;
import com.realnest.dto.response.PagedResponse;
import com.realnest.dto.response.PropertyResponse;
import com.realnest.entity.PropertyType;
import com.realnest.security.UserPrincipal;
import com.realnest.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
@Tag(name = "Properties", description = "Endpoints for managing real estate listings")
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping
    @Operation(summary = "Search approved properties with filters, sorting, and pagination")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponse>>> searchProperties(
            @RequestParam(required = false) PropertyType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        PagedResponse<PropertyResponse> properties = propertyService.searchApprovedProperties(
                type, location, minPrice, maxPrice, keyword, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success(properties));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed information about a property by ID")
    public ResponseEntity<ApiResponse<PropertyResponse>> getPropertyById(@PathVariable Long id) {
        PropertyResponse property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(ApiResponse.success(property));
    }

    @PostMapping
    @Operation(summary = "Create a new property listing (Pending Admin Approval)", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<PropertyResponse>> createProperty(
            @Valid @RequestBody PropertyCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        PropertyResponse created = propertyService.createProperty(request, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Property listing created successfully. Pending admin approval.", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing property listing", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<PropertyResponse>> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        PropertyResponse updated = propertyService.updateProperty(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Property listing updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a property listing", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<Void>> deleteProperty(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        propertyService.deleteProperty(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Property listing deleted successfully", null));
    }

    @GetMapping("/my-listings")
    @Operation(summary = "Retrieve current authenticated user's property listings", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponse>>> getMyListings(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponse<PropertyResponse> myListings = propertyService.getMyListings(currentUser, page, size);
        return ResponseEntity.ok(ApiResponse.success(myListings));
    }

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload property image to Cloudinary", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @Parameter(description = "Image file (JPEG, PNG, WEBP up to 10MB)")
            @RequestParam("file") MultipartFile file) {
        
        String imageUrl = propertyService.uploadPropertyImage(file);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", Map.of("imageUrl", imageUrl)));
    }
}
