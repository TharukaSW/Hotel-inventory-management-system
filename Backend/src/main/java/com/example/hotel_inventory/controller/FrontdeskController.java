package com.example.hotel_inventory.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.hotel_inventory.dto.FrontdeskDto;
import com.example.hotel_inventory.dto.request.CreateFrontdeskRequest;
import com.example.hotel_inventory.dto.request.UpdateFrontdeskRequest;
import com.example.hotel_inventory.dto.response.ApiResponse;
import com.example.hotel_inventory.service.FrontdeskService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/frontdesk")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class FrontdeskController {
    
    private final FrontdeskService frontdeskService;

    @GetMapping
    public ResponseEntity<List<FrontdeskDto>> getAllBookings() {
        try {
            List<FrontdeskDto> bookings = frontdeskService.getAllBookings();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<FrontdeskDto> getBookingById(@PathVariable Long id) {
        try {
            return frontdeskService.getBookingById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FrontdeskDto>> createBooking(@Valid @RequestBody CreateFrontdeskRequest request) {
        try {
            FrontdeskDto createdBooking = frontdeskService.createBooking(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Booking created successfully", createdBooking));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error occurred"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FrontdeskDto>> updateBooking(@PathVariable Long id, 
                                                                  @Valid @RequestBody UpdateFrontdeskRequest request) {
        try {
            FrontdeskDto updatedBooking = frontdeskService.updateBooking(id, request);
            return ResponseEntity.ok(ApiResponse.success("Booking updated successfully", updatedBooking));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error occurred"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Long id) {
        try {
            frontdeskService.deleteBooking(id);
            return ResponseEntity.ok(ApiResponse.success("Booking deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error occurred"));
        }
    }

    @PostMapping("/{id}/checkin")
    public ResponseEntity<ApiResponse<FrontdeskDto>> checkIn(@PathVariable Long id) {
        try {
            UpdateFrontdeskRequest request = UpdateFrontdeskRequest.builder()
                    .status(com.example.hotel_inventory.model.Frontdesk.BookingStatus.CHECKED_IN)
                    .checkInDate(java.time.LocalDateTime.now())
                    .build();
            FrontdeskDto updatedBooking = frontdeskService.updateBooking(id, request);
            return ResponseEntity.ok(ApiResponse.success("Guest checked in successfully", updatedBooking));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error occurred"));
        }
    }

    @PostMapping("/{id}/checkout")
    public ResponseEntity<ApiResponse<FrontdeskDto>> checkOut(@PathVariable Long id) {
        try {
            UpdateFrontdeskRequest request = UpdateFrontdeskRequest.builder()
                    .status(com.example.hotel_inventory.model.Frontdesk.BookingStatus.CHECKED_OUT)
                    .checkOutDate(java.time.LocalDateTime.now())
                    .build();
            FrontdeskDto updatedBooking = frontdeskService.updateBooking(id, request);
            return ResponseEntity.ok(ApiResponse.success("Guest checked out successfully", updatedBooking));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error occurred"));
        }
    }
}
