package com.example.hotel_inventory.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateItemRequestRequest {
    
    @NotNull(message = "Inventory item ID is required")
    private Long inventoryItemId;
    
    @NotNull(message = "Requested quantity is required")
    @Min(value = 1, message = "Requested quantity must be at least 1")
    private Integer requestedQuantity;
    
    @NotBlank(message = "Location type is required")
    private String locationType;
    
    @NotBlank(message = "Location identifier is required")
    private String locationIdentifier;
    
    @Size(max = 500, message = "Reason cannot exceed 500 characters")
    private String reason;
}
