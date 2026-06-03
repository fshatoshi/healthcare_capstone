package com.healthtrack.api.repository;

import com.healthtrack.api.entity.HealthRecord;
import com.healthtrack.api.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthRecordRepository extends MongoRepository<HealthRecord, String> {
    List<HealthRecord> findByUserOrderByTimestampDesc(User user);
    List<HealthRecord> findByUserAndTypeOrderByTimestampDesc(User user, HealthRecord.RecordType type);
}
