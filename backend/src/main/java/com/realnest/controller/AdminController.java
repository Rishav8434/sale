package com.realnest.controller;

import com.realnest.dto.response.ApiResponse;
import com.realnest.dto.response.PagedResponse;
import com.realnest.dto.response.PropertyResponse;
import com.realnest.dto.response.UserResponse;
import com.realnest.entity.PropertyType;
import com.realnest.security.UserPrincipal;
import com.realnest.service.PropertyService;
import com.realnest.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Administrator", description = "Endpoints restricted to users with ROLE_ADMIN")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminController {

    private final UserService userService;
    private final PropertyService propertyService;

    @GetMapping("/users")
    @Operation(summary = "Get list of all registered platform users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user account by ID")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @GetMapping("/properties")
    @Operation(summary = "View all properties (approved, pending, or rejected) with filters")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponse>>> getAllProperties(
            @RequestParam(required = false) Boolean approved,
            @RequestParam(required = false) PropertyType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        PagedResponse<PropertyResponse> properties = propertyService.getAllPropertiesForAdmin(
                approved, type, location, minPrice, maxPrice, keyword, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success(properties));
    }

    @PatchMapping("/properties/{id}/approve")
    @Operation(summary = "Approve a property listing to make it publicly visible")
    public ResponseEntity<ApiResponse<PropertyResponse>> approveProperty(@PathVariable Long id) {
        PropertyResponse approved = propertyService.approveProperty(id);
        return ResponseEntity.ok(ApiResponse.success("Property listing approved successfully", approved));
    }

    @PatchMapping("/properties/{id}/reject")
    @Operation(summary = "Reject or unapprove a property listing")
    public ResponseEntity<ApiResponse<PropertyResponse>> rejectProperty(@PathVariable Long id) {
        PropertyResponse rejected = propertyService.rejectProperty(id);
        return ResponseEntity.ok(ApiResponse.success("Property listing rejected", rejected));
    }

    @DeleteMapping("/properties/{id}")
    @Operation(summary = "Administratively delete any property listing")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        propertyService.deleteProperty(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Property listing deleted by administrator", null));
    }
}
