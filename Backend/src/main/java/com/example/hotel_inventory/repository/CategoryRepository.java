package com.example.hotel_inventory.repository;

import com.example.hotel_inventory.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
} 