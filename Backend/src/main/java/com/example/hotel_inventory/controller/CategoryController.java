package com.example.hotel_inventory.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotel_inventory.dto.CategoryDto;
import com.example.hotel_inventory.dto.request.CreateCategoryRequest;
import com.example.hotel_inventory.model.Category;
import com.example.hotel_inventory.repository.CategoryRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryRepository categoryRepository;

    // Public (auth removed)
    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .isActive(request.isActive())
                .supplyItem(request.getSupplyItem())
                .build();
        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(CategoryDto.fromEntity(savedCategory));
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        List<CategoryDto> categories = categoryRepository.findAll().stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategory(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(CategoryDto::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Public
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @Valid @RequestBody CreateCategoryRequest request) {
        return categoryRepository.findById(id)
                .map(category -> {
                    category.setName(request.getName());
                    category.setDescription(request.getDescription());
                    category.setActive(request.isActive());
                    category.setSupplyItem(request.getSupplyItem());
                    Category savedCategory = categoryRepository.save(category);
                    return ResponseEntity.ok(CategoryDto.fromEntity(savedCategory));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 