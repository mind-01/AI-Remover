import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { languages } from '../lib/translations';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageModal } from './LanguageModal';

export const LanguageSelector: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { language } = useLanguage();

    const currentLangName = languages.find(l => l.code === language)?.name || 'English';

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2.5 px-6 py-3 bg-slate-100/80 hover:bg-slate-200/80 rounded-full transition-all border border-slate-200 group"
            >
                <Globe className="w-5 h-5 text-slate-600 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-bold text-slate-700">{currentLangName}</span>
            </button>

            <LanguageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};
