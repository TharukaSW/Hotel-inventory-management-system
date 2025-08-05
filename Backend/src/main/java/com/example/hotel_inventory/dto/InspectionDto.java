package com.example.hotel_inventory.dto;

import com.example.hotel_inventory.model.Inspection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionDto {
    private Long id;
    private Long inspectorId;
    private String inspectorName;
    private String locationType;
    private String locationIdentifier;
    private Inspection.InspectionStatus status;
    private String notes;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<InspectionItemDto> inspectionItems;
}
