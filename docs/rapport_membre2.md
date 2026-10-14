# Rapport de Projet Fin d'Études - Sections Membre 2
## Analyse, Besoins et Conception Fonctionnelle

---

# INTRODUCTION GÉNÉRALE

Le secteur de la santé traverse une phase de mutation sans précédent, propulsée par l'essor des technologies numériques et de l'intelligence artificielle. Traditionnellement réactif et centré sur le traitement des pathologies déclarées, le paradigme médical évolue vers une approche préventive, personnalisée et continue, souvent qualifiée de médecine des 4P (Prédictive, Préventive, Personnalisée et Participative). Dans ce contexte, la santé mobile (m-health) s'est imposée comme un vecteur essentiel de démocratisation du suivi médical, permettant d'étendre la surveillance clinique hors des murs des hôpitaux et de l'intégrer dans le quotidien des individus.

Cependant, l'accès à ces innovations demeure fortement inégalitaire. En effet, la majorité des solutions de suivi de santé disponibles sur le marché imposent deux contraintes majeures : l'acquisition d'objets connectés (wearables) coûteux et la possession d'une connexion internet haut débit permanente. Ces barrières économiques et infrastructurelles excluent de facto une part significative de la population, notamment dans les pays en développement et les zones rurales. Au Maroc, bien que le taux de pénétration des smartphones dépasse les 70% en zone urbaine, l'accès à des équipements médicaux connectés dédiés reste marginal, et les déserts médicaux compliquent l'accès à une médecine préventive de proximité.

Le projet **HealthTrack AI** est né de la volonté de lever ces verrous technologiques et socio-économiques. L'objectif est de concevoir et de développer une plateforme mobile et web de suivi médical intelligent et inclusive, adaptée aux spécificités culturelles et linguistiques du marché marocain. L'originalité du projet réside dans sa capacité à collecter des constantes physiologiques complexes (telles que la fréquence cardiaque) à l'aide des capteurs natifs du smartphone — notamment par photopléthysmographie à distance (rPPG) via la caméra — et à interpréter des rapports médicaux numérisés (EHR) grâce à des algorithmes de reconnaissance optique de caractères (OCR) et de traitement automatique du langage (NLP). Cette approche permet de proposer un suivi médical de premier plan sans imposer de coûts matériels supplémentaires au patient.

Ce rapport détaille la conception fonctionnelle, technique et la mise en œuvre de cette plateforme. Les chapitres rédigés sous la responsabilité du **Membre 2** s'attacheront à poser les bases théoriques et méthodologiques du projet. Le *Chapitre I* établira le cadrage du projet, sa problématique et ses objectifs. Le *Chapitre II* proposera une étude préliminaire à travers une analyse de l'existant, la présentation de la solution et la modélisation du contexte d'interaction. Le *Chapitre III* identifiera les spécifications fonctionnelles et le découpage en sprints agiles. Enfin, le *Chapitre IV* formalisera la conception fonctionnelle à travers la spécification détaillée des cas d'utilisation et des histoires utilisateurs clés du système.

---
---

# CHAPITRE I - CONTEXTE GÉNÉRAL DU PROJET

## 1. PRÉSENTATION DU PROJET

Le projet **HealthTrack AI** vise à concevoir une solution logicielle globale permettant de collecter, centraliser, analyser et partager des données de santé et de bien-être de manière sécurisée et intelligente. Conçue sous la forme d'une application mobile multiplateforme à destination des patients, couplée à un espace de supervision pour les médecins et un panneau de configuration pour les administrateurs, la plateforme agit comme un intermédiaire intelligent entre la vie quotidienne du patient et le cabinet médical.

Le projet met l'accent sur la prévention. En permettant au patient de suivre en continu ses données physiologiques (pression artérielle, rythme cardiaque, glycémie, sommeil, activité), HealthTrack AI l'aide à mieux comprendre son corps et à adopter des comportements plus sains. Pour le médecin, la plateforme offre un historique de données structuré et pré-analysé, facilitant la détection précoce de dégradations cliniques et optimisant le temps de consultation.

---

## 2. PROBLÉMATIQUE

L'analyse du secteur de la santé au Maroc et dans plusieurs régions d'Afrique du Nord met en lumière des failles structurelles majeures auxquelles notre projet tente de répondre :

1.  **Dépendance matérielle et barrière financière :** La plupart des applications de santé grand public (ex. Apple Health, Google Fit) tirent leur valeur de l'intégration avec des montres connectées. Le coût de ces dispositifs représente un verrou d'accès majeur pour les ménages à revenus modestes.
2.  **Infrastructures réseau asymétriques :** Les zones rurales ou semi-urbaines souffrent parfois de connexions internet instables. Une application de santé qui exige une synchronisation cloud en temps réel pour fonctionner devient inutilisable dans ces régions.
3.  **Inadéquation des modèles d'IA aux spécificités locales :** Les modèles de vision par ordinateur ou d'analyse prédictive sont majoritairement entraînés sur des banques de données occidentales. Ils ne prennent pas en compte les variations de pigmentation cutanée locales (essentielles pour l'analyse d'images ou la mesure rPPG par caméra), ni les habitudes de vie et le profil épidémiologique de la population marocaine.
4.  **Barrières linguistiques et analphabétisme fonctionnel :** Le français est souvent la langue par défaut des applications médicales au Maroc, ce qui exclut une grande partie de la population non francophone. L'absence d'interfaces vocales ou de support de l'arabe et de la Darija (arabe dialectal marocain) limite l'inclusivité des outils numériques de santé.
5.  **Dossiers médicaux fragmentés et non structurés :** Les patients possèdent souvent des comptes-rendus d'analyses médicales sous forme de documents papier ou PDF disparates. Ces données, bien qu'essentielles, sont rarement exploitées de manière structurée et restent invisibles pour le médecin en dehors des consultations physiques.

### Question de recherche centrale :
*« Comment concevoir une plateforme de santé mobile qui collecte, analyse et interprète des données de santé multimodales pour fournir des recommandations préventives fiables, tout en garantissant une accessibilité maximale indépendamment de la connectivité réseau, du coût des terminaux ou du niveau linguistique des utilisateurs ? »*

---

## 3. OBJECTIFS DU PROJET

Pour répondre à cette problématique, le projet HealthTrack AI s'articule autour d'un objectif principal décliné en sept objectifs spécifiques.

### 3.1. Objectif Principal
Développer une plateforme logicielle multiplateforme (Mobile et Web) qui démocratise l'accès à la médecine préventive en collectant des données de santé sans matériel dédié, en automatisant l'analyse clinique par l'intelligence artificielle et en facilitant la collaboration sécurisée entre le patient et son médecin.

### 3.2. Objectifs Spécifiques
*   **Track (Suivre) :** Permettre la collecte multidimensionnelle des données de santé (fréquence cardiaque, pas, sommeil, pression artérielle) par saisie manuelle guidée, par traitement des capteurs intégrés au smartphone (accéléromètre, caméra) et par importation de documents cliniques existants.
*   **Analyze (Analyser) :** Déployer des modèles de machine learning capables d'identifier les anomalies dans l'historique du patient et de calculer un score de risque clinique dynamique (Faible / Modéré / Élevé / Critique).
*   **Visualize (Visualiser) :** Restituer l'information de manière claire et ergonomique à travers des graphiques temporels et des tableaux de bord adaptés à chaque type d'acteur.
*   **Recommend (Recommander) :** Traduire les analyses de données en conseils de prévention personnalisés et exploitables au quotidien (alimentation, hydratation, sommeil, activité physique).
*   **Detect (Détecter) :** Utiliser la vision par ordinateur (on-device) pour analyser des clichés pris par le patient afin de repérer des indicateurs visuels liés à la posture, à la fatigue oculaire ou à des affections dermatologiques superficielles.
*   **Alert (Alerter) :** Mettre en œuvre un système d'alerte en temps réel via des notifications push pour avertir le patient et son médecin traitant lorsqu'une constante franchit un seuil de sécurité clinique.
*   **Include (Inclure) :** Garantir un fonctionnement hors-ligne (offline-first) avec base de données locale synchronisée et proposer une localisation linguistique complète intégrant le Français, l'Anglais, l'Arabe et la Darija.

---
---

# CHAPITRE II - ÉTUDE PRÉLIMINAIRE

## 1. PRÉSENTATION ET ANALYSE DE L'EXISTANT

Avant d'initier la conception de notre système, nous avons mené une étude comparative des principales solutions existantes sur le marché de la santé mobile :

1.  **Apple Health / Google Fit :** Ces plateformes sont des agrégateurs de données de santé robustes et reconnus. Elles offrent d'excellentes visualisations de données. Cependant, leur valeur clinique dépend fortement de la possession d'objets connectés (Apple Watch, Pixel Watch) dont le coût est prohibitif pour de nombreux utilisateurs. De plus, ces outils ne proposent pas de passerelle directe, bidirectionnelle et structurée pour qu'un médecin de famille puisse suivre activement son patient.
2.  **Applications de fitness tierces (MyFitnessPal, Fitbit App) :** Axées principalement sur la nutrition et le sport, elles manquent de rigueur clinique. Les conseils générés sont génériques et ne s'appuient pas sur des analyses croisées de documents médicaux officiels (EHR). De plus, elles exigent presque toutes un abonnement payant et une connexion internet permanente.
3.  **Portails patients hospitaliers (MyChart) :** Très répandus dans les systèmes de santé occidentaux, ils permettent d'accéder à ses dossiers médicaux réels. Toutefois, ils sont lourds, rigides, ne supportent pas la saisie passive par capteurs mobiles (rPPG), et ne sont absolument pas adaptés aux infrastructures et aux langues locales marocaines.

### Synthèse critique :
Les solutions existantes souffrent d'une double fracture : une **fracture économique** (exigence de matériel connecté cher) et une **fracture d'usage** (dépendance au réseau, interfaces complexes en langues étrangères, absence de liaison collaborative médecin-patient). C'est pour combler ce vide que la solution HealthTrack AI a été pensée.

---

## 2. SOLUTION PROPOSÉE

HealthTrack AI se positionne comme une plateforme de santé préventive intelligente et inclusive. Pour éliminer les limites identifiées dans les solutions existantes, notre proposition repose sur les piliers suivants :

*   **Zéro équipement additionnel :** L'application mobile remplace les capteurs externes en utilisant la caméra arrière du smartphone pour mesurer le pouls par photopléthysmographie (rPPG). Les variations de couleur de la peau du doigt posé sur l'objectif, associées au flash, permettent d'extraire l'onde de pouls et de calculer le rythme cardiaque. L'accéléromètre interne est quant à lui sollicité pour mesurer l'activité physique (compteur de pas).
*   **Intelligence Artificielle en périphérie (On-Device AI) & Service dédié :** L'analyse des images et de la voix (symptômes) se fait localement grâce à des modèles légers (MediaPipe, TensorFlow Lite), protégeant la vie privée et réduisant le besoin de bande passante. Pour les calculs lourds de traitement de texte et d'OCR des dossiers EHR complexes, un microservice Python dédié prend le relais de manière sécurisée.
*   **Architecture Offline-First :** L'application stocke localement toutes les données saisies ou capturées dans une base de données SQLite embarquée. Dès qu'une connexion internet est détectée, un protocole de synchronisation asynchrone transmet les données au serveur Spring Boot sans interrompre l'expérience utilisateur.
*   **Une passerelle Patient-Médecin opérationnelle :** Au lieu de simplement afficher des données, l'application permet au patient d'associer son compte à un médecin agréé. Le médecin accède à un espace de travail où l'IA a préalablement analysé les rapports et classé les dossiers par niveau de criticité, permettant un suivi à distance efficace et structuré.

---

## 3. IDENTIFICATION DES ACTEURS

Quatre acteurs clés interagissent avec la plateforme HealthTrack AI :

1.  **Le Patient (Acteur Principal) :** C'est l'utilisateur final de l'application mobile. Il renseigne ses constantes (manuellement ou via les capteurs du téléphone), télécharge ses documents médicaux (analyses de laboratoire, comptes-rendus de radiologie), décrit ses symptômes (via du texte ou des enregistrements vocaux en Darija/Arabe/Français) et consulte ses tableaux de bord de santé ainsi que les conseils personnalisés émis par le système.
2.  **Le Médecin (Acteur Clinique) :** C'est le partenaire médical du patient. Depuis son portail, il consulte la liste de ses patients assignés, classée par niveau de risque. Il accède aux dossiers médicaux complets, examine les analyses automatiques de l'IA (qu'il peut confirmer, rejeter ou corriger en y apportant sa propre interprétation clinique), rédige des notes d'évolution clinique et émet des prescriptions.
3.  **L'Administrateur (Acteur Technique) :** Il gère la plateforme logicielle. Ses tâches consistent à valider les comptes des professionnels de santé, à suivre les statistiques d'utilisation du système et à configurer les modules d'IA (ajustement des seuils de sensibilité pour les alertes de risque, activation/désactivation de modules).
4.  **Le Système / Moteur d'IA (Acteur Interne) :** Entité logicielle autonome qui effectue les calculs d'extraction des données EHR (OCR), de détection d'anomalies cliniques, d'évaluation du score de risque et de génération automatique de recommandations préventives.

---

## 4. DIAGRAMME DE CONTEXTE DYNAMIQUE

Le diagramme de contexte définit les frontières du système HealthTrack AI et schématise les flux d'informations bidirectionnels entre l'application et les différents acteurs externes.

### Description des flux d'information :

#### Flux liés au Patient :
*   **Patient ➔ Système :**
    *   Données d'authentification et de profil.
    *   Constantes physiologiques saisies manuellement (pression artérielle, sommeil, poids).
    *   Signaux de capteurs (flux vidéo du doigt pour le rPPG, données d'accéléromètre).
    *   Fichiers EHR importés (fichiers PDF ou images de comptes-rendus cliniques).
    *   Descriptions multimodales de symptômes (saisies textuelles ou vocales).
*   **Système ➔ Patient :**
    *   Indicateurs de santé visuels et graphiques de tendances historiques.
    *   Alertes instantanées en cas d'anomalie critique détectée.
    *   Recommandations personnalisées et conseils d'hygiène de vie.
    *   Rapports de diagnostic préliminaires issus de l'analyse des symptômes.
    *   Notes et ordonnances médicales validées par le médecin.

#### Flux liés au Médecin :
*   **Médecin ➔ Système :**
    *   Identifiants d'accès clinique.
    *   Décisions de validation des analyses IA (Confirmation / Correction / Rejet des anomalies détectées).
    *   Notes de consultation clinique et annotations sur le dossier du patient.
    *   Ordonnances numériques prescrites.
*   **Système ➔ Médecin :**
    *   Liste de tri clinique des patients ordonnée par niveau de criticité.
    *   Dossier patient consolidé (historique des constantes vitales, graphes cliniques).
    *   Rapports d'analyses prédictives générés par l'IA (détection d'anomalies, score de risque).
    *   Documents EHR originaux importés par le patient et données extraites par l'OCR.

#### Flux liés à l'Administrateur :
*   **Administrateur ➔ Système :**
    *   Commandes d'administration (approbation/suspension de comptes).
    *   Paramètres de configuration des modules d'IA (seuils de déclenchement d'alertes).
*   **Système ➔ Administrateur :**
    *   Statistiques d'utilisation globale de la plateforme et logs de sécurité.
    *   Indicateurs de charge du serveur et états opérationnels des modules d'IA.

---
---

# CHAPITRE III - SPÉCIFICATIONS FONCTIONNELLES

## 1. IDENTIFICATION DES FONCTIONNALITÉS DU SYSTEME

Les besoins fonctionnels du système HealthTrack AI ont été regroupés par domaine de responsabilité afin de structurer l'architecture modulaire :

### F01 : Gestion des comptes et profils sécurisés
*   Inscription séparée pour les patients et les médecins avec vérification des rôles.
*   Authentification sécurisée par jetons JWT (Json Web Token) et chiffrement des mots de passe.
*   Gestion du profil utilisateur (données anthropométriques, préférences linguistiques, antécédents médicaux).
*   Liaison sécurisée entre un patient et un médecin traitant unique.

### F02 : Module de collecte de constantes (Tracking)
*   Saisie manuelle guidée des données vitales (Pression artérielle, Fréquence cardiaque, Glycémie).
*   Saisie de données comportementales (Heures et qualité du sommeil, hydratation, poids).
*   Mesure du rythme cardiaque par rPPG via la caméra arrière et le flash du smartphone.
*   Suivi automatique de l'activité physique par traitement passif de l'accéléromètre.

### F03 : Gestion et extraction des documents EHR
*   Téléchargement sécurisé de fichiers PDF et d'images médicales vers un espace de stockage objet MinIO (S3).
*   Extraction automatique des données textuelles et numériques des comptes-rendus par OCR (Tesseract).
*   Structuration des données médicales extraites pour alimenter le dossier du patient.

### F04 : Analyse prédictive par l'IA
*   Détection d'anomalies physiologiques (comparaison des données temporelles à des seuils cliniques).
*   Calcul du score de risque clinique global basé sur l'historique et les alertes d'anomalies.
*   Génération de recommandations personnalisées adaptées au profil et à l'état du patient.

### F05 : Espace collaboratif Clinique (Médecin)
*   Tableau de bord de tri listant les patients assignés par ordre de criticité.
*   Consultation détaillée du dossier patient (graphes de tendances, historique complet, documents originaux).
*   Interface de révision clinique pour valider, rejeter ou corriger les diagnostics suggérés par l'IA.
*   Éditeur de notes d'évolution clinique et de prescriptions médicales.

### F06 : Module d'alerte et de notification
*   Envoi immédiat de notifications push (Firebase Cloud Messaging) au patient en cas d'anomalie critique.
*   Notification push instantanée au médecin traitant lorsque l'un de ses patients passe en état de risque critique.

### F07 : Administration et configuration
*   Supervision des statistiques de la plateforme (croissance utilisateur, volume d'analyses IA).
*   Gestion des comptes (activation, suspension de profils).
*   Panneau de configuration des modèles d'IA pour ajuster les seuils de confiance et de criticité par constante vitale.

### F08 : Inclusivité et résilience réseau
*   Sauvegarde locale des données de suivi dans une base SQLite embarquée.
*   Synchronisation automatique asynchrone des données locales lors du retour de la connexion réseau.
*   Interface utilisateur localisée dans les langues cibles (Français, Arabe, Darija, Anglais).

---

## 2. MODÉLISATION DES CAS D'UTILISATION GÉNÉRAUX

Le diagramme de cas d'utilisation général présente graphiquement les interactions entre les acteurs externes (Patient, Médecin, Administrateur) et les fonctionnalités offertes par l'application HealthTrack AI.

### Acteurs et Frontières du Système :
Le système est délimité par l'application mobile et sa plateforme backend. Les trois acteurs humains se connectent à l'application via des droits d'accès différenciés, tandis que le moteur d'IA agit en arrière-plan pour traiter les données.

### Liste des Cas d'Utilisation Majeurs :

*   **Cas d'utilisation communs :**
    *   *S'authentifier (Se connecter / S'inscrire)* ➔ Requis pour accéder à toute fonctionnalité.
    *   *Gérer son profil* ➔ Modifier ses informations personnelles et linguistiques.
*   **Cas d'utilisation du Patient :**
    *   *Renseigner ses constantes de santé* ➔ Englobe la saisie manuelle et la capture par capteurs (rPPG, accéléromètre).
    *   *Importer un document EHR* ➔ Télécharger des comptes-rendus d'analyses médicales.
    *   *Décrire des symptômes* ➔ Formuler une demande d'évaluation IA par texte, voix ou image.
    *   *Consulter son tableau de bord de santé* ➔ Visualiser ses indicateurs cliniques et lire les recommandations de l'IA.
*   **Cas d'utilisation du Médecin :**
    *   *Consulter la file de tri des patients* ➔ Visualiser la liste ordonnée selon la sévérité des risques.
    *   *Consulter un dossier patient* ➔ Accéder aux constantes, graphes et documents EHR du patient.
    *   *Valider une analyse IA (AI Review)* ➔ Valider, modifier ou rejeter le rapport prédictif de l'IA.
    *   *Ajouter une note clinique / Rédiger une ordonnance* ➔ Mettre à jour le dossier de soin du patient.
*   **Cas d'utilisation de l'Administrateur :**
    *   *Gérer les utilisateurs* ➔ Consulter et modifier le statut des comptes (médecins, patients).
    *   *Configurer les paramètres d'IA* ➔ Ajuster les valeurs seuils des variables cliniques surveillées par le système.
    *   *Consulter les indicateurs d'activité* ➔ Suivre les graphiques d'utilisation globale de la plateforme.

---

## 3. DÉCOUPAGE EN SPRINTS (MÉTHODOLOGIE AGILE)

Afin de livrer un produit fonctionnel de manière progressive, le projet a été découpé en **8 sprints d'une semaine** :

*   **Sprint 1 : Architecture et fondations** ➔ Analyse des besoins, spécification fonctionnelle, configuration des environnements (Docker, Spring Boot, Expo), initialisation de la base MongoDB et de MinIO.
*   **Sprint 2 : Authentification et Saisie des données** ➔ Authentification JWT, inscription en 2 étapes, formulaire de saisie manuelle des constantes et base de données locale SQLite (offline-first).
*   **Sprint 3 : Importation EHR et Traitement OCR** ➔ Téléchargement sécurisé de PDF sur MinIO, intégration du pipeline OCR Python de traitement d'images/textes médicaux.
*   **Sprint 4 : Capteurs mobiles et Dashboards** ➔ Module rPPG de capture de fréquence cardiaque par caméra, intégration de l'accéléromètre pour le podomètre et création des graphiques de tendances (Victory Native).
*   **Sprint 5 : Analyse prédictive et Alertes** ➔ Logique d'analyse de risque par l'IA (classification des anomalies), configuration du service de messagerie push (Firebase Cloud Messaging).
*   **Sprint 6 : Espace de Travail Médecin** ➔ Liste de tri des patients par risque, dossier médical complet, interface de validation/correction d'IA, rédaction d'ordonnances et de notes cliniques.
*   **Sprint 7 : Vision par Ordinateur et Multilinguisme** ➔ Module de vision par ordinateur (posture, fatigue oculaire via MediaPipe), saisie vocale des symptômes, localisation linguistique complète (EN/FR/AR/Darija).
*   **Sprint 8 : Validation et Stabilisation** ➔ Tests unitaires et d'intégration, audits de sécurité et de conformité (protection des données médicales), optimisations et livraison.

---
---

# CHAPITRE IV - CONCEPTION FONCTIONNELLE

## 1. DÉCOUPAGE MODULAIRE DU SYSTÈME

Le système HealthTrack AI s'organise autour de trois modules fonctionnels (workspaces) principaux, chacun répondant aux besoins d'un acteur précis, tout en étant soutenu par un module technique transverse (le moteur d'IA).

```
┌────────────────────────────────────────────────────────────────────────┐
│                              HEALTHTRACK AI                            │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  ESPACE PATIENT  │      │  ESPACE MÉDECIN  │      │   ESPACE ADMIN   │
│ (Saisie, rPPG,   │      │ (Tri clinique,   │      │(Gestion comptes, │
│ EHR, Symptômes)  │      │  AI Validation)  │      │ IA Config, Logs) │
└────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   ▼
                      ┌─────────────────────────┐
                      │    MOTEUR D'ANALYSE IA  │
                      │ (FastAPI, OCR, Risk ML) │
                      └─────────────────────────┘
```

---

## 2. MODÉLISATION DES DIAGRAMMES DE CAS D'UTILISATION PAR MODULE

Pour affiner la conception, nous présentons la logique des cas d'utilisation pour chaque module fonctionnel.

### 2.1. Module Espace Patient (Patient Workspace)
Le Patient interagit avec l'application mobile pour suivre sa santé au quotidien.
*   **Acteurs impliqués :** Le Patient (Acteur Principal), le Moteur d'IA (Acteur Secondaire).
*   **Cas d'utilisation clés :**
    *   *Enregistrer des constantes de santé* ➔ L'utilisateur peut saisir des constantes vitales ou démarrer une mesure de fréquence cardiaque par rPPG. La mesure rPPG inclut l'activation de la caméra arrière.
    *   *Importer un fichier EHR* ➔ Le patient télécharge un document médical. Ce cas d'utilisation étend le cas *Analyser le document EHR* pris en charge par le Moteur d'IA (OCR).
    *   *Évaluer ses symptômes par l'IA* ➔ Le patient décrit ses symptômes par texte, voix ou photo. Le système évalue le risque et affiche un rapport préliminaire.
    *   *Consulter ses recommandations* ➔ Lecture des suggestions préventives personnalisées basées sur les constantes analysées.

### 2.2. Module Espace Médecin (Doctor Workspace)
Le Médecin utilise l'interface web ou mobile pour surveiller ses patients et valider les rapports cliniques.
*   **Acteurs impliqués :** Le Médecin (Acteur Principal), le Moteur d'IA (Acteur Secondaire).
*   **Cas d'utilisation clés :**
    *   *Consulter le tableau de bord clinique* ➔ Affichage de la file d'attente des alertes et de la liste des patients classés par criticité.
    *   *Examiner le dossier patient* ➔ Accès aux visualisations graphiques de constantes et aux documents EHR importés par le patient.
    *   *Renseigner une décision clinique (AI Review)* ➔ Suite à une analyse d'IA, le médecin doit :
        *   *Confirmer le rapport IA* (si le rapport est correct).
        *   *Corriger le rapport IA* (s'il détecte une erreur de diagnostic, ce qui lui permet de modifier le diagnostic et d'ajouter une note justificative).
        *   *Rejeter le rapport IA* (si l'alerte n'a aucune pertinence clinique).
    *   *Rédiger une ordonnance / note clinique* ➔ Permet de consigner des directives médicales officielles dans la base de données.

### 2.3. Module Espace Administration & IA (Admin & IA Modules)
L'administrateur et les processus techniques configurent et régulent le fonctionnement de la plateforme.
*   **Acteurs impliqués :** L'Administrateur (Acteur Principal), le Moteur d'IA (Acteur Interne).
*   **Cas d'utilisation clés :**
    *   *Gérer les utilisateurs* ➔ Valider les licences des médecins à l'inscription, suspendre ou supprimer des comptes en cas d'abus.
    *   *Consulter les tableaux de bord statistiques* ➔ Analyse de l'usage global de la plateforme.
    *   *Configurer les paramètres des modules d'IA* ➔ Ajuster les seuils de sensibilité (ex. définir à partir de quelle fréquence cardiaque une alerte de risque "Critical" doit être envoyée).

---

## 3. TABLEAUX DES HISTOIRES UTILISATEURS (USER STORIES) CLÉS

Nous formalisons ici les exigences sous forme d'histoires utilisateurs (User Stories) détaillées, servant de base pour l'implémentation et les critères de test (QA) menés par le Membre 3.

---

### US-01 : Inscription et authentification des acteurs
*   **Rôle :** En tant qu'utilisateur (Patient, Médecin, Administrateur)
*   **Description :** Je veux pouvoir créer un compte et m'authentifier de manière sécurisée afin de protéger la confidentialité de mes données de santé et d'accéder à mon espace de travail dédié.
*   **Critères d'acceptation :**
    1.  L'inscription s'effectue via un formulaire à deux étapes (données d'identité puis sélection et paramétrage du rôle).
    2.  Les rôles Patient et Médecin sont exclusifs et orientent vers des interfaces différentes.
    3.  Le mot de passe doit respecter des règles de complexité (8 caractères, 1 chiffre, 1 caractère spécial) et est stocké de manière chiffrée (BCrypt) en base MongoDB.
    4.  L'authentification génère un jeton JWT valide transmis de manière sécurisée dans les en-têtes HTTP de chaque requête.
*   **Priorité :** Must Have  
*   **Effort (Story Points) :** 5

---

### US-02 : Enregistrement manuel des constantes (Espace Patient)
*   **Rôle :** En tant que Patient
*   **Description :** Je veux pouvoir consigner manuellement mes constantes vitales (pression artérielle, pouls, glycémie, sommeil, poids) afin de tenir mon journal de santé à jour.
*   **Critères d'acceptation :**
    1.  L'interface de saisie présente des champs structurés avec indication des unités (bpm, mmHg, mg/dL, kg).
    2.  La saisie de la qualité du sommeil s'effectue via une échelle visuelle de 1 à 5 étoiles dorées.
    3.  Une validation de plage de données empêche la saisie de valeurs absurdes (ex. fréquence cardiaque supérieure à 300 bpm).
    4.  L'enregistrement réussi déclenche une vibration sur le téléphone (haptic feedback) et met à jour instantanément la base locale SQLite.
*   **Priorité :** Must Have  
*   **Effort (Story Points) :** 3

---

### US-04 : Extraction automatique de données cliniques (OCR EHR)
*   **Rôle :** En tant que Patient
*   **Description :** Je veux que le système extraie automatiquement les données de mes comptes-rendus d'analyses médicaux (PDF) importés afin de m'éviter une saisie manuelle fastidieuse.
*   **Critères d'acceptation :**
    1.  L'utilisateur peut importer un fichier PDF d'analyse de laboratoire ou un scan de compte-rendu médical.
    2.  Le microservice Python (FastAPI + Tesseract OCR) extrait le texte brut, puis identifie les couples "Paramètre / Valeur" (ex. "Hémoglobine glyquée : 6.1%").
    3.  Le document passe par trois états visibles à l'écran : PENDING (en cours d'extraction), DONE (extraction réussie et structurée), FAILED (échec de lecture avec notification).
    4.  Les données extraites et validées sont injectées dans la chronologie des mesures de santé du patient.
*   **Priorité :** Must Have  
*   **Effort (Story Points) :** 8

---

### US-05 : Prise de pouls par rPPG via la caméra du smartphone
*   **Rôle :** En tant que Patient
*   **Description :** Je veux pouvoir mesurer ma fréquence cardiaque en posant mon doigt sur la caméra de mon téléphone afin de suivre mon rythme cardiaque sans avoir besoin d'un bracelet connecté.
*   **Critères d'acceptation :**
    1.  L'application active la caméra arrière et allume le flash de manière automatique lors du démarrage du module de mesure.
    2.  L'interface affiche des instructions pour guider le patient (ex. "Posez fermement votre index sur la caméra").
    3.  L'algorithme analyse les variations de luminosité des pixels rouges (liées au flux sanguin) pendant une durée fixe de 15 secondes.
    4.  La fréquence cardiaque mesurée (bpm) s'affiche à l'écran avec un indicateur de confiance et est sauvegardée dans le dossier de santé du patient.
*   **Priorité :** Must Have  
*   **Effort (Story Points) :** 13

---

### US-08 : Détection d'anomalies physiologiques par l'IA
*   **Rôle :** En tant que Système (Moteur d'IA)
*   **Description :** Je veux analyser les constantes temporelles du patient afin de détecter les anomalies et d'évaluer le niveau de risque clinique pour alerter les soignants si nécessaire.
*   **Critères d'acceptation :**
    1.  L'analyse se déclenche automatiquement à chaque nouvel enregistrement de constante ou d'importation de données EHR.
    2.  L'algorithme compare les valeurs à des profils types (sexe, âge, antécédents) et à l'historique du patient pour détecter des déviations statistiques significatives.
    3.  Le système attribue un niveau de risque global au patient : LOW (vert), MODERATE (orange), HIGH (rouge), CRITICAL (rouge foncé).
    4.  Le rapport d'analyse génère des recommandations préventives personnalisées adaptées aux anomalies détectées (ex. recommandations de sommeil si fatigue et palpitations associées).
*   **Priorité :** Must Have  
*   **Effort (Story Points) :** 8

---

### US-10 : Alertes cliniques urgentes en temps réel
*   **Rôle :** En tant que Patient ou Médecin
*   **Description :** Je veux recevoir une alerte immédiate lorsqu'un paramètre de santé franchit un seuil critique afin qu'une action médicale rapide puisse être engagée.
*   **Critères d'acceptation :**
    1.  Lorsqu'une anomalie est classée comme "CRITICAL", le système génère instantanément un événement d'alerte.
    2.  Une notification push (Firebase Cloud Messaging) est envoyée sur le smartphone du patient concerné avec des consignes claires d'urgence.
    3.  Une notification push est envoyée simultanément sur le smartphone du médecin traitant associé.
    4.  L'alerte s'affiche en rouge clignotant dans l'application mobile et dans le tableau de bord du médecin, nécessitant une validation manuelle pour être classée.
*   **Priorité :** Must Have  
*   **Effort (Story Points) :** 5

---

### US-13 : Validation et correction clinique des rapports d'IA
*   **Rôle :** En tant que Médecin
*   **Description :** Je veux pouvoir confirmer, rejeter ou corriger les anomalies et diagnostics suggérés par l'IA afin de garantir la pertinence clinique du dossier du patient.
*   **Critères d'acceptation :**
    1.  Le médecin accède à un panneau d'évaluation "AI Review" présentant le rapport généré par l'algorithme.
    2.  Trois boutons d'action sont disponibles : "Confirm" (valider l'anomalie), "Correct" (modifier le rapport), "Reject" (déclarer l'alerte non pertinente).
    3.  L'action "Correct" ouvre un formulaire permettant de modifier le libellé du diagnostic et d'ajouter des notes cliniques obligatoires pour justifier le changement.
    4.  La soumission met à jour l'état de l'analyse en base de données ("CONFIRMED", "CORRECTED", "REJECTED") et actualise l'affichage pour le patient.
*   **Priorité :** Must Have  
*   **Effort (Story Points) :** 5

---

### US-14 : Rédaction de notes cliniques et de prescriptions médicales
*   **Rôle :** En tant que Médecin
*   **Description :** Je veux pouvoir rédiger des notes d'évolution et émettre des ordonnances numériques directement depuis la fiche de mon patient afin de centraliser son suivi.
*   **Critères d'acceptation :**
    1.  Dans la fiche du patient, l'onglet "Notes" liste l'historique des commentaires soignants et propose un bouton "+" pour en ajouter un nouveau.
    2.  L'onglet "Prescriptions" permet de créer une ordonnance via un formulaire structuré (nom du médicament, dosage, fréquence, durée en jours).
    3.  La prescription validée génère un identifiant unique de prescription et est marquée comme "ACTIVE". Elle passe automatiquement à "EXPIRED" une fois la durée de traitement dépassée.
    4.  Le patient reçoit une notification push l'informant de la mise à jour de ses prescriptions.
*   **Priorité :** Must Have  
*   **Effort (Story Points) :** 3

---

### US-17 : Saisie et diagnostic de symptômes (multimodal)
*   **Rôle :** En tant que Patient
*   **Description :** Je veux pouvoir décrire mes symptômes sous forme écrite, vocale ou photographique afin d'obtenir une première évaluation clinique de mon état de santé.
*   **Critères d'acceptation :**
    1.  L'utilisateur peut basculer entre les modes de saisie : clavier, microphone ou appareil photo.
    2.  Le mode vocal enregistre la voix de l'utilisateur ( Darija ou Arabe standard) et s'appuie sur un modèle de reconnaissance vocale (Speech-to-Text) pour transcrire le signal.
    3.  Le texte obtenu est analysé par un modèle NLP pour identifier les symptômes clés (fièvre, toux, maux de tête).
    4.  Le système affiche une fiche d'évaluation contenant le score de risque associé, les causes potentielles non définitives et trois conseils de comportement de premier recours.
*   **Priorité :** Should Have  
*   **Effort (Story Points) :** 8

---

### US-24 : Configuration d'administration des seuils cliniques
*   **Rôle :** En tant qu'Administrateur
*   **Description :** Je veux pouvoir configurer les valeurs seuils des constantes vitales pour chaque module d'IA afin d'adapter la sensibilité de détection aux exigences cliniques globales.
*   **Critères d'acceptation :**
    1.  L'interface d'administration liste les modules d'IA configurables (Anomaly Detection, Risk Scoring, Computer Vision).
    2.  Pour chaque module, un commutateur permet de l'activer ou de le désactiver pour l'ensemble de la plateforme.
    3.  L'administrateur peut régler le seuil de déclenchement d'alerte (ex. fréquence cardiaque supérieure à 100 bpm au repos) via un curseur linéaire interactif (slider) affichant la valeur en temps réel.
    4.  La sauvegarde applique instantanément les nouvelles règles aux calculs effectués par le moteur d'IA en tâche de fond.
*   **Priorité :** Could Have  
*   **Effort (Story Points) :** 5
