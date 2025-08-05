package com.example.hotel_inventory.dto.request;

import com.example.hotel_inventory.model.Frontdesk;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateFrontdeskRequest {
    
    private String guestName;

    @Email(message = "Invalid email format")
    private String guestEmail;

    private String guestPhone;

    private String roomNumber;

    private String roomType;

    private Frontdesk.BookingStatus status;

    private LocalDateTime checkInDate;

    private LocalDateTime checkOutDate;

    private LocalDateTime expectedCheckIn;

    private LocalDateTime expectedCheckOut;

    @Min(value = 1, message = "Number of guests must be at least 1")
    private Integer numberOfGuests;

    private String specialRequests;

    @Min(value = 0, message = "Total amount cannot be negative")
    private Double totalAmount;

    private Frontdesk.PaymentStatus paymentStatus;
}
