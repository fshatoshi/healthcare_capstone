package com.healthtrack.api.service;

import com.healthtrack.api.entity.AccessLogEntry;
import com.healthtrack.api.repository.AccessLogRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Journal d'accès chaîné par hash (append-only) + vérification d'intégrité.
 *
 * L'ajout est synchronisé : le hash d'une entrée dépend de la précédente, donc
 * deux écritures concurrentes ne doivent pas lire le même "dernier hash".
 * (Limite : correct pour une instance unique du backend ; une montée en charge
 * multi-instances demanderait un verrou distribué ou une séquence côté base.)
 */
@Service
@RequiredArgsConstructor
public class AccessLogService {

    private static final Logger log = LoggerFactory.getLogger(AccessLogService.class);
    private static final String GENESIS = "GENESIS";

    private final AccessLogRepository repository;

    /** Enregistre un accès et renvoie l'entrée chaînée créée. */
    public synchronized AccessLogEntry record(String patientId,
                                              String actorId,
                                              String actorRole,
                                              AccessLogEntry.AccessAction action,
                                              String detail) {
        AccessLogEntry last = repository.findTopByOrderBySeqDesc();
        long seq = (last == null) ? 0 : last.getSeq() + 1;
        String previousHash = (last == null) ? GENESIS : last.getCurrentHash();
        // Tronque à la milliseconde : MongoDB ne stocke pas au-delà, donc le hash
        // recalculé à la vérification doit se baser sur la même précision.
        Instant now = Instant.now().truncatedTo(ChronoUnit.MILLIS);

        AccessLogEntry entry = AccessLogEntry.builder()
                .seq(seq)
                .patientId(patientId)
                .actorId(actorId)
                .actorRole(actorRole)
                .action(action.name())
                .detail(detail)
                .timestamp(now)
                .previousHash(previousHash)
                .build();

        entry.setCurrentHash(computeHash(entry));
        return repository.save(entry);
    }

    /** Journal d'un patient (du plus récent au plus ancien). */
    public List<AccessLogEntry> getForPatient(String patientId) {
        return repository.findByPatientIdOrderBySeqDesc(patientId);
    }

    /**
     * Recalcule toute la chaîne et vérifie chaque maillon.
     * Détecte : hash falsifié, entrée modifiée, chaînage rompu, séquence trouée.
     */
    public ChainVerification verifyChain() {
        List<AccessLogEntry> all = repository.findAllByOrderBySeqAsc();
        List<Long> broken = new ArrayList<>();
        String expectedPrev = GENESIS;
        long expectedSeq = 0;

        for (AccessLogEntry e : all) {
            boolean seqOk = e.getSeq() == expectedSeq;
            boolean linkOk = expectedPrev.equals(e.getPreviousHash());
            boolean hashOk = computeHash(e).equals(e.getCurrentHash());
            if (!seqOk || !linkOk || !hashOk) {
                broken.add(e.getSeq());
            }
            expectedPrev = e.getCurrentHash();
            expectedSeq = e.getSeq() + 1;
        }

        boolean valid = broken.isEmpty();
        if (!valid) {
            log.warn("Access log integrity check FAILED at seq {}", broken);
        }
        return new ChainVerification(valid, all.size(), broken);
    }

    /** Hash déterministe d'une entrée (indépendant de l'id Mongo). */
    private String computeHash(AccessLogEntry e) {
        String payload = String.join("|",
                String.valueOf(e.getSeq()),
                nullSafe(e.getPatientId()),
                nullSafe(e.getActorId()),
                nullSafe(e.getActorRole()),
                nullSafe(e.getAction()),
                nullSafe(e.getDetail()),
                String.valueOf(e.getTimestamp()),
                nullSafe(e.getPreviousHash()));
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(digest.length * 2);
            for (byte b : digest) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception ex) {
            throw new IllegalStateException("SHA-256 unavailable", ex);
        }
    }

    private String nullSafe(String s) {
        return s == null ? "" : s;
    }

    /** Résultat de la vérification d'intégrité de la chaîne. */
    public record ChainVerification(boolean valid, int totalEntries, List<Long> brokenAtSeq) {}
}
