package com.realnest.service.impl;

import com.realnest.dto.request.PropertyCreateRequest;
import com.realnest.dto.request.PropertyUpdateRequest;
import com.realnest.dto.response.PagedResponse;
import com.realnest.dto.response.PropertyResponse;
import com.realnest.entity.Property;
import com.realnest.entity.PropertyType;
import com.realnest.entity.Role;
import com.realnest.entity.User;
import com.realnest.exception.BadRequestException;
import com.realnest.exception.ResourceNotFoundException;
import com.realnest.exception.UnauthorizedException;
import com.realnest.repository.PropertyRepository;
import com.realnest.repository.UserRepository;
import com.realnest.security.UserPrincipal;
import com.realnest.service.CloudinaryService;
import com.realnest.service.PropertyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public PropertyResponse createProperty(PropertyCreateRequest request, UserPrincipal currentUser) {
        User owner = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Property property = Property.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .price(request.getPrice())
                .type(request.getType())
                .location(request.getLocation().trim())
                .imageUrl(StringUtils.hasText(request.getImageUrl()) ? request.getImageUrl() : null)
                .approved(false) // Pending admin approval
                .owner(owner)
                .build();

        Property savedProperty = propertyRepository.save(property);
        log.info("Property created with ID: {} by user: {}", savedProperty.getId(), owner.getEmail());
        return mapToPropertyResponse(savedProperty);
    }

    @Override
    @Transactional
    public PropertyResponse updateProperty(Long id, PropertyUpdateRequest request, UserPrincipal currentUser) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        verifyOwnershipOrAdmin(property, currentUser);

        if (StringUtils.hasText(request.getTitle())) {
            property.setTitle(request.getTitle().trim());
        }
        if (StringUtils.hasText(request.getDescription())) {
            property.setDescription(request.getDescription().trim());
        }
        if (request.getPrice() != null) {
            property.setPrice(request.getPrice());
        }
        if (request.getType() != null) {
            property.setType(request.getType());
        }
        if (StringUtils.hasText(request.getLocation())) {
            property.setLocation(request.getLocation().trim());
        }
        if (StringUtils.hasText(request.getImageUrl())) {
            property.setImageUrl(request.getImageUrl());
        }

        Property updatedProperty = propertyRepository.save(property);
        return mapToPropertyResponse(updatedProperty);
    }

    @Override
    @Transactional
    public void deleteProperty(Long id, UserPrincipal currentUser) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        verifyOwnershipOrAdmin(property, currentUser);
        propertyRepository.delete(property);
        log.info("Property {} deleted by user {}", id, currentUser.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));
        return mapToPropertyResponse(property);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponse> searchApprovedProperties(
            PropertyType type,
            String location,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String keyword,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        String cleanLocation = StringUtils.hasText(location) ? location.trim() : null;
        String cleanKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        Page<Property> propertyPage = propertyRepository.searchProperties(
                true, // Only approved properties for public search
                type,
                cleanLocation,
                minPrice,
                maxPrice,
                cleanKeyword,
                pageable
        );

        return createPagedResponse(propertyPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponse> getMyListings(UserPrincipal currentUser, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Property> propertyPage = propertyRepository.findByOwnerId(currentUser.getId(), pageable);
        return createPagedResponse(propertyPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponse> getAllPropertiesForAdmin(
            Boolean approved,
            PropertyType type,
            String location,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String keyword,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        String cleanLocation = StringUtils.hasText(location) ? location.trim() : null;
        String cleanKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        Page<Property> propertyPage = propertyRepository.searchProperties(
                approved,
                type,
                cleanLocation,
                minPrice,
                maxPrice,
                cleanKeyword,
                pageable
        );

        return createPagedResponse(propertyPage);
    }

    @Override
    @Transactional
    public PropertyResponse approveProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));
        property.setApproved(true);
        Property saved = propertyRepository.save(property);
        log.info("Property {} approved by administrator", id);
        return mapToPropertyResponse(saved);
    }

    @Override
    @Transactional
    public PropertyResponse rejectProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));
        property.setApproved(false);
        Property saved = propertyRepository.save(property);
        log.info("Property {} rejected by administrator", id);
        return mapToPropertyResponse(saved);
    }

    @Override
    public String uploadPropertyImage(MultipartFile file) {
        return cloudinaryService.uploadImage(file);
    }

    private void verifyOwnershipOrAdmin(Property property, UserPrincipal currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(Role.ROLE_ADMIN.name()));

        if (!isAdmin && !property.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to modify or delete this listing");
        }
    }

    private Pageable createPageable(int page, int size, String sortBy, String sortDir) {
        int pageIndex = Math.max(0, page);
        int pageSize = Math.min(Math.max(1, size), 50); // Bound between 1 and 50
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String propertySort = StringUtils.hasText(sortBy) ? sortBy : "createdAt";

        return PageRequest.of(pageIndex, pageSize, Sort.by(direction, propertySort));
    }

    private PagedResponse<PropertyResponse> createPagedResponse(Page<Property> propertyPage) {
        List<PropertyResponse> content = propertyPage.getContent().stream()
                .map(this::mapToPropertyResponse)
                .collect(Collectors.toList());

        return PagedResponse.<PropertyResponse>builder()
                .content(content)
                .pageNumber(propertyPage.getNumber())
                .pageSize(propertyPage.getSize())
                .totalElements(propertyPage.getTotalElements())
                .totalPages(propertyPage.getTotalPages())
                .isLast(propertyPage.isLast())
                .build();
    }

    private PropertyResponse mapToPropertyResponse(Property property) {
        return PropertyResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .price(property.getPrice())
                .type(property.getType())
                .location(property.getLocation())
                .imageUrl(property.getImageUrl())
                .approved(property.getApproved())
                .ownerId(property.getOwner().getId())
                .ownerName(property.getOwner().getName())
                .ownerEmail(property.getOwner().getEmail())
                .createdAt(property.getCreatedAt())
                .updatedAt(property.getUpdatedAt())
                .build();
    }
}
