import { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'fr';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const resetLanguage = () => {
        setLanguage('fr');
        localStorage.setItem('language', 'fr');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, resetLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
