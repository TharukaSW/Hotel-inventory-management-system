package com.example.hotel_inventory.repository;

import com.example.hotel_inventory.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    
    // Find by Category
    List<InventoryItem> findByCategoryId(Long categoryId);
    
    // Find by Supplier
    List<InventoryItem> findBySupplierId(Long supplierId);
    
    // Find by Status
    List<InventoryItem> findByStatus(InventoryItem.ItemStatus status);
    
    // Search by name or description (case insensitive)
    List<InventoryItem> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name, String description);
    
    // Find low stock items
    @Query("SELECT i FROM InventoryItem i WHERE i.quantity <= i.minQuantity")
    List<InventoryItem> findByQuantityLessThanOrEqualToMinQuantity();
    
    // Find out of stock items
    List<InventoryItem> findByQuantity(int quantity);
    
    // Find items by quantity range
    List<InventoryItem> findByQuantityBetween(int minQuantity, int maxQuantity);
    
    // Find items by price range
    @Query("SELECT i FROM InventoryItem i WHERE i.price BETWEEN :minPrice AND :maxPrice")
    List<InventoryItem> findByPriceBetween(@Param("minPrice") java.math.BigDecimal minPrice, 
                                          @Param("maxPrice") java.math.BigDecimal maxPrice);
    
    // Find items created by specific user
    List<InventoryItem> findByCreatedById(Long userId);
    
    // Find items with stock alerts (quantity <= minimum stock)
    @Query("SELECT i FROM InventoryItem i WHERE i.status = 'LOW_STOCK' OR i.quantity <= i.minQuantity ORDER BY i.quantity ASC")
    List<InventoryItem> findItemsWithStockAlerts();
    
    // Count items by status
    long countByStatus(InventoryItem.ItemStatus status);
}
