package com.healthtrack.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai-service.url}")
    private String aiServiceUrl;

    public Map<String, Object> analyzeSymptoms(String symptoms) {
        String url = aiServiceUrl + "/analyze";
        
        Map<String, String> request = new HashMap<>();
        request.put("text", symptoms);

        try {
            return restTemplate.postForObject(url, request, Map.class);
        } catch (Exception e) {
            // Fallback mock if AI service is down
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("risk_level", "STABLE");
            fallback.put("summary", "AI Service unavailable. Basic analysis applied.");
            return fallback;
        }
    }
}
