import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiService, { setAuthToken } from '../../services/apiService';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/api/v1/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/api/v1/auth/register', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  userId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  language: string;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  role: 'PATIENT',
  userId: null,
  firstName: '',
  lastName: '',
  email: '',
  dob: '',
  language: 'EN',
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ role: UserRole; userId: string; firstName: string; lastName: string; language?: string; token: string }>) {
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.language = action.payload.language || state.language;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.role = 'PATIENT';
      state.userId = null;
      state.firstName = '';
      state.lastName = '';
      state.email = '';
      state.dob = '';
      state.language = 'EN';
      state.token = null;
      state.error = null;
      setAuthToken(null);
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.role = action.payload.role;
        state.userId = action.payload.userId;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.dob = action.payload.dob;
        state.language = action.payload.language || state.language;
        state.token = action.payload.token;
        setAuthToken(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.role = action.payload.role;
        state.userId = action.payload.userId;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.dob = action.payload.dob;
        state.language = action.payload.language || state.language;
        state.token = action.payload.token;
        setAuthToken(action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { loginSuccess, logout, clearError } = authSlice.actions;
export default authSlice.reducer;