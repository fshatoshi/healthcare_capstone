# =============================================================================
# HealthTrack AI - Project Scaffold Script
# Compatible: PowerShell 5.1+ on Windows
# Run: powershell -ExecutionPolicy Bypass -File setup_healthtrackAI.ps1
# =============================================================================

param(
    [string]$RootDir = "HealthTrackAI",
    [switch]$SkipGitInit
)

$ErrorActionPreference = "Stop"

function Log($msg) { Write-Host "  >> $msg" -ForegroundColor Cyan }
function Section($title) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor DarkGray
    Write-Host "  $title" -ForegroundColor White
    Write-Host "============================================================" -ForegroundColor DarkGray
}
function MakeDir($path) {
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    }
}
function MakeFile($path, $content) {
    # [System.IO.File] uses the .NET process working directory, NOT PowerShell's
    # Set-Location. Always resolve to an absolute path first.
    $absPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine((Get-Location).Path, $path))
    $dir = Split-Path $absPath -Parent
    if ($dir -and -not (Test-Path $dir)) { MakeDir $dir }
    if (-not (Test-Path $absPath)) {
        if ($null -eq $content) { $content = "" }
        [System.IO.File]::WriteAllText($absPath, $content, [System.Text.Encoding]::UTF8)
    }
}

# =============================================================================
# 0. CHECK PREREQUISITES
# =============================================================================
Section "0. Checking prerequisites"

foreach ($tool in @("node","npm","java","git","python")) {
    if (Get-Command $tool -ErrorAction SilentlyContinue) {
        Log "$tool found"
    } else {
        Write-Host "  [WARNING] $tool not found - install it before running the app" -ForegroundColor Yellow
    }
}

# =============================================================================
# 1. ROOT
# =============================================================================
Section "1. Creating root workspace: $RootDir"

MakeDir $RootDir
Set-Location $RootDir
Log "Working directory: $(Get-Location)"

MakeFile "README.md" @"
# HealthTrack AI

Intelligent wellness monitoring platform.

## Structure
- mobile/       React Native app (iOS, Android, PWA)
- backend/      Spring Boot REST API (home server)
- ai-service/   Python FastAPI - AI/ML microservice
- shared/       Shared types, constants, API contracts
- infra/        Docker, deployment, server config
- docs/         Architecture, API docs, diagrams

## Startup order
1. docker-compose up mongodb redis minio -d
2. cd ai-service && uvicorn app.main:app --port 8001
3. cd backend && gradlew.bat bootRun
4. cd mobile && npm start
"@

MakeFile ".gitignore" @"
node_modules/
.expo/
*.log
target/
build/
.gradle/
.idea/
__pycache__/
*.pyc
.venv/
venv/
.env
.env.local
application-local.yml
.DS_Store
Thumbs.db
mongo-data/
dump.rdb
ai-service/models/*.tflite
ai-service/models/*.pkl
ai-service/models/*.h5
"@

MakeFile "docker-compose.yml" @"
version: '3.9'

services:

  mongodb:
    image: mongo:7.0
    container_name: healthtrack-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - ./infra/mongo-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: healthtrack
      MONGO_INITDB_ROOT_PASSWORD: changeme
      MONGO_INITDB_DATABASE: healthtrackdb

  redis:
    image: redis:7.2-alpine
    container_name: healthtrack-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: redis-server --requirepass changeme

  minio:
    image: minio/minio:latest
    container_name: healthtrack-minio
    restart: unless-stopped
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - ./infra/minio-data:/data
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: changeme
    command: server /data --console-address ":9001"

  ai-service:
    build: ./ai-service
    container_name: healthtrack-ai
    restart: unless-stopped
    ports:
      - "8001:8001"

  backend:
    build: ./backend
    container_name: healthtrack-backend
    restart: unless-stopped
    ports:
      - "8080:8080"
    depends_on:
      - mongodb
      - redis
      - ai-service
"@

# =============================================================================
# 2. MOBILE - React Native
# =============================================================================
Section "2. Scaffolding React Native mobile app"

$mobileDirs = @(
    "mobile/src/screens/auth",
    "mobile/src/screens/patient/dashboard",
    "mobile/src/screens/patient/records",
    "mobile/src/screens/patient/symptoms",
    "mobile/src/screens/patient/locator",
    "mobile/src/screens/doctor/workspace",
    "mobile/src/screens/doctor/patientFile",
    "mobile/src/screens/admin",
    "mobile/src/components/common",
    "mobile/src/components/charts",
    "mobile/src/components/forms",
    "mobile/src/components/alerts",
    "mobile/src/components/camera",
    "mobile/src/navigation",
    "mobile/src/services/api",
    "mobile/src/services/sensors",
    "mobile/src/services/offline",
    "mobile/src/services/notifications",
    "mobile/src/services/ehr",
    "mobile/src/store/slices",
    "mobile/src/store/middleware",
    "mobile/src/hooks",
    "mobile/src/utils",
    "mobile/src/i18n/locales",
    "mobile/src/theme",
    "mobile/src/types",
    "mobile/src/config",
    "mobile/assets/images",
    "mobile/assets/fonts",
    "mobile/assets/animations",
    "mobile/pwa",
    "mobile/__tests__/screens",
    "mobile/__tests__/services",
    "mobile/__tests__/components"
)
foreach ($d in $mobileDirs) { MakeDir $d }

# --- Screens ---
MakeFile "mobile/src/screens/auth/LoginScreen.tsx" "// Login screen - email + password, JWT stored in SecureStore"
MakeFile "mobile/src/screens/auth/RegisterScreen.tsx" "// Registration screen - name, email, role, language preference"
MakeFile "mobile/src/screens/auth/ForgotPasswordScreen.tsx" "// Forgot password - email-based reset flow"

MakeFile "mobile/src/screens/patient/dashboard/DashboardScreen.tsx" "// Main patient dashboard - health summary cards, trend charts, quick actions"
MakeFile "mobile/src/screens/patient/dashboard/HealthSummaryCard.tsx" "// Card showing one health metric with sparkline"
MakeFile "mobile/src/screens/patient/records/ManualEntryScreen.tsx" "// Manual health data entry - steps, sleep, HR, weight, blood pressure, glucose"
MakeFile "mobile/src/screens/patient/records/EHRImportScreen.tsx" "// EHR/medical document import - PDF picker, FHIR URL, HL7 file"
MakeFile "mobile/src/screens/patient/records/HealthHistoryScreen.tsx" "// Historical records list with filters by type and date range"
MakeFile "mobile/src/screens/patient/symptoms/SymptomInputScreen.tsx" "// Symptom description - text, voice recording, or image upload"
MakeFile "mobile/src/screens/patient/symptoms/AIEvaluationScreen.tsx" "// Displays AI evaluation result with risk level and recommendations"
MakeFile "mobile/src/screens/patient/symptoms/CameraAnalysisScreen.tsx" "// Camera capture for CV analysis - disclaimer shown before capture"
MakeFile "mobile/src/screens/patient/locator/HealthServiceLocatorScreen.tsx" "// Map + list of nearby clinics and pharmacies using device GPS"

MakeFile "mobile/src/screens/doctor/workspace/DoctorHomeScreen.tsx" "// Doctor workspace - list of patients with pending AI alerts"
MakeFile "mobile/src/screens/doctor/workspace/AlertQueueScreen.tsx" "// Queue of AI-flagged cases waiting for doctor review"
MakeFile "mobile/src/screens/doctor/patientFile/PatientFileScreen.tsx" "// Full patient file - records timeline, AI analyses, snapshots"
MakeFile "mobile/src/screens/doctor/patientFile/AIReviewScreen.tsx" "// Doctor reviews AI result - confirm, correct, or reject"
MakeFile "mobile/src/screens/doctor/patientFile/ClinicalNoteScreen.tsx" "// Add clinical notes and annotations to patient file"
MakeFile "mobile/src/screens/doctor/patientFile/PrescriptionScreen.tsx" "// Write and save prescription linked to patient record"

MakeFile "mobile/src/screens/admin/AdminDashboardScreen.tsx" "// Admin dashboard - platform stats, user management"
MakeFile "mobile/src/screens/admin/UserManagementScreen.tsx" "// List and manage users"
MakeFile "mobile/src/screens/admin/AIModuleConfigScreen.tsx" "// Configure AI thresholds and activate/deactivate modules"

# --- Components ---
MakeFile "mobile/src/components/common/Button.tsx" "// Base button with variants: primary, secondary, danger, outline"
MakeFile "mobile/src/components/common/Input.tsx" "// Text input with label, error state, and RTL support for Arabic"
MakeFile "mobile/src/components/common/Card.tsx" "// Generic card container with optional shadow and border"
MakeFile "mobile/src/components/common/Badge.tsx" "// Risk level badge: LOW=green, MODERATE=amber, HIGH=red, CRITICAL=dark red"
MakeFile "mobile/src/components/common/LoadingSpinner.tsx" "// Centered loading indicator with optional overlay"
MakeFile "mobile/src/components/common/EmptyState.tsx" "// Empty state with icon and message for lists with no data"
MakeFile "mobile/src/components/common/Modal.tsx" "// Generic modal wrapper with backdrop"
MakeFile "mobile/src/components/charts/HeartRateChart.tsx" "// Line chart for HR over time using Victory Native"
MakeFile "mobile/src/components/charts/SleepChart.tsx" "// Bar chart for sleep duration and quality score"
MakeFile "mobile/src/components/charts/ActivityChart.tsx" "// Steps and active minutes bar chart"
MakeFile "mobile/src/components/charts/TrendIndicator.tsx" "// Small up/down/stable arrow with color encoding"
MakeFile "mobile/src/components/forms/HealthDataForm.tsx" "// Reusable form for manual health data fields with validation"
MakeFile "mobile/src/components/alerts/AlertBanner.tsx" "// In-app alert banner showing anomaly with severity color"
MakeFile "mobile/src/components/camera/CameraCapture.tsx" "// Camera wrapper handling permissions, capture, and preview"
MakeFile "mobile/src/components/camera/DisclaimerModal.tsx" "// Required disclaimer before CV analysis: not a medical diagnosis"

# --- Navigation ---
MakeFile "mobile/src/navigation/AppNavigator.tsx" "// Root navigator - switches between Auth stack and Main tabs based on auth state"
MakeFile "mobile/src/navigation/AuthNavigator.tsx" "// Stack: Login, Register, ForgotPassword"
MakeFile "mobile/src/navigation/PatientNavigator.tsx" "// Bottom tabs: Dashboard, Records, Symptoms, Locator, Profile"
MakeFile "mobile/src/navigation/DoctorNavigator.tsx" "// Bottom tabs: Workspace, Alert Queue, Profile"
MakeFile "mobile/src/navigation/AdminNavigator.tsx" "// Admin tab navigator"
MakeFile "mobile/src/navigation/types.ts" "// TypeScript route param types for all navigators"

# --- Services / API ---
MakeFile "mobile/src/services/api/apiClient.ts" "// Axios instance - base URL, JWT interceptor, refresh token logic, error handling"
MakeFile "mobile/src/services/api/authApi.ts" "// Auth endpoints: login, register, refresh, logout"
MakeFile "mobile/src/services/api/healthApi.ts" "// Health records CRUD - manual entry, fetch records, fetch history"
MakeFile "mobile/src/services/api/ehrApi.ts" "// EHR import: multipart upload and status polling"
MakeFile "mobile/src/services/api/aiApi.ts" "// AI endpoints: trigger analysis, get results, get recommendations"
MakeFile "mobile/src/services/api/doctorApi.ts" "// Doctor endpoints: patient list, file access, validate AI result, add notes"
MakeFile "mobile/src/services/api/notificationApi.ts" "// Fetch in-app notifications and mark as read"

# --- Services / Sensors ---
MakeFile "mobile/src/services/sensors/heartRateSensor.ts" "// Camera rPPG heart rate measurement using react-native-camera"
MakeFile "mobile/src/services/sensors/accelerometerSensor.ts" "// Step counting and activity detection via device accelerometer"
MakeFile "mobile/src/services/sensors/gpsSensor.ts" "// Location service used for health center locator feature"
MakeFile "mobile/src/services/sensors/microphoneSensor.ts" "// Voice input for symptom description feature"

# --- Services / Offline ---
MakeFile "mobile/src/services/offline/offlineStorage.ts" "// SQLite wrapper - store and sync health records when offline"
MakeFile "mobile/src/services/offline/syncQueue.ts" "// Queue of pending sync operations that fire when connection is restored"
MakeFile "mobile/src/services/offline/connectivityMonitor.ts" "// NetInfo listener that triggers sync on reconnect"

# --- Services / Other ---
MakeFile "mobile/src/services/notifications/fcmService.ts" "// Firebase Cloud Messaging - register token, handle foreground and background messages"
MakeFile "mobile/src/services/ehr/ehrParser.ts" "// Client-side EHR file validation before upload: type check, size limit"

# --- Store ---
MakeFile "mobile/src/store/index.ts" "// Redux store setup with redux-persist for offline state persistence"
MakeFile "mobile/src/store/slices/authSlice.ts" "// Auth state: current user, token, role, loading flag"
MakeFile "mobile/src/store/slices/healthSlice.ts" "// Health records state, loading indicators, error handling"
MakeFile "mobile/src/store/slices/aiSlice.ts" "// AI results, recommendations list, current risk level"
MakeFile "mobile/src/store/slices/notificationSlice.ts" "// In-app notification list and unread badge count"
MakeFile "mobile/src/store/middleware/offlineMiddleware.ts" "// Intercepts actions when offline and queues them for later sync"

# --- Hooks ---
MakeFile "mobile/src/hooks/useAuth.ts" "// Hook: current user, login/logout helpers, role-based access checks"
MakeFile "mobile/src/hooks/useHealthRecords.ts" "// Hook: fetch, create, delete health records with loading state"
MakeFile "mobile/src/hooks/useOfflineSync.ts" "// Hook: exposes sync status and manual trigger"
MakeFile "mobile/src/hooks/useCamera.ts" "// Hook: camera permission request and capture flow abstraction"
MakeFile "mobile/src/hooks/useLocalization.ts" "// Hook: t() translation helper and current language state"

# --- i18n ---
MakeFile "mobile/src/i18n/index.ts" "// i18n setup with i18next and device language auto-detection"
MakeFile "mobile/src/i18n/locales/en.json" '{"dashboard":{"title":"Dashboard"},"common":{"loading":"Loading...","save":"Save","cancel":"Cancel"}}'
MakeFile "mobile/src/i18n/locales/fr.json" '{"dashboard":{"title":"Tableau de bord"},"common":{"loading":"Chargement...","save":"Enregistrer","cancel":"Annuler"}}'
MakeFile "mobile/src/i18n/locales/ar.json" '{"dashboard":{"title":"Dashboard"},"common":{"loading":"...","save":"Save","cancel":"Cancel"}}'

# --- Theme ---
MakeFile "mobile/src/theme/colors.ts" "// Design tokens: primary navy, teal accent, semantic colors for risk levels"
MakeFile "mobile/src/theme/typography.ts" "// Font sizes, weights, line heights for consistent text styling"
MakeFile "mobile/src/theme/spacing.ts" "// Spacing scale: 4, 8, 12, 16, 24, 32, 48"
MakeFile "mobile/src/theme/index.ts" "// Re-exports all theme tokens"

# --- Types ---
MakeFile "mobile/src/types/user.types.ts" "// User, Patient, Doctor, Admin TypeScript interfaces"
MakeFile "mobile/src/types/health.types.ts" "// HealthRecord, ManualEntry, SleepRecord, HeartRateRecord interfaces"
MakeFile "mobile/src/types/ai.types.ts" "// AIAnalysisResult, Recommendation, Alert interfaces"
MakeFile "mobile/src/types/ehr.types.ts" "// EHRDocument, PatientStateSnapshot interfaces"
MakeFile "mobile/src/types/api.types.ts" "// Generic ApiResponse<T>, PaginatedResponse<T>, ApiError"

# --- Config ---
MakeFile "mobile/src/config/constants.ts" "// API base URL, timeout, pagination size, risk thresholds"
MakeFile "mobile/src/config/endpoints.ts" "// All API endpoint paths as named constants"

# --- Utils ---
MakeFile "mobile/src/utils/formatters.ts" "// Date, number, and unit formatters"
MakeFile "mobile/src/utils/validators.ts" "// Input validation helpers for forms"
MakeFile "mobile/src/utils/riskColors.ts" "// Maps risk level enum to color token"
MakeFile "mobile/src/utils/ehrUtils.ts" "// FHIR and HL7 client-side helpers"

# --- PWA ---
MakeFile "mobile/pwa/manifest.json" @"
{
  "name": "HealthTrack AI",
  "short_name": "HealthTrack",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1B3A5C",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
"@
MakeFile "mobile/pwa/service-worker.js" "// PWA service worker - cache-first for static assets, network-first for API calls"

# --- package.json ---
MakeFile "mobile/package.json" @"
{
  "name": "healthtrack-mobile",
  "version": "0.1.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.74.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@reduxjs/toolkit": "^2.2.0",
    "react-redux": "^9.1.0",
    "redux-persist": "^6.0.0",
    "axios": "^1.7.0",
    "i18next": "^23.0.0",
    "react-i18next": "^14.0.0",
    "expo-sqlite": "^13.0.0",
    "expo-camera": "^15.0.0",
    "expo-location": "^17.0.0",
    "expo-av": "^14.0.0",
    "expo-document-picker": "^12.0.0",
    "expo-secure-store": "^13.0.0",
    "@react-native-community/netinfo": "^11.0.0",
    "victory-native": "^40.0.0",
    "expo-sensors": "^13.0.0"
  },
  "devDependencies": {
    "@types/react": "~18.2.0",
    "@types/react-native": "~0.73.0",
    "typescript": "^5.3.0",
    "jest": "^29.0.0",
    "eslint": "^8.0.0"
  }
}
"@

MakeFile "mobile/tsconfig.json" @"
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
"@

MakeFile "mobile/README.md" @"
# HealthTrack AI - Mobile App

## First time setup
1. Install Node.js >= 18
2. Run: npm install -g expo-cli
3. Inside this folder: npx create-expo-app . --template blank-typescript
4. Then: npm install
5. Start: npm start

## Daily use
- Android emulator: npm run android
- iOS simulator (macOS only): npm run ios
- Web/PWA: npm run web
"@

Log "Mobile structure created"

# =============================================================================
# 3. BACKEND - Spring Boot
# =============================================================================
Section "3. Scaffolding Spring Boot backend"

$base = "backend/src/main/java/com/healthtrack"
$res  = "backend/src/main/resources"

$backendDirs = @(
    "$base/config",
    "$base/security/jwt",
    "$base/controller",
    "$base/service/impl",
    "$base/repository",
    "$base/model/entity",
    "$base/model/dto/request",
    "$base/model/dto/response",
    "$base/model/enums",
    "$base/ai",
    "$base/ehr",
    "$base/notification",
    "$base/exception",
    "$base/util",
    $res,
    "backend/src/test/java/com/healthtrack/controller",
    "backend/src/test/java/com/healthtrack/service"
)
foreach ($d in $backendDirs) { MakeDir $d }

MakeFile "$base/HealthTrackApplication.java" @"
package com.healthtrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class HealthTrackApplication {
    public static void main(String[] args) {
        SpringApplication.run(HealthTrackApplication.class, args);
    }
}
"@

# Config
MakeFile "$base/config/MongoConfig.java" "// MongoDB config: custom converters, indexes, auditing"
MakeFile "$base/config/RedisConfig.java" "// Redis template, cache manager, session TTL"
MakeFile "$base/config/SecurityConfig.java" "// Spring Security: CORS, JWT filter chain, role-based access"
MakeFile "$base/config/WebConfig.java" "// CORS config, multipart upload size limits"
MakeFile "$base/config/AsyncConfig.java" "// Thread pool for async tasks: AI calls, notifications"
MakeFile "$base/config/MinioConfig.java" "// MinIO client bean for file storage"

# Security
MakeFile "$base/security/jwt/JwtTokenProvider.java" "// Generate, validate, and parse JWT access and refresh tokens"
MakeFile "$base/security/jwt/JwtAuthenticationFilter.java" "// OncePerRequestFilter: extracts and validates JWT from Authorization header"
MakeFile "$base/security/UserDetailsServiceImpl.java" "// Loads UserDetails from MongoDB for Spring Security"

# Controllers
MakeFile "$base/controller/AuthController.java" "// POST /api/auth/login, /register, /refresh, /logout"
MakeFile "$base/controller/PatientController.java" "// GET/POST /api/patients - patient profile management"
MakeFile "$base/controller/HealthRecordController.java" "// CRUD /api/records - manual entry, fetch history, delete record"
MakeFile "$base/controller/EHRController.java" "// POST /api/ehr/import - multipart upload, parse status polling"
MakeFile "$base/controller/AIController.java" "// POST /api/ai/analyze - trigger analysis, GET /api/ai/results/{id}"
MakeFile "$base/controller/DoctorController.java" "// GET /api/doctor/patients, validate AI result, notes, prescriptions"
MakeFile "$base/controller/NotificationController.java" "// GET /api/notifications, PATCH /mark-read"
MakeFile "$base/controller/AdminController.java" "// GET /api/admin/users, /stats, /modules"
MakeFile "$base/controller/ImageAnalysisController.java" "// POST /api/cv/analyze - upload image for computer vision analysis"

# Services interfaces
MakeFile "$base/service/AuthService.java" "// Interface: login, register, token refresh"
MakeFile "$base/service/HealthRecordService.java" "// Interface: save record, get history, aggregate metrics"
MakeFile "$base/service/EHRService.java" "// Interface: parse EHR, extract records, create patient state snapshot"
MakeFile "$base/service/AIBridgeService.java" "// Interface: HTTP client to Python AI microservice"
MakeFile "$base/service/DoctorService.java" "// Interface: patient list, validate AI, notes, prescriptions"
MakeFile "$base/service/NotificationService.java" "// Interface: send FCM push and save in-app notification"
MakeFile "$base/service/FileStorageService.java" "// Interface: upload and download from MinIO"

# Service implementations
MakeFile "$base/service/impl/AuthServiceImpl.java" "// Implements AuthService with MongoDB, BCrypt, and JWT"
MakeFile "$base/service/impl/HealthRecordServiceImpl.java" "// Implements HealthRecordService: validation, persistence, aggregation"
MakeFile "$base/service/impl/EHRServiceImpl.java" "// Calls Apache Tika for PDF text, FHIR parser, HL7 bridge"
MakeFile "$base/service/impl/AIBridgeServiceImpl.java" "// WebClient calls to Python AI service, deserializes result"
MakeFile "$base/service/impl/DoctorServiceImpl.java" "// Fetches patient file, saves AI validation record"
MakeFile "$base/service/impl/NotificationServiceImpl.java" "// Firebase Admin SDK for FCM, saves notification to MongoDB"
MakeFile "$base/service/impl/FileStorageServiceImpl.java" "// MinIO SDK: putObject, getPresignedUrl, deleteObject"

# Repositories
MakeFile "$base/repository/UserRepository.java" "// MongoRepository<User>: findByEmail, existsByEmail"
MakeFile "$base/repository/MedicalFileRepository.java" "// MongoRepository<MedicalFile>: findByPatientId"
MakeFile "$base/repository/HealthRecordRepository.java" "// MongoRepository<HealthRecord>: findByFileIdAndTimestampBetween"
MakeFile "$base/repository/EHRDocumentRepository.java" "// MongoRepository<EHRDocument>: findByFileId, updateParseStatus"
MakeFile "$base/repository/AIAnalysisResultRepository.java" "// MongoRepository<AIAnalysisResult>: findByFileIdOrderByGeneratedAtDesc"
MakeFile "$base/repository/ValidationRecordRepository.java" "// MongoRepository<ValidationRecord>: findByDoctorId"
MakeFile "$base/repository/NotificationRepository.java" "// MongoRepository<Notification>: findByUserIdAndIsReadFalse"

# Entities
MakeFile "$base/model/entity/User.java" "// @Document(users): userId, email, passwordHash, role, language, createdAt"
MakeFile "$base/model/entity/MedicalFile.java" "// @Document(medical_files): fileId, patientId, status, createdAt, lastUpdated"
MakeFile "$base/model/entity/HealthRecord.java" "// @Document(health_records): recordId, fileId, timestamp, source enum"
MakeFile "$base/model/entity/ManualEntry.java" "// Embedded: steps, sleepHours, heartRate, weight, bloodPressure, glucose"
MakeFile "$base/model/entity/PhoneSensorData.java" "// Embedded: sensorType enum, rawValue JSON, deviceModel, capturedAt"
MakeFile "$base/model/entity/EHRDocument.java" "// @Document(ehr_documents): fileId, fileType, parsedContent, parseStatus"
MakeFile "$base/model/entity/PatientStateSnapshot.java" "// @Document: snapshotId, fileId, riskScore, trend enum, keyIndicators map"
MakeFile "$base/model/entity/AIAnalysisResult.java" "// @Document: resultId, analysisType, confidence, riskLevel, summary, generatedAt"
MakeFile "$base/model/entity/ValidationRecord.java" "// @Document: validationId, doctorId, analysisResultId, verdict, notes"
MakeFile "$base/model/entity/Recommendation.java" "// @Document: category enum, message, priority, isRead, createdAt"
MakeFile "$base/model/entity/Alert.java" "// @Document: type, targetActor, message, triggeredAt, isAcknowledged"
MakeFile "$base/model/entity/Prescription.java" "// @Document: doctorId, patientId, medications list, dosage, validUntil"
MakeFile "$base/model/entity/Notification.java" "// @Document: userId, channel enum, title, body, isDelivered, sentAt"

# DTOs
MakeFile "$base/model/dto/request/LoginRequest.java" "// { email: String, password: String }"
MakeFile "$base/model/dto/request/RegisterRequest.java" "// { firstName, lastName, email, password, role, language }"
MakeFile "$base/model/dto/request/ManualEntryRequest.java" "// { steps, sleepHours, heartRate, weight, bloodPressure, timestamp }"
MakeFile "$base/model/dto/request/AIAnalysisRequest.java" "// { fileId, recordIds[], analysisType }"
MakeFile "$base/model/dto/request/ValidationRequest.java" "// { resultId, verdict, correctedDiagnosis, notes }"
MakeFile "$base/model/dto/response/AuthResponse.java" "// { accessToken, refreshToken, user: UserDto }"
MakeFile "$base/model/dto/response/HealthRecordResponse.java" "// Flattened record safe for API response"
MakeFile "$base/model/dto/response/AIResultResponse.java" "// { resultId, riskLevel, summary, recommendations[], requiresValidation }"
MakeFile "$base/model/dto/response/PatientFileResponse.java" "// Doctor view: patient info + latest snapshot + pending alerts count"

# Enums
MakeFile "$base/model/enums/UserRole.java" "// PATIENT, DOCTOR, ADMIN"
MakeFile "$base/model/enums/RiskLevel.java" "// LOW, MODERATE, HIGH, CRITICAL"
MakeFile "$base/model/enums/RecordSource.java" "// MANUAL, PHONE_SENSOR, EHR_IMPORT"
MakeFile "$base/model/enums/AnalysisType.java" "// TREND, ANOMALY, CV_IMAGE, SYMPTOM_NLP"
MakeFile "$base/model/enums/ValidationVerdict.java" "// CONFIRMED, CORRECTED, REJECTED"
MakeFile "$base/model/enums/SensorType.java" "// ACCELEROMETER, CAMERA_RPPG, GPS, MICROPHONE"

# AI Bridge
MakeFile "$base/ai/AIServiceClient.java" "// WebClient bean pointing to Python AI microservice base URL"
MakeFile "$base/ai/AIRequestMapper.java" "// Maps HealthRecord list to AI service payload format"
MakeFile "$base/ai/AIResponseMapper.java" "// Maps AI service JSON response to AIAnalysisResult entity"

# EHR
MakeFile "$base/ehr/EHRParserFactory.java" "// Returns correct parser based on file type: PDF, HL7, FHIR"
MakeFile "$base/ehr/FHIRParser.java" "// HAPI FHIR client: parses FHIR R4 bundles into HealthRecord list"
MakeFile "$base/ehr/HL7Parser.java" "// Parses HL7 v2 messages using hl7api library"
MakeFile "$base/ehr/PDFExtractor.java" "// Apache Tika: extracts text from PDF, sends to AI for structuring"

# Notification
MakeFile "$base/notification/FCMSender.java" "// Firebase Admin SDK: send push notification with title, body, data payload"
MakeFile "$base/notification/AlertDispatcher.java" "// Decides who receives alert (patient, doctor, or both) and dispatches"

# Exception
MakeFile "$base/exception/GlobalExceptionHandler.java" "// @ControllerAdvice: handles ResourceNotFoundException, ValidationException"
MakeFile "$base/exception/ResourceNotFoundException.java" "// Thrown when a requested resource does not exist in MongoDB"
MakeFile "$base/exception/AIServiceException.java" "// Thrown when Python AI microservice is unavailable or returns error"

# Util
MakeFile "$base/util/DateUtils.java" "// Date formatting and timezone conversion helpers"
MakeFile "$base/util/PaginationUtils.java" "// Builds PageRequest from controller request params"

# application.yml
MakeFile "$res/application.yml" @"
spring:
  application:
    name: healthtrack-backend
  data:
    mongodb:
      uri: mongodb://healthtrack:changeme@localhost:27017/healthtrackdb
  redis:
    host: localhost
    port: 6379
    password: changeme
  servlet:
    multipart:
      max-file-size: 20MB
      max-request-size: 25MB

server:
  port: 8080

jwt:
  secret: REPLACE_WITH_256_BIT_SECRET_KEY_MINIMUM_32_CHARS
  access-token-expiration: 3600000
  refresh-token-expiration: 604800000

ai-service:
  base-url: http://localhost:8001

minio:
  endpoint: http://localhost:9000
  access-key: minioadmin
  secret-key: changeme
  bucket: healthtrack-files

logging:
  level:
    com.healthtrack: DEBUG
"@

MakeFile "$res/application-docker.yml" @"
spring:
  data:
    mongodb:
      uri: mongodb://healthtrack:changeme@mongodb:27017/healthtrackdb
  redis:
    host: redis
ai-service:
  base-url: http://ai-service:8001
minio:
  endpoint: http://minio:9000
"@

MakeFile "backend/build.gradle" @"
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.3.0'
    id 'io.spring.dependency-management' version '1.1.5'
}

group = 'com.healthtrack'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '21'

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-mongodb'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
    implementation 'org.springframework.boot:spring-boot-starter-cache'
    implementation 'org.springframework.boot:spring-boot-starter-data-redis'

    implementation 'io.jsonwebtoken:jjwt-api:0.12.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.5'

    implementation 'ca.uhn.hapi.fhir:hapi-fhir-base:7.0.0'
    implementation 'ca.uhn.hapi.fhir:hapi-fhir-structures-r4:7.0.0'
    implementation 'org.apache.tika:tika-core:2.9.1'
    implementation 'com.google.firebase:firebase-admin:9.3.0'
    implementation 'io.minio:minio:8.5.9'

    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'

    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
}
"@

MakeFile "backend/settings.gradle" @"
rootProject.name = 'healthtrack-backend'
"@

MakeFile "backend/README.md" @"
# HealthTrack AI - Spring Boot Backend

## Setup from Spring Initializr
1. Go to https://start.spring.io
2. Project: Gradle - Groovy | Language: Java | Boot: 3.3.x
3. Group: com.healthtrack | Artifact: backend | Java: 21
4. Dependencies: Spring Web, Data MongoDB, Security, Validation,
   Spring Reactive Web, Data Redis, Lombok
5. Click GENERATE, download zip
6. Extract the zip, then copy ONLY these into this folder:
   - gradlew
   - gradlew.bat
   - settings.gradle  (overwrite the one here)
   - gradle/ folder
   (do NOT copy src/ or build.gradle - this folder already has them)

## Run
1. docker-compose up mongodb redis -d
2. gradlew.bat bootRun
3. API at http://localhost:8080
"@

Log "Backend structure created"

# =============================================================================
# 4. AI SERVICE - Python
# =============================================================================
Section "4. Scaffolding Python AI microservice"

$aiDirs = @(
    "ai-service/app/api",
    "ai-service/app/core",
    "ai-service/app/models/schemas",
    "ai-service/app/models/ml",
    "ai-service/app/services/anomaly",
    "ai-service/app/services/cv",
    "ai-service/app/services/nlp",
    "ai-service/app/services/recommendations",
    "ai-service/app/services/ehr_extraction",
    "ai-service/app/services/risk_scoring",
    "ai-service/app/utils",
    "ai-service/models/anomaly",
    "ai-service/models/cv",
    "ai-service/models/nlp",
    "ai-service/models/risk",
    "ai-service/data/samples",
    "ai-service/notebooks",
    "ai-service/tests"
)
foreach ($d in $aiDirs) { MakeDir $d }

MakeFile "ai-service/app/main.py" @"
# FastAPI entrypoint
# Run: uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload

from fastapi import FastAPI
from app.api import health_router, analysis_router, cv_router, ehr_router

app = FastAPI(
    title="HealthTrack AI Service",
    description="AI/ML microservice: anomaly detection, CV, EHR extraction",
    version="0.1.0"
)

app.include_router(health_router.router,   prefix="/health")
app.include_router(analysis_router.router, prefix="/analyze")
app.include_router(cv_router.router,       prefix="/cv")
app.include_router(ehr_router.router,      prefix="/ehr")

@app.get("/")
def root():
    return {"status": "HealthTrack AI Service running"}
"@

MakeFile "ai-service/app/api/__init__.py" ""
MakeFile "ai-service/app/api/health_router.py" "# GET /health - liveness and readiness check"
MakeFile "ai-service/app/api/analysis_router.py" "# POST /analyze - receives health records, returns AI analysis with risk level and recommendations"
MakeFile "ai-service/app/api/cv_router.py" "# POST /cv/analyze - receives image bytes, returns CV indicators for skin/eyes/posture"
MakeFile "ai-service/app/api/ehr_router.py" "# POST /ehr/extract - receives raw EHR text or JSON, returns structured HealthRecord list"

MakeFile "ai-service/app/__init__.py" ""
MakeFile "ai-service/app/core/__init__.py" ""
MakeFile "ai-service/app/core/config.py" "# Settings loaded via pydantic-settings: mongo URI, model paths, thresholds"
MakeFile "ai-service/app/core/logging.py" "# Structured logging configuration"
MakeFile "ai-service/app/core/exceptions.py" "# Custom exceptions: ModelNotLoadedError, InsufficientDataError"

MakeFile "ai-service/app/models/__init__.py" ""
MakeFile "ai-service/app/models/schemas/__init__.py" ""
MakeFile "ai-service/app/models/schemas/analysis_schema.py" "# Pydantic schemas: AnalysisRequest, AnalysisResult, RiskLevel enum"
MakeFile "ai-service/app/models/schemas/cv_schema.py" "# Pydantic schemas: CVRequest (image_b64, target), CVResult (indicators, score)"
MakeFile "ai-service/app/models/schemas/ehr_schema.py" "# Pydantic schemas: EHRExtractRequest, ExtractedRecord"
MakeFile "ai-service/app/models/ml/__init__.py" ""
MakeFile "ai-service/app/models/ml/model_loader.py" "# Loads scikit-learn pipelines and TF Lite models at startup - singleton pattern"

MakeFile "ai-service/app/services/__init__.py" ""
MakeFile "ai-service/app/services/anomaly/__init__.py" ""
MakeFile "ai-service/app/services/anomaly/anomaly_detector.py" "# IsolationForest and Z-score detection on time-series health records"
MakeFile "ai-service/app/services/anomaly/preprocessor.py" "# Normalize and window health record sequences before anomaly model"
MakeFile "ai-service/app/services/cv/__init__.py" ""
MakeFile "ai-service/app/services/cv/cv_analyzer.py" "# MediaPipe face mesh + CNN for skin and eye anomaly scoring"
MakeFile "ai-service/app/services/cv/image_preprocessor.py" "# Resize, normalize, CLAHE preprocessing before CV model inference"
MakeFile "ai-service/app/services/nlp/__init__.py" ""
MakeFile "ai-service/app/services/nlp/symptom_analyzer.py" "# NLP pipeline for symptom text: entity extraction, symptom classification"
MakeFile "ai-service/app/services/nlp/darija_preprocessor.py" "# Darija text normalization before NLP pipeline"
MakeFile "ai-service/app/services/recommendations/__init__.py" ""
MakeFile "ai-service/app/services/recommendations/recommendation_engine.py" "# Rule-based and collaborative filtering to generate ranked Recommendation list"
MakeFile "ai-service/app/services/recommendations/recommendation_rules.py" "# Explicit rules: HR > 100 plus low sleep triggers rest recommendation"
MakeFile "ai-service/app/services/ehr_extraction/__init__.py" ""
MakeFile "ai-service/app/services/ehr_extraction/ehr_extractor.py" "# NLP extraction from raw EHR text: dates, values, diagnoses, medications"
MakeFile "ai-service/app/services/ehr_extraction/fhir_mapper.py" "# Maps FHIR R4 resource JSON to internal HealthRecord schema"
MakeFile "ai-service/app/services/risk_scoring/__init__.py" ""
MakeFile "ai-service/app/services/risk_scoring/risk_scorer.py" "# Computes overall patient risk score from multiple health indicators"
MakeFile "ai-service/app/services/risk_scoring/risk_thresholds.py" "# Configurable thresholds per metric: HR, glucose, sleep, blood pressure"
MakeFile "ai-service/app/utils/__init__.py" ""
MakeFile "ai-service/app/utils/image_utils.py" "# Base64 encode/decode, image format validation helpers"
MakeFile "ai-service/app/utils/date_utils.py" "# Date parsing helpers for heterogeneous EHR date formats"

MakeFile "ai-service/models/anomaly/.gitkeep" "# Place trained anomaly_detector.pkl here after training"
MakeFile "ai-service/models/cv/.gitkeep" "# Place skin_analyzer.tflite and eye_analyzer.tflite here"
MakeFile "ai-service/models/nlp/.gitkeep" "# Place symptom_classifier.pkl here"
MakeFile "ai-service/models/risk/.gitkeep" "# Place risk_scorer.pkl here"
MakeFile "ai-service/data/samples/.gitkeep" "# Anonymized sample records for local dev and testing"

MakeFile "ai-service/notebooks/01_anomaly_detection_training.ipynb" "{}"
MakeFile "ai-service/notebooks/02_cv_model_evaluation.ipynb" "{}"
MakeFile "ai-service/notebooks/03_recommendation_engine.ipynb" "{}"
MakeFile "ai-service/notebooks/04_ehr_extraction_pipeline.ipynb" "{}"

MakeFile "ai-service/requirements.txt" @"
fastapi==0.111.0
uvicorn[standard]==0.30.0
pydantic==2.7.0
pydantic-settings==2.3.0
scikit-learn==1.5.0
numpy==1.26.4
pandas==2.2.2
opencv-python-headless==4.10.0.82
mediapipe==0.10.14
Pillow==10.3.0
fhir.resources==7.1.0
hl7apy==1.3.4
pymongo==4.7.3
motor==3.4.0
python-multipart==0.0.9
httpx==0.27.0
pytest==8.2.0
"@

MakeFile "ai-service/Dockerfile" @"
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
"@

MakeFile "ai-service/README.md" @"
# HealthTrack AI - Python AI Microservice

## Setup
1. Python 3.12+
2. python -m venv .venv
3. Windows: .venv\Scripts\Activate.ps1
4. pip install -r requirements.txt
5. uvicorn app.main:app --reload --port 8001
6. API at http://localhost:8001

## Models
Place trained model files in the models/ subdirectories.
Use the Jupyter notebooks in notebooks/ to train from scratch.
"@

Log "AI service structure created"

# =============================================================================
# 5. SHARED
# =============================================================================
Section "5. Creating shared folder"

MakeDir "shared/api-contracts"
MakeDir "shared/types"
MakeDir "shared/constants"

MakeFile "shared/api-contracts/openapi.yml" @"
openapi: 3.1.0
info:
  title: HealthTrack AI API
  version: 0.1.0
servers:
  - url: http://localhost:8080
    description: Local development
"@
MakeFile "shared/types/health.types.ts" "// Shared TypeScript types for health data structures"
MakeFile "shared/constants/riskLevels.ts" "// Shared risk level constants and color mappings"
MakeFile "shared/constants/endpoints.ts" "// Single source of truth for all API endpoint paths"

Log "Shared folder created"

# =============================================================================
# 6. INFRA
# =============================================================================
Section "6. Creating infra folder"

MakeDir "infra/nginx"
MakeDir "infra/mongo-data"
MakeDir "infra/minio-data"
MakeDir "infra/scripts"

MakeFile "infra/nginx/nginx.conf" @"
server {
    listen 80;
    server_name healthtrack.local;

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
    }

    location /ai {
        proxy_pass http://localhost:8001;
    }

    location / {
        root /var/www/healthtrack-pwa;
        try_files `$uri /index.html;
    }
}
"@

MakeFile "infra/scripts/init-mongo.js" @"
db = db.getSiblingDB('healthtrackdb');
db.users.createIndex({ email: 1 }, { unique: true });
db.health_records.createIndex({ fileId: 1, timestamp: -1 });
db.ai_analysis_results.createIndex({ fileId: 1, generatedAt: -1 });
print('MongoDB initialized successfully');
"@

Log "Infra folder created"

# =============================================================================
# 7. DOCS
# =============================================================================
Section "7. Creating docs folder"

MakeDir "docs/diagrams"
MakeDir "docs/api"
MakeDir "docs/decisions"

MakeFile "docs/diagrams/use-case.puml" "// PlantUML use case diagram"
MakeFile "docs/diagrams/class-diagram.puml" "// PlantUML class diagram"
MakeFile "docs/api/endpoints.md" "// All API endpoints documented with request/response examples"
MakeFile "docs/decisions/001-no-wearable.md" "// ADR: No wearable dependency - all data from manual entry, phone sensors, or EHR import"
MakeFile "docs/decisions/002-mongodb-redis.md" "// ADR: MongoDB primary DB (document model), Redis for session and cache"
MakeFile "docs/decisions/003-python-ai-microservice.md" "// ADR: Python microservice for AI - keeps ML dependencies away from JVM"

Log "Docs folder created"

# =============================================================================
# 8. GIT INIT
# =============================================================================
if (-not $SkipGitInit) {
    Section "8. Git init"
    if (Get-Command git -ErrorAction SilentlyContinue) {
        # Suppress CRLF warnings - normal on Windows, not an error
        git init 2>$null | Out-Null
        git config core.autocrlf true 2>$null | Out-Null
        git add . 2>$null | Out-Null
        git commit -m "chore: initial project scaffold" 2>$null | Out-Null
        Log "Git repository initialized"
    } else {
        Log "git not found - skipping"
    }
}

# =============================================================================
# DONE
# =============================================================================
Section "All done!"
Write-Host ""
Write-Host "  Project created at: $(Get-Location)" -ForegroundColor Green
Write-Host ""
Write-Host "  NEXT STEPS:" -ForegroundColor White
Write-Host "  1. docker-compose up mongodb redis minio -d" -ForegroundColor Gray
Write-Host "  2. cd ai-service  then  pip install -r requirements.txt  then  uvicorn app.main:app --port 8001" -ForegroundColor Gray
Write-Host "  3. cd backend     then  gradlew.bat bootRun" -ForegroundColor Gray
Write-Host "  4. cd mobile      then  npx create-expo-app . --template blank-typescript  then  npm start" -ForegroundColor Gray
Write-Host ""
