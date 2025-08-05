package com.example.hotel_inventory.controller;

import com.example.hotel_inventory.dto.InventoryStats;
import com.example.hotel_inventory.model.InventoryItem;
import com.example.hotel_inventory.model.StockTransaction;
import com.example.hotel_inventory.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class AdminController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        try {
            List<InventoryItem> allItems = inventoryService.getAllItems();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalItems", allItems.size());
            stats.put("totalValue", allItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add));
            stats.put("lowStockItems", allItems.stream()
                .filter(item -> item.getQuantity() <= 10 && item.getQuantity() > 0)
                .count());
            stats.put("outOfStockItems", allItems.stream()
                .filter(item -> item.getQuantity() == 0)
                .count());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/inventory/low-stock")
    public ResponseEntity<List<InventoryItem>> getLowStockItems() {
        try {
            List<InventoryItem> lowStockItems = inventoryService.getAllItems()
                .stream()
                .filter(item -> item.getQuantity() <= 10 && item.getQuantity() > 0)
                .toList();
            return ResponseEntity.ok(lowStockItems);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/inventory/out-of-stock")
    public ResponseEntity<List<InventoryItem>> getOutOfStockItems() {
        try {
            List<InventoryItem> outOfStockItems = inventoryService.getAllItems()
                .stream()
                .filter(item -> item.getQuantity() == 0)
                .toList();
            return ResponseEntity.ok(outOfStockItems);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/reports/inventory")
    public ResponseEntity<Map<String, Object>> getInventoryReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            List<InventoryItem> items = inventoryService.getAllItems();
            
            Map<String, Object> report = new HashMap<>();
            report.put("totalItems", items.size());
            report.put("totalValue", items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add));
            report.put("items", items);
            report.put("generatedAt", LocalDateTime.now());
            
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/reports/categories")
    public ResponseEntity<Map<String, Object>> getCategoryReport() {
        try {
            List<InventoryItem> items = inventoryService.getAllItems();
            
            Map<String, Object> categoryStats = new HashMap<>();
            items.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    item -> item.getCategory().getName(),
                    java.util.stream.Collectors.summarizingInt(InventoryItem::getQuantity)))
                .forEach((category, stats) -> {
                    Map<String, Object> categoryData = new HashMap<>();
                    categoryData.put("totalQuantity", stats.getSum());
                    categoryData.put("itemCount", stats.getCount());
                    categoryStats.put(category, categoryData);
                });
            
            Map<String, Object> report = new HashMap<>();
            report.put("categoryStats", categoryStats);
            report.put("generatedAt", LocalDateTime.now());
            
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/reports/suppliers")
    public ResponseEntity<Map<String, Object>> getSupplierReport() {
        try {
            List<InventoryItem> items = inventoryService.getAllItems();
            
            Map<String, Object> supplierStats = new HashMap<>();
            items.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    item -> item.getSupplier().getName(),
                    java.util.stream.Collectors.summarizingInt(InventoryItem::getQuantity)))
                .forEach((supplier, stats) -> {
                    Map<String, Object> supplierData = new HashMap<>();
                    supplierData.put("totalQuantity", stats.getSum());
                    supplierData.put("itemCount", stats.getCount());
                    supplierStats.put(supplier, supplierData);
                });
            
            Map<String, Object> report = new HashMap<>();
            report.put("supplierStats", supplierStats);
            report.put("generatedAt", LocalDateTime.now());
            
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/inventory/bulk-update")
    public ResponseEntity<List<InventoryItem>> bulkUpdateInventory(@RequestBody List<Map<String, Object>> updates) {
        try {
            // Implementation for bulk updates would go here
            // For now, return empty list
            return ResponseEntity.ok(List.of());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
