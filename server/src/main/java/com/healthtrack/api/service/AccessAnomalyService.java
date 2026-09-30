package com.healthtrack.api.service;

import com.healthtrack.api.entity.AccessLogEntry;
import com.healthtrack.api.repository.AccessLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Détection d'accès anormaux (UEBA — phase 1, statistique et explicable).
 *
 * Analyse le journal d'accès sur une fenêtre glissante et attribue à chaque
 * "acteur" (médecin, admin) un score de risque à partir de signaux simples :
 *  - volume d'accès élevé sur la fenêtre ;
 *  - grand nombre de patients DISTINCTS consultés ;
 *  - accès en pleine nuit.
 *
 * Chaque alerte est motivée (reasons) : un analyste sait POURQUOI ça a été levé.
 * Phase 2 (non incluse) : un modèle Isolation Forest côté service IA, entraîné
 * une fois que le journal aura accumulé un historique réel.
 */
@Service
@RequiredArgsConstructor
public class AccessAnomalyService {

    private static final ZoneId ZONE = ZoneId.of("Africa/Casablanca");

    // Seuils (ajustables ; à calibrer sur des données réelles en phase 2).
    private static final int BURST_COUNT = 20;        // accès sur la fenêtre
    private static final int DISTINCT_PATIENTS = 10;  // patients distincts
    private static final int NIGHT_START = 0, NIGHT_END = 5; // 00h-05h

    private final AccessLogRepository repository;

    public List<AnomalyReport> detect(int windowMinutes) {
        Instant since = Instant.now().minus(windowMinutes, ChronoUnit.MINUTES);
        List<AccessLogEntry> entries = repository.findByTimestampAfter(since).stream()
                // On surveille les accès humains ; l'IA système est exclue.
                .filter(e -> !"SYSTEM".equalsIgnoreCase(e.getActorRole()))
                .collect(Collectors.toList());

        Map<String, List<AccessLogEntry>> byActor = entries.stream()
                .collect(Collectors.groupingBy(AccessLogEntry::getActorId));

        List<AnomalyReport> reports = new ArrayList<>();
        for (var e : byActor.entrySet()) {
            reports.add(score(e.getKey(), e.getValue(), windowMinutes));
        }
        // Ne renvoie que les acteurs présentant au moins un signal, plus risqué d'abord.
        return reports.stream()
                .filter(r -> !r.reasons().isEmpty())
                .sorted(Comparator.comparingInt(AnomalyReport::score).reversed())
                .collect(Collectors.toList());
    }

    private AnomalyReport score(String actorId, List<AccessLogEntry> acts, int windowMinutes) {
        int count = acts.size();
        long distinct = acts.stream().map(AccessLogEntry::getPatientId).distinct().count();
        long night = acts.stream()
                .filter(a -> {
                    int h = a.getTimestamp().atZone(ZONE).getHour();
                    return h >= NIGHT_START && h < NIGHT_END;
                }).count();

        List<String> reasons = new ArrayList<>();
        int score = 0;
        if (count >= BURST_COUNT) {
            reasons.add(count + " accès en " + windowMinutes + " min (seuil " + BURST_COUNT + ")");
            score += 40;
        }
        if (distinct >= DISTINCT_PATIENTS) {
            reasons.add(distinct + " patients distincts consultés (seuil " + DISTINCT_PATIENTS + ")");
            score += 40;
        }
        if (night > 0) {
            reasons.add(night + " accès en pleine nuit (00h-05h)");
            score += 20;
        }

        String role = acts.get(0).getActorRole();
        String severity = score >= 60 ? "HIGH" : score >= 30 ? "MEDIUM" : score > 0 ? "LOW" : "NONE";
        return new AnomalyReport(actorId, role, count, distinct, night, score, severity, reasons);
    }

    public record AnomalyReport(String actorId, String actorRole, int accessCount,
                                long distinctPatients, long nightAccesses,
                                int score, String severity, List<String> reasons) {}
}
