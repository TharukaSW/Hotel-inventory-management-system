package com.example.hotel_inventory.service.impl;

import com.example.hotel_inventory.dto.*;
import com.example.hotel_inventory.dto.request.CreateInspectionRequest;
import com.example.hotel_inventory.dto.request.CreateItemRequestRequest;
import com.example.hotel_inventory.model.*;
import com.example.hotel_inventory.repository.*;
import com.example.hotel_inventory.service.InspectorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InspectorServiceImpl implements InspectorService {

    private final ItemRequestRepository itemRequestRepository;
    private final InspectionRepository inspectionRepository;
    private final InspectionItemRepository inspectionItemRepository;
    private final UserRepository userRepository;
    private final InventoryItemRepository inventoryItemRepository;

    @Override
    public ItemRequestDto createItemRequest(CreateItemRequestRequest request, Long inspectorId) {
        User inspector = userRepository.findById(inspectorId)
                .orElseThrow(() -> new RuntimeException("Inspector not found"));
        
        InventoryItem inventoryItem = inventoryItemRepository.findById(request.getInventoryItemId())
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));

        ItemRequest itemRequest = ItemRequest.builder()
                .inspector(inspector)
                .inventoryItem(inventoryItem)
                .requestedQuantity(request.getRequestedQuantity())
                .locationType(request.getLocationType())
                .locationIdentifier(request.getLocationIdentifier())
                .reason(request.getReason())
                .status(ItemRequest.RequestStatus.PENDING)
                .build();

        ItemRequest savedRequest = itemRequestRepository.save(itemRequest);
        return convertToItemRequestDto(savedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemRequestDto> getMyItemRequests(Long inspectorId) {
        User inspector = userRepository.findById(inspectorId)
                .orElseThrow(() -> new RuntimeException("Inspector not found"));
        
        List<ItemRequest> requests = itemRequestRepository.findByInspectorOrderByCreatedAtDesc(inspector);
        return requests.stream()
                .map(this::convertToItemRequestDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemRequestDto> getPendingItemRequests() {
        List<ItemRequest> requests = itemRequestRepository.findByStatusOrderByCreatedAtDesc(ItemRequest.RequestStatus.PENDING);
        return requests.stream()
                .map(this::convertToItemRequestDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ItemRequestDto getItemRequestById(Long requestId) {
        ItemRequest request = itemRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Item request not found"));
        return convertToItemRequestDto(request);
    }

    @Override
    public InspectionDto createInspection(CreateInspectionRequest request, Long inspectorId) {
        User inspector = userRepository.findById(inspectorId)
                .orElseThrow(() -> new RuntimeException("Inspector not found"));

        Inspection inspection = Inspection.builder()
                .inspector(inspector)
                .locationType(request.getLocationType())
                .locationIdentifier(request.getLocationIdentifier())
                .notes(request.getNotes())
                .status(Inspection.InspectionStatus.IN_PROGRESS)
                .startedAt(LocalDateTime.now())
                .build();

        Inspection savedInspection = inspectionRepository.save(inspection);
        return convertToInspectionDto(savedInspection);
    }

    @Override
    public InspectionDto updateInspection(Long inspectionId, InspectionDto inspectionDto) {
        Inspection inspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new RuntimeException("Inspection not found"));

        inspection.setNotes(inspectionDto.getNotes());
        inspection.setStatus(inspectionDto.getStatus());

        if (inspectionDto.getStatus() == Inspection.InspectionStatus.COMPLETED && inspection.getCompletedAt() == null) {
            inspection.setCompletedAt(LocalDateTime.now());
        }

        Inspection savedInspection = inspectionRepository.save(inspection);
        return convertToInspectionDto(savedInspection);
    }

    @Override
    public InspectionDto completeInspection(Long inspectionId) {
        Inspection inspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new RuntimeException("Inspection not found"));

        inspection.setStatus(Inspection.InspectionStatus.COMPLETED);
        inspection.setCompletedAt(LocalDateTime.now());

        Inspection savedInspection = inspectionRepository.save(inspection);
        return convertToInspectionDto(savedInspection);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InspectionDto> getMyInspections(Long inspectorId) {
        User inspector = userRepository.findById(inspectorId)
                .orElseThrow(() -> new RuntimeException("Inspector not found"));

        List<Inspection> inspections = inspectionRepository.findByInspectorOrderByCreatedAtDesc(inspector);
        return inspections.stream()
                .map(this::convertToInspectionDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InspectionDto getInspectionById(Long inspectionId) {
        Inspection inspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new RuntimeException("Inspection not found"));
        return convertToInspectionDto(inspection);
    }

    @Override
    public InspectionItemDto addInspectionItem(Long inspectionId, InspectionItemDto inspectionItemDto) {
        Inspection inspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new RuntimeException("Inspection not found"));

        InventoryItem inventoryItem = inventoryItemRepository.findById(inspectionItemDto.getInventoryItemId())
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));

        InspectionItem inspectionItem = InspectionItem.builder()
                .inspection(inspection)
                .inventoryItem(inventoryItem)
                .expectedQuantity(inspectionItemDto.getExpectedQuantity())
                .actualQuantity(inspectionItemDto.getActualQuantity())
                .conditionStatus(inspectionItemDto.getConditionStatus())
                .notes(inspectionItemDto.getNotes())
                .build();

        InspectionItem savedItem = inspectionItemRepository.save(inspectionItem);
        return convertToInspectionItemDto(savedItem);
    }

    @Override
    public InspectionItemDto updateInspectionItem(Long inspectionItemId, InspectionItemDto inspectionItemDto) {
        InspectionItem inspectionItem = inspectionItemRepository.findById(inspectionItemId)
                .orElseThrow(() -> new RuntimeException("Inspection item not found"));

        inspectionItem.setExpectedQuantity(inspectionItemDto.getExpectedQuantity());
        inspectionItem.setActualQuantity(inspectionItemDto.getActualQuantity());
        inspectionItem.setConditionStatus(inspectionItemDto.getConditionStatus());
        inspectionItem.setNotes(inspectionItemDto.getNotes());

        InspectionItem savedItem = inspectionItemRepository.save(inspectionItem);
        return convertToInspectionItemDto(savedItem);
    }

    @Override
    public void removeInspectionItem(Long inspectionItemId) {
        if (!inspectionItemRepository.existsById(inspectionItemId)) {
            throw new RuntimeException("Inspection item not found");
        }
        inspectionItemRepository.deleteById(inspectionItemId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getAllInventoryItems() {
        List<InventoryItem> items = inventoryItemRepository.findAll();
        return items.stream()
                .map(this::convertToInventoryItemDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryItemDto getInventoryItemById(Long itemId) {
        InventoryItem item = inventoryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));
        return convertToInventoryItemDto(item);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItemsByCategory(Long categoryId) {
        List<InventoryItem> items = inventoryItemRepository.findByCategoryId(categoryId);
        return items.stream()
                .map(this::convertToInventoryItemDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItemsBySupplier(Long supplierId) {
        List<InventoryItem> items = inventoryItemRepository.findBySupplierId(supplierId);
        return items.stream()
                .map(this::convertToInventoryItemDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> searchInventoryItems(String searchTerm) {
        List<InventoryItem> items = inventoryItemRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(searchTerm, searchTerm);
        return items.stream()
                .map(this::convertToInventoryItemDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getLowStockInventoryItems() {
        List<InventoryItem> items = inventoryItemRepository.findByQuantityLessThanOrEqualToMinQuantity();
        return items.stream()
                .map(this::convertToInventoryItemDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItemsByStatus(String status) {
        InventoryItem.ItemStatus itemStatus = InventoryItem.ItemStatus.valueOf(status.toUpperCase());
        List<InventoryItem> items = inventoryItemRepository.findByStatus(itemStatus);
        return items.stream()
                .map(this::convertToInventoryItemDto)
                .collect(Collectors.toList());
    }

    // Conversion methods
    private ItemRequestDto convertToItemRequestDto(ItemRequest itemRequest) {
        return ItemRequestDto.builder()
                .id(itemRequest.getId())
                .inspectorId(itemRequest.getInspector().getId())
                .inspectorName(itemRequest.getInspector().getFirstName() + " " + itemRequest.getInspector().getLastName())
                .inventoryItemId(itemRequest.getInventoryItem().getId())
                .itemName(itemRequest.getInventoryItem().getName())
                .requestedQuantity(itemRequest.getRequestedQuantity())
                .locationType(itemRequest.getLocationType())
                .locationIdentifier(itemRequest.getLocationIdentifier())
                .reason(itemRequest.getReason())
                .status(itemRequest.getStatus())
                .approvedById(itemRequest.getApprovedBy() != null ? itemRequest.getApprovedBy().getId() : null)
                .approvedByName(itemRequest.getApprovedBy() != null ? 
                    itemRequest.getApprovedBy().getFirstName() + " " + itemRequest.getApprovedBy().getLastName() : null)
                .approvalNotes(itemRequest.getApprovalNotes())
                .createdAt(itemRequest.getCreatedAt())
                .updatedAt(itemRequest.getUpdatedAt())
                .build();
    }

    private InspectionDto convertToInspectionDto(Inspection inspection) {
        List<InspectionItemDto> inspectionItems = inspectionItemRepository.findByInspection(inspection)
                .stream()
                .map(this::convertToInspectionItemDto)
                .collect(Collectors.toList());

        return InspectionDto.builder()
                .id(inspection.getId())
                .inspectorId(inspection.getInspector().getId())
                .inspectorName(inspection.getInspector().getFirstName() + " " + inspection.getInspector().getLastName())
                .locationType(inspection.getLocationType())
                .locationIdentifier(inspection.getLocationIdentifier())
                .status(inspection.getStatus())
                .notes(inspection.getNotes())
                .startedAt(inspection.getStartedAt())
                .completedAt(inspection.getCompletedAt())
                .createdAt(inspection.getCreatedAt())
                .updatedAt(inspection.getUpdatedAt())
                .inspectionItems(inspectionItems)
                .build();
    }

    private InspectionItemDto convertToInspectionItemDto(InspectionItem inspectionItem) {
        return InspectionItemDto.builder()
                .id(inspectionItem.getId())
                .inspectionId(inspectionItem.getInspection().getId())
                .inventoryItemId(inspectionItem.getInventoryItem().getId())
                .itemName(inspectionItem.getInventoryItem().getName())
                .expectedQuantity(inspectionItem.getExpectedQuantity())
                .actualQuantity(inspectionItem.getActualQuantity())
                .conditionStatus(inspectionItem.getConditionStatus())
                .notes(inspectionItem.getNotes())
                .createdAt(inspectionItem.getCreatedAt())
                .updatedAt(inspectionItem.getUpdatedAt())
                .build();
    }

    private InventoryItemDto convertToInventoryItemDto(InventoryItem item) {
        return InventoryItemDto.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .category(item.getCategory() != null ? CategoryDto.fromEntity(item.getCategory()) : null)
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .status(item.getStatus())
                .minQuantity(item.getMinQuantity())
                .maxQuantity(item.getMaxQuantity())
                .supplier(item.getSupplier() != null ? SupplierDto.fromEntity(item.getSupplier()) : null)
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .createdBy(item.getCreatedBy() != null ? UserDto.fromEntity(item.getCreatedBy()) : null)
                .updatedBy(item.getUpdatedBy() != null ? UserDto.fromEntity(item.getUpdatedBy()) : null)
                .build();
    }
}
