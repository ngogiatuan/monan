import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './en.json';
import vi from './vi.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

// Sửa lại detect để chỉ lấy 'vi' hoặc 'en' (không lấy languageTag như 'vi-VN')
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (lang: string) => void) => {
    const locales = RNLocalize.getLocales();
    // Ưu tiên 'vi' nếu thiết bị là tiếng Việt, còn lại là 'en'
    const bestLang = locales[0]?.languageCode === 'vi' ? 'vi' : 'en';
    callback(bestLang);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    fallbackLng: 'vi', // fallback là tiếng Việt
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

