# Rapport de Projet Fin d'Études - Sections Membre 3
## Gestion, Documentation et Finitions

---

# PARTIES PRÉLIMINAIRES

## DÉDICACES

*(Chaque membre de l'équipe peut insérer sa dédicace personnelle ci-dessous. Voici une structure type pour les trois membres du groupe) :*

### Dédicace de [Nom du Membre 1]
*À mes chers parents,*
*Pour leur amour inconditionnel, leurs sacrifices inestimables et leur soutien indéfectible tout au long de mon parcours universitaire. Ce travail est le fruit de leur dévouement et de leurs prières.*
*À mes frères et sœurs, ainsi qu'à mes chers amis pour leur encouragement constant.*

### Dédicace de [Nom du Membre 2]
*À ma famille et mes proches,*
*Pour leur présence chaleureuse, leur patience et leur confiance tout au long de mes études. Ce travail témoigne de ma profonde gratitude.*
*À tous ceux qui m'ont soutenu de près ou de loin.*

### Dédicace de [Nom du Membre 3]
*À mes parents,*
*Qui m'ont guidé sur le chemin de l'apprentissage avec amour et patience, et qui m'ont appris à toujours persévérer. Ce travail est dédié à leur générosité.*
*À mes professeurs pour la transmission de leur savoir et leur bienveillance.*


---

## REMERCIEMENTS

Au terme de ce travail de fin d’études, nous tenons à exprimer notre profonde gratitude et nos sincères remerciements à toutes les personnes qui ont contribué à la réussite de ce projet de capstone.

Nous adressons nos remerciements les plus chaleureux à notre coordinateur de projet et à l'ensemble du corps professoral pour leur encadrement de qualité, leurs conseils précieux et leur disponibilité tout au long de cette expérience académique et technique.

Nous tenons également à exprimer notre reconnaissance aux membres du jury qui ont accepté d'évaluer ce travail et d'apporter leurs remarques constructives afin d'en améliorer la qualité.

Enfin, nous remercions chaleureusement nos collègues de projet pour leur engagement, leur esprit d’équipe et la synergie dont ils ont fait preuve tout au long des différents sprints. Ce travail est le résultat d'un effort collectif soutenu et d'une passion partagée pour l'innovation technologique au service de la santé.

---

## RÉSUMÉ

**Résumé**
Le projet **HealthTrack AI** est une plateforme mobile et web innovante de suivi médical et de bien-être, spécialement conçue pour répondre aux besoins du secteur de la santé au Maroc. Ce projet vise à combler le fossé communicationnel et opérationnel entre les patients, les professionnels de la santé et les administrateurs médicaux. En s'appuyant sur une architecture moderne, sécurisée et pilotée par l'intelligence artificielle, l'application permet aux patients d'enregistrer et de suivre en temps réel leurs constantes vitales (fréquence cardiaque, pression artérielle, glycémie, sommeil) tout en téléchargeant de manière sécurisée leurs dossiers médicaux (EHR) sur un serveur d'objets privé MinIO (S3). Un module d'IA en Python analyse ces données pour détecter les anomalies et évaluer les niveaux de risque clinique (faible, modéré, élevé), facilitant ainsi le tri et la prise de décision pour les médecins à travers un tableau de bord intuitif. L'interface mobile, développée sous React Native avec Expo, adopte une charte graphique premium inspirée du patrimoine marocain (« Refined Moroccan Luxury »). Le backend, propulsé par Spring Boot 3 et MongoDB, garantit une sécurité stricte grâce à une authentification JWT et une gestion des sessions sans état. 

**Mots-clés :** Suivi médical, Intelligence Artificielle, React Native, Spring Boot, MongoDB, MinIO, Risque clinique, Patrimoine marocain.

---

## ABSTRACT

**Abstract**
The **HealthTrack AI** project is an innovative mobile and web platform for health and wellness monitoring, specifically designed to meet the requirements of the healthcare sector in Morocco. The system aims to bridge the communication and operational gap between patients, healthcare providers, and medical administrators. Built on a modern, secure, and AI-driven architecture, the application enables patients to record and track their vital signs (heart rate, blood pressure, glucose, sleep) in real-time while securely uploading clinical documents (EHR) to a private MinIO (S3) object storage server. A Python-based AI microservice analyzes this data to detect anomalies and stratify clinical risk levels (low, moderate, high), thereby facilitating patient triaging and clinical decision-making for doctors via an intuitive workspace dashboard. The mobile interface, developed using React Native and Expo, features a premium visual design inspired by Moroccan heritage ("Refined Moroccan Luxury"). The backend, powered by Spring Boot 3 and MongoDB, ensures robust security through JWT authentication and stateless session management.

**Keywords:** Healthcare monitoring, Artificial Intelligence, React Native, Spring Boot, MongoDB, MinIO, Clinical risk stratification, Moroccan heritage.

---

## SOMMAIRE

*   **Dédicaces**
*   **Remerciements**
*   **Résumé**
*   **Abstract**
*   **Sommaire**
*   **Liste des acronymes**
*   **Liste des figures**
*   **Liste des tableaux**
*   **Introduction générale**
*   **Chapitre I. Contexte général du projet**
    *   1. Présentation du projet
        *   1.1. Contexte (cadrage du projet)
        *   1.2. Problématique
        *   1.3. Objectifs
    *   2. Conduite du projet
        *   2.1. Méthodologies utilisées (Gestion et développement)
        *   2.2. Grands choix techniques du projet
        *   2.3. Ressources humaines du projet
        *   2.4. Planification du projet (Sprints et diagramme de Gantt)
*   **Chapitre II. Étude préliminaire**
    *   1. Présentation de l’existant
    *   2. Analyse de l’existant (limites et critiques)
    *   3. Solution proposée
        *   3.1. Présentation de la solution
        *   3.2. Identification des acteurs
        *   3.3. Diagramme de contexte
*   **Chapitre III. Spécifications générales**
    *   1. Spécifications fonctionnelles
        *   1.1. Identification des fonctionnalités du système
        *   1.2. Identification des cas d’utilisation
        *   1.3. Identification des sprints
    *   2. Spécifications techniques
        *   2.1. Architecture technique
        *   2.2. Exigences techniques
        *   2.3. Benchmark technique
*   **Chapitre IV. Étude conceptuelle**
    *   1. Découpage modulaire
    *   2. Module I : Gestion de l'authentification et des profils (Sprint 1)
        *   2.1. Diagramme de cas d’utilisation
        *   2.2. Tableau descriptif des histoires utilisateur
        *   2.3. Diagramme de séquences
        *   2.4. Diagramme de classes
    *   3. Module II : Suivi des constantes et dossier patient (Sprint 2)
        *   3.1. Diagramme de cas d’utilisation
        *   3.2. Tableau descriptif des histoires utilisateur
        *   3.3. Diagramme de séquences
        *   3.4. Diagramme de classes
    *   4. Module III : Analyse prédictive par l'IA et alertes (Sprint 3)
*   **Chapitre V. Réalisation et mise en œuvre**
    *   1. Outils et technologies utilisés
    *   2. Structure globale du projet
        *   2.1. Structure du Frontend (React Native)
        *   2.2. Structure du Backend (Spring Boot & Python AI)
    *   3. Interfaces (Captures d'écran de la solution avec description textuelle)
        *   3.1. Workspace Authentification
        *   3.2. Workspace Patient
        *   3.3. Workspace Médecin
        *   3.4. Workspace Administrateur
*   **Conclusion générale et perspectives**
*   **Bibliographie**
*   **Annexes**

---

## LISTE DES ACRONYMES

| Acronyme | Définition |
| :--- | :--- |
| **API** | Application Programming Interface |
| **EHR** | Electronic Health Record (Dossier Médical Électronique) |
| **FHIR** | Fast Healthcare Interoperability Resources (Norme d'interopérabilité en santé) |
| **JWT** | JSON Web Token |
| **S3** | Simple Storage Service (Technologie de stockage objet) |
| **FCM** | Firebase Cloud Messaging |
| **REST** | Representational State Transfer |
| **NLP** | Natural Language Processing (Traitement Automatique du Langage Naturel) |
| **JSON** | JavaScript Object Notation |
| **UI** | User Interface (Interface Utilisateur) |
| **UX** | User Experience (Expérience Utilisateur) |
| **DBMS** | Database Management System (Système de Gestion de Base de Données) |
| **CRUD** | Create, Read, Update, Delete |
| **MVC** | Model-View-Controller |
| **SVG** | Scalable Vector Graphics |
| **EHR** | Electronic Health Record |

---

## LISTE DES FIGURES

1.  *Figure 1.1 : Structure organisationnelle de l'équipe de projet*
2.  *Figure 1.2 : Diagramme de Gantt prévisionnel du projet*
3.  *Figure 2.1 : Diagramme de contexte global du système*
4.  *Figure 3.1 : Schéma de l'architecture technique microservices*
5.  *Figure 4.1 : Diagramme de cas d'utilisation général*
6.  *Figure 4.2 : Diagramme de séquences de l'authentification*
7.  *Figure 4.3 : Diagramme de classes du domaine médical*
8.  *Figure 5.1 : Arborescence du projet mobile React Native*
9.  *Figure 5.2 : Interface de démarrage (Splash Screen)*
10. *Figure 5.3 : Interface de Connexion (Login)*
11. *Figure 5.4 : Interface d'Inscription en 2 étapes (Register)*
12. *Figure 5.5 : Tableau de bord du Patient (Dashboard)*
13. *Figure 5.6 : Formulaire de Saisie Manuelle des Constantes*
14. *Figure 5.7 : Espace d'Importation EHR et Documents Cliniques*
15. *Figure 5.8 : Historique Médical Interactif du Patient*
16. *Figure 5.9 : Saisie multimodale des symptômes par IA (Text, Voix, Image)*
17. *Figure 5.10 : Localisateur des Services de Santé de Proximité*
18. *Figure 5.11 : Page d'accueil du Médecin (Liste des patients)*
19. *Figure 5.12 : Dossier Clinique Patient (Vue Médecin)*
20. *Figure 5.13 : Interface de validation et de correction de l'IA (AI Review)*
21. *Figure 5.14 : Tableau de bord Administrateur (Statistiques globales)*
22. *Figure 5.15 : Interface de Configuration des Modules d'IA*

*(Note : Les figures listées ci-dessus correspondent aux schémas conceptuels et captures d'écran intégrés dans le rapport final).*

---

## LISTE DES TABLEAUX

1.  *Tableau 1.1 : Tableau de répartition des ressources humaines et rôles*
2.  *Tableau 1.2 : Planification détaillée des Sprints de développement*
3.  *Tableau 3.1 : Tableau comparatif (Benchmark) des solutions de stockage objet*
4.  *Tableau 4.1 : Description textuelle de l'histoire utilisateur « Renseigner une constante »*
5.  *Tableau 4.2 : Description textuelle de l'histoire utilisateur « Corriger un diagnostic IA »*
6.  *Tableau 5.1 : Matrice de correspondance des couleurs de la charte graphique*

---
---

# CHAPITRE I - CONDUITE DU PROJET (SECTION 2)

## 2. CONDUITE DU PROJET

### 2.1. Méthodologies utilisées (Gestion et développement)

Pour mener à bien ce projet d’envergure associant développement mobile multiplateforme, logique backend d'entreprise et intelligence artificielle, nous avons adopté des méthodologies rigoureuses axées sur la flexibilité, la transparence et la qualité logicielle.

#### 2.1.1. Gestion de projet : Le Cadre Agile SCRUM
Le développement du projet s'est structuré autour de la méthodologie **Scrum**, particulièrement adaptée aux projets de développement logiciel itératifs et incrémentaux.
*   **Les Sprints :** Le projet a été divisé en **sprints de 2 semaines**. Chaque sprint avait pour objectif de livrer un incrément de produit potentiellement opérationnel et testé.
*   **Les Cérémonies Scrum :**
    *   **Sprint Planning :** Au début de chaque sprint, l'équipe s'est réunie pour définir l'objectif du sprint (*Sprint Goal*) et sélectionner les histoires utilisateur (*User Stories*) prioritaires du *Backlog Produit* à intégrer dans le *Sprint Backlog*.
    *   **Daily Stand-up :** Une réunion quotidienne de 15 minutes a été instaurée afin de synchroniser les activités des membres de l'équipe, de faire le point sur les tâches de la veille, les objectifs du jour et d'identifier d'éventuels obstacles.
    *   **Sprint Review :** À la fin de chaque sprint, une démonstration des fonctionnalités terminées a été réalisée pour valider la conformité aux exigences fonctionnelles.
    *   **Sprint Retrospective :** Cette cérémonie a permis à l'équipe d'analyser son fonctionnement interne et de définir des axes d'amélioration continue pour les sprints suivants.

#### 2.1.2. Gestion du code source : Git et la stratégie GitFlow
Pour assurer la cohérence du code produit par les différents collaborateurs sans blocage, nous avons utilisé l'outil de gestion de version **Git** hébergé sur **GitHub** en appliquant la stratégie **GitFlow** :
*   **Branche `main` :** Contient le code stable et testé, correspondant aux versions prêtes pour la production.
*   **Branche `develop` :** Branche d'intégration principale où convergent tous les développements de fonctionnalités validés.
*   **Branches `feature/` :** Branches temporaires créées par les développeurs pour concevoir une fonctionnalité spécifique (ex. `feature/patient-doctor-communication`). Une fois la fonctionnalité développée et testée localement, une *Pull Request* (PR) est soumise sur la branche `develop`. Une revue de code est obligatoire avant toute fusion.

---

### 2.2. Grands choix techniques du projet

Les choix technologiques de HealthTrack AI ont été guidés par des impératifs de performance, de sécurité, de portabilité et de séparation claire des responsabilités architecturales.

*   **Frontend (React Native & Expo) :** L'application mobile cible le grand public ainsi que les professionnels de santé. React Native a été choisi pour concevoir une application native performante et multiplateforme (iOS et Android) à partir d'une base de code unique en TypeScript. L'utilisation d'Expo (SDK 51) a grandement accéléré la configuration de l'environnement, l'intégration des capteurs et les tests en conditions réelles.
*   **Backend principal (Spring Boot 3 & Java 21) :** Spring Boot a été sélectionné pour sa robustesse industrielle, sa gestion native de la sécurité (Spring Security) et sa facilité à modéliser des API RESTful standardisées. Java 21 apporte des optimisations majeures en termes de performances grâce aux threads virtuels.
*   **Base de données principale (MongoDB) :** Les données de santé (constantes physiologiques, historiques de diagnostics, profils cliniques) sont très hétérogènes et sujettes à des évolutions. Le modèle orienté document de MongoDB offre la flexibilité nécessaire pour gérer ces schémas dynamiques sans la rigidité d'une base relationnelle SQL.
*   **Stockage objet (MinIO) :** Les documents cliniques importés par les patients (PDF de laboratoires, clichés radiologiques) doivent être stockés de manière sécurisée et performante. MinIO, serveur de stockage objet compatible S3 auto-hébergé, permet de conserver ces fichiers volumineux localement ou sur une infrastructure privée tout en maintenant un contrôle total sur l'accès aux données.
*   **Microservice IA (Python, FastAPI) :** Afin de ne pas surcharger la JVM avec des dépendances lourdes liées au machine learning et au traitement de données (NLP, OCR, Vision), un microservice Python autonome a été mis en œuvre. Il expose des points de terminaison via FastAPI pour analyser les symptômes, extraire les métadonnées des PDF et calculer les scores de risque clinique.
*   **Cache et Sessions (Redis) :** Utilisé comme mémoire cache pour optimiser les requêtes fréquentes sur le profil des patients et pour stocker les sessions utilisateur temporaires, garantissant une réactivité maximale de l'interface mobile.

---

### 2.3. Ressources humaines du projet

L'équipe projet est composée de trois membres, chacun possédant un rôle clé dans la conception, l'implémentation et la validation du système.

| Ressource | Rôle Principal | Responsabilités Spécifiques |
| :--- | :--- | :--- |
| **Membre 1** | **Ingénieur Frontend & UI/UX** | - Conception graphique et ergonomique de l'application mobile sous React Native.<br>- Implémentation du système de design premium émeraude et or.<br>- Intégration des graphiques de tendances de santé et de la navigation locale. |
| **Membre 2** | **Ingénieur Backend & Intégrateur IA** | - Conception et développement de l'API REST sous Spring Boot 3.<br>- Modélisation de la base de données MongoDB.<br>- Développement du microservice d'analyse IA sous Python et sa connexion avec le backend principal. |
| **Membre 3** | **Chef de Projet, QA & Documentaliste** | - Suivi de la planification, gestion des réunions Scrum et coordination inter-membres.<br>- Rédaction de la documentation globale et du rapport de projet.<br>- Conception du plan de test, contrôle qualité (QA) et finitions esthétiques du produit. |

---

### 2.4. Planification du projet (Sprints et diagramme de Gantt)

Le projet s'est déroulé sur une durée globale de 8 semaines, structuré selon le cadre méthodologique Scrum en **8 sprints d'une semaine**. Ce découpage permet de délivrer un produit opérationnel de manière incrémentale en ajoutant progressivement des couches d'intelligence et de finition.

#### 2.4.1. Calendrier Détaillé des Sprints

##### **Sprint 1 (Semaine 1) : Initialisation et Architecture Technique**
*   **Thème :** Project Setup & Architecture
*   **Tâches Clés :** 
    *   Cadrage des besoins et rédaction des spécifications fonctionnelles.
    *   Configuration des environnements de développement locaux et des dépôts (Git, Docker, structures de base Spring Boot et React Native/Expo).
    *   Modélisation UML (diagrammes de classes et de cas d'utilisation généraux).
    *   Conception du schéma de la base de données MongoDB et configuration du serveur de stockage objet MinIO.
*   **Définition de Terminé (DoD - Definition of Done) :** Environnement de développement opérationnel, contrats d'API REST documentés, et maquettes d'interfaces (wireframes) validées.

##### **Sprint 2 (Semaine 2) : Authentification et Saisie Manuelle des Données**
*   **Thème :** Authentication & Manual Data Entry
*   **Tâches Clés :**
    *   Développement du système d'inscription des utilisateurs et de connexion sécurisée (JWT).
    *   Configuration du profil utilisateur (données anthropométriques et rôles Patient/Médecin).
    *   Développement des points de terminaison (endpoints) API pour l'enregistrement manuel des constantes vitales (pouls, pression artérielle, sommeil, glycémie).
    *   Implémentation du stockage local SQLite sur l'application mobile pour le mode hors-ligne.
*   **Définition de Terminé (DoD) :** Flux d'authentification opérationnel, saisie manuelle fonctionnelle sur le mobile, et base SQLite locale active et synchronisable.

##### **Sprint 3 (Semaine 3) : Gestion du Dossier Patient (EHR) et Extraction IA**
*   **Thème :** EHR Import & AI Extraction
*   **Tâches Clés :**
    *   Mise en œuvre du téléversement de documents médicaux (comptes-rendus d'analyses au format PDF ou normes FHIR) vers le serveur MinIO.
    *   Développement du pipeline d'extraction automatique des données cliniques par reconnaissance optique de caractères (OCR) et NLP sous Python.
    *   Développement de la logique serveur de création de clichés d'état clinique (patient state snapshot) et structuration des résultats en base de données.
*   **Définition de Terminé (DoD) :** Téléchargement de documents EHR fonctionnel, pipeline d'extraction IA opérationnel, et alimentation automatique de la chronologie patient.

##### **Sprint 4 (Semaine 4) : Intégration des Capteurs Mobiles et Tableaux de Bord**
*   **Thème :** Phone Sensors & Dashboard
*   **Tâches Clés :**
    *   Développement du module de mesure du pouls (fréquence cardiaque) par rPPG via la caméra arrière et le flash du smartphone.
    *   Intégration de l'accéléromètre pour le comptage passif des pas et le suivi de l'activité.
    *   Conception de l'interface utilisateur du tableau de bord (Dashboard) patient et intégration des graphiques de tendances historiques (Victory Native).
    *   Mise en place de l'outil de suivi de la qualité du sommeil.
*   **Définition de Terminé (DoD) :** Capture de fréquence cardiaque fonctionnelle sur trois appareils de test, podomètre réactif, et affichage dynamique des graphiques de tendance sur le dashboard.

##### **Sprint 5 (Semaine 5) : Analyse Clinique IA et Système d'Alerte**
*   **Thème :** AI Analysis & Alert System
*   **Tâches Clés :**
    *   Développement de l'algorithme de détection d'anomalies physiologiques (avec scikit-learn).
    *   Mise en place de la logique d'évaluation du score de risque clinique global (LOW / MODERATE / HIGH / CRITICAL).
    *   Conception du moteur de recommandations préventives adaptées aux profils.
    *   Déploiement du système d'alertes instantanées en temps réel via Firebase Cloud Messaging (FCM) vers les patients et les médecins.
*   **Définition de Terminé (DoD) :** Analyse de risque automatique opérationnelle, alertes push distribuées instantanément lors du franchissement de seuils critiques, et recommandations visibles sur l'interface.

##### **Sprint 6 (Semaine 6) : Espace de Travail Clinique du Médecin**
*   **Thème :** Doctor Workspace
*   **Tâches Clés :**
    *   Création de l'interface de tri clinique pour le médecin (liste ordonnée des patients par niveau de risque).
    *   Développement de la fiche patient clinique consolidée (historique des mesures, visualisations, accès aux documents originaux).
    *   Développement de l'interface de validation médicale des rapports d'IA (AI Review : valider, corriger, rejeter).
    *   Implémentation du module d'édition de notes d'évolution clinique et de prescriptions d'ordonnances numériques.
*   **Définition de Terminé (DoD) :** Le médecin peut consulter la liste triée, réviser et amender les rapports de diagnostic de l'IA, et enregistrer des notes et prescriptions directement rattachées au patient.

##### **Sprint 7 (Semaine 7) : Vision par Ordinateur, Symptômes et Multilinguisme**
*   **Thème :** Computer Vision, Symptoms & Multilingual
*   **Tâches Clés :**
    *   Développement du module de vision par ordinateur (sur le mobile via MediaPipe) pour analyser la posture, la fatigue oculaire et les anomalies de peau superficielles.
    *   Mise en œuvre du module d'évaluation multimodal des symptômes (saisie vocale en Darija/Arabe transcrite par Speech-to-Text).
    *   Traduction et localisation de toute l'application (Français, Anglais, Arabe standard, Darija).
    *   Ajustements et polissage esthétique final de l'interface utilisateur.
*   **Définition de Terminé (DoD) :** Module de vision opérationnel avec mentions d'avertissement légales, transcription vocale fonctionnelle, 4 langues actives, et compatibilité de l'application mobile testée sur Android 8+.

##### **Sprint 8 (Semaine 8) : Campagne de Tests, Sécurité et Livraison**
*   **Thème :** Testing, Stabilization & Delivery
*   **Tâches Clés :**
    *   Campagne de tests de bout en bout (End-to-End), tests de performance et correction de bugs.
    *   Audit de sécurité sur les points d'accès API REST et la protection des fichiers stockés sur MinIO.
    *   Vérification de la conformité aux normes locales de protection des données de santé (conformité CNDP au Maroc).
    *   Rédaction finale de la documentation technique et des rapports de déploiement.
*   **Définition de Terminé (DoD) :** Tous les tests critiques sont validés (taux de passage 100%), binaire de production (.apk/.ipa) généré, et l'ensemble des livrables de projet soumis.

#### 2.4.2. Diagramme de Gantt Prévisionnel

Le diagramme de Gantt ci-dessous représente la planification temporelle et le chevauchement des chantiers techniques sur les 8 semaines de réalisation du projet.

```
Activités / Semaines               | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 |
---------------------------------------------------------------------------
Cadrage & Spécifications (M2)      |====|    |    |    |    |    |    |    |
Setup Dev & Schémas DB (M1/M2)     |====|====|    |    |    |    |    |    |
Auth JWT & Saisie mobile (M1/M2)   |    |====|====|    |    |    |    |    |
EHR Upload & S3 MinIO (M2)         |    |    |====|====|    |    |    |    |
Moteur OCR & Parser IA (M2)        |    |    |====|====|====|    |    |    |
rPPG Caméra & Capteurs (M1)        |    |    |    |====|====|    |    |    |
Dashboard & Graphes (M1)           |    |    |    |====|====|====|    |    |
Score Risque & Alertes FCM (M2)    |    |    |    |    |====|====|    |    |
Espace Médecin & Validation (M1/M2)|    |    |    |    |    |====|====|    |
MediaPipe Vision & STT Vocal (M2)  |    |    |    |    |    |    |====|====|
Localisation FR/AR/Darija (M1)     |    |    |    |    |    |    |====|====|
Tests, Sécurité & CNDP (M3)        |    |    |    |    |    |    |====|====|
Finalisation & Rapport (M3)        |    |    |    |    |    |    |    |====|
```


---
---

# CHAPITRE V - DESCRIPTION DES INTERFACES (SECTION 3)

## 3. DESCRIPTION DES INTERFACES DE L'APPLICATION MOBILE

La conception visuelle de HealthTrack AI repose sur une approche haut de gamme nommée **« Refined Moroccan Luxury »**. L'objectif graphique est de concevoir une application moderne et épurée, s'inspirant de l'identité visuelle de notre logo : une main de Khamsa contenant des motifs d'arabesques, une étoile marocaine et une ligne de rythme cardiaque. 
L'application adopte principalement un **mode sombre** extrêmement premium. La couleur de fond dominante est un vert forêt profond (`#0D2318`), contrastée par des cartes au ton émeraude sombre (`#122B1E`) délimitées par de fines bordures vert clair translucides (`#1A9B6C22`). Les boutons d'action principaux et les éléments mis en avant utilisent une couleur de pouvoir dorée chaleureuse (`#C9A84C`). L'élégance typographique est assurée par l'utilisation de la police avec empattement **Playfair Display** pour les titres et la police sans empattement **Inter** pour le corps du texte.

---

### 3.1. Espace d'Authentification (Auth Workspace)

L'espace d'authentification prépare l'expérience utilisateur à travers une identité visuelle immersive et rassurante.

#### 3.1.1. Écran de Démarrage (SplashScreen)
*   **Description visuelle :** Cet écran de transition s'affiche sur un fond vert forêt profond (`#0D2318`). Au centre géométrique de l'écran, le logo officiel de HealthTrack AI est affiché sous forme d'une Khamsa stylisée. Directement en dessous, le nom de l'application « HealthTrack AI » s'inscrit en lettres dorées avec la typographie Playfair Display (taille 32px), suivi du slogan « Your health. Your data. Your control. » rédigé en police Inter d'un ton vert atténué (`#4A7A66`). Une texture d'arabesque vectorielle très subtile est appliquée en arrière-plan à 6% d'opacité.
*   **Fonctionnalité :** Cet écran s'affiche pendant une durée fixe de 2 secondes avant de rediriger automatiquement l'utilisateur vers l'écran de connexion par un fondu doux de 150ms.

#### 3.1.2. Écran de Connexion (LoginScreen)
*   **Description visuelle :** Cet écran est structuré en deux parties. La partie supérieure présente une version compacte du logo et du nom de l'application. La partie centrale est occupée par un bloc carte (`#122B1E`) aux angles arrondis (20px), surmonté d'une bordure dorée très fine. Le titre « Welcome back » est écrit en Playfair Display blanc, accompagné du sous-titre « Sign in to continue » en Inter vert pastel.
*   **Fonctionnalité :** L'utilisateur saisit son adresse e-mail et son mot de passe. Les champs de saisie possèdent un style personnalisé : lorsque l'utilisateur sélectionne un champ, une lueur verte émeraude se diffuse autour de la bordure. Le mot de passe peut être affiché ou masqué en appuyant sur un bouton représenté par un œil doré. Un bouton doré (« Sign In ») permet de soumettre le formulaire avec un effet haptique. En bas d'écran, un sélecteur de langue discret permet de basculer l'interface entre le français, l'arabe et l'anglais.

#### 3.1.3. Écran d'Inscription (RegisterScreen)
*   **Description visuelle :** Cet écran conserve la même charte graphique émeraude et dorée que la connexion, mais intègre un formulaire divisé en deux étapes distinctes pour ne pas surcharger visuellement l'utilisateur. Deux indicateurs circulaires en haut du bloc (l'un doré actif, l'autre vert inactif) marquent la progression.
*   **Fonctionnalité :** 
    *   *Étape 1 :* Saisie des données d'identité fondamentales (Nom, Prénom, Email, Mot de passe). L'activation du bouton doré « Next » déclenche une transition vers la seconde étape.
    *   *Étape 2 :* Sélection du rôle à l'aide de deux grands boutons tactiles représentant des cartes d'activité. La première carte affiche un pictogramme de patient et la seconde un stéthoscope pour les professionnels de santé. La sélection d'un rôle applique une bordure dorée lumineuse à la carte correspondante. L'utilisateur indique ensuite sa date de naissance et valide son inscription en cliquant sur le bouton « Create Account ». Un bouton de retour sous forme de flèche dorée permet de revenir à l'étape précédente.

#### 3.1.4. Écran de Récupération (ForgotPasswordScreen)
*   **Description visuelle :** Une mise en page centrée et minimaliste affichant une flèche de retour dorée dans l'angle supérieur gauche, le titre « Reset Password » et une consigne textuelle invitant à renseigner l'adresse e-mail.
*   **Fonctionnalité :** L'utilisateur fournit son adresse e-mail pour recevoir un lien de réinitialisation. Lors de la soumission réussie, une animation dynamique de coche de validation verte s'affiche au centre d'une carte émeraude pour confirmer l'envoi du message.

---

### 3.2. Espace Patient (Patient Workspace)

Cet espace est structuré autour d'un menu de navigation inférieur personnalisé composé de cinq onglets tactiles : *Tableau de bord*, *Dossier*, *Symptômes*, *Localisateur* et *Profil*. L'onglet actif se distingue par un pictogramme et un libellé dorés, soulignés par un petit point lumineux doré.

#### 3.2.1. Tableau de Bord (DashboardScreen)
*   **Description visuelle :** L'en-tête salue chaleureusement le patient par son prénom (« Good morning, Youssef ») en Playfair Display blanc, avec la date du jour affichée en caractères plus petits et de couleur vert atténué. Une icône de cloche de notification dorée est visible en haut à droite.
    *   *Ligne des indicateurs rapides (Quick Stats Row) :* Un ruban défilant horizontalement affiche quatre indicateurs de santé : fréquence cardiaque, nombre de pas quotidiens, heures de sommeil et indice de risque calculé par l'IA. Ces blocs possèdent un arrière-plan `#122B1E` avec la valeur affichée en grand format doré. Le bloc de risque utilise une couleur sémantique (vert pour un risque faible, orange pour modéré, rouge pour élevé).
    *   *Section des recommandations de l'IA :* Un carrousel de cartes affiche des conseils personnalisés illustrés par des pictogrammes ciblés (sommeil, nutrition, activité physique).
    *   *Section des dernières mesures :* Un tableau synthétise les trois derniers enregistrements, précisant la source de la mesure (saisie manuelle, capteur ou dossier médical importé) via des badges colorés discrets.

#### 3.2.2. Formulaire de Saisie (ManualEntryScreen)
*   **Description visuelle :** Un formulaire de saisie structuré en sections verticales séparées par des en-têtes dorés écrits en majuscules (police Inter, 11px).
*   **Fonctionnalité :** Le patient peut renseigner manuellement ses constantes physiques :
    *   *Constantes Vitales :* Pouls (bpm), Tension artérielle systolique et diastolique (mmHg), Glycémie (mg/dL).
    *   *Activité Physique :* Nombre de pas, minutes d'activité, calories dépensées.
    *   *Sommeil :* Heure de coucher, heure de réveil et un indicateur de qualité sous forme d'étoiles dorées (évaluation de 1 à 5).
    Les entrées numériques intègrent leurs unités de mesure alignées à droite du champ. Le bouton doré « Save Record » situé en bas d'écran enregistre les données et fournit un retour tactile vibrant pour confirmer la réussite.

#### 3.2.3. Gestion du Dossier Médical Électronique (EHRImportScreen)
*   **Description visuelle :** Cette interface propose trois grandes cartes d'action de couleur émeraude avec des icônes explicites : « Import PDF » (icône document), « Import FHIR / HL7 » (icône code de flux) et « Scan Document » (icône appareil photo). La partie inférieure présente la liste des dossiers de santé importés.
*   **Fonctionnalité :** Le patient peut importer des documents médicaux externes. Chaque fichier de la liste affiche son nom, sa date de chargement et un badge d'état coloré géré par le traitement asynchrone de l'IA (orange pour « PENDING », vert pour « DONE », rouge pour « FAILED »). L'utilisateur peut appuyer sur un document pour ouvrir la visionneuse PDF intégrée, partager le document ou le supprimer.

#### 3.2.4. Historique Médical (HealthHistoryScreen)
*   **Description visuelle :** Une liste chronologique épurée des enregistrements du patient. En haut, une barre de filtres horizontaux (« All », « Vitals », « Activity », « Sleep », « EHR ») se présente sous forme de puces dorées ou vertes.
*   **Fonctionnalité :** Les mesures sont regroupées par date. Une pression sur une ligne d'enregistrement déploie un bloc de détails révélant l'historique complet et les notes associées.

#### 3.2.5. Diagnostic de Symptômes par l'IA (SymptomInputScreen)
*   **Description visuelle :** Un sélecteur d'onglets permet de choisir le mode de saisie : texte, voix ou image. 
*   **Fonctionnalité :**
    *   Le mode *texte* offre une zone de saisie libre (« Décrivez ce que vous ressentez... »).
    *   Le mode *voix* affiche un bouton de microphone doré qui pulse au rythme de l'enregistrement avec une animation de forme d'onde sonore.
    *   Le mode *image* permet de charger une photo de symptôme ou d'ordonnance.
    L'activation du bouton doré « Get AI Evaluation » déclenche l'affichage d'un encadré de diagnostic de l'IA (`AIResultCard`) composé d'un badge de risque coloré, d'un résumé clinique textuel, de trois recommandations classées par ordre de priorité et d'un raccourci direct pour partager ce rapport d'analyse avec son médecin traitant.

#### 3.2.6. Localisateur de Services de Santé (HealthServiceLocatorScreen)
*   **Description visuelle :** Une carte géographique interactive (occupant la moitié supérieure de l'écran) surmontée d'un volet d'information coulissant depuis le bas (bottom sheet).
*   **Fonctionnalité :** Le volet présente une barre de recherche et la liste des établissements de santé à proximité (cliniques, hôpitaux, pharmacies). Chaque ligne affiche le nom de l'établissement, sa catégorie, sa distance en kilomètres et un indicateur d'ouverture. En sélectionnant un établissement, le volet se déploie pour afficher l'adresse complète, les horaires d'ouverture, le numéro de téléphone et un bouton doré pour lancer le guidage routier.

---

### 3.3. Espace Médecin (Doctor Workspace)

L'espace destiné aux médecins privilégie la clarté opérationnelle et la mise en évidence des alertes prioritaires.

#### 3.3.1. Page d'Accueil et Gestion des Alertes (DoctorHomeScreen)
*   **Description visuelle :** L'en-tête affiche le nom du professionnel (« Dr. El Alaoui ») et sa spécialité clinique.
    *   *File d'attente des alertes (Alert Queue) :* Un carrousel défilant de cartes horizontales met en évidence les dossiers jugés urgents par l'IA. Les fiches de patients classées en niveau « CRITICAL » arborent une bordure de couleur rouge vif à effet de halo lumineux pour capter immédiatement l'attention du médecin.
    *   *Liste des patients suivis :* Une liste verticale des patients assignés, avec une barre de recherche. Chaque ligne présente la photo de profil (ou les initiales du patient sur fond doré), le nom, l'âge, la date de la dernière consultation et un indicateur coloré symbolisant son niveau de risque. Un clic redirige vers la fiche médicale complète.

#### 3.3.2. Dossier Clinique Patient (PatientFileScreen)
*   **Description visuelle :** Cet écran présente l'identité du patient, son âge, son groupe sanguin, ainsi qu'une flèche de retour et un raccourci doré pour exporter le dossier au format PDF. Le contenu est organisé en cinq onglets internes : *Vue d'ensemble*, *Mesures*, *Analyses IA*, *Notes* et *Ordonnances*.
*   **Fonctionnalité :**
    *   *Vue d'ensemble :* Regroupe les données administratives clés du patient, sa courbe de risque globale et un indicateur d'évolution de l'état clinique (amélioration, stabilité ou dégradation).
    *   *Mesures :* Affiche l'historique complet des constantes vitales sous forme de graphiques de tendances de santé interactifs (Victory Native).
    *   *Analyses IA :* Historique des rapports générés par l'IA avec leur statut de validation par le médecin : « PENDING REVIEW » (doré), « CONFIRMED » (vert), « CORRECTED » (bleu) ou « REJECTED » (rouge).
    *   *Notes :* Zone d'affichage des commentaires cliniques de l'équipe soignante. Un bouton flottant circulaire doré (« + ») ouvre un éditeur en plein écran pour rédiger et enregistrer une nouvelle note clinique.
    *   *Ordonnances :* Historique des prescriptions médicales délivrées avec un indicateur de validité (« ACTIVE » en vert ou « EXPIRED » en gris). Un bouton flottant permet de générer une nouvelle ordonnance à l'aide d'un formulaire structuré (médicament, posologie, fréquence, durée).

#### 3.3.3. Validation des Analyses de l'IA (AIReviewScreen)
*   **Description visuelle :** Cette interface affiche le rapport complet élaboré par les algorithmes de l'IA : indicateur de risque, taux de fiabilité représenté par un anneau de progression doré, résumé de situation, liste des anomalies détectées et recommandations générées.
*   **Fonctionnalité :** En bas d'écran, trois boutons d'action permettent au médecin de prendre une décision : « Confirm » (bouton vert plein), « Correct » (bouton orange à contour) ou « Reject » (bouton rouge à contour). Si le médecin choisit « Correct », deux champs de saisie apparaissent pour renseigner le diagnostic rectifié et ajouter des commentaires cliniques justificatifs avant de valider via le bouton doré « Submit Review ».

---

### 3.4. Espace Administrateur (Admin Workspace)

Cet espace fournit aux administrateurs de la plateforme les indicateurs de supervision technique et fonctionnelle.

#### 3.4.1. Tableau de Bord d'Administration (AdminDashboardScreen)
*   **Description visuelle :** Le titre « Admin Panel » est affiché en haut de page.
    *   *Grille d'indicateurs (2x2) :* Affiche quatre statistiques globales (Utilisateurs enregistrés, Patients actifs, Médecins agréés, Analyses de l'IA du jour). Chaque statistique présente sa valeur en grand format doré, son intitulé vert pastel et un symbole thématique associé.
    *   *Section des courbes analytiques :* Présente un graphique linéaire doré (Victory Native) illustrant la croissance du nombre d'utilisateurs sur les sept derniers jours, ainsi qu'un graphique à barres horizontales vert et or détaillant la répartition des analyses d'IA par catégorie.
    *   *Flux d'activité récent :* Une liste verticale consigne les derniers événements techniques ou fonctionnels de la plateforme (création de compte, alerte générée, validation médicale).

#### 3.4.2. Gestion des Comptes Utilisateurs (UserManagementScreen)
*   **Description visuelle :** Une zone de recherche textuelle associée à quatre filtres d'affichage sous forme de boutons (« All », « Patients », « Doctors », « Admins »).
*   **Fonctionnalité :** Affiche la liste des profils enregistrés avec leur nom, leur rôle et leur statut (« ACTIVE » ou « SUSPENDED »). Un appui long ou un balayage latéral (swipe) sur une ligne fait apparaître trois boutons d'action rapide : suspendre, supprimer ou afficher les détails. Un bouton flottant doré « + » ouvre un formulaire d'invitation pour intégrer un nouveau médecin par e-mail.

#### 3.4.3. Configuration des Modules d'IA (AIModuleConfigScreen)
*   **Description visuelle :** Liste ordonnée des différents services intelligents actifs (détection des anomalies, évaluation des risques, vision par ordinateur, traitement automatique des langues pour les symptômes, extraction EHR).
*   **Fonctionnalité :** Chaque module dispose d'un interrupteur d'activation (switch personnalisé devenant vert clair une fois activé), d'un curseur (slider) doré pour ajuster le seuil de confiance requis pour les analyses de l'IA, et d'un bouton « Configure » qui ouvre un volet de paramétrage avancé. Ce volet permet de définir finement les valeurs seuils pour chaque indicateur de santé avant d'enregistrer la configuration via le bouton doré dédié.

---
---

# CONCLUSION GÉNÉRALE ET PERSPECTIVES

## CONCLUSION GÉNÉRALE

Le projet **HealthTrack AI** représente une avancée significative dans la digitalisation et la modernisation du suivi médical et du bien-être pour le marché marocain. En intégrant de manière cohérente des technologies de pointe telles que React Native pour l'application mobile multiplateforme, Spring Boot 3 pour le serveur d'API robuste et sécurisé, et un microservice d'intelligence artificielle en Python, la plateforme répond avec efficacité aux défis de la communication médicale et du tri clinique.

La force de cette solution réside dans sa capacité à collecter, stocker et analyser des constantes de santé complexes tout en maintenant un très haut niveau de sécurité et de confidentialité grâce à une architecture découplée, un chiffrement de bout en bout et un stockage objet autonome MinIO (S3). De plus, l'adoption de la charte graphique premium « Refined Moroccan Luxury » apporte une dimension esthétique et culturelle unique, favorisant l'adoption de l'application tant par les patients que par les praticiens de santé.

En tant que membre chargé de la gestion du projet, du contrôle qualité et de la documentation, ce travail m'a permis d'appréhender toute la complexité de la coordination d'un projet informatique pluridisciplinaire. L'application des méthodologies agiles (Scrum) et des standards de versioning (GitFlow) a été déterminante pour maintenir le cap des livrables et garantir la synergie globale de l'équipe de développement.

## PERSPECTIVES

Bien que HealthTrack AI présente des fondations robustes et un ensemble fonctionnel complet, plusieurs axes d'évolution scientifique et technique peuvent être envisagés pour étendre sa portée :

1.  **Intégration d'objets connectés physiques (IoT) :** Actuellement basé sur des saisies manuelles ou des imports EHR, le système gagnerait à s'intégrer directement avec des API de wearables du marché (Apple HealthKit, Google Fit, montres connectées Fitbit ou Garmin) pour collecter de manière passive et continue les constantes physiologiques des patients.
2.  **Interopérabilité et Standard HL7 FHIR avancé :** Pousser plus loin le support de la norme d'échange internationale HL7 FHIR afin de permettre une intégration bilatérale transparente avec les grands systèmes d'information hospitaliers (SIH) et les dossiers médicaux partagés nationaux au Maroc.
3.  **Module de Téléconsultation Intégré :** Enrichir la boîte de messagerie instantanée patient-médecin par une fonctionnalité de téléconsultation vidéo chiffrée de bout en bout, permettant au médecin de réaliser ses consultations directement au sein de la plateforme suite à une alerte d'IA critique.
4.  **Déploiement Cloud et Passage à l'Échelle (Scaling) :** Migrer l'infrastructure conteneurisée Docker locale vers un orchestrateur de conteneurs Kubernetes hébergé sur un cloud souverain au Maroc, afin de garantir la haute disponibilité du service, la redondance des données de santé et un traitement asynchrone performant face à un grand volume d'utilisateurs.
5.  **Amélioration continue des modèles d'IA :** Entraîner les modèles NLP de diagnostic sur des dialectes locaux supplémentaires (comme l'arabe marocain - Darija) en format textuel et vocal pour accroître l'accessibilité de la solution à toutes les franges de la population.

---
---

# BIBLIOGRAPHIE

1.  **Spring Boot & Architecture Logicielle**
    *   Walls, C. (2022). *Spring in Action, Sixth Edition*. Manning Publications.
    *   Documentation officielle de Spring Framework & Spring Boot 3.3.x. URL : [https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)
2.  **Développement Mobile & React Native**
    *   Expo SDK 51 Documentation. URL : [https://docs.expo.dev/](https://docs.expo.dev/)
    *   React Navigation v6 Documentation. URL : [https://reactnavigation.org/](https://reactnavigation.org/)
    *   Abramov, D., Wieruch, R. (2023). *State Management in React Native using Redux Toolkit*. O'Reilly Media.
3.  **Bases de données & Stockage Objet**
    *   Banker, K. (2021). *MongoDB in Action, Second Edition*. Manning Publications.
    *   MinIO Object Storage Documentation & S3 API Reference. URL : [https://min.io/docs/minio/linux/index.html](https://min.io/docs/minio/linux/index.html)
4.  **Intelligence Artificielle & Traitement NLP**
    *   FastAPI Framework Documentation. URL : [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
    *   Jurafsky, D., Martin, J. H. (2023). *Speech and Language Processing (3rd ed. draft)*. Prentice Hall.
5.  **Gestion de Projet Agile & Scrum**
    *   Schwaber, K., Beedle, M. (2002). *Agile Software Development with Scrum*. Prentice Hall.
    *   Chacon, S., Straub, B. (2014). *Pro Git, Second Edition*. Apress (GitFlow branching strategies).

---
---

# ANNEXES

## ANNEXE A : Fichier Docker Compose d'infrastructure locale (`docker-compose.yml`)

Ce fichier permet de déployer de manière conteneurisée l'ensemble de la pile de services nécessaires à l'exécution locale du projet HealthTrack AI.

```yaml
version: '3.8'

services:
  # Base de données MongoDB
  mongodb:
    image: mongo:6.0
    container_name: healthtrack-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=healthtrack
    restart: always

  # Base de données Redis pour le cache
  redis:
    image: redis:7.0-alpine
    container_name: healthtrack-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: always

  # Serveur de stockage objet MinIO (compatible S3)
  minio:
    image: minio/minio:RELEASE.2024-01-18T22-51-58Z
    container_name: healthtrack-minio
    ports:
      - "9000:9000"      # API S3
      - "9001:9001"      # Console Web d'administration
    environment:
      - MINIO_ROOT_USER=admin
      - MINIO_ROOT_PASSWORD=minioadminpassword
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    restart: always

volumes:
  mongodb_data:
  redis_data:
  minio_data:
```

## ANNEXE B : Exemple de charge utile JSON - Rapport de diagnostic de l'IA

Le flux ci-dessous représente le format des données JSON renvoyées par le microservice d'IA Python au backend Spring Boot après l'évaluation des symptômes physiques d'un patient.

```json
{
  "analysisId": "ai-report-893021",
  "patientId": "p-001",
  "evaluatedSymptoms": ["fatigue", "palpitations", "insomnie"],
  "riskAssessment": {
    "level": "MODERATE",
    "confidenceScore": 0.825,
    "riskTrend": "STABLE"
  },
  "clinicalSummary": "Le patient présente des épisodes de palpitations associés à un manque de sommeil chronique et à une fatigue accrue sur les dernières 48 heures. La variabilité du rythme cardiaque reste dans des limites acceptables mais nécessite une surveillance accrue.",
  "anomaliesDetected": [
    {
      "metric": "HEART_RATE",
      "description": "Légère tachycardie transitoire détectée lors de l'enregistrement de 08:30 (98 bpm).",
      "severity": "WARNING"
    },
    {
      "metric": "SLEEP",
      "description": "Durée moyenne de sommeil inférieure à 6 heures sur les 3 derniers jours.",
      "severity": "INFO"
    }
  ],
  "recommendations": [
    {
      "category": "SLEEP",
      "priority": "HIGH",
      "message": "Assurer un minimum de 7.5 heures de repos nocturne continu."
    },
    {
      "category": "HYDRATION",
      "priority": "MEDIUM",
      "message": "Limiter la consommation d'excitants (caféine, thé) après 16:00 et s'hydrater régulièrement."
    },
    {
      "category": "ACTIVITY",
      "priority": "LOW",
      "message": "Maintenir une activité physique modérée (marche) de 30 minutes, à distance du coucher."
    }
  ],
  "validationStatus": "PENDING_REVIEW",
  "timestamp": "2026-06-17T14:30:00Z"
}
```
