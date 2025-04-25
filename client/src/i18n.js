import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          settings: "Settings",
          language: "Language",
          theme: "Theme",
          fontSize: "Font Size",
          notifications: "Notifications",
        },
      },
      tr: {
        translation: {
          welcome: "Hoşgeldiniz",
          settings: "Ayarlar",
          language: "Dil",
          theme: "Tema",
          fontSize: "Yazı Boyutu",
          notifications: "Bildirimler",
        },
      },
    },
  });

export default i18n;
