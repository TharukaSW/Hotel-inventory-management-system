package com.example.hotel_inventory.repository;

import com.example.hotel_inventory.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
} 