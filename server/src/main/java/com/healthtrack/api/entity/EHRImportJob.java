package com.healthtrack.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ehr_import_jobs")
public class EHRImportJob {

    @Id
    private String id;

    @DBRef
    private User user;

    private String documentId;
    private ImportStatus status;
    private String sourceType;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ExtractedData extracted;
    private List<String> warnings;

    public enum ImportStatus {
        PENDING, PROCESSING, DONE, FAILED
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExtractedData {
        private String summary;
        private List<Measurement> measurements;
        private List<Medication> medications;
        private List<Diagnosis> diagnoses;
        private Double confidence;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Measurement {
        private String key;
        private String value;
        private String unit;
        private String observedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Medication {
        private String name;
        private String dosage;
        private String frequency;
        private String startDate;
        private String endDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Diagnosis {
        private String code;
        private String label;
        private String diagnosedAt;
    }
}
