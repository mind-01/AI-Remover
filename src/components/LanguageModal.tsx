import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { languages, type LanguageCode } from '../lib/translations';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
    const { language, setLanguage } = useLanguage();

    const handleSelect = (code: string) => {
        setLanguage(code as LanguageCode);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
                    />
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                                    Choose Your Language
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleSelect(lang.code)}
                                            className={`
                        flex items-center justify-between p-4 rounded-2xl border-2 transition-all group
                        ${language === lang.code
                                                    ? 'border-amber-600 bg-amber-50/10'
                                                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}
                      `}
                                        >
                                            <span className={`text-sm font-bold ${language === lang.code ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {lang.name}
                                            </span>
                                            {language === lang.code && (
                                                <Check className="w-4 h-4 text-amber-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
