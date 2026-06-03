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
@Document(collection = "medical_documents")
public class MedicalDocument {

    @Id
    private String id;

    @DBRef
    private User user;

    private String fileName;
    private String fileType;
    private String minioObjectName;
    private String downloadUrl;

    @CreatedDate
    private LocalDateTime uploadedAt;
}
