'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  availableLanguages: { code: string; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguageState] = useState('en');

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'am', name: 'አማርኛ (Amharic)' },
    { code: 'om', name: 'Afaan Oromo' },
  ];

  useEffect(() => {
    // Get language from localStorage on client side
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguageState(savedLanguage);
  }, []);

  const setLanguage = (lang: string) => {
    setCurrentLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
