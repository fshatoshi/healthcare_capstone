import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import healthReducer from './slices/healthSlice';
import aiReducer from './slices/aiSlice';
import notificationReducer from './slices/notificationSlice';
import { logout } from './slices/authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  health: healthReducer,
  ai: aiReducer,
  notifications: notificationReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'health'], // Only persist these slices
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;