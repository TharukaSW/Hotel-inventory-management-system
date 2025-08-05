package com.example.hotel_inventory.controller;

import com.example.hotel_inventory.dto.SupplierDto;
import com.example.hotel_inventory.dto.request.CreateSupplierRequest;
import com.example.hotel_inventory.model.Supplier;
import com.example.hotel_inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierRepository supplierRepository;

    @PostMapping
    public ResponseEntity<SupplierDto> createSupplier(@Valid @RequestBody CreateSupplierRequest request) {
        Supplier supplier = Supplier.builder()
                .name(request.getName())
                .description(request.getDescription())
                .contactPerson(request.getContactPerson())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .address(request.getAddress())
                .supplyItem(request.getSupplyItem())
                .isActive(request.isActive())
                .build();
        Supplier savedSupplier = supplierRepository.save(supplier);
        return ResponseEntity.ok(SupplierDto.fromEntity(savedSupplier));
    }

    @GetMapping
    public ResponseEntity<List<SupplierDto>> getAllSuppliers() {
        List<SupplierDto> suppliers = supplierRepository.findAll().stream()
                .map(SupplierDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierDto> getSupplier(@PathVariable Long id) {
        return supplierRepository.findById(id)
                .map(SupplierDto::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierDto> updateSupplier(@PathVariable Long id, @Valid @RequestBody CreateSupplierRequest request) {
        return supplierRepository.findById(id)
                .map(supplier -> {
                    supplier.setName(request.getName());
                    supplier.setDescription(request.getDescription());
                    supplier.setContactPerson(request.getContactPerson());
                    supplier.setPhoneNumber(request.getPhoneNumber());
                    supplier.setEmail(request.getEmail());
                    supplier.setAddress(request.getAddress());
                    supplier.setSupplyItem(request.getSupplyItem());
                    supplier.setActive(request.isActive());
                    Supplier savedSupplier = supplierRepository.save(supplier);
                    return ResponseEntity.ok(SupplierDto.fromEntity(savedSupplier));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        supplierRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 