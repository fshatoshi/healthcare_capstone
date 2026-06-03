package com.healthtrack.api.service;

import com.healthtrack.api.entity.AIAnalysis;
import com.healthtrack.api.entity.PatientProfile;
import com.healthtrack.api.entity.User;
import com.healthtrack.api.repository.AIAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AIAnalysisService {

    private final AIAnalysisRepository repository;

    public AIAnalysis generateAnalysis(User patient, String input) {
        // Mock AI Logic: In production, this would call a ML model
        AIAnalysis analysis = AIAnalysis.builder()
                .patient(patient)
                .riskLevel(PatientProfile.RiskLevel.STABLE)
                .confidence(0.92)
                .summary("Analysis completed for: " + input)
                .recommendations("Keep maintaining a balanced diet and regular exercise.")
                .validationStatus(AIAnalysis.ValidationStatus.PENDING)
                .build();
        
        return repository.save(analysis);
    }

    public List<AIAnalysis> getAnalysesForPatient(User patient) {
        return repository.findAllByPatientOrderByGeneratedAtDesc(patient);
    }
}
