package com.example.hotel_inventory.dto;

import com.example.hotel_inventory.model.InventoryItem;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryItemDto {
    private Long id;
    private String name;
    private String description;
    private CategoryDto category;
    private int quantity;
    private BigDecimal price;
    private InventoryItem.ItemStatus status;
    private int minQuantity;
    private int maxQuantity;
    private SupplierDto supplier;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDto createdBy;
    private UserDto updatedBy;

    public static InventoryItemDto fromEntity(InventoryItem item) {
        return InventoryItemDto.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .category(item.getCategory() != null ? CategoryDto.fromEntity(item.getCategory()) : null)
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .status(item.getStatus())
                .minQuantity(item.getMinQuantity())
                .maxQuantity(item.getMaxQuantity())
                .supplier(item.getSupplier() != null ? SupplierDto.fromEntity(item.getSupplier()) : null)
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .createdBy(item.getCreatedBy() != null ? UserDto.fromEntity(item.getCreatedBy()) : null)
                .updatedBy(item.getUpdatedBy() != null ? UserDto.fromEntity(item.getUpdatedBy()) : null)
                .build();
    }
} 