package com.example.hotel_inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionItemDto {
    private Long id;
    private Long inspectionId;
    private Long inventoryItemId;
    private String itemName;
    private Integer expectedQuantity;
    private Integer actualQuantity;
    private String conditionStatus;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
