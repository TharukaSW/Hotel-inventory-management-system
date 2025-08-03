package com.example.hotel_inventory.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryStats {
    private long totalItems;
    private long totalCategories;
    private long totalSuppliers;
    private long lowStockItems;
    private long outOfStockItems;
    private BigDecimal totalValue;
    private long totalTransactions;
} 