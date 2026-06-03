import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AIResult {
  id: string;
  type: string;
  riskLevel: string;
  confidence: number;
  summary: string;
  validationStatus: string;
  generatedAt: string;
}

interface AIState {
  results: AIResult[];
  pendingAnalysis: boolean;
}

const initialState: AIState = {
  results: [],
  pendingAnalysis: false,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setResults(state, action: PayloadAction<AIResult[]>) {
      state.results = action.payload;
    },
    setPending(state, action: PayloadAction<boolean>) {
      state.pendingAnalysis = action.payload;
    },
    addResult(state, action: PayloadAction<AIResult>) {
      state.results.unshift(action.payload);
      state.pendingAnalysis = false;
    },
  },
});

export const { setResults, setPending, addResult } = aiSlice.actions;
export default aiSlice.reducer;