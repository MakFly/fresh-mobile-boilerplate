import * as SecureStore from 'expo-secure-store';

export async function readSecureJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await SecureStore.getItemAsync(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeSecureJson<T>(key: string, value: T) {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}

export async function removeSecureItem(key: string) {
  await SecureStore.deleteItemAsync(key);
}
