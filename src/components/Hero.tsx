import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

interface HeroProps {
    onFilesSelect: (files: File[]) => void;
}

export const Hero: React.FC<HeroProps> = ({ onFilesSelect }) => {
    const { language } = useLanguage();
    const t = translations[language]?.common || translations.en.common;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) {
            onFilesSelect(files);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
            if (files.length > 0) {
                onFilesSelect(files);
            }
        }
    };

    return (
        <div className="relative pt-24 pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="text-center lg:text-left space-y-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 shadow-sm dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            {t.leadingAi}
                        </motion.div>

                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight leading-[1.1] dark:text-white">
                                {t.heroTitle}
                            </h1>
                            <p className="text-xl text-slate-500 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed dark:text-slate-400">
                                {t.heroSubtitle}
                            </p>
                        </div>

                        <div
                            className={`
                  relative max-w-2xl mx-auto lg:mx-0 p-12 rounded-[3rem] border-4 border-dashed transition-all duration-300
                  ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xl shadow-slate-200/50 dark:bg-slate-800 dark:border-slate-700 dark:shadow-none'}
                `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                                multiple
                            />

                            <div className="space-y-8 text-center">
                                <div className="relative inline-flex">
                                    <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 animate-pulse" />
                                    <div className="relative p-8 bg-blue-600 rounded-3xl shadow-xl shadow-blue-200 dark:shadow-blue-900/20">
                                        <Upload className="w-10 h-10 text-white" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-lg font-black hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto uppercase tracking-wide dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:shadow-none"
                                    >
                                        {t.uploadButton} <ArrowRight className="w-5 h-5" />
                                    </button>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] dark:text-slate-500">
                                        {isDragging ? t.dropImage : t.noRegistration}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-wider dark:text-slate-500">
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">
                                        <ImageIcon className="w-3 h-3 text-slate-400 dark:text-slate-400" /> {t.formats}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Result Visual Prediction */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-blue-600 blur-[100px] opacity-10" />
                        <img
                            src="/blog/nike-shoe-background-removal.webp"
                            alt="Professional Background Removal Result"
                            className="w-full h-auto rounded-3xl shadow-2xl transition-transform duration-700"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-30 pointer-events-none">
                <div className="w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
            </div>
        </div>
    );
};
