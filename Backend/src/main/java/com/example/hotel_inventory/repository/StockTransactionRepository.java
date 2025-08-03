package com.example.hotel_inventory.repository;

import com.example.hotel_inventory.model.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
} 