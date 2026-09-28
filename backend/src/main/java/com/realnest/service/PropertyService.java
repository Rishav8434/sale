package com.realnest.service;

import com.realnest.dto.request.PropertyCreateRequest;
import com.realnest.dto.request.PropertyUpdateRequest;
import com.realnest.dto.response.PagedResponse;
import com.realnest.dto.response.PropertyResponse;
import com.realnest.entity.PropertyType;
import com.realnest.security.UserPrincipal;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

public interface PropertyService {

    PropertyResponse createProperty(PropertyCreateRequest request, UserPrincipal currentUser);

    PropertyResponse updateProperty(Long id, PropertyUpdateRequest request, UserPrincipal currentUser);

    void deleteProperty(Long id, UserPrincipal currentUser);

    PropertyResponse getPropertyById(Long id);

    PagedResponse<PropertyResponse> searchApprovedProperties(
            PropertyType type,
            String location,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String keyword,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    PagedResponse<PropertyResponse> getMyListings(UserPrincipal currentUser, int page, int size);

    PagedResponse<PropertyResponse> getAllPropertiesForAdmin(
            Boolean approved,
            PropertyType type,
            String location,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String keyword,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    PropertyResponse approveProperty(Long id);

    PropertyResponse rejectProperty(Long id);

    String uploadPropertyImage(MultipartFile file);
}
