import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Adaptateur de stockage pour redux-persist s'appuyant sur expo-secure-store
 * (Keychain iOS / Keystore Android : les valeurs sont chiffrées au repos).
 *
 * Utilisé pour le slice "auth", qui contient le jeton JWT. Sur le web,
 * SecureStore n'existe pas : on retombe sur AsyncStorage.
 *
 * Limite : SecureStore accepte ~2 Ko par clé. Le slice auth (jeton + profil)
 * reste bien en dessous.
 */
// SecureStore n'accepte que [A-Za-z0-9._-] dans les cles. redux-persist utilise
// des cles comme "persist:auth" (le ":" est interdit) : on les normalise.
const sanitizeKey = (key: string): string => key.replace(/[^A-Za-z0-9._-]/g, '_');

const secureStorage = {
  getItem: (key: string): Promise<string | null> =>
    Platform.OS === 'web' ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(sanitizeKey(key)),
  setItem: (key: string, value: string): Promise<void> =>
    Platform.OS === 'web'
      ? AsyncStorage.setItem(key, value)
      : SecureStore.setItemAsync(sanitizeKey(key), value),
  removeItem: (key: string): Promise<void> =>
    Platform.OS === 'web'
      ? AsyncStorage.removeItem(key)
      : SecureStore.deleteItemAsync(sanitizeKey(key)),
};

export default secureStorage;
