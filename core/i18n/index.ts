import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/core/i18n/locales/en.json';
import fr from '@/core/i18n/locales/fr.json';

export type AppLanguage = 'en' | 'fr';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
} as const;

export function resolveDeviceLanguage(): AppLanguage {
  const deviceLanguage = Localization.getLocales()[0]?.languageCode;
  return deviceLanguage === 'fr' ? 'fr' : 'en';
}

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: resolveDeviceLanguage(),
  fallbackLng: 'en',
  supportedLngs: ['en', 'fr'],
  interpolation: { escapeValue: false },
  showSupportNotice: false,
});

export { i18n };
