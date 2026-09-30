package com.healthtrack.api.repository;

import com.healthtrack.api.entity.AccessLogEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface AccessLogRepository extends MongoRepository<AccessLogEntry, String> {

    // Journal d'un patient, du plus récent au plus ancien (affichage).
    List<AccessLogEntry> findByPatientIdOrderBySeqDesc(String patientId);

    // Toute la chaîne dans l'ordre d'écriture (vérification d'intégrité).
    List<AccessLogEntry> findAllByOrderBySeqAsc();

    // Dernière entrée écrite (pour récupérer le hash précédent).
    AccessLogEntry findTopByOrderBySeqDesc();

    // Entrées écrites après un instant donné (fenêtre d'analyse UEBA).
    List<AccessLogEntry> findByTimestampAfter(Instant t);
}
