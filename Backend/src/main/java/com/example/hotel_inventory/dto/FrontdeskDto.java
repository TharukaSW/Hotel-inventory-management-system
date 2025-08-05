package com.example.hotel_inventory.dto;

import com.example.hotel_inventory.model.Frontdesk;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FrontdeskDto {
    private Long id;
    private String guestName;
    private String guestEmail;
    private String guestPhone;
    private String roomNumber;
    private String roomType;
    private Frontdesk.BookingStatus status;
    private LocalDateTime checkInDate;
    private LocalDateTime checkOutDate;
    private LocalDateTime expectedCheckIn;
    private LocalDateTime expectedCheckOut;
    private Integer numberOfGuests;
    private String specialRequests;
    private Double totalAmount;
    private Frontdesk.PaymentStatus paymentStatus;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static FrontdeskDto fromEntity(Frontdesk frontdesk) {
        return FrontdeskDto.builder()
                .id(frontdesk.getId())
                .guestName(frontdesk.getGuestName())
                .guestEmail(frontdesk.getGuestEmail())
                .guestPhone(frontdesk.getGuestPhone())
                .roomNumber(frontdesk.getRoomNumber())
                .roomType(frontdesk.getRoomType())
                .status(frontdesk.getStatus())
                .checkInDate(frontdesk.getCheckInDate())
                .checkOutDate(frontdesk.getCheckOutDate())
                .expectedCheckIn(frontdesk.getExpectedCheckIn())
                .expectedCheckOut(frontdesk.getExpectedCheckOut())
                .numberOfGuests(frontdesk.getNumberOfGuests())
                .specialRequests(frontdesk.getSpecialRequests())
                .totalAmount(frontdesk.getTotalAmount())
                .paymentStatus(frontdesk.getPaymentStatus())
                .createdBy(frontdesk.getCreatedBy())
                .createdAt(frontdesk.getCreatedAt())
                .updatedAt(frontdesk.getUpdatedAt())
                .build();
    }
}
