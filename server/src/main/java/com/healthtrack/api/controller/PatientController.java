package com.healthtrack.api.controller;

import com.healthtrack.api.entity.HealthRecord;
import com.healthtrack.api.entity.User;
import com.healthtrack.api.repository.UserRepository;
import com.healthtrack.api.service.HealthRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
public class PatientController {

    private final HealthRecordService healthRecordService;
    private final UserRepository userRepository;

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
                .orElseThrow(() -> new RuntimeException("Assigned doctor not found"));
        return ResponseEntity.ok(doctor);
    }
}
