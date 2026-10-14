package com.healthtrack.api.controller;

import com.healthtrack.api.dto.CardioRiskRequest;
import jakarta.validation.Valid;
import com.healthtrack.api.entity.AIAnalysis;
import com.healthtrack.api.entity.AccessLogEntry;
import com.healthtrack.api.entity.HealthRecord;
import com.healthtrack.api.entity.User;
import com.healthtrack.api.repository.UserRepository;
import com.healthtrack.api.service.AIAnalysisService;
import com.healthtrack.api.service.AccessLogService;
import com.healthtrack.api.service.HealthRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
public class PatientController {

    private final HealthRecordService healthRecordService;
    private final UserRepository userRepository;
    private final AccessLogService accessLogService;
    private final AIAnalysisService aiAnalysisService;

    @GetMapping("/records")
    public ResponseEntity<List<HealthRecord>> getMyRecords(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(healthRecordService.getPatientRecords(user));
    }

    @PostMapping("/records")
    public ResponseEntity<HealthRecord> addRecord(
            @AuthenticationPrincipal User user,
            @RequestBody HealthRecord record
    ) {
        return ResponseEntity.ok(healthRecordService.saveRecord(record, user));
    }

    @GetMapping("/doctor")
    public ResponseEntity<User> getAssignedDoctor(@AuthenticationPrincipal User user) {
        if (user.getAssignedDoctorId() == null) {
            return ResponseEntity.noContent().build();
        }
        User doctor = userRepository.findById(user.getAssignedDoctorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assigned doctor not found"));
        return ResponseEntity.ok(doctor);
    }

    /**
     * Journal d'accès du patient : qui a consulté SON dossier, quand, pour quoi.
     * Un patient ne voit que son propre journal (isolation par l'identité JWT).
     */
    @GetMapping("/access-log")
    public ResponseEntity<List<AccessLogEntry>> getMyAccessLog(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(accessLogService.getForPatient(user.getId()));
    }

    /** Vérifie l'intégrité de la chaîne (détection d'altération du journal). */
    @GetMapping("/access-log/verify")
    public ResponseEntity<AccessLogService.ChainVerification> verifyAccessLog(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(accessLogService.verifyChain());
    }

    /** Évaluation du risque cardiovasculaire par le modèle IA (résultat en attente
     *  de validation par le médecin). Journalise un accès AI_ANALYSIS. */
    @PostMapping("/ai/cardio-risk")
    public ResponseEntity<AIAnalysis> assessCardioRisk(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CardioRiskRequest request
    ) {
        return ResponseEntity.ok(aiAnalysisService.assessCardioRisk(user, request));
    }

    /** Historique des analyses IA du patient. */
    @GetMapping("/ai/history")
    public ResponseEntity<List<AIAnalysis>> aiHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(aiAnalysisService.getAnalysesForPatient(user));
    }
}
