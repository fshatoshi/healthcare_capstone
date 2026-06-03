package com.healthtrack.api.dto;

import com.healthtrack.api.entity.User;
import com.healthtrack.api.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageResponse {
    private String id;
    private String patientId;
    private String doctorId;
    private String senderId;
    private String receiverId;
    private String senderRole;
    private String content;
    private String mediaType;
    private String mediaDownloadUrl;
    private String timestamp;

    public static ChatMessageResponse from(ChatMessage message, String mediaDownloadUrl) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .patientId(message.getPatientId())
                .doctorId(message.getDoctorId())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .senderRole(message.getSenderRole() != null ? message.getSenderRole().name() : null)
                .content(message.getContent())
                .mediaType(message.getMediaType())
                .mediaDownloadUrl(mediaDownloadUrl)
                .timestamp(message.getTimestamp() != null ? message.getTimestamp().toString() : null)
                .build();
    }
}
