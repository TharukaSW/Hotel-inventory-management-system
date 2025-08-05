package com.example.hotel_inventory.dto.request;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSupplierRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
    private String contactPerson;
    private String phoneNumber;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    private String address;
    @JsonAlias({"supplyItems"})
    private String supplyItem;
    private boolean isActive = true;
} 