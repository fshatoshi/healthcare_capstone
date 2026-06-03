export type EHRImportStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED';

export interface EHRMeasurement {
  key: string;
  value: string | number;
  unit?: string;
  observedAt?: string;
}

export interface EHRMedication {
  name: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
}

export interface EHRDiagnosis {
  code?: string;
  label: string;
  diagnosedAt?: string;
}

export interface EHRExtractedData {
  summary?: string;
  measurements: EHRMeasurement[];
  medications: EHRMedication[];
  diagnoses: EHRDiagnosis[];
  confidence?: number;
}

export interface EHRImportJob {
  importId: string;
  documentId?: string;
  status: EHRImportStatus;
  createdAt?: string;
  updatedAt?: string;
  sourceType?: 'PDF' | 'IMAGE' | 'HL7' | 'FHIR' | 'UNKNOWN';
  message?: string;
}

export interface EHRImportResult {
  importId: string;
  status: EHRImportStatus;
  extracted: EHRExtractedData;
  warnings?: string[];
}