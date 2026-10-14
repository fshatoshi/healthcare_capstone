import axios from 'axios';
import { NativeModules, Platform } from 'react-native';

/** Port exposé par le backend dans docker-compose.yml (service "backend"). */
const BACKEND_PORT = 8080;

/**
 * Détermine l'URL du backend Docker local.
 *
 * 1. EXPO_PUBLIC_API_BASE_URL (fichier mobile/.env) si défini : prioritaire.
 * 2. Sinon, on réutilise l'IP de la machine qui sert le bundle Expo
 *    (ex. 192.168.1.20:8081 -> http://192.168.1.20:8080). Fonctionne avec
 *    Expo Go sur un téléphone connecté au même Wi-Fi que le PC.
 * 3. Sinon : émulateur Android -> 10.0.2.2, web / simulateur iOS -> localhost.
 */
const resolveApiBaseUrl = (): string => {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, '');

  if (Platform.OS === 'web') return `http://localhost:${BACKEND_PORT}`;

  const scriptURL: string | undefined = NativeModules?.SourceCode?.scriptURL;
  const devHost = scriptURL?.match(/^https?:\/\/([^/:]+)/)?.[1];
  if (devHost && devHost !== 'localhost' && devHost !== '127.0.0.1') {
    return `http://${devHost}:${BACKEND_PORT}`;
  }

  return Platform.OS === 'android'
    ? `http://10.0.2.2:${BACKEND_PORT}`
    : `http://localhost:${BACKEND_PORT}`;
};

export const API_BASE_URL = resolveApiBaseUrl();

if (__DEV__) {
  console.log(`[api] Backend : ${API_BASE_URL}`);
}

const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Helper pour injecter le token sans importer le store (évite les boucles infinies)
 */
// Journal de diagnostic : trace chaque appel et surtout chaque echec (dev uniquement).
apiService.interceptors.request.use((config) => {
  if (__DEV__) console.log(`[api] -> ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});
apiService.interceptors.response.use(
  (res) => {
    if (__DEV__) console.log(`[api] <- ${res.status} ${res.config.url}`);
    return res;
  },
  (error) => {
    if (__DEV__) {
      const url = error.config ? `${error.config.baseURL}${error.config.url}` : '?';
      console.log(`[api] X ${url} | code=${error.code} | message=${error.message} | status=${error.response?.status}`);
    }
    if (error.response?.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  }
);

// Handler appele quand le backend renvoie 401 (jeton absent/invalide) :
// le store l'enregistre pour declencher une deconnexion + retour au login.
let unauthorizedHandler: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: (() => void) | null) => {
  unauthorizedHandler = fn;
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiService.defaults.headers.common['Authorization'];
  }
};

export default apiService;
