package com.healthtrack.api.controller;

import com.healthtrack.api.entity.HealthRecord;
import com.healthtrack.api.entity.User;
import com.healthtrack.api.repository.UserRepository;
import com.healthtrack.api.entity.AccessLogEntry;
import com.healthtrack.api.service.AccessLogService;
import com.healthtrack.api.service.HealthRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/doctor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorController {

    private final UserRepository userRepository;
    private final HealthRecordService recordService;
    private final AccessLogService accessLogService;

    @GetMapping("/patients")
    public ResponseEntity<List<User>> getAllPatients(@RequestParam(required = false) Boolean assigned) {
        List<User> patients = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.PATIENT)
                .filter(u -> assigned == null || assigned.equals(u.getAssignedDoctorId() != null))
                .collect(Collectors.toList());
        return ResponseEntity.ok(patients);
    }

    @PostMapping("/patient/{id}/assign")
    public ResponseEntity<User> assignPatient(
            @PathVariable String id,
            @AuthenticationPrincipal User doctor
    ) {
        User patient = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
        if (patient.getAssignedDoctorId() != null) {
            return ResponseEntity.badRequest().body(patient);
        }
        patient.setAssignedDoctorId(doctor.getId());
        userRepository.save(patient);
        accessLogService.record(patient.getId(), doctor.getId(), doctor.getRole().name(),
                AccessLogEntry.AccessAction.ASSIGN_DOCTOR, "doctor assigned to patient");
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/patient/{id}/records")
    public ResponseEntity<List<HealthRecord>> getPatientRecords(
            @PathVariable String id,
            @AuthenticationPrincipal User doctor
    ) {
        User patient = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
        // V03 (sécurité) : un médecin n'accède qu'aux dossiers des patients qui LUI sont assignés.
        if (!doctor.getId().equals(patient.getAssignedDoctorId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not assigned to this patient.");
        }
        List<HealthRecord> records = recordService.getPatientRecords(patient);
        accessLogService.record(patient.getId(), doctor.getId(), doctor.getRole().name(),
                AccessLogEntry.AccessAction.READ_RECORDS, "records:" + records.size());
        return ResponseEntity.ok(records);
    }
}
