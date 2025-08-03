package com.example.hotel_inventory.controller;

import com.example.hotel_inventory.dto.InventoryItemDto;
import com.example.hotel_inventory.dto.InventoryStats;
import com.example.hotel_inventory.dto.request.CreateInventoryItemRequest;
import com.example.hotel_inventory.model.InventoryItem;
import com.example.hotel_inventory.model.StockTransaction;
import com.example.hotel_inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<InventoryItemDto> addItem(@Valid @RequestBody CreateInventoryItemRequest request) {
        InventoryItem item = inventoryService.addItem(request);
        return ResponseEntity.ok(InventoryItemDto.fromEntity(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItemDto> updateItem(@PathVariable Long id, @Valid @RequestBody CreateInventoryItemRequest request) {
        InventoryItem item = inventoryService.updateItem(id, request);
        return ResponseEntity.ok(InventoryItemDto.fromEntity(item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItemDto> getItem(@PathVariable Long id) {
        InventoryItem item = inventoryService.getItem(id);
        return ResponseEntity.ok(InventoryItemDto.fromEntity(item));
    }

    @GetMapping
    public ResponseEntity<List<InventoryItemDto>> getAllItems() {
        List<InventoryItemDto> items = inventoryService.getAllItems().stream()
                .map(InventoryItemDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryItemDto>> getLowStockItems() {
        List<InventoryItemDto> items = inventoryService.getLowStockItems().stream()
                .map(InventoryItemDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }

    @GetMapping("/out-of-stock")
    public ResponseEntity<List<InventoryItemDto>> getOutOfStockItems() {
        List<InventoryItemDto> items = inventoryService.getOutOfStockItems().stream()
                .map(InventoryItemDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }

    @PostMapping("/transaction")
    public ResponseEntity<StockTransaction> addStockTransaction(@RequestBody StockTransaction transaction) {
        return ResponseEntity.ok(inventoryService.addStockTransaction(transaction));
    }

    @GetMapping("/{itemId}/transactions")
    public ResponseEntity<List<StockTransaction>> getTransactionsForItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(inventoryService.getTransactionsForItem(itemId));
    }

    @GetMapping("/stats")
    public ResponseEntity<InventoryStats> getInventoryStats() {
        return ResponseEntity.ok(inventoryService.getInventoryStats());
    }
} 