package com.healthtrack.api.repository;

import com.healthtrack.api.entity.MedicalDocument;
import com.healthtrack.api.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalDocumentRepository extends MongoRepository<MedicalDocument, String> {
    List<MedicalDocument> findByUserOrderByUploadedAtDesc(User user);
    long countByUser(User user);
}
