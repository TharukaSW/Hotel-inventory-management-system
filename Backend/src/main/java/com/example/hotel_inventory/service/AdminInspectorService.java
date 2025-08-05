package com.example.hotel_inventory.service;

import com.example.hotel_inventory.dto.ItemRequestDto;

import java.util.List;

public interface AdminInspectorService {
    List<ItemRequestDto> getItemRequests();
    ItemRequestDto approveItemRequest(Long requestId, Long adminUserId);
    ItemRequestDto rejectItemRequest(Long requestId, Long adminUserId, String rejectionNotes);
}
