package com.example.hotel_inventory.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateInventoryItemRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Category is required")
    private Long categoryId;
    
    @PositiveOrZero(message = "Quantity must be zero or positive")
    private int quantity;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    private int minQuantity = 10;
    private int maxQuantity = 1000;
    
    // Optional category-specific fields
    private String unitOfMeasurement;
    private LocalDateTime expiryDate;
    private String condition;
    private LocalDateTime warrantyExpiry;
    
    @NotNull(message = "Supplier is required")
    private Long supplierId;
} 