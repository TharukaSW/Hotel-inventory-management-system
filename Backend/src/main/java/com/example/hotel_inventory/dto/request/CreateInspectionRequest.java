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
public class CreateInspectionRequest {
    
    @NotBlank(message = "Location type is required")
    private String locationType;
    
    @NotBlank(message = "Location identifier is required")
    private String locationIdentifier;
    
    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
}
