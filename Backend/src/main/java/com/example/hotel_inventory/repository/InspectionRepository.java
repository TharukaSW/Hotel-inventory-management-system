package com.example.hotel_inventory.repository;

import com.example.hotel_inventory.model.Inspection;
import com.example.hotel_inventory.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InspectionRepository extends JpaRepository<Inspection, Long> {
    
    List<Inspection> findByInspectorOrderByCreatedAtDesc(User inspector);
    
    List<Inspection> findByStatusOrderByCreatedAtDesc(Inspection.InspectionStatus status);
    
    List<Inspection> findByLocationTypeAndLocationIdentifier(String locationType, String locationIdentifier);
    
    @Query("SELECT i FROM Inspection i WHERE i.inspector = :inspector AND i.status = :status")
    List<Inspection> findByInspectorAndStatus(@Param("inspector") User inspector, 
                                              @Param("status") Inspection.InspectionStatus status);
    
    @Query("SELECT i FROM Inspection i WHERE i.createdAt BETWEEN :startDate AND :endDate")
    List<Inspection> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                            @Param("endDate") LocalDateTime endDate);
}
