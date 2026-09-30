package com.healthtrack.api.service;

import com.healthtrack.api.dto.CardioRiskRequest;
import com.healthtrack.api.entity.AIAnalysis;
import com.healthtrack.api.entity.AccessLogEntry;
import com.healthtrack.api.entity.PatientProfile;
import com.healthtrack.api.entity.User;
import com.healthtrack.api.repository.AIAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIAnalysisService {

    private final AIAnalysisRepository repository;
    private final AiServiceClient aiServiceClient;
    private final AccessLogService accessLogService;

    /**
     * Évalue le risque cardiovasculaire d'un patient via le modèle ML (service IA),
     * enregistre le résultat en attente de validation médicale, et journalise l'accès.
     */
    @SuppressWarnings("unchecked")
    public AIAnalysis assessCardioRisk(User patient, CardioRiskRequest request) {
        Map<String, Object> prediction = aiServiceClient.predictCardioRisk(request);

        String aiRisk = String.valueOf(prediction.getOrDefault("risk_level", "STABLE"));
        double probability = toDouble(prediction.get("probability"));
        String modelName = String.valueOf(prediction.getOrDefault("model_name", "unknown"));
        List<String> factors = (List<String>) prediction.getOrDefault("top_factors", List.of());

        String summary = String.format("Risque %s (probabilité %.0f%%) — modèle %s.",
                aiRisk, probability * 100, modelName);
        String recommendations = factors.isEmpty()
                ? "Aucun facteur aggravant marquant détecté. Maintenir une hygiène de vie saine."
                : "Facteurs à surveiller : " + String.join(", ", factors) + ".";

        AIAnalysis analysis = AIAnalysis.builder()
                .patient(patient)
                .riskLevel(mapRisk(aiRisk))
                .confidence(probability)
                .summary(summary)
                .recommendations(recommendations)
                .validationStatus(AIAnalysis.ValidationStatus.PENDING)
                .build();

        AIAnalysis saved = repository.save(analysis);

        // Journal d'accès infalsifiable : l'IA a traité les données du patient.
        accessLogService.record(patient.getId(), "system-ai", "SYSTEM",
                AccessLogEntry.AccessAction.AI_ANALYSIS, "cardio risk=" + aiRisk);

        return saved;
    }

    public List<AIAnalysis> getAnalysesForPatient(User patient) {
        return repository.findAllByPatientOrderByGeneratedAtDesc(patient);
    }

    /** STABLE -> STABLE, AMBER -> MODERATE, RED -> CRITICAL. */
    private PatientProfile.RiskLevel mapRisk(String aiRisk) {
        return switch (aiRisk == null ? "" : aiRisk.toUpperCase()) {
            case "RED", "CRITICAL" -> PatientProfile.RiskLevel.CRITICAL;
            case "AMBER", "MODERATE" -> PatientProfile.RiskLevel.MODERATE;
            default -> PatientProfile.RiskLevel.STABLE;
        };
    }

    private double toDouble(Object o) {
        if (o instanceof Number n) return n.doubleValue();
        try { return Double.parseDouble(String.valueOf(o)); } catch (Exception e) { return 0.0; }
    }
}
