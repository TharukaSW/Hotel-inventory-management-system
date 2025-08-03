package com.example.hotel_inventory.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCategoryRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
    
    private boolean isActive = true;
    
    private String supplyItem;
} 