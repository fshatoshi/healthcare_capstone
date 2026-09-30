# Plan de sécurité — HealthTrack AI

> Document de travail : inventaire des failles, plan de correction, puis proposition d'un mécanisme de sécurité innovant.
> Périmètre : backend `server/` (Spring Boot), appli `mobile/` (Expo), infrastructure `docker-compose.yml`, futur service IA `ai-service/`.
> Référentiels : OWASP API Security Top 10 (2023), OWASP MASVS (mobile), OWASP ASVS (vérification), CVSS v3.1 pour la notation.
> Cadre légal : loi marocaine 09-08 sur la protection des données personnelles (CNDP) — les données de santé sont des données sensibles.

---

## 1. Méthode

1. **Reconnaissance** : cartographie des routes (`/api/v1/...`), des rôles (PATIENT, DOCTOR, ADMIN) et des flux de données.
2. **Revue de code** : contrôleurs, services, configuration de sécurité, stockage mobile.
3. **Exploitation (preuve de concept)** : chaque faille est **démontrée avant d'être corrigée** (requête Burp/curl + capture), pour le rapport de pentest.
4. **Correction** puis **re-test** : la même preuve de concept doit échouer après correctif.
5. **Notation** : gravité estimée ci-dessous, à confirmer par un score CVSS v3.1 lors de l'exploitation.

---

## 2. Inventaire des vulnérabilités

Légende gravité (estimation avant exploitation) : 🔴 Critique · 🟠 Élevée · 🟡 Moyenne · 🟢 Faible

| ID | Faille | Où | Gravité | OWASP |
|---|---|---|---|---|
| V01 | **Inscription avec rôle arbitraire** : le rôle vient de la requête (`User.Role.valueOf(request.getRole())`). N'importe qui peut créer un compte `ADMIN` ou `DOCTOR`. | `AuthenticationService.register` | 🔴 | API5 — Broken Function Level Authorization |
| V02 | **Fuite des hachés de mots de passe** : les entités `User` sont renvoyées telles quelles (champ `password` non masqué) par `/doctor/patients`, `/doctor/patient/{id}/assign`, `/patient/doctor`, et indirectement via le `@DBRef user` de `HealthRecord`, `MedicalDocument`, `AIAnalysis`, `EHRImportJob`. | `User.java`, contrôleurs | 🟠 | API3 — Broken Object Property Level Authorization |
| V03 | **IDOR en lecture** : `/doctor/patient/{id}/records` ne vérifie pas que le patient est assigné au médecin. Tout médecin lit tout dossier. | `DoctorController.getPatientRecords` | 🟠 | API1 — Broken Object Level Authorization |
| V04 | **Écrasement du dossier d'un autre patient** (à confirmer par test) : `POST /patient/records` et `POST /records` lient directement l'entité `HealthRecord` ; le champ `id` n'est pas vidé, donc `save()` peut écraser un enregistrement existant d'un autre utilisateur. | `HealthRecordService.saveRecord` | 🟠 | API3 (mass assignment) / API1 |
| V05 | **Auto-assignation sans consentement** : tout médecin (ou tout compte créé via V01) peut s'assigner n'importe quel patient non assigné, et obtient ainsi le dossier et le chat. | `DoctorController.assignPatient` | 🟠 | API6 — Unrestricted Access to Sensitive Business Flows |
| V06 | **Énumération de tous les patients** : `/doctor/patients` renvoie tous les patients de la plateforme (identité, date de naissance, e-mail). | `DoctorController.getAllPatients` | 🟡 | API3 |
| V07 | **Services internes exposés** : MongoDB (27017), Redis (6379), MinIO (9000/9001) publiés sur toutes les interfaces avec des mots de passe faibles (`changeme`). Sur un Wi-Fi partagé, n'importe qui peut lire la base. | `docker-compose.yml` | 🟠 | API8 — Security Misconfiguration |
| V08 | **Pas de chiffrement en transit** : API en HTTP clair, nginx n'écoute que sur le port 80. | `infra/nginx/nginx.conf`, mobile | 🟠 | API8 / MASVS-NETWORK |
| V09 | **Téléversement non contrôlé** : type MIME fourni par le client et réutilisé tel quel, pas de vérification du contenu réel (magic bytes), nom de fichier non assaini dans la clé de l'objet. Un fichier HTML servi via l'URL présignée permet un XSS st
