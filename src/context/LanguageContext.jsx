import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'th' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

