package com.healthtrack.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_messages")
public class ChatMessage {

    @Id
    private String id;
    private String patientId;
    private String doctorId;
    private String senderId;
    private String receiverId;
    private User.Role senderRole;
    private String content;
    private String mediaObjectName;
    private String mediaType;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
