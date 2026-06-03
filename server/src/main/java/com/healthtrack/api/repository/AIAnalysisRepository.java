package com.healthtrack.api.repository;

import com.healthtrack.api.entity.AIAnalysis;
import com.healthtrack.api.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AIAnalysisRepository extends MongoRepository<AIAnalysis, String> {
    List<AIAnalysis> findAllByPatientOrderByGeneratedAtDesc(User patient);
}
