import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import secureStorage from './secureStorage';
import { setUnauthorizedHandler, setAuthToken } from '../services/apiService';
import authReducer from './slices/authSlice';
import healthReducer from './slices/healthSlice';
import aiReducer from './slices/aiSlice';
import notificationReducer from './slices/notificationSlice';
import { logout } from './slices/authSlice';

// Le slice "auth" (jeton JWT inclus) est persisté à part, dans le stockage
// sécurisé du système (Keychain / Keystore) au lieu d'AsyncStorage en clair.
const authPersistConfig = {
  key: 'auth',
  storage: secureStorage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  health: healthReducer,
  ai: aiReducer,
  notifications: notificationReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['health'], // "auth" a sa propre persistance sécurisée ci-dessus
};

const appReducer = (state: ReturnType<typeof rootReducer> | undefined, action: { type: string }) => {
  if (action.type === logout.type) {
    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Sur 401 (jeton invalide/expire) : on purge le token et on deconnecte,
// ce qui bascule la navigation vers l'ecran de login.
setUnauthorizedHandler(() => {
  setAuthToken(null);
  store.dispatch(logout());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;