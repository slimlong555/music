import { createI18n } from "vue-i18n";
import zh from "@/locales/zh.json";
import en from "@/locales/en.json";

export default createI18n({
  locale: "zh",
  fallbackLocale: "en",
  messages: {
    zh,
    en,
  },numberFormats: {
    en: {
      currency: {
        style: "currency",
        currency: "USD",
      },
    },
    zh: {
      currency: {
        style: "currency",
        currency: "CNY",
      },
    },
  },
  
});
