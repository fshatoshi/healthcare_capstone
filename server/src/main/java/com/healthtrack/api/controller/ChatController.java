package com.healthtrack.api.controller;

import com.healthtrack.api.dto.ChatMessageRequest;
import com.healthtrack.api.dto.ChatMessageResponse;
import com.healthtrack.api.entity.ChatMessage;
import com.healthtrack.api.entity.User;
import com.healthtrack.api.service.ChatService;
import com.healthtrack.api.entity.AccessLogEntry;
import com.healthtrack.api.service.AccessLogService;
import com.healthtrack.api.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final FileStorageService fileStorageService;
    private final AccessLogService accessLogService;

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/patient/messages")
    public ResponseEntity<List<ChatMessageResponse>> getPatientMessages(
            @AuthenticationPrincipal User user
    ) {
        List<ChatMessage> messages = chatService.getMessagesForPatient(user);
        return ResponseEntity.ok(toResponse(messages));
    }

    @PreAuthorize("hasRole('PATIENT')")
    @PostMapping("/patient/messages/text")
    public ResponseEntity<ChatMessageResponse> sendPatientTextMessage(
            @AuthenticationPrincipal User user,
            @RequestBody ChatMessageRequest request
    ) {
        ChatMessage message = chatService.sendPatientTextMessage(user, request.getContent());
        return ResponseEntity.ok(toResponse(message));
    }

    @PreAuthorize("hasRole('PATIENT')")
    @PostMapping(value = "/patient/messages/audio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChatMessageResponse> sendPatientAudioMessage(
            @AuthenticationPrincipal User user,
            @RequestPart("file") MultipartFile file
    ) {
        ChatMessage message = chatService.sendPatientAudioMessage(user, file);
        return ResponseEntity.ok(toResponse(message));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/doctor/{patientId}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getDoctorMessages(
            @AuthenticationPrincipal User doctor,
            @PathVariable String patientId
    ) {
        List<ChatMessage> messages = chatService.getMessagesForDoctor(doctor, patientId);
        accessLogService.record(patientId, doctor.getId(), doctor.getRole().name(),
                AccessLogEntry.AccessAction.READ_MESSAGES, "messages:" + messages.size());
        return ResponseEntity.ok(toResponse(messages));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @PostMapping("/doctor/{patientId}/messages/text")
    public ResponseEntity<ChatMessageResponse> sendDoctorTextMessage(
            @AuthenticationPrincipal User doctor,
            @PathVariable String patientId,
            @RequestBody ChatMessageRequest request
    ) {
        ChatMessage message = chatService.sendDoctorTextMessage(doctor, patientId, request.getContent());
        return ResponseEntity.ok(toResponse(message));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @PostMapping(value = "/doctor/{patientId}/messages/audio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChatMessageResponse> sendDoctorAudioMessage(
            @AuthenticationPrincipal User doctor,
            @PathVariable String patientId,
            @RequestPart("file") MultipartFile file
    ) {
        ChatMessage message = chatService.sendDoctorAudioMessage(doctor, patientId, file);
        return ResponseEntity.ok(toResponse(message));
    }

    private List<ChatMessageResponse> toResponse(List<ChatMessage> messages) {
        return messages.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ChatMessageResponse toResponse(ChatMessage message) {
        String mediaUrl = message.getMediaObjectName() != null ? fileStorageService.getDownloadUrl(message.getMediaObjectName()) : null;
        return ChatMessageResponse.from(message, mediaUrl);
    }
}
