package com.example.hotel_inventory.repository;

import com.example.hotel_inventory.model.InspectionItem;
import com.example.hotel_inventory.model.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectionItemRepository extends JpaRepository<InspectionItem, Long> {
    
    List<InspectionItem> findByInspection(Inspection inspection);
    
    List<InspectionItem> findByConditionStatus(String conditionStatus);
}
