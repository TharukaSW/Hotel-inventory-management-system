package com.example.hotel_inventory.service;

import com.example.hotel_inventory.dto.InventoryStats;
import com.example.hotel_inventory.dto.request.CreateInventoryItemRequest;
import com.example.hotel_inventory.model.InventoryItem;
import com.example.hotel_inventory.model.StockTransaction;
import java.util.List;

public interface InventoryService {
    InventoryItem addItem(CreateInventoryItemRequest request);
    InventoryItem updateItem(Long id, CreateInventoryItemRequest request);
    void deleteItem(Long id);
    InventoryItem getItem(Long id);
    List<InventoryItem> getAllItems();
    List<InventoryItem> getLowStockItems();
    List<InventoryItem> getOutOfStockItems();
    InventoryStats getInventoryStats();

    StockTransaction addStockTransaction(StockTransaction transaction);
    List<StockTransaction> getTransactionsForItem(Long itemId);
} 