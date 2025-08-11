package com.example.hotel_inventory.service.impl;

import com.example.hotel_inventory.dto.ItemRequestDto;
import com.example.hotel_inventory.model.ItemRequest;
import com.example.hotel_inventory.model.InventoryItem;
import com.example.hotel_inventory.model.StockTransaction;
import com.example.hotel_inventory.model.User;
import com.example.hotel_inventory.repository.ItemRequestRepository;
import com.example.hotel_inventory.repository.InventoryItemRepository;
import com.example.hotel_inventory.repository.StockTransactionRepository;
import com.example.hotel_inventory.repository.UserRepository;
import com.example.hotel_inventory.service.AdminInspectorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminInspectorServiceImpl implements AdminInspectorService {

    private final ItemRequestRepository itemRequestRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final UserRepository userRepository;

    @Override
    public List<ItemRequestDto> getItemRequests() {
        List<ItemRequest> itemRequests = itemRequestRepository.findByStatusOrderByCreatedAtDesc(ItemRequest.RequestStatus.PENDING);
        return itemRequests.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ItemRequestDto approveItemRequest(Long requestId, Long adminUserId) {
        ItemRequest itemRequest = itemRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Item request not found"));

        if (itemRequest.getStatus() != ItemRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Item request is already processed");
        }

        User adminUser = userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        InventoryItem inventoryItem = itemRequest.getInventoryItem();
        int requestedQuantity = itemRequest.getRequestedQuantity();
        int currentQuantity = inventoryItem.getQuantity();
        
        // Check if we have enough stock
        if (currentQuantity < requestedQuantity) {
            throw new RuntimeException(
                String.format("Insufficient stock. Available: %d, Requested: %d", 
                    currentQuantity, requestedQuantity));
        }
        
        // Update inventory quantity
        int newQuantity = currentQuantity - requestedQuantity;
        inventoryItem.setQuantity(newQuantity);
        inventoryItem.setUpdatedBy(adminUser);
        
        // Update status based on new quantity
        if (newQuantity == 0) {
            inventoryItem.setStatus(InventoryItem.ItemStatus.OUT_OF_STOCK);
        } else if (newQuantity <= inventoryItem.getMinQuantity()) {
            inventoryItem.setStatus(InventoryItem.ItemStatus.LOW_STOCK);
        }
        
        inventoryItemRepository.save(inventoryItem);
        
        // Create stock transaction record
        StockTransaction stockTransaction = StockTransaction.builder()
                .item(inventoryItem)
                .type(StockTransaction.TransactionType.REMOVE)
                .quantity(requestedQuantity)
                .previousQuantity(currentQuantity)
                .newQuantity(newQuantity)
                .reason(String.format("Approved request by %s for %s (%s)", 
                    itemRequest.getInspector().getFirstName() + " " + itemRequest.getInspector().getLastName(),
                    itemRequest.getLocationType(), 
                    itemRequest.getLocationIdentifier()))
                .performedBy(adminUser)
                .transactionDate(LocalDateTime.now())
                .build();
        
        stockTransactionRepository.save(stockTransaction);
        
        // Update item request status
        itemRequest.setStatus(ItemRequest.RequestStatus.APPROVED);
        itemRequest.setApprovedBy(adminUser);
        itemRequest.setApprovalNotes("Request approved and inventory updated");
        itemRequestRepository.save(itemRequest);

        return convertToDto(itemRequest);
    }

    @Override
    public ItemRequestDto rejectItemRequest(Long requestId, Long adminUserId, String rejectionNotes) {
        ItemRequest itemRequest = itemRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Item request not found"));

        if (itemRequest.getStatus() != ItemRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Item request is already processed");
        }

        User adminUser = userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        itemRequest.setStatus(ItemRequest.RequestStatus.REJECTED);
        itemRequest.setApprovedBy(adminUser);
        itemRequest.setApprovalNotes(rejectionNotes);
        itemRequestRepository.save(itemRequest);

        return convertToDto(itemRequest);
    }

    private ItemRequestDto convertToDto(ItemRequest itemRequest) {
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
}

