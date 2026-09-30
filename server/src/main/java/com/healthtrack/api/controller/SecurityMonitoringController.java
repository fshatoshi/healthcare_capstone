package com.healthtrack.api.controller;

import com.healthtrack.api.service.AccessAnomalyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Supervision de sécurité (réservée à l'ADMIN) : détection d'accès anormaux.
 */
@RestController
@RequestMapping("/api/v1/admin/security")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SecurityMonitoringController {

    private final AccessAnomalyService anomalyService;

    /** Acteurs présentant un comportement d'accès suspect sur la fenêtre donnée. */
    @GetMapping("/anomalies")
    public ResponseEntity<List<AccessAnomalyService.AnomalyReport>> anomalies(
            @RequestParam(defaultValue = "60") int windowMinutes
    ) {
        return ResponseEntity.ok(anomalyService.detect(windowMinutes));
    }
}
