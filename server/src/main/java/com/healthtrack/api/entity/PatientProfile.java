package com.healthtrack.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "patient_profiles")
public class PatientProfile {

    @Id
    private String id;

    @DBRef
    private User user;

    private String dob;
    private String bloodType;
    private String insurance;
    
    @Builder.Default
    private RiskLevel riskLevel = RiskLevel.STABLE;

    public enum RiskLevel {
        STABLE, MODERATE, CRITICAL
    }
}
