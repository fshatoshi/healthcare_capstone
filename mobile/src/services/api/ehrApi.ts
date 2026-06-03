import apiService from '../apiService';
import type { EHRImportJob, EHRImportResult, EHRImportStatus } from '../../types/ehr.types';

const EHR_IMPORT_PATHS = ['/api/v1/ehr/import', '/api/ehr/import', '/ehr/import'] as const;

type RawResponse = Record<string, unknown>;

const toStatus = (value: unknown): EHRImportStatus => {
  const status = String(value || '').toUpperCase();
  if (status === 'DONE' || status === 'FAILED' || status === 'PROCESSING') return status;
  return 'PENDING';
};

const normalizeJob = (raw: RawResponse): EHRImportJob => ({
  importId: String(raw.importId || raw.id || ''),
  documentId: raw.documentId ? String(raw.documentId) : undefined,
  status: toStatus(raw.status),
  createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
  updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
  sourceType: raw.sourceType ? String(raw.sourceType).toUpperCase() as EHRImportJob['sourceType'] : 'UNKNOWN',
  message: raw.message ? String(raw.message) : undefined,
});

const normalizeResult = (raw: RawResponse): EHRImportResult => {
  const extractedRaw = (raw.extracted || raw.data || {}) as RawResponse;
  const measurements = Array.isArray(extractedRaw.measurements) ? extractedRaw.measurements : [];
  const medications = Array.isArray(extractedRaw.medications) ? extractedRaw.medications : [];
  const diagnoses = Array.isArray(extractedRaw.diagnoses) ? extractedRaw.diagnoses : [];
  const warnings = Array.isArray(raw.warnings) ? raw.warnings.map(String) : [];

  return {
    importId: String(raw.importId || raw.id || ''),
    status: toStatus(raw.status),
    extracted: {
      summary: extractedRaw.summary ? String(extractedRaw.summary) : undefined,
      measurements: measurements.map((m) => ({
        key: String((m as RawResponse).key || (m as RawResponse).name || 'unknown'),
        value: ((m as RawResponse).value as string | number) ?? 'N/A',
        unit: (m as RawResponse).unit ? String((m as RawResponse).unit) : undefined,
        observedAt: (m as RawResponse).observedAt ? String((m as RawResponse).observedAt) : undefined,
      })),
      medications: medications.map((m) => ({
        name: String((m as RawResponse).name || 'Unknown medication'),
        dosage: (m as RawResponse).dosage ? String((m as RawResponse).dosage) : undefined,
        frequency: (m as RawResponse).frequency ? String((m as RawResponse).frequency) : undefined,
        startDate: (m as RawResponse).startDate ? String((m as RawResponse).startDate) : undefined,
        endDate: (m as RawResponse).endDate ? String((m as RawResponse).endDate) : undefined,
      })),
      diagnoses: diagnoses.map((d) => ({
        code: (d as RawResponse).code ? String((d as RawResponse).code) : undefined,
        label: String((d as RawResponse).label || (d as RawResponse).name || 'Unknown diagnosis'),
        diagnosedAt: (d as RawResponse).diagnosedAt ? String((d as RawResponse).diagnosedAt) : undefined,
      })),
      confidence: typeof extractedRaw.confidence === 'number' ? extractedRaw.confidence : undefined,
    },
    warnings,
  };
};

export interface EHRUploadPayload {
  uri: string;
  name: string;
  type: string;
}

const isNotFoundError = (error: unknown): boolean => {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return status === 404;
};

const withFallbackPaths = async <T>(
  request: (path: string) => Promise<T>
): Promise<T> => {
  let lastError: unknown;
  for (const path of EHR_IMPORT_PATHS) {
    try {
      return await request(path);
    } catch (error) {
      lastError = error;
      if (!isNotFoundError(error)) throw error;
    }
  }
  throw lastError;
};

export const uploadEHRDocument = async (file: EHRUploadPayload): Promise<EHRImportJob> => {
  const data = new FormData();
  data.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);

  const response = await withFallbackPaths((path) =>
    apiService.post<RawResponse>(path, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  );

  return normalizeJob(response.data || {});
};

export const getEHRImportStatus = async (importId: string): Promise<EHRImportJob> => {
  const response = await withFallbackPaths((path) =>
    apiService.get<RawResponse>(`${path}/${importId}/status`)
  );
  return normalizeJob(response.data || {});
};

export const getEHRImportResult = async (importId: string): Promise<EHRImportResult> => {
  const response = await withFallbackPaths((path) =>
    apiService.get<RawResponse>(`${path}/${importId}/result`)
  );
  return normalizeResult(response.data || {});
};

export const confirmEHRImport = async (
  importId: string,
  payload?: Record<string, unknown>
): Promise<{ success: boolean; message?: string }> => {
  const response = await withFallbackPaths((path) =>
    apiService.post<RawResponse>(`${path}/${importId}/confirm`, payload || {})
  );
  return {
    success: Boolean(response.data?.success ?? true),
    message: response.data?.message ? String(response.data.message) : undefined,
  };
};