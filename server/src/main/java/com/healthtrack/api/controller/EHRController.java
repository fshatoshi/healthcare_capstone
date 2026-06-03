package com.healthtrack.api.controller;

import com.healthtrack.api.entity.EHRImportJob;
import com.healthtrack.api.entity.User;
import com.healthtrack.api.repository.MedicalDocumentRepository;
import com.healthtrack.api.service.EHRImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ehr/import")
@RequiredArgsConstructor
public class EHRController {

    private final EHRImportService ehrImportService;
    private final MedicalDocumentRepository medicalDocumentRepository;

    @PostMapping
    public ResponseEntity<?> importEhrDocument(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user
    ) {
        long count = medicalDocumentRepository.countByUser(user);
        if (count >= 3) {
            return ResponseEntity.badRequest().body(Map.of("message", "Quota reached: maximum 3 documents"));
        }

        EHRImportJob job = ehrImportService.importDocument(file, user);
        return ResponseEntity.ok(toJobResponse(job));
    }

    @GetMapping("/{importId}/status")
    public ResponseEntity<Map<String, Object>> getImportStatus(
            @PathVariable String importId,
            @AuthenticationPrincipal User user
    ) {
        EHRImportJob job = ehrImportService.getJob(importId, user);
        return ResponseEntity.ok(toJobResponse(job));
    }

    @GetMapping("/{importId}/result")
    public ResponseEntity<Map<String, Object>> getImportResult(
            @PathVariable String importId,
            @AuthenticationPrincipal User user
    ) {
        EHRImportJob job = ehrImportService.getJob(importId, user);
        Map<String, Object> body = toJobResponse(job);
        body.put("extracted", job.getExtracted());
        body.put("warnings", job.getWarnings());
        return ResponseEntity.ok(body);
    }

    @PostMapping("/{importId}/confirm")
    public ResponseEntity<Map<String, Object>> confirmImport(
            @PathVariable String importId,
            @AuthenticationPrincipal User user,
            @RequestBody(required = false) Map<String, Object> ignoredPayload
    ) {
        EHRImportJob job = ehrImportService.confirmImport(importId, user);
        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("message", "EHR extraction confirmed and medical records updated");
        body.put("importId", job.getId());
        return ResponseEntity.ok(body);
    }

    private Map<String, Object> toJobResponse(EHRImportJob job) {
        Map<String, Object> out = new HashMap<>();
        out.put("importId", job.getId());
        out.put("documentId", job.getDocumentId());
        out.put("status", job.getStatus());
        out.put("sourceType", job.getSourceType());
        out.put("message", job.getMessage());
        out.put("createdAt", job.getCreatedAt());
        out.put("updatedAt", job.getUpdatedAt());
        return out;
    }
}
