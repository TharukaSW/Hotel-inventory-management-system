package com.example.hotel_inventory.repository;

import com.example.hotel_inventory.model.Frontdesk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FrontdeskRepository extends JpaRepository<Frontdesk, Long> {
    
    List<Frontdesk> findByStatus(Frontdesk.BookingStatus status);
    
    List<Frontdesk> findByRoomNumber(String roomNumber);
    
    Optional<Frontdesk> findByRoomNumberAndStatus(String roomNumber, Frontdesk.BookingStatus status);
    
    List<Frontdesk> findByGuestNameContainingIgnoreCase(String guestName);
    
    List<Frontdesk> findByGuestEmail(String guestEmail);
    
    List<Frontdesk> findByPaymentStatus(Frontdesk.PaymentStatus paymentStatus);
    
    @Query("SELECT f FROM Frontdesk f WHERE f.expectedCheckIn BETWEEN :startDate AND :endDate")
    List<Frontdesk> findByExpectedCheckInBetween(@Param("startDate") LocalDateTime startDate, 
                                                @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT f FROM Frontdesk f WHERE f.expectedCheckOut BETWEEN :startDate AND :endDate")
    List<Frontdesk> findByExpectedCheckOutBetween(@Param("startDate") LocalDateTime startDate, 
                                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(f) FROM Frontdesk f WHERE f.status = :status")
    Long countByStatus(@Param("status") Frontdesk.BookingStatus status);
    
    @Query("SELECT f FROM Frontdesk f WHERE f.roomNumber = :roomNumber AND f.status IN ('RESERVED', 'CHECKED_IN')")
    List<Frontdesk> findActiveBookingsByRoom(@Param("roomNumber") String roomNumber);
}
