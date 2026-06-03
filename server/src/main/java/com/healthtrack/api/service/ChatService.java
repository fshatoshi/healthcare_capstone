package com.healthtrack.api.service;

import com.healthtrack.api.dto.ChatMessageResponse;
import com.healthtrack.api.entity.ChatMessage;
import com.healthtrack.api.entity.User;
import com.healthtrack.api.repository.ChatMessageRepository;
import com.healthtrack.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public List<ChatMessage> getMessagesForPatient(User patient) {
        String doctorId = patient.getAssignedDoctorId();
        if (doctorId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No assigned doctor for this patient.");
        }
        return chatMessageRepository.findByPatientIdAndDoctorIdOrderByTimestampAsc(patient.getId(), doctorId);
    }

    public List<ChatMessage> getMessagesForDoctor(User doctor, String patientId) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found."));
        if (!doctor.getId().equals(patient.getAssignedDoctorId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not assigned to this patient.");
        }
        return chatMessageRepository.findByPatientIdAndDoctorIdOrderByTimestampAsc(patientId, doctor.getId());
    }

    public ChatMessage sendPatientTextMessage(User patient, String content) {
        String doctorId = patient.getAssignedDoctorId();
        if (doctorId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No assigned doctor for this patient.");
        }
        return saveMessage(patient.getId(), doctorId, patient.getId(), doctorId, User.Role.PATIENT, content, null, null);
    }

    public ChatMessage sendDoctorTextMessage(User doctor, String patientId, String content) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found."));
        if (!doctor.getId().equals(patient.getAssignedDoctorId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not assigned to this patient.");
        }
        return saveMessage(doctor.getId(), patientId, doctor.getId(), patientId, User.Role.DOCTOR, content, null, null);
    }

    public ChatMessage sendPatientAudioMessage(User patient, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Audio file is required.");
        }
        String doctorId = patient.getAssignedDoctorId();
        if (doctorId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No assigned doctor for this patient.");
        }
        String objectName = String.format("chat/%s/%s-%s", patient.getId(), UUID.randomUUID(), file.getOriginalFilename());
        String savedObjectName = fileStorageService.uploadFile(file, objectName);
        return saveMessage(patient.getId(), doctorId, patient.getId(), doctorId, User.Role.PATIENT, null, savedObjectName, file.getContentType());
    }

    public ChatMessage sendDoctorAudioMessage(User doctor, String patientId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Audio file is required.");
        }
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found."));
        if (!doctor.getId().equals(patient.getAssignedDoctorId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not assigned to this patient.");
        }
        String objectName = String.format("chat/%s/%s-%s", patientId, UUID.randomUUID(), file.getOriginalFilename());
        String savedObjectName = fileStorageService.uploadFile(file, objectName);
        return saveMessage(doctor.getId(), patientId, doctor.getId(), patientId, User.Role.DOCTOR, null, savedObjectName, file.getContentType());
    }

    private ChatMessage saveMessage(String senderId,
                                    String receiverId,
                                    String senderReferenceId,
                                    String receiverReferenceId,
                                    User.Role senderRole,
                                    String content,
                                    String mediaObjectName,
                                    String mediaType) {
        ChatMessage message = ChatMessage.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .patientId(senderRole == User.Role.PATIENT ? senderReferenceId : receiverReferenceId)
                .doctorId(senderRole == User.Role.DOCTOR ? senderReferenceId : receiverReferenceId)
                .senderRole(senderRole)
                .content(content)
                .mediaObjectName(mediaObjectName)
                .mediaType(mediaType)
                .build();
        return chatMessageRepository.save(message);
    }
}
