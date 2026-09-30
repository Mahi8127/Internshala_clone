import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import en from "@/locales/en.json"
import es from "@/locales/es.json"
import hi from "@/locales/hi.json"
import pt from "@/locales/pt.json"
import zh from "@/locales/zh.json"
import fr from "@/locales/fr.json"

export type LanguageCode =
  | "en"
  | "es"
  | "hi"
  | "pt"
  | "zh"
  | "fr";

const translations = {
  en,
  es,
  hi,
  pt,
  zh,
  fr,
}
interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({
  children,
}: LanguageProviderProps) => {
  const [language, setLanguageState] =
    useState<LanguageCode>("en");

  /*
    Load saved language when the application starts.
  */
  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("selectedLanguage");

    if (
      savedLanguage === "en" ||
      savedLanguage === "es" ||
      savedLanguage === "hi" ||
      savedLanguage === "pt" ||
      savedLanguage === "zh" ||
      savedLanguage === "fr"
    ) {
      setLanguageState(savedLanguage);
    }
  }, []);

  /*
    Change application language.
  */
  const setLanguage = (newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);

    localStorage.setItem(
      "selectedLanguage",
      newLanguage
    );
  };

  /*
    Get translated text using a key.
  */
  const t = (key: string): string => {
    const keys = key.split(".");

    let value: any = translations[language];

    for (const currentKey of keys) {
      value = value?.[currentKey];
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

/*
  Hook used by components to access language.
*/
export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
};