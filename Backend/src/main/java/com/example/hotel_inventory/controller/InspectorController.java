package com.example.hotel_inventory.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.hotel_inventory.dto.InspectionDto;
import com.example.hotel_inventory.dto.InspectionItemDto;
import com.example.hotel_inventory.dto.InventoryItemDto;
import com.example.hotel_inventory.dto.ItemRequestDto;
import com.example.hotel_inventory.dto.request.CreateInspectionRequest;
import com.example.hotel_inventory.dto.request.CreateItemRequestRequest;
import com.example.hotel_inventory.security.UserPrincipal;
import com.example.hotel_inventory.service.InspectorService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/inspector")
@Slf4j
public class InspectorController {

    @Autowired
    private InspectorService inspectorService;

    private Long currentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal up) {
            return up.getId();
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
    }

    // Item Request endpoints
    @PostMapping("/item-requests")
    public ResponseEntity<ItemRequestDto> createItemRequest(
            @Valid @RequestBody CreateItemRequestRequest request) {
    Long inspectorId = currentUserId();
    ItemRequestDto result = inspectorService.createItemRequest(request, inspectorId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/item-requests")
    public ResponseEntity<List<ItemRequestDto>> getMyItemRequests() {
        try {
            Long inspectorId = currentUserId();
            List<ItemRequestDto> requests = inspectorService.getMyItemRequests(inspectorId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            // Return empty list instead of error for development
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/item-requests/{requestId}")
    public ResponseEntity<ItemRequestDto> getItemRequest(@PathVariable Long requestId) {
        ItemRequestDto request = inspectorService.getItemRequestById(requestId);
        return ResponseEntity.ok(request);
    }

    // Inspection endpoints
    @PostMapping("/inspections")
    public ResponseEntity<InspectionDto> createInspection(
            @Valid @RequestBody CreateInspectionRequest request) {
        Long inspectorId = currentUserId();
        log.info("Creating inspection: inspectorId={}, locationType={}, locationIdentifier={}", inspectorId, request.getLocationType(), request.getLocationIdentifier());
        InspectionDto result = inspectorService.createInspection(request, inspectorId);
        log.info("Created inspection id={} for inspectorId={}", result.getId(), inspectorId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/inspections")
    public ResponseEntity<List<InspectionDto>> getMyInspections() {
        try {
            Long inspectorId = currentUserId();
            List<InspectionDto> inspections = inspectorService.getMyInspections(inspectorId);
            return ResponseEntity.ok(inspections);
        } catch (Exception e) {
            // If user not authenticated, fall back to returning all inspections so UI can still display data
            try {
                List<InspectionDto> all = inspectorService.getAllInspections();
                return ResponseEntity.ok(all);
            } catch (Exception inner) {
                return ResponseEntity.ok(List.of());
            }
        }
    }

    @GetMapping("/inspections/all")
    public ResponseEntity<List<InspectionDto>> getAllInspections() {
        try {
            List<InspectionDto> inspections = inspectorService.getAllInspections();
            return ResponseEntity.ok(inspections);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/inspections/{inspectionId}")
    public ResponseEntity<InspectionDto> getInspection(@PathVariable Long inspectionId) {
        InspectionDto inspection = inspectorService.getInspectionById(inspectionId);
        return ResponseEntity.ok(inspection);
    }

    @PutMapping("/inspections/{inspectionId}")
    public ResponseEntity<InspectionDto> updateInspection(
            @PathVariable Long inspectionId,
            @RequestBody InspectionDto inspectionDto) {
        InspectionDto result = inspectorService.updateInspection(inspectionId, inspectionDto);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/inspections/{inspectionId}/complete")
    public ResponseEntity<InspectionDto> completeInspection(@PathVariable Long inspectionId) {
        InspectionDto result = inspectorService.completeInspection(inspectionId);
        return ResponseEntity.ok(result);
    }

    // Inspection Item endpoints
    @PostMapping("/inspections/{inspectionId}/items")
    public ResponseEntity<InspectionItemDto> addInspectionItem(
            @PathVariable Long inspectionId,
            @RequestBody InspectionItemDto inspectionItemDto) {
        InspectionItemDto result = inspectorService.addInspectionItem(inspectionId, inspectionItemDto);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/inspection-items/{inspectionItemId}")
    public ResponseEntity<InspectionItemDto> updateInspectionItem(
            @PathVariable Long inspectionItemId,
            @RequestBody InspectionItemDto inspectionItemDto) {
        InspectionItemDto result = inspectorService.updateInspectionItem(inspectionItemId, inspectionItemDto);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/inspection-items/{inspectionItemId}")
    public ResponseEntity<Void> removeInspectionItem(@PathVariable Long inspectionItemId) {
        inspectorService.removeInspectionItem(inspectionItemId);
        return ResponseEntity.ok().build();
    }

    // Inventory view endpoints (read-only)
    @GetMapping("/inventory")
    public ResponseEntity<List<InventoryItemDto>> getAllInventoryItems() {
        try {
            List<InventoryItemDto> items = inspectorService.getAllInventoryItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            // Return empty list instead of error for development
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/inventory/{itemId}")
    public ResponseEntity<InventoryItemDto> getInventoryItem(@PathVariable Long itemId) {
        InventoryItemDto item = inspectorService.getInventoryItemById(itemId);
        return ResponseEntity.ok(item);
    }

    @GetMapping("/inventory/category/{categoryId}")
    public ResponseEntity<List<InventoryItemDto>> getInventoryItemsByCategory(@PathVariable Long categoryId) {
        List<InventoryItemDto> items = inspectorService.getInventoryItemsByCategory(categoryId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/inventory/supplier/{supplierId}")
    public ResponseEntity<List<InventoryItemDto>> getInventoryItemsBySupplier(@PathVariable Long supplierId) {
        List<InventoryItemDto> items = inspectorService.getInventoryItemsBySupplier(supplierId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/inventory/search")
    public ResponseEntity<List<InventoryItemDto>> searchInventoryItems(@RequestParam String searchTerm) {
        List<InventoryItemDto> items = inspectorService.searchInventoryItems(searchTerm);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/inventory/low-stock")
    public ResponseEntity<List<InventoryItemDto>> getLowStockInventoryItems() {
        List<InventoryItemDto> items = inspectorService.getLowStockInventoryItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/inventory/status/{status}")
    public ResponseEntity<List<InventoryItemDto>> getInventoryItemsByStatus(@PathVariable String status) {
        List<InventoryItemDto> items = inspectorService.getInventoryItemsByStatus(status);
        return ResponseEntity.ok(items);
    }

}

