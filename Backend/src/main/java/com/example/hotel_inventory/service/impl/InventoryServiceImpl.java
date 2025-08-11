package com.example.hotel_inventory.service.impl;

import com.example.hotel_inventory.dto.InventoryStats;
import com.example.hotel_inventory.dto.request.CreateInventoryItemRequest;
import com.example.hotel_inventory.model.Category;
import com.example.hotel_inventory.model.InventoryItem;
import com.example.hotel_inventory.model.StockTransaction;
import com.example.hotel_inventory.model.Supplier;
import com.example.hotel_inventory.repository.CategoryRepository;
import com.example.hotel_inventory.repository.InventoryItemRepository;
import com.example.hotel_inventory.repository.StockTransactionRepository;
import com.example.hotel_inventory.repository.SupplierRepository;
import com.example.hotel_inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {
    private final InventoryItemRepository itemRepository;
    private final StockTransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    @Override
    public InventoryItem addItem(CreateInventoryItemRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        InventoryItem item = InventoryItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(category)
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .minQuantity(request.getMinQuantity())
                .maxQuantity(request.getMaxQuantity())
                .unitOfMeasurement(request.getUnitOfMeasurement())
                .expiryDate(request.getExpiryDate())
                .condition(request.getCondition())
                .warrantyExpiry(request.getWarrantyExpiry())
                .supplier(supplier)
                .build();

        return itemRepository.save(item);
    }

    @Override
    public InventoryItem updateItem(Long id, CreateInventoryItemRequest request) {
        InventoryItem existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        existingItem.setName(request.getName());
        existingItem.setDescription(request.getDescription());
        existingItem.setCategory(category);
        existingItem.setQuantity(request.getQuantity());
        existingItem.setPrice(request.getPrice());
        existingItem.setMinQuantity(request.getMinQuantity());
        existingItem.setMaxQuantity(request.getMaxQuantity());
        existingItem.setUnitOfMeasurement(request.getUnitOfMeasurement());
        existingItem.setExpiryDate(request.getExpiryDate());
        existingItem.setCondition(request.getCondition());
        existingItem.setWarrantyExpiry(request.getWarrantyExpiry());
        existingItem.setSupplier(supplier);

        return itemRepository.save(existingItem);
    }

    @Override
    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    @Override
    public InventoryItem getItem(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    @Override
    public List<InventoryItem> getAllItems() {
        return itemRepository.findAll();
    }

    @Override
    public List<InventoryItem> getLowStockItems() {
        return itemRepository.findAll().stream()
                .filter(item -> item.getQuantity() <= item.getMinQuantity() && item.getQuantity() > 0)
                .toList();
    }

    @Override
    public List<InventoryItem> getOutOfStockItems() {
        return itemRepository.findAll().stream()
                .filter(item -> item.getQuantity() == 0)
                .toList();
    }

    @Override
    public InventoryStats getInventoryStats() {
        List<InventoryItem> allItems = itemRepository.findAll();
        
        long totalItems = allItems.size();
        long totalCategories = categoryRepository.count();
        long totalSuppliers = supplierRepository.count();
        long lowStockItems = getLowStockItems().size();
        long outOfStockItems = getOutOfStockItems().size();
        long totalTransactions = transactionRepository.count();
        
        BigDecimal totalValue = allItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return InventoryStats.builder()
                .totalItems(totalItems)
                .totalCategories(totalCategories)
                .totalSuppliers(totalSuppliers)
                .lowStockItems(lowStockItems)
                .outOfStockItems(outOfStockItems)
                .totalValue(totalValue)
                .totalTransactions(totalTransactions)
                .build();
    }

    @Override
    public StockTransaction addStockTransaction(StockTransaction transaction) {
        return transactionRepository.save(transaction);
    }

    @Override
    public List<StockTransaction> getTransactionsForItem(Long itemId) {
        return transactionRepository.findAll().stream()
                .filter(t -> t.getItem().getId().equals(itemId))
                .toList();
    }
} 