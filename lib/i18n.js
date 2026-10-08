import React, { createContext, useContext } from "react";
import { useRouter } from "next/router";

import en from "../locales/en/common.json";
import sv from "../locales/sv/common.json";
import tr from "../locales/tr/common.json";
import de from "../locales/de/common.json";
import es from "../locales/es/common.json";
import ptPT from "../locales/pt-PT/common.json";
import ptBR from "../locales/pt-BR/common.json";

const translations = {
  en,
  sv,
  tr,
  de,
  es,
  "pt-PT": ptPT,
  "pt-BR": ptBR,
};

const I18nContext = createContext(null);

function translate(dictionary, key, values = {}) {
  let value = key.split(".").reduce((obj, part) => obj?.[part], dictionary);

  if (value === undefined) return key;

  if (typeof value === "string") {
    value = value.replace(/\{\{(\w+)\}\}/g, (_, name) =>
      values[name] !== undefined ? values[name] : `{{${name}}}`,
    );
  }

  return value;
}

export function I18nProvider({ children }) {
  const { locale = "en" } = useRouter();
  const dictionary = translations[locale] || translations.en;

  const t = (key, values) => translate(dictionary, key, values);

  return (
    <I18nContext.Provider value={{ t, lang: locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
