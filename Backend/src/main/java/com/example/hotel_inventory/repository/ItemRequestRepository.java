package com.example.hotel_inventory.repository;

import com.example.hotel_inventory.model.ItemRequest;
import com.example.hotel_inventory.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRequestRepository extends JpaRepository<ItemRequest, Long> {
    
    List<ItemRequest> findByInspectorOrderByCreatedAtDesc(User inspector);
    
    List<ItemRequest> findByStatusOrderByCreatedAtDesc(ItemRequest.RequestStatus status);
    
    @Query("SELECT ir FROM ItemRequest ir WHERE ir.status = :status AND ir.inspector = :inspector")
    List<ItemRequest> findByStatusAndInspector(@Param("status") ItemRequest.RequestStatus status, 
                                               @Param("inspector") User inspector);
    
    List<ItemRequest> findByLocationTypeAndLocationIdentifier(String locationType, String locationIdentifier);
}
