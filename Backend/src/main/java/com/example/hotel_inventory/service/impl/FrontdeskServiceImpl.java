package com.example.hotel_inventory.service.impl;

import com.example.hotel_inventory.dto.FrontdeskDto;
import com.example.hotel_inventory.dto.request.CreateFrontdeskRequest;
import com.example.hotel_inventory.dto.request.UpdateFrontdeskRequest;
import com.example.hotel_inventory.model.Frontdesk;
import com.example.hotel_inventory.repository.FrontdeskRepository;
import com.example.hotel_inventory.service.FrontdeskService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class FrontdeskServiceImpl implements FrontdeskService {

    private final FrontdeskRepository frontdeskRepository;
    
    @Override
    public List<FrontdeskDto> getAllBookings() {
        return frontdeskRepository.findAll().stream().map(FrontdeskDto::fromEntity).collect(Collectors.toList());
    }

    @Override
    public Optional<FrontdeskDto> getBookingById(Long id) {
        return frontdeskRepository.findById(id).map(FrontdeskDto::fromEntity);
    }

    @Override
    public FrontdeskDto createBooking(CreateFrontdeskRequest request) {
        Frontdesk booking = Frontdesk.builder()
                .guestName(request.getGuestName())
                .guestEmail(request.getGuestEmail())
                .guestPhone(request.getGuestPhone())
                .roomNumber(request.getRoomNumber())
                .roomType(request.getRoomType())
                .status(request.getStatus())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .expectedCheckIn(request.getExpectedCheckIn())
                .expectedCheckOut(request.getExpectedCheckOut())
                .numberOfGuests(request.getNumberOfGuests())
                .specialRequests(request.getSpecialRequests())
                .totalAmount(request.getTotalAmount())
                .paymentStatus(request.getPaymentStatus())
                .createdBy(request.getCreatedBy())
                .build();
        return FrontdeskDto.fromEntity(frontdeskRepository.save(booking));
    }

    @Override
    public FrontdeskDto updateBooking(Long id, UpdateFrontdeskRequest request) {
        Frontdesk booking = frontdeskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));
        if (request.getGuestName() != null) booking.setGuestName(request.getGuestName());
        if (request.getGuestEmail() != null) booking.setGuestEmail(request.getGuestEmail());
        if (request.getGuestPhone() != null) booking.setGuestPhone(request.getGuestPhone());
        if (request.getRoomNumber() != null) booking.setRoomNumber(request.getRoomNumber());
        if (request.getRoomType() != null) booking.setRoomType(request.getRoomType());
        if (request.getStatus() != null) booking.setStatus(request.getStatus());
        if (request.getCheckInDate() != null) booking.setCheckInDate(request.getCheckInDate());
        if (request.getCheckOutDate() != null) booking.setCheckOutDate(request.getCheckOutDate());
        if (request.getExpectedCheckIn() != null) booking.setExpectedCheckIn(request.getExpectedCheckIn());
        if (request.getExpectedCheckOut() != null) booking.setExpectedCheckOut(request.getExpectedCheckOut());
        if (request.getNumberOfGuests() != null) booking.setNumberOfGuests(request.getNumberOfGuests());
        if (request.getSpecialRequests() != null) booking.setSpecialRequests(request.getSpecialRequests());
        if (request.getTotalAmount() != null) booking.setTotalAmount(request.getTotalAmount());
        if (request.getPaymentStatus() != null) booking.setPaymentStatus(request.getPaymentStatus());
        return FrontdeskDto.fromEntity(frontdeskRepository.save(booking));
    }

    @Override
    public void deleteBooking(Long id) {
        if (!frontdeskRepository.existsById(id)) {
            throw new EntityNotFoundException("Booking not found with id: " + id);
        }
        frontdeskRepository.deleteById(id);
    }
}
