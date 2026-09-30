# 🏥 HealthTrack AI — Intelligent Wellness Monitoring

> **Academic Year 2024-2025**  
> **2CS Capstone Project**  
> **Authors:** Nadahe Mohamed, TRAORE Fanogo Mohamed, Zogbelemou François

---

## 🌟 Project Overview

**HealthTrack AI** is a premium, AI-driven wellness monitoring mobile and web platform designed to bridge the gap between daily preventive wellness and professional healthcare. 

### 1.1 Project Context & Problem Statement
Healthcare systems in developing regions face significant challenges: overcrowded hospitals, medical deserts, and late detection of chronic conditions (e.g., diabetes, hypertension). Concurrently, smartphone penetration is growing rapidly. 

HealthTrack AI leverages the powerful sensors already present in modern smartphones (cameras, accelerometers, microphones) to deliver **preventive health tools without requiring expensive wearable devices or constant internet access**. It offers a secure, offline-first, and culturally adapted solution tailored to the Moroccan and regional markets.

### 1.2 Key Objectives
*   **Track:** Capture physical activity, sleep quality, and heart rate through manual logs, phone sensors (camera rPPG, accelerometer), and clinical documents.
*   **Analyze:** Run machine learning algorithms to detect anomalies and identify clinical risk levels.
*   **Visualize:** Present longitudinal health trends via modern interactive dashboards.
*   **Recommend:** Generate contextualized recommendations based on the user's physiological profile.
*   **Detect:** Use on-device computer vision to detect visible health anomalies (skin, eyes, posture).
*   **Alert:** Dispatch real-time notifications to patients and doctors if parameters exceed safe limits.
*   **Include:** Provide offline-first sync and multilingual support (EN, FR, AR, Darija).

### 1.3 Key Actors
1.  **Patient:** Logs data, runs sensor measurements, uploads medical reports, views dashboards and AI insights.
2.  **Doctor:** Reviews validated patient files, updates AI findings, adds clinical notes, and writes prescriptions.
3.  **Admin:** Manages user accounts, configures AI model sensitivity, and consults platform analytics.
4.  **AI Engine:** Extracts PDF data, detects anomalies, scores risk, and triggers critical alerts.

### 1.4 Scope Boundaries
*   **Out of Scope:** Clinical diagnosis or issuing prescriptions automatically without doctor validation.
*   **Out of Scope:** Real-time video teleconsultation (planned for future releases).
*   **Out of Scope:** Wearable device integrations (all data comes from manual entry, phone sensors, or EHR imports).

---

## 🛠️ Architecture & Technical Stack

HealthTrack AI uses a decoupled, secure, and modern microservices architecture.

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Mobile Frontend** | **React Native (Expo SDK 51)** | Typed TypeScript, single codebase for iOS/Android, native sensor integration. |
| **Backend API** | **Java 21 / Spring Boot 3.3** | Highly secure, asynchronous support, stateless session management (JWT). |
| **AI / ML Engine** | **FastAPI (Python)** | Keeps ML overhead (scikit-learn, OCR) separate from the JVM. |
| **Computer Vision** | **MediaPipe / OpenCV** | On-device, lightweight inference for face, eye, and posture landmarks. |
| **Databases** | **MongoDB & Redis** | MongoDB for flexible health records; Redis for cache and session performance. |
| **File Storage** | **MinIO (S3-compatible)** | Private cloud storage for EHR documents (PDFs, images). |
| **Offline Sync** | **SQLite (Mobile)** | Enables offline-first tracking for areas with unstable internet connectivity. |
| **Alerts** | **Firebase Cloud Messaging** | Reliable push notifications across Android and iOS devices. |

---

## 📅 8-Week Agile Sprint Plan

The project follows the Scrum agile framework. Each week represents a sprint delivering a testable increment.

```
[Sprint 1: Architecture] ──> [Sprint 2: Auth & Manual Entry] ──> [Sprint 3: EHR & AI OCR] ──> [Sprint 4: Sensors & Dashboards]
                                                                                                    │
[Sprint 8: Final QA & Demo] <── [Sprint 7: Vision & i18n] <── [Sprint 6: Doctor Workspace] <── [Sprint 5: Risk AI & FCM Alerts]
```

*   **Sprint 1 (W1) - Setup & Architecture:** Dev environment setup, database modeling, OpenAPI contracts.
*   **Sprint 2 (W2) - Auth & Manual Saisie:** Secure JWT login/register, manual vital logs (BP, heart rate, sleep), SQLite database.
*   **Sprint 3 (W3) - EHR Import & AI Parsing:** File upload to MinIO, OCR data extraction from laboratory PDFs, timeline creation.
*   **Sprint 4 (W4) - Mobile Sensors & Graphs:** Camera-based rPPG heart rate capture, accelerometer steps tracking, Victory Native trend charts.
*   **Sprint 5 (W5) - AI Risk Scoring & Push:** Anomaly detection, clinical risk levels (Green/Amber/Red), FCM alert dispatcher.
*   **Sprint 6 (W6) - Doctor Workspace:** Patient file overview, AI validation panel, clinical notes editor, prescription issuer.
*   **Sprint 7 (W7) - Computer Vision & Locales:** MediaPipe posture/eye/skin scanner, symptom voice recorder, EN/FR/AR/Darija translation.
*   **Sprint 8 (W8) - QA, Audit & Delivery:** End-to-end testing, security audits, CNDP compliance, final deployment script.

---

## 📋 Core Product Backlog

| ID | User Story Title | Priority | Value | Complexity (SP) |
| :--- | :--- | :--- | :--- | :--- |
| **US-01** | User registration and secure JWT login | Must Have | High | 5 |
| **US-02** | Manual health data entry (vitals, sleep, steps) | Must Have | High | 3 |
| **US-03** | EHR and medical document import (PDF) | Must Have | High | 8 |
| **US-04** | Automated OCR data extraction from PDF EHR | Must Have | High | 8 |
| **US-05** | Phone sensor data capture (camera rPPG, steps) | Must Have | High | 13 |
| **US-06** | Interactive health dashboard & trend charts | Must Have | High | 5 |
| **US-07** | Sleep quality tracking and logging | Must Have | High | 3 |
| **US-08** | AI anomaly detection and risk scoring | Must Have | High | 8 |
| **US-09** | AI-powered personalized health recommendations | Must Have | High | 8 |
| **US-10** | Real-time push alerts for patient and doctor | Must Have | High | 5 |
| **US-11** | Offline data collection and sync | Must Have | High | 8 |
| **US-12** | Doctor workspace - access patient file | Must Have | High | 5 |
| **US-13** | Doctor workspace - review and validate AI findings | Must Have | High | 5 |
| **US-14** | Doctor workspace - add clinical notes & prescriptions | Must Have | High | 3 |
| **US-15** | Patient state tracking and longitudinal trends | Should Have | Medium | 5 |
| **US-16** | Computer vision image analysis (posture, skin, eyes) | Should Have | Medium | 13 |
| **US-17** | Multimodal symptom input (text, voice, image) | Should Have | Medium | 8 |
| **US-18** | Multilingual support (EN, FR, AR, Darija) | Should Have | Medium | 5 |
| **US-19** | Health history detail sheets | Should Have | Medium | 5 |
| **US-20** | Nearby clinics & pharmacies locator map | Should Have | Medium | 5 |
| **US-21** | Export health summary (PDF) | Could Have | Low | 3 |
| **US-22** | Family sub-profiles management | Could Have | Low | 5 |
| **US-23** | Admin dashboard & usage analytics | Could Have | Low | 5 |
| **US-24** | Admin AI module configurations & thresholds | Could Have | Low | 5 |

---

## 🚀 Getting Started

### 1. Configuration
Copy the environment template and fill in the values (the `.env` file is git-ignored):
```bash
cp .env.example .env
# JWT secret: openssl rand -base64 48
```

### 2. Backend + infrastructure (Docker)
From the project root, start MongoDB, Redis, MinIO and the Spring Boot API:
```bash
docker compose up -d --build
```
* API: `http://localhost:8080/api/v1`
* MinIO console: `http://localhost:9001`

The AI service is not implemented yet; it is only started on demand (`docker compose --profile ai up -d`). Without it, the backend returns a fallback analysis.

### 3. Mobile application (React Native / Expo)
```bash
cd mobile
npm install
npx expo start
```
The app finds the local backend automatically: on a phone running Expo Go (same Wi-Fi as the PC) it uses the PC's IP on port 8080, `10.0.2.2` on the Android emulator, `localhost` on web. To force another address, set `EXPO_PUBLIC_API_BASE_URL` in `mobile/.env` (see `mobile/.env.example`).

> On Windows, allow port 8080 through the firewall so a physical phone can reach the backend.

---

## 📂 Project Structure

```
├── ai-service/              # Python FastAPI microservice (AI models, OCR, MediaPipe)
├── backend/                 # Spring Boot 3 Java backend (core API, security)
├── mobile/                  # React Native / Expo application (frontend)
│   ├── assets/              # App assets (Logo, arabesque watermarks, etc.)
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── screens/         # Patient, Doctor, Admin workspace screens
│       ├── navigation/      # Stack & bottom tab routers
│       └── theme/           # Playfair Display & Inter brand colors (Refined Moroccan Luxury)
├── docs/                    # Architectural decisions (ADRs) and project deliverables
├── infra/                   # Persistent Docker volume bindings
└── docker-compose.yml       # Base orchestration for local databases & services
```