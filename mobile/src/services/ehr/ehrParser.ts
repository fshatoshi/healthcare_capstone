import type { DocumentPickerAsset } from 'expo-document-picker';
import type { EHRExtractedData } from '../../types/ehr.types';
import type { HealthRecordPayload } from '../../types/api.types';

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/heic',
  'image/heif',
  'text/plain',
];

const MAX_SIZE_BYTES = 15 * 1024 * 1024;

export interface EHRValidationResult {
  valid: boolean;
  message?: string;
}

export const validateEHRFile = (asset: DocumentPickerAsset): EHRValidationResult => {
  if (!asset.uri) return { valid: false, message: 'Fichier invalide: URI manquante' };

  const fileType = (asset.mimeType || '').toLowerCase();
  const fileName = (asset.name || '').toLowerCase();
  const hasSupportedExtension =
    fileName.endsWith('.pdf') ||
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.jpeg') ||
    fileName.endsWith('.png') ||
    fileName.endsWith('.heic') ||
    fileName.endsWith('.heif');

  const mimeLooksSupported =
    ALLOWED_TYPES.includes(fileType) ||
    fileType.startsWith('image/');

  if (!mimeLooksSupported && !hasSupportedExtension) {
    return {
      valid: false,
      message: 'Format non supporte. Utilisez PDF, JPG ou PNG.',
    };
  }

  if (typeof asset.size === 'number' && asset.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      message: 'Fichier trop volumineux (max 15MB).',
    };
  }

  return { valid: true };
};

export const formatExtractionSummary = (data?: EHRExtractedData): string => {
  if (!data) return 'Aucune extraction disponible.';

  const vitalsCount = data.measurements.length;
  const diagnosisCount = data.diagnoses.length;
  const medicationCount = data.medications.length;

  return `${vitalsCount} mesures, ${diagnosisCount} diagnostics, ${medicationCount} medicaments extraits`;
};

const toNumber = (value: string | number | undefined): number | undefined => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value !== 'string') return undefined;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const mapEHRExtractionToHealthRecords = (data?: EHRExtractedData): HealthRecordPayload[] => {
  if (!data) return [];

  const records: HealthRecordPayload[] = [];
  const byKey = (keys: string[]): string | number | undefined => {
    const hit = data.measurements.find((m) => keys.includes(m.key.toLowerCase()));
    return hit?.value;
  };

  const heartRate = toNumber(byKey(['heartrate', 'heart_rate', 'hr', 'pulse']));
  const glucose = toNumber(byKey(['glucose', 'bloodglucose', 'blood_glucose']));
  const bloodPressureValue = byKey(['bloodpressure', 'blood_pressure', 'bp']);
  const bloodPressure = typeof bloodPressureValue === 'string' ? bloodPressureValue : undefined;

  if (heartRate || glucose || bloodPressure) {
    records.push({
      type: 'VITALS',
      heartRate,
      bloodGlucose: glucose,
      bloodPressure,
      source: 'EHR',
    });
  }

  const steps = toNumber(byKey(['steps', 'stepcount']));
  const activeMinutes = toNumber(byKey(['activeminutes', 'active_minutes']));
  if (steps || activeMinutes) {
    records.push({
      type: 'ACTIVITY',
      steps,
      activeMinutes,
      source: 'EHR',
    });
  }

  const sleepDuration = toNumber(byKey(['sleepduration', 'sleep_duration']));
  if (sleepDuration) {
    records.push({
      type: 'SLEEP',
      sleepDuration,
      source: 'EHR',
    });
  }

  if (data.summary) {
    records.push({
      type: 'EHR',
      value: data.summary,
      source: 'EHR',
    });
  }

  return records;
};