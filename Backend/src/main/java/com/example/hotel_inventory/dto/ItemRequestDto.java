package com.example.hotel_inventory.dto;

import com.example.hotel_inventory.model.ItemRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemRequestDto {
    private Long id;
    private Long inspectorId;
    private String inspectorName;
    private Long inventoryItemId;
    private String itemName;
    private Integer requestedQuantity;
    private String locationType;
    private String locationIdentifier;
    private String reason;
    private ItemRequest.RequestStatus status;
    private Long approvedById;
    private String approvedByName;
    private String approvalNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
