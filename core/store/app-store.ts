import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { AuthReturnTo, DEFAULT_AUTH_RETURN_TO } from '@/core/auth/return-to';
import { appPersistStorage } from '@/core/storage/persist-storage';

export type AppThemePreference = 'system' | 'light' | 'dark';

type AppStore = {
  lastAuthReturnTo: AuthReturnTo;
  biometricPromptEnabled: boolean;
  hasCompletedOnboarding: boolean;
  appLanguage: 'en' | 'fr' | null;
  themePreference: AppThemePreference;
  setLastAuthReturnTo: (value: AuthReturnTo) => void;
  setBiometricPromptEnabled: (value: boolean) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  setAppLanguage: (value: 'en' | 'fr' | null) => void;
  setThemePreference: (value: AppThemePreference) => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      lastAuthReturnTo: DEFAULT_AUTH_RETURN_TO,
      biometricPromptEnabled: false,
      hasCompletedOnboarding: false,
      appLanguage: null,
      themePreference: 'system',
      setLastAuthReturnTo: (value) => set({ lastAuthReturnTo: value }),
      setBiometricPromptEnabled: (value) => set({ biometricPromptEnabled: value }),
      setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
      setAppLanguage: (value) => set({ appLanguage: value }),
      setThemePreference: (value) => set({ themePreference: value }),
    }),
    {
      name: 'fresh-app-store',
      storage: appPersistStorage,
      partialize: (state) => ({
        lastAuthReturnTo: state.lastAuthReturnTo,
        biometricPromptEnabled: state.biometricPromptEnabled,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        appLanguage: state.appLanguage,
        themePreference: state.themePreference,
      }),
    }
  )
);
