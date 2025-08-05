package com.example.hotel_inventory.dto;

import java.time.LocalDateTime;

import com.example.hotel_inventory.model.Supplier;
import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierDto {
    private Long id;
    private String name;
    private String description;
    private String contactPerson;
    private String phoneNumber;
    private String email;
    private String address;

    private String supplyItem;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static SupplierDto fromEntity(Supplier supplier) {
        return SupplierDto.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .description(supplier.getDescription())
                .contactPerson(supplier.getContactPerson())
                .phoneNumber(supplier.getPhoneNumber())
                .email(supplier.getEmail())
                .address(supplier.getAddress())
                .supplyItem(supplier.getSupplyItem())
                .isActive(supplier.isActive())
                .createdAt(supplier.getCreatedAt())
                .updatedAt(supplier.getUpdatedAt())
                .build();
    }
} 