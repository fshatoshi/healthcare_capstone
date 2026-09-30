package com.healthtrack.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Entrée d'un journal d'accès INFALSIFIABLE (append-only, chaîné par hash).
 *
 * Chaque entrée référence le hash de l'entrée précédente :
 *     currentHash = SHA-256(seq | patientId | actorId | actorRole | action | detail | timestamp | previousHash)
 * Toute modification/suppression a posteriori casse la chaîne et devient détectable
 * (voir AccessLogService.verifyChain). Aucun champ ne doit être modifié après écriture.
 *
 * Limite assumée : registre centralisé. Un administrateur contrôlant le serveur
 * pourrait recalculer toute la chaîne. Parade réelle : ancrer périodiquement le
 * dernier hash sur un support externe indépendant.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "access_log")
public class AccessLogEntry {

    @Id
    private String id;

    /** Position dans la chaîne (0 pour la première entrée). */
    private long seq;

    /** Patient dont le dossier est concerné (sujet des données). */
    @Indexed
    private String patientId;

    /** Auteur de l'accès (médecin, admin, système IA, ou le patient lui-même). */
    private String actorId;
    private String actorRole;

    /** Nature de l'action (voir AccessAction). */
    private String action;

    /** Détail lisible, non sensible (ex. "records:12", "export PDF"). */
    private String detail;

    /** Horodatage d'écriture (UTC). */
    private Instant timestamp;

    /** Hash de l'entrée précédente (chaînage). "GENESIS" pour la première. */
    private String previousHash;

    /** Hash de cette entrée. */
    private String currentHash;

    public enum AccessAction {
        READ_RECORDS,      // un médecin consulte les dossiers du patient
        AI_ANALYSIS,       // le moteur IA analyse le patient
        EXPORT,            // export d'un document / résumé
        ASSIGN_DOCTOR,     // un médecin est assigné au patient
        READ_MESSAGES,     // un médecin lit la messagerie du patient
        DOCUMENT_ACCESS    // génération d'une URL de téléchargement de document
    }
}
