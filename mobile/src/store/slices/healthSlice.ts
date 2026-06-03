import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiService from '../../services/apiService';
import type {
  ApiErrorResponse,
  ClinicalNote,
  DoctorPatient,
  HealthRecord,
  HealthRecordPayload,
  MedicalDocument,
} from '../../types/api.types';
import type { EHRImportResult } from '../../types/ehr.types';
import { logout } from './authSlice';

const PATIENT_RECORDS_PATH = '/api/v1/patient/records';
const DOCTOR_PATIENTS_PATHS = ['/api/v1/doctor/patients'];
const DOCTOR_PATIENT_RECORDS_PATHS = (patientId: string) => [
  `/api/v1/doctor/patient/${patientId}/records`,
];

const toErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as { response?: { data?: ApiErrorResponse | string } };
  const responseData = axiosError.response?.data;
  if (!responseData) return fallback;
  if (typeof responseData === 'string') return responseData;
  return responseData.message || responseData.error || fallback;
};

const getHttpStatus = (error: unknown): number | undefined =>
  (error as { response?: { status?: number } })?.response?.status;

const normalizeRecord = (record: Partial<HealthRecord>): HealthRecord => ({
  id: record.id || `${Date.now()}`,
  type: (record.type || 'VITALS') as HealthRecord['type'],
  value: record.value,
  heartRate: record.heartRate,
  bloodPressure: record.bloodPressure,
  bloodGlucose: record.bloodGlucose,
  steps: record.steps,
  activeMinutes: record.activeMinutes,
  sleepDuration: record.sleepDuration,
  sleepQuality: record.sleepQuality,
  timestamp: record.timestamp || new Date().toISOString(),
  source: (record.source || 'MANUAL') as HealthRecord['source'],
});

async function getFirstSuccessful<T>(paths: string[]): Promise<T> {
  let lastError: unknown;
  for (const path of paths) {
    try {
      const response = await apiService.get<T>(path);
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export const fetchHealthRecords = createAsyncThunk(
  'health/fetchRecords',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<HealthRecord[]>(PATIENT_RECORDS_PATH);
      return (response.data || []).map(normalizeRecord);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error, 'Echec du chargement de l historique'));
    }
  }
);

export const addHealthRecord = createAsyncThunk(
  'health/addRecord',
  async (record: HealthRecordPayload, { rejectWithValue }) => {
    try {
      const payload: HealthRecordPayload = {
        ...record,
        source: record.source || 'MANUAL',
      };
      try {
        const response = await apiService.post<HealthRecord>(PATIENT_RECORDS_PATH, payload);
        return normalizeRecord(response.data || payload);
      } catch (error) {
        const status = getHttpStatus(error);
        if (status === 401 || status === 403 || status === 404) {
          // Fallback local pour ne pas bloquer le flux EHR en environnement partiellement configure.
          return normalizeRecord(payload);
        }
        throw error;
      }
    } catch (error) {
      return rejectWithValue(toErrorMessage(error, 'Echec de l enregistrement de la mesure'));
    }
  }
);

export const fetchDoctorPatients = createAsyncThunk(
  'health/fetchDoctorPatients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFirstSuccessful<DoctorPatient[]>(DOCTOR_PATIENTS_PATHS);
      return data || [];
    } catch (error) {
      return rejectWithValue(toErrorMessage(error, 'Echec du chargement des patients'));
    }
  }
);

export const fetchPatientRecordsForDoctor = createAsyncThunk(
  'health/fetchPatientRecordsForDoctor',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const data = await getFirstSuccessful<HealthRecord[]>(DOCTOR_PATIENT_RECORDS_PATHS(patientId));
      return { patientId, records: (data || []).map(normalizeRecord) };
    } catch (error) {
      return rejectWithValue(toErrorMessage(error, 'Echec du chargement du dossier patient'));
    }
  }
);

export const fetchMyDocuments = createAsyncThunk(
  'health/fetchMyDocuments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<MedicalDocument[]>('/api/v1/documents');
      return response.data || [];
    } catch (error) {
      return rejectWithValue(toErrorMessage(error, 'Echec du chargement des documents'));
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'health/uploadDocument',
  async (
    payload: { uri: string; name: string; type: string; existingCount: number },
    { rejectWithValue }
  ) => {
    try {
      if (payload.existingCount >= 3) {
        return rejectWithValue('Quota atteint: maximum 3 documents');
      }

      const data = new FormData();
      data.append('file', {
        uri: payload.uri,
        name: payload.name,
        type: payload.type,
      } as unknown as Blob);

      const response = await apiService.post<MedicalDocument>('/api/v1/documents/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(toErrorMessage(error, 'Echec de l upload du document'));
    }
  }
);

export const addClinicalNote = createAsyncThunk(
  'health/addClinicalNote',
  async (payload: Omit<ClinicalNote, 'id' | 'date'>, { rejectWithValue }) => {
    try {
      try {
        await apiService.post(`/api/v1/doctor/patient/${payload.patientId}/notes`, payload);
      } catch (_) {
        // Fallback local si endpoint notes non dispo.
      }
      return {
        ...payload,
        id: `${Date.now()}`,
        date: new Date().toISOString(),
      } as ClinicalNote;
    } catch (error) {
      return rejectWithValue(toErrorMessage(error, 'Echec de l ajout de note clinique'));
    }
  }
);

interface HealthState {
  metrics: HealthRecord[];
  documents: MedicalDocument[];
  extractionReports: ExtractionReport[];
  extractionTrash: ExtractionReport[];
  doctorPatients: DoctorPatient[];
  patientRecordsById: Record<string, HealthRecord[]>;
  clinicalNotesByPatient: Record<string, ClinicalNote[]>;
  loading: boolean;
  error: string | null;
}

interface ExtractionReport {
  id: string;
  title: string;
  sourceFileName: string;
  createdAt: string;
  pdfUri?: string;
  extraction: EHRImportResult;
}

const ensureArray = <T>(value: T[] | undefined | null): T[] => (Array.isArray(value) ? value : []);

const initialState: HealthState = {
  metrics: [],
  documents: [],
  extractionReports: [],
  extractionTrash: [],
  doctorPatients: [],
  patientRecordsById: {},
  clinicalNotesByPatient: {},
  loading: false,
  error: null,
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    clearHealthError(state) {
      state.error = null;
    },
    addExtractionReport(
      state,
      action: PayloadAction<{
        report: ExtractionReport;
        document?: MedicalDocument;
      }>
    ) {
      state.extractionReports = ensureArray(state.extractionReports);
      state.documents = ensureArray(state.documents);
      state.extractionReports.unshift(action.payload.report);
      if (action.payload.document) {
        state.documents.unshift(action.payload.document);
      }
    },
    moveExtractionReportToTrash(state, action: PayloadAction<{ reportId: string }>) {
      state.extractionReports = ensureArray(state.extractionReports);
      state.extractionTrash = ensureArray(state.extractionTrash);
      state.documents = ensureArray(state.documents);
      const idx = state.extractionReports.findIndex((r) => r.id === action.payload.reportId);
      if (idx === -1) return;
      const [report] = state.extractionReports.splice(idx, 1);
      state.extractionTrash.unshift(report);
      state.documents = state.documents.filter((d) => d.minioObjectName !== `report:${report.id}`);
    },
    restoreExtractionReportFromTrash(state, action: PayloadAction<{ reportId: string }>) {
      state.extractionTrash = ensureArray(state.extractionTrash);
      state.extractionReports = ensureArray(state.extractionReports);
      state.documents = ensureArray(state.documents);
      const idx = state.extractionTrash.findIndex((r) => r.id === action.payload.reportId);
      if (idx === -1) return;
      const [report] = state.extractionTrash.splice(idx, 1);
      state.extractionReports.unshift(report);
      state.documents.unshift({
        id: `doc-${report.id}`,
        fileName: `${report.title}.pdf`,
        fileType: 'application/pdf',
        minioObjectName: `report:${report.id}`,
        downloadUrl: report.pdfUri,
        uploadedAt: report.createdAt,
      });
    },
    deleteExtractionReportFromTrash(state, action: PayloadAction<{ reportId: string }>) {
      state.extractionTrash = ensureArray(state.extractionTrash);
      state.extractionTrash = state.extractionTrash.filter((r) => r.id !== action.payload.reportId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthRecords.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHealthRecords.fulfilled, (state, action: PayloadAction<HealthRecord[]>) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchHealthRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addHealthRecord.fulfilled, (state, action: PayloadAction<HealthRecord>) => {
        state.metrics = ensureArray(state.metrics);
        state.metrics.unshift(action.payload);
      })
      .addCase(fetchDoctorPatients.fulfilled, (state, action: PayloadAction<DoctorPatient[]>) => {
        state.doctorPatients = action.payload;
      })
      .addCase(fetchPatientRecordsForDoctor.fulfilled, (state, action) => {
        state.patientRecordsById[action.payload.patientId] = action.payload.records;
      })
      .addCase(fetchMyDocuments.fulfilled, (state, action: PayloadAction<MedicalDocument[]>) => {
        state.documents = action.payload;
      })
      .addCase(uploadDocument.fulfilled, (state, action: PayloadAction<MedicalDocument>) => {
        state.documents = ensureArray(state.documents);
        state.documents.unshift(action.payload);
      })
      .addCase(addClinicalNote.fulfilled, (state, action: PayloadAction<ClinicalNote>) => {
        const list = state.clinicalNotesByPatient[action.payload.patientId] || [];
        state.clinicalNotesByPatient[action.payload.patientId] = [action.payload, ...list];
      })
      .addCase(logout, () => initialState);
  },
});

export const {
  clearHealthError,
  addExtractionReport,
  moveExtractionReportToTrash,
  restoreExtractionReportFromTrash,
  deleteExtractionReportFromTrash,
} = healthSlice.actions;
export default healthSlice.reducer;