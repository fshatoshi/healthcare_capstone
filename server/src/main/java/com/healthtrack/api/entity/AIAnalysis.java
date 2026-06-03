package com.healthtrack.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ai_analyses")
public class AIAnalysis {

    @Id
    private String id;

    @DBRef
    private User patient;

    private PatientProfile.RiskLevel riskLevel;
    private Double confidence;
    private String summary;
    private String recommendations;
    
    @Builder.Default
    private ValidationStatus validationStatus = ValidationStatus.PENDING;

    @CreatedDate
    private LocalDateTime generatedAt;

    public enum ValidationStatus {
        PENDING, CONFIRMED, CORRECTED, REJECTED
    }
}
