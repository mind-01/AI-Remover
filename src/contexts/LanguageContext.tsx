import React, { createContext, useContext, useState } from 'react';

type LanguageCode =
    | 'id' | 'de' | 'en' | 'es' | 'fr' | 'it' | 'pt' | 'ru' | 'ko' | 'ja'
    | 'zh-Hans' | 'zh-Hant' | 'pl' | 'hu' | 'th' | 'da' | 'el' | 'uk' | 'ms'
    | 'vi' | 'sv' | 'tr' | 'cs' | 'ro' | 'lv' | 'fi' | 'bg' | 'sr' | 'sl' | 'lt' | 'hi' | 'ur';

interface LanguageContextType {
    language: LanguageCode;
    setLanguage: (code: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<LanguageCode>(() => {
        const saved = localStorage.getItem('app-language');
        return (saved as LanguageCode) || 'en';
    });

    const setLanguage = (code: LanguageCode) => {
        setLanguageState(code);
        localStorage.setItem('app-language', code);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
