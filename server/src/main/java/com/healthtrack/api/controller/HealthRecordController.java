package com.healthtrack.api.controller;

import com.healthtrack.api.entity.HealthRecord;
import com.healthtrack.api.entity.User;
import com.healthtrack.api.service.HealthRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/records")
@RequiredArgsConstructor
public class HealthRecordController {

    private final HealthRecordService service;

    @PostMapping
    public ResponseEntity<HealthRecord> createRecord(
            @RequestBody HealthRecord record,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.saveRecord(record, user));
    }

    @GetMapping
    public ResponseEntity<List<HealthRecord>> getMyRecords(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getPatientRecords(user));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<HealthRecord>> getMyRecordsByType(
            @PathVariable HealthRecord.RecordType type,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getPatientRecordsByType(user, type));
    }
}
