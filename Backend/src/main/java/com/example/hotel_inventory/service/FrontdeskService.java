package com.example.hotel_inventory.service;

import com.example.hotel_inventory.dto.FrontdeskDto;
import com.example.hotel_inventory.dto.request.CreateFrontdeskRequest;
import com.example.hotel_inventory.dto.request.UpdateFrontdeskRequest;

import java.util.List;
import java.util.Optional;

public interface FrontdeskService {
    
    List<FrontdeskDto> getAllBookings();
    
    Optional<FrontdeskDto> getBookingById(Long id);
    
    FrontdeskDto createBooking(CreateFrontdeskRequest request);
    
    FrontdeskDto updateBooking(Long id, UpdateFrontdeskRequest request);
    
    void deleteBooking(Long id);
}
