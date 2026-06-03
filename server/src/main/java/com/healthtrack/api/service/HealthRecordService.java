package com.healthtrack.api.service;

import com.healthtrack.api.entity.HealthRecord;
import com.healthtrack.api.entity.User;
import com.healthtrack.api.repository.HealthRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthRecordService {

    private final HealthRecordRepository repository;

    public HealthRecord saveRecord(HealthRecord record, User user) {
        record.setUser(user);
        if (record.getTimestamp() == null) {
            record.setTimestamp(LocalDateTime.now());
        }
        return repository.save(record);
    }

    public List<HealthRecord> getPatientRecords(User user) {
        return repository.findByUserOrderByTimestampDesc(user);
    }

    public List<HealthRecord> getPatientRecordsByType(User user, HealthRecord.RecordType type) {
        return repository.findByUserAndTypeOrderByTimestampDesc(user, type);
    }
}
