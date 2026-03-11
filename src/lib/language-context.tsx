import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from './i18n';

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  hasChosenLanguage: boolean;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  hasChosenLanguage: false,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>('en');
  const [hasChosenLanguage, setHasChosenLanguage] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('chithur-lang') as Language | null;
    if (saved) {
      setLangState(saved);
      setHasChosenLanguage(true);
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('chithur-lang', l);
    setHasChosenLanguage(true);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, hasChosenLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
