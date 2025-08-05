package com.example.hotel_inventory.service.impl;

import com.example.hotel_inventory.dto.ItemRequestDto;
import com.example.hotel_inventory.model.ItemRequest;
import com.example.hotel_inventory.model.User;
import com.example.hotel_inventory.repository.ItemRequestRepository;
import com.example.hotel_inventory.repository.UserRepository;
import com.example.hotel_inventory.service.AdminInspectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminInspectorServiceImpl implements AdminInspectorService {

    @Autowired
    private ItemRequestRepository itemRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<ItemRequestDto> getItemRequests() {
        List<ItemRequest> itemRequests = itemRequestRepository.findByStatusOrderByCreatedAtDesc(ItemRequest.RequestStatus.PENDING);
        return itemRequests.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public ItemRequestDto approveItemRequest(Long requestId, Long adminUserId) {
        ItemRequest itemRequest = itemRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Item request not found"));

        if (itemRequest.getStatus() != ItemRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Item request is already processed");
        }

        User adminUser = userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        itemRequest.setStatus(ItemRequest.RequestStatus.APPROVED);
        itemRequest.setApprovedBy(adminUser);
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

