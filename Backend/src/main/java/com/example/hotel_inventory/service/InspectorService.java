package com.example.hotel_inventory.service;

import com.example.hotel_inventory.dto.*;
import com.example.hotel_inventory.dto.request.CreateInspectionRequest;
import com.example.hotel_inventory.dto.request.CreateItemRequestRequest;
import com.example.hotel_inventory.model.ItemRequest;
import com.example.hotel_inventory.model.Inspection;

import java.util.List;

public interface InspectorService {
    
    // Item Request Management
    ItemRequestDto createItemRequest(CreateItemRequestRequest request, Long inspectorId);
    List<ItemRequestDto> getMyItemRequests(Long inspectorId);
    List<ItemRequestDto> getPendingItemRequests();
    ItemRequestDto getItemRequestById(Long requestId);
    
    // Inspection Management
    InspectionDto createInspection(CreateInspectionRequest request, Long inspectorId);
    InspectionDto updateInspection(Long inspectionId, InspectionDto inspectionDto);
    InspectionDto completeInspection(Long inspectionId);
    List<InspectionDto> getMyInspections(Long inspectorId);
    InspectionDto getInspectionById(Long inspectionId);
    
    // Inspection Item Management
    InspectionItemDto addInspectionItem(Long inspectionId, InspectionItemDto inspectionItemDto);
    InspectionItemDto updateInspectionItem(Long inspectionItemId, InspectionItemDto inspectionItemDto);
    void removeInspectionItem(Long inspectionItemId);
    
    // Inventory View (Read-only)
    List<InventoryItemDto> getAllInventoryItems();
    InventoryItemDto getInventoryItemById(Long itemId);
}
