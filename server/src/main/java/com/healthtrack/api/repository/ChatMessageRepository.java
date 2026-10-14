package com.healthtrack.api.repository;

import com.healthtrack.api.entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByPatientIdAndDoctorIdOrderByTimestampAsc(String patientId, String doctorId);
}
