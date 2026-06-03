export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export type HealthRecordType = 'VITALS' | 'ACTIVITY' | 'SLEEP' | 'EHR';
export type HealthRecordSource = 'MANUAL' | 'SENSOR' | 'EHR';

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export interface AuthResponse {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  userId: string;
  dob?: string;
}

export interface HealthRecord {
  id: string;
  type: HealthRecordType;
  value?: string;
  heartRate?: number;
  bloodPressure?: string;
  bloodGlucose?: number;
  steps?: number;
  activeMinutes?: number;
  sleepDuration?: number;
  sleepQuality?: number;
  timestamp: string;
  source: HealthRecordSource;
}

export interface HealthRecordPayload {
  type: HealthRecordType;
  value?: string;
  heartRate?: number;
  bloodPressure?: string;
  bloodGlucose?: number;
  steps?: number;
  activeMinutes?: number;
  sleepDuration?: number;
  sleepQuality?: number;
  source?: HealthRecordSource;
}

export interface MedicalDocument {
  id: string;
  fileName: string;
  fileType: string;
  minioObjectName?: string;
  downloadUrl?: string;
  uploadedAt: string;
}

export interface DoctorPatient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob?: string;
}

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface ClinicalNote {
  id: string;
  patientId: string;
  content: string;
  doctorName: string;
  date: string;
}