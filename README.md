# 🏥 HealthTrack AI - Intelligent Wellness Monitoring

HealthTrack AI is a premium, AI-driven wellness platform designed to bridge the gap between patients and healthcare providers. It provides real-time health monitoring, clinical document management, and intelligent risk analysis.

## ✨ Key Features

### 👤 Patient Experience
- **Real-time Monitoring**: Track Heart Rate, Blood Pressure, Glucose, Sleep, and Activity.
- **Records Hub**: Centralized management for manual entries and historical health data.
- **Medical Document Vault**: Securely upload clinical documents (PDFs, Images) to a private MinIO server.
- **AI Symptom Checker**: Multi-modal input (Text, Voice, Image) for instant health evaluation.
- **Health Service Locator**: Find nearby clinics and hospitals in real-time.

### 🩺 Doctor Workspace
- **Patient Dashboard**: Real-time overview of all assigned patients with intelligent risk stratification (High/Moderate/Low).
- **Clinical Deep-Dive**: Detailed view of patient vitals history and access to uploaded medical documents.
- **Risk Analysis**: AI-powered indicators to help prioritize urgent cases.

## 🛠️ Technology Stack

### Backend (Spring Boot 3)
- **Framework**: Java 21, Spring Boot 3.3.0
- **Security**: Spring Security with JWT & Stateless Session Management.
- **Database**: MongoDB (Patient data & Health records), Redis (Caching & Sessions).
- **Storage**: MinIO (S3-compatible) for clinical document storage.
- **Architecture**: RESTful API with standardized `/api/v1` prefixes.

### Mobile (React Native / Expo)
- **Core**: React Native with Expo (SDK 51), TypeScript.
- **State Management**: Redux Toolkit for centralized health and auth state.
- **Navigation**: React Navigation (Nested Stack & Tab Navigators).
- **UI/UX**: Custom premium theme with dark mode support, glassmorphism, and smooth animations.

## 🚀 Getting Started

### 1. Infrastructure (Docker)
Ensure Docker is installed and run the infrastructure services:
```bash
cd server
docker-compose up -d mongo redis minio
```

### 2. Backend Deployment
```bash
cd server
# Build and run the backend container
docker-compose up -d --build backend
```

### 3. Mobile App
```bash
cd mobile
npm install
npx expo start
```

## 📂 Project Structure
- `server/`: Spring Boot source code and Docker configuration.
- `mobile/`: React Native application with Redux and Theme providers.
- `infra/`: Persistent data volumes and server scripts.

---
*Developed with focus on Security, Privacy, and Scalability.*