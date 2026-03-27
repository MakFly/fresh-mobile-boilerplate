import { Platform } from 'react-native';

import type { MMKV } from 'react-native-mmkv';

import { logger } from '@/core/logger';

let mmkv: MMKV | null = null;
let triedInit = false;

export function getAppMmkv(): MMKV | null {
  if (Platform.OS === 'web') return null;
  if (triedInit) return mmkv;
  triedInit = true;
  try {
    const { createMMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
    mmkv = createMMKV({ id: 'fresh-app-kv' });
  } catch {
    logger.debug('MMKV unavailable (Expo Go?), direct KV ops will be no-ops');
  }
  return mmkv;
}

export function mmkvGetString(key: string): string | undefined {
  return getAppMmkv()?.getString(key);
}

export function mmkvSetString(key: string, value: string) {
  getAppMmkv()?.set(key, value);
}

export function mmkvDelete(key: string) {
  getAppMmkv()?.remove(key);
}
