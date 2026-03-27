import { useColorScheme as useSystemColorScheme } from 'react-native';

import { AppThemePreference, useAppStore } from '@/core/store/app-store';

export function resolveColorScheme(
  preference: AppThemePreference,
  systemColorScheme: 'light' | 'dark' | null | undefined
) {
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }

  return systemColorScheme ?? 'light';
}

export function useColorScheme() {
  const systemColorScheme = useSystemColorScheme();
  const themePreference = useAppStore((state) => state.themePreference);

  return resolveColorScheme(themePreference, systemColorScheme);
}
