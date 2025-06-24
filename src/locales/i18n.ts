import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './en.json';
import vi from './vi.json';


const resources = {
  en: { translation: en },
  vi: { translation: vi },

};

const languageDetector = {
  type: 'languageDetector', 
    async: true,
    detect: (callback: (lang: string) => void) => {
       const locales = RNLocalize.getLocales();
       const bestLang = locales[0]?.languageTag || 'en';
        callback(bestLang);
        },
    init: () => {},
    cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector as any)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        resources,
        interpolation: {
            escapeValue: false,
        },
    })


    export default i18n;
