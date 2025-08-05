package com.example.hotel_inventory.controller;

import com.example.hotel_inventory.dto.*;
import com.example.hotel_inventory.dto.request.CreateInspectionRequest;
import com.example.hotel_inventory.dto.request.CreateItemRequestRequest;
import com.example.hotel_inventory.dto.response.ApiResponse;
import com.example.hotel_inventory.service.InspectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/inspector")
@CrossOrigin(origins = {"http://localhost:3005", "http://localhost:3000", "*"})
public class InspectorController {

    @Autowired
    private InspectorService inspectorService;

    // Item Request endpoints
    @PostMapping("/item-requests")
    public ResponseEntity<ItemRequestDto> createItemRequest(
            @Valid @RequestBody CreateItemRequestRequest request) {
        Long inspectorId = 1L; // Default inspector for development
        ItemRequestDto result = inspectorService.createItemRequest(request, inspectorId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/item-requests")
    public ResponseEntity<List<ItemRequestDto>> getMyItemRequests() {
        Long inspectorId = 1L; // Default inspector for development
        List<ItemRequestDto> requests = inspectorService.getMyItemRequests(inspectorId);
        return ResponseEntity.ok(requests);
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
        Long inspectorId = 1L; // Default inspector for development
        InspectionDto result = inspectorService.createInspection(request, inspectorId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/inspections")
    public ResponseEntity<List<InspectionDto>> getMyInspections() {
        Long inspectorId = 1L; // Default inspector for development
        List<InspectionDto> inspections = inspectorService.getMyInspections(inspectorId);
        return ResponseEntity.ok(inspections);
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
        List<InventoryItemDto> items = inspectorService.getAllInventoryItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/inventory/{itemId}")
    public ResponseEntity<InventoryItemDto> getInventoryItem(@PathVariable Long itemId) {
        InventoryItemDto item = inspectorService.getInventoryItemById(itemId);
        return ResponseEntity.ok(item);
    }

}

