import { Platform } from 'react-native';
import { createJSONStorage, type StateStorage } from 'zustand/middleware';

import { logger } from '@/core/logger';

const memoryMap = new Map<string, string>();

const memoryStorage: StateStorage = {
  getItem: (name) => memoryMap.get(name) ?? null,
  setItem: (name, value) => {
    memoryMap.set(name, value);
  },
  removeItem: (name) => {
    memoryMap.delete(name);
  },
};

const webStorage: StateStorage = {
  getItem: (name) => {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(name);
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

let nativePersist: StateStorage | null = null;

function getNativePersist(): StateStorage {
  if (nativePersist) return nativePersist;
  try {
    const { createMMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
    const mmkv = createMMKV({ id: 'fresh-app-persist' });
    nativePersist = {
      getItem: (name) => mmkv.getString(name) ?? null,
      setItem: (name, value) => mmkv.set(name, value),
      removeItem: (name) => {
        mmkv.remove(name);
      },
    };
  } catch {
    logger.debug('MMKV unavailable (Expo Go?), falling back to in-memory persist');
    nativePersist = memoryStorage;
  }
  return nativePersist;
}

function getStorage(): StateStorage {
  if (Platform.OS === 'web') return webStorage;
  return getNativePersist();
}

export const appPersistStorage = createJSONStorage(getStorage);
