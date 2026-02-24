import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as en from './locales/en.json';
import * as hi from './locales/hi.json';
import * as mr from './locales/mr.json';

const LANGUAGE_KEY = 'user-language';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
};

/**
 * Detects the best default language:
 *  1. Previously saved preference in AsyncStorage
 *  2. Device locale (if we ship that translation)
 *  3. English as ultimate fallback
 */
const getStoredLanguage = async (): Promise<string> => {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (saved && resources[saved as keyof typeof resources]) return saved;
  } catch (_) {
    /* ignore storage errors */
  }

  // Try device locale
  const deviceLocale = Localization.getLocales()?.[0]?.languageCode ?? 'en';
  return resources[deviceLocale as keyof typeof resources] ? deviceLocale : 'en';
};

// Initialise synchronously with a safe default; then override once
// AsyncStorage resolves (happens very quickly on app start).
i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // safe default until async detection resolves
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

// Async language detection – fires once on cold start
getStoredLanguage().then((lang) => {
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
});

/**
 * Call this to change the language at runtime.
 * Persists the choice to AsyncStorage so it survives restarts.
 */
export const changeLanguage = async (lang: string) => {
  await i18n.changeLanguage(lang);
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (_) {
    /* best-effort persistence */
  }
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
];

export default i18n;
