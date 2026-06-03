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
@Document(collection = "health_records")
public class HealthRecord {

    @Id
    private String id;

    @DBRef
    private User user;

    private RecordType type;
    private String value;
    
    private Integer heartRate;
    private String bloodPressure;
    private Double bloodGlucose;
    private Integer steps;
    private Integer activeMinutes;
    private Double sleepDuration;
    private Integer sleepQuality;

    @CreatedDate
    private LocalDateTime timestamp;

    private String source;

    public enum RecordType {
        VITALS, ACTIVITY, SLEEP, EHR
    }
}
