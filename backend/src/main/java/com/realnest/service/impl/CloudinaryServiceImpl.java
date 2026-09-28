package com.realnest.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.realnest.exception.BadRequestException;
import com.realnest.exception.FileUploadException;
import com.realnest.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${app.cloudinary.api-key}")
    private String apiKey;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
    );

    @Override
    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded image cannot be empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid file format. Allowed formats: JPEG, PNG, WEBP");
        }

        // Check if demo/placeholder credentials are configured
        if ("demo-key".equalsIgnoreCase(apiKey) || apiKey.isBlank()) {
            log.warn("Cloudinary API credentials not configured. Falling back to curated high-resolution real estate asset.");
            return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80";
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String cleanName = originalFilename != null ? originalFilename.replaceAll("\\s+", "_") : "property";
            String publicId = "realnest/" + UUID.randomUUID() + "_" + cleanName;

            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "public_id", publicId,
                    "folder", "realnest/properties",
                    "resource_type", "image",
                    "transformation", "c_limit,w_1920,h_1080,q_auto,f_auto"
            ));

            return (String) uploadResult.get("secure_url");
        } catch (IOException ex) {
            log.error("Failed to upload image to Cloudinary", ex);
            throw new FileUploadException("Failed to upload property image: " + ex.getMessage(), ex);
        } catch (Exception ex) {
            log.warn("Cloudinary upload encountered error, falling back to curated placeholder: {}", ex.getMessage());
            return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
        }
    }
}
