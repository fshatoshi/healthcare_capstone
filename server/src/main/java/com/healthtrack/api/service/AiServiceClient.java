package com.healthtrack.api.service;

import com.healthtrack.api.dto.CardioRiskRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Client HTTP vers le microservice IA (FastAPI). Appelle POST /analyze/predict
 * avec les mesures du patient et renvoie la prédiction de risque.
 */
@Service
@RequiredArgsConstructor
public class AiServiceClient {

    private static final Logger log = LoggerFactory.getLogger(AiServiceClient.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai-service.url}")
    private String aiServiceUrl;

    @SuppressWarnings("unchecked")
    public Map<String, Object> predictCardioRisk(CardioRiskRequest r) {
        String url = aiServiceUrl + "/analyze/predict";

        Map<String, Object> body = new HashMap<>();
        body.put("age_years", r.getAgeYears());
        body.put("gender", r.getGender());
        body.put("height", r.getHeight());
        body.put("weight", r.getWeight());
        body.put("ap_hi", r.getApHi());
        body.put("ap_lo", r.getApLo());
        body.put("cholesterol", r.getCholesterol());
        body.put("gluc", r.getGluc());
        body.put("smoke", r.getSmoke());
        body.put("alco", r.getAlco());
        body.put("active", r.getActive());

        try {
            return restTemplate.postForObject(url, body, Map.class);
        } catch (Exception e) {
            // Repli si le service IA est indisponible : on ne bloque pas l'appli,
            // et on marque clairement le résultat comme dégradé.
            log.warn("AI service unavailable at {} : {}", url, e.getMessage());
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("risk_level", "STABLE");
            fallback.put("probability", 0.0);
            fallback.put("model_name", "fallback");
            fallback.put("top_factors", List.of());
            fallback.put("disclaimer", "Service IA indisponible : analyse de repli.");
            return fallback;
        }
    }
}
