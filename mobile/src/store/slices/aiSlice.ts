import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiService from '../../services/apiService';

/** Niveaux de risque renvoyes par le backend (PatientProfile.RiskLevel). */
export type AiRiskLevel = 'STABLE' | 'MODERATE' | 'CRITICAL';

/**
 * Entrees attendues par POST /api/v1/patient/ai/cardio-risk.
 * Les bornes sont validees cote backend (CardioRiskRequest) ET cote service IA.
 */
export interface CardioRiskPayload {
  ageYears: number;
  gender: number;      // 1 = femme, 2 = homme (codage du dataset)
  height: number;      // cm
  weight: number;      // kg
  apHi: number;        // tension systolique
  apLo: number;        // tension diastolique
  cholesterol: number; // 1 = normal, 2 = eleve, 3 = tres eleve
  gluc: number;        // 1 = normal, 2 = eleve, 3 = tres eleve
  smoke: number;       // 0 / 1
  alco: number;        // 0 / 1
  active: number;      // 0 / 1
}

/** Resultat d'une analyse IA tel qu'affiche cote mobile. */
export interface AIResult {
  id: string;
  riskLevel: AiRiskLevel;
  confidence: number;      // probabilite 0..1
  summary: string;
  recommendations: string;
  validationStatus: string;
  generatedAt: string;
}

interface AIState {
  results: AIResult[];
  loading: boolean;   // chargement de l'historique
  running: boolean;   // evaluation en cours
  error: string | null;
}

const initialState: AIState = {
  results: [],
  loading: false,
  running: false,
  error: null,
};

const AI_HISTORY_PATH = '/api/v1/patient/ai/history';
const AI_CARDIO_RISK_PATH = '/api/v1/patient/ai/cardio-risk';

const toMessage = (error: unknown, fallback: string): string => {
  const e = error as { response?: { data?: { message?: string; error?: string } | string } };
  const data = e.response?.data;
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  return data.message || data.error || fallback;
};

/** Normalise un AIAnalysis backend vers la forme consommee par l'UI. */
const normalize = (r: any): AIResult => ({
  id: String(r?.id ?? Date.now()),
  riskLevel: (r?.riskLevel ?? 'STABLE') as AiRiskLevel,
  confidence: typeof r?.confidence === 'number' ? r.confidence : Number(r?.confidence) || 0,
  summary: r?.summary ?? '',
  recommendations: r?.recommendations ?? '',
  validationStatus: r?.validationStatus ?? 'PENDING',
  generatedAt: r?.generatedAt ?? new Date().toISOString(),
});

/** Charge l'historique des analyses IA du patient (plus recentes d'abord). */
export const fetchAiHistory = createAsyncThunk(
  'ai/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiService.get<any[]>(AI_HISTORY_PATH);
      return (res.data || []).map(normalize);
    } catch (error) {
      return rejectWithValue(toMessage(error, "Echec du chargement de l'historique IA"));
    }
  }
);

/** Lance une evaluation de risque cardiovasculaire via le vrai modele ML. */
export const runCardioRisk = createAsyncThunk(
  'ai/runCardioRisk',
  async (payload: CardioRiskPayload, { rejectWithValue }) => {
    try {
      const res = await apiService.post<any>(AI_CARDIO_RISK_PATH, payload);
      return normalize(res.data);
    } catch (error) {
      return rejectWithValue(toMessage(error, "Echec de l'evaluation du risque"));
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearAiError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAiHistory.fulfilled, (state, action: PayloadAction<AIResult[]>) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchAiHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Erreur';
      })
      .addCase(runCardioRisk.pending, (state) => {
        state.running = true;
        state.error = null;
      })
      .addCase(runCardioRisk.fulfilled, (state, action: PayloadAction<AIResult>) => {
        state.running = false;
        state.results.unshift(action.payload);
      })
      .addCase(runCardioRisk.rejected, (state, action) => {
        state.running = false;
        state.error = (action.payload as string) || 'Erreur';
      });
  },
});

export const { clearAiError } = aiSlice.actions;
export default aiSlice.reducer;
