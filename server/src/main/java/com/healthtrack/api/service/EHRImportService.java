package com.healthtrack.api.service;

import com.healthtrack.api.entity.EHRImportJob;
import com.healthtrack.api.entity.HealthRecord;
import com.healthtrack.api.entity.MedicalDocument;
import com.healthtrack.api.entity.User;
import com.healthtrack.api.repository.EHRImportJobRepository;
import com.healthtrack.api.repository.MedicalDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class EHRImportService {

    private final FileStorageService storageService;
    private final MedicalDocumentRepository medicalDocumentRepository;
    private final EHRImportJobRepository ehrImportJobRepository;
    private final HealthRecordService healthRecordService;

    public EHRImportJob importDocument(MultipartFile file, User user) {
        String fileName = file.getOriginalFilename() == null ? "document" : file.getOriginalFilename();
        String objectName = user.getId() + "/" + UUID.randomUUID() + "-" + fileName;
        String savedObjectName = storageService.uploadFile(file, objectName);

        MedicalDocument document = medicalDocumentRepository.save(
                MedicalDocument.builder()
                        .user(user)
                        .fileName(fileName)
                        .fileType(file.getContentType())
                        .minioObjectName(savedObjectName)
                        .uploadedAt(LocalDateTime.now())
                        .build()
        );

        EHRImportJob.ExtractedData extracted = extractData(fileName);
        LocalDateTime now = LocalDateTime.now();

        EHRImportJob job = EHRImportJob.builder()
                .user(user)
                .documentId(document.getId())
                .status(EHRImportJob.ImportStatus.DONE)
                .sourceType(resolveSourceType(file.getContentType(), fileName))
                .message("Extraction complete")
                .createdAt(now)
                .updatedAt(now)
                .extracted(extracted)
                .warnings(List.of())
                .build();

        return ehrImportJobRepository.save(job);
    }

    public EHRImportJob getJob(String importId, User user) {
        return ehrImportJobRepository.findByIdAndUser(importId, user)
                .orElseThrow(() -> new IllegalArgumentException("EHR import job not found"));
    }

    public EHRImportJob confirmImport(String importId, User user) {
        EHRImportJob job = getJob(importId, user);
        EHRImportJob.ExtractedData extracted = job.getExtracted();
        if (extracted == null) {
            return job;
        }

        List<HealthRecord> records = mapToHealthRecords(extracted);
        for (HealthRecord record : records) {
            healthRecordService.saveRecord(record, user);
        }
        return job;
    }

    private List<HealthRecord> mapToHealthRecords(EHRImportJob.ExtractedData data) {
        List<HealthRecord> out = new ArrayList<>();
        Integer heartRate = toInteger(readMeasurement(data, "heartrate", "heart_rate", "hr", "pulse"));
        Double glucose = toDouble(readMeasurement(data, "glucose", "bloodglucose", "blood_glucose"));
        String bloodPressure = readMeasurement(data, "bloodpressure", "blood_pressure", "bp");

        if (heartRate != null || glucose != null || bloodPressure != null) {
            out.add(HealthRecord.builder()
                    .type(HealthRecord.RecordType.VITALS)
                    .heartRate(heartRate)
                    .bloodGlucose(glucose)
                    .bloodPressure(bloodPressure)
                    .source("EHR")
                    .build());
        }

        Integer steps = toInteger(readMeasurement(data, "steps", "stepcount"));
        Integer activeMinutes = toInteger(readMeasurement(data, "activeminutes", "active_minutes"));
        if (steps != null || activeMinutes != null) {
            out.add(HealthRecord.builder()
                    .type(HealthRecord.RecordType.ACTIVITY)
                    .steps(steps)
                    .activeMinutes(activeMinutes)
                    .source("EHR")
                    .build());
        }

        Double sleepDuration = toDouble(readMeasurement(data, "sleepduration", "sleep_duration"));
        if (sleepDuration != null) {
            out.add(HealthRecord.builder()
                    .type(HealthRecord.RecordType.SLEEP)
                    .sleepDuration(sleepDuration)
                    .source("EHR")
                    .build());
        }

        if (data.getSummary() != null && !data.getSummary().isBlank()) {
            out.add(HealthRecord.builder()
                    .type(HealthRecord.RecordType.EHR)
                    .value(data.getSummary())
                    .source("EHR")
                    .build());
        }

        return out;
    }

    private String readMeasurement(EHRImportJob.ExtractedData data, String... keys) {
        if (data.getMeasurements() == null) return null;
        for (EHRImportJob.Measurement m : data.getMeasurements()) {
            if (m.getKey() == null) continue;
            String normalized = m.getKey().toLowerCase(Locale.ROOT);
            for (String key : keys) {
                if (normalized.equals(key)) {
                    return m.getValue();
                }
            }
        }
        return null;
    }

    private Integer toInteger(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return Integer.parseInt(value.replace(",", ".").split("\\.")[0]);
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    private Double toDouble(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return Double.parseDouble(value.replace(",", "."));
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    private String resolveSourceType(String contentType, String fileName) {
        String lowerName = fileName.toLowerCase(Locale.ROOT);
        if (contentType != null && contentType.contains("pdf")) return "PDF";
        if (contentType != null && contentType.startsWith("image/")) return "IMAGE";
        if (lowerName.endsWith(".hl7") || lowerName.endsWith(".txt")) return "HL7";
        if (lowerName.endsWith(".json") || lowerName.endsWith(".xml")) return "FHIR";
        return "UNKNOWN";
    }

    private EHRImportJob.ExtractedData extractData(String fileName) {
        String normalized = fileName.toLowerCase(Locale.ROOT);
        List<EHRImportJob.Measurement> measurements = new ArrayList<>();

        addIfFound(measurements, "heartRate", normalized, "(?:hr|heartrate|heart[_\\s-]?rate)\\D{0,6}(\\d{2,3})", "bpm");
        addIfFound(measurements, "bloodGlucose", normalized, "(?:glucose|glycemie|blood[_\\s-]?glucose)\\D{0,8}(\\d{2,3})", "mg/dL");
        addIfFound(measurements, "steps", normalized, "(?:steps|pas)\\D{0,6}(\\d{3,6})", "count");
        addIfFound(measurements, "sleepDuration", normalized, "(?:sleep|sommeil)\\D{0,6}(\\d(?:\\.\\d)?)", "hours");

        EHRImportJob.Measurement bpMeasurement = extractBloodPressure(normalized);
        if (bpMeasurement != null) {
            measurements.add(bpMeasurement);
        }

        String summary = "Structured extraction from uploaded EHR document";
        if (measurements.isEmpty()) {
            summary = "Document imported. No structured vitals detected from filename metadata.";
        }

        return EHRImportJob.ExtractedData.builder()
                .summary(summary)
                .measurements(measurements)
                .diagnoses(List.of())
                .medications(List.of())
                .confidence(measurements.isEmpty() ? 0.45 : 0.82)
                .build();
    }

    private void addIfFound(List<EHRImportJob.Measurement> list, String key, String text, String regex, String unit) {
        Matcher matcher = Pattern.compile(regex, Pattern.CASE_INSENSITIVE).matcher(text);
        if (matcher.find()) {
            list.add(EHRImportJob.Measurement.builder()
                    .key(key)
                    .value(matcher.group(1))
                    .unit(unit)
                    .observedAt(LocalDateTime.now().toString())
                    .build());
        }
    }

    private EHRImportJob.Measurement extractBloodPressure(String text) {
        Matcher matcher = Pattern.compile("(\\d{2,3})[\\s/_-]?(\\d{2,3})").matcher(text);
        if (!matcher.find()) {
            return null;
        }
        return EHRImportJob.Measurement.builder()
                .key("bloodPressure")
                .value(matcher.group(1) + "/" + matcher.group(2))
                .unit("mmHg")
                .observedAt(LocalDateTime.now().toString())
                .build();
    }
}
