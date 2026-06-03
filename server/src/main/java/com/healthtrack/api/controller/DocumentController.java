package com.healthtrack.api.controller;

import com.healthtrack.api.entity.MedicalDocument;
import com.healthtrack.api.entity.User;
import com.healthtrack.api.repository.MedicalDocumentRepository;
import com.healthtrack.api.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final FileStorageService storageService;
    private final MedicalDocumentRepository documentRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) {

        // Vérification du quota de 3 documents
        long count = documentRepository.countByUser(user);
        if (count >= 3) {
            return ResponseEntity.badRequest().body("You have reached the maximum limit of 3 documents.");
        }

        String fileName = file.getOriginalFilename();
        String objectName = user.getId() + "/" + UUID.randomUUID() + "-" + fileName;

        String savedObjectName = storageService.uploadFile(file, objectName);

        MedicalDocument document = MedicalDocument.builder()
                .user(user)
                .fileName(fileName)
                .fileType(file.getContentType())
                .minioObjectName(savedObjectName)
                .uploadedAt(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(documentRepository.save(document));
    }

    @GetMapping
    public ResponseEntity<List<MedicalDocument>> getMyDocuments(@AuthenticationPrincipal User user) {
        List<MedicalDocument> documents = documentRepository.findByUserOrderByUploadedAtDesc(user);
        
        // Générer les URLs de téléchargement temporaires
        documents.forEach(doc -> doc.setDownloadUrl(storageService.getDownloadUrl(doc.getMinioObjectName())));
        
        return ResponseEntity.ok(documents);
    }
}
