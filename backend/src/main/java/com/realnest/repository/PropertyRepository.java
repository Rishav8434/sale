package com.realnest.repository;

import com.realnest.entity.Property;
import com.realnest.entity.PropertyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    Page<Property> findByApprovedTrue(Pageable pageable);

    Page<Property> findByOwnerId(Long ownerId, Pageable pageable);

    long countByApprovedFalse();

    long countByApprovedTrue();

    @Query("SELECT p FROM Property p WHERE " +
           "(:approved IS NULL OR p.approved = :approved) AND " +
           "(:type IS NULL OR p.type = :type) AND " +
           "(:location IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Property> searchProperties(
            @Param("approved") Boolean approved,
            @Param("type") PropertyType type,
            @Param("location") String location,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
