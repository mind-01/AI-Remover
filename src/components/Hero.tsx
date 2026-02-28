import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';
import { ComparisonSlider } from './ComparisonSlider';

interface HeroProps {
    onFilesSelect: (files: File[]) => void;
}

export const Hero: React.FC<HeroProps> = ({ onFilesSelect }) => {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;
    const heroT = t.hero || translations.en.hero || {};

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [activeCategory, setActiveCategory] = useState('products');

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

    const [isFetching, setIsFetching] = useState(false);
    const [urlError, setUrlError] = useState<string | null>(null);

    const handleUrlUpload = React.useCallback(async (url: string) => {
        if (!url) return;
        setIsFetching(true);
        setUrlError(null);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch');
            const blob = await response.blob();
            if (!blob.type.startsWith('image/')) throw new Error('Not an image');

            const filename = url.split('/').pop()?.split('?')[0] || 'uploaded-image.png';
            const file = new File([blob], filename, { type: blob.type });
            onFilesSelect([file]);
        } catch (err) {
            console.error('URL Fetch Error:', err);
            setUrlError(heroT.urlError || 'Failed to fetch image from URL.');
        } finally {
            setIsFetching(false);
        }
    }, [onFilesSelect, heroT.urlError]);

    const handlePaste = React.useCallback(async (e: ClipboardEvent | React.ClipboardEvent) => {
        const clipboardData = (e as ClipboardEvent).clipboardData || (e as React.ClipboardEvent).clipboardData;
        const items = clipboardData?.items;
        if (!items) return;

        // Check for images first
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith('image/')) {
                const file = items[i].getAsFile();
                if (file) {
                    onFilesSelect([file]);
                    return;
                }
            }
        }

        // Check for text (URL)
        const text = clipboardData.getData('text');
        if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
            handleUrlUpload(text);
        }
    }, [handleUrlUpload, onFilesSelect]);

    React.useEffect(() => {
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [handlePaste]);

    const categories = [
        { id: 'products', label: 'Products' },
        { id: 'people', label: 'People' },
        { id: 'animals', label: 'Animals' },
        { id: 'cars', label: 'Cars' },
        { id: 'graphics', label: 'Graphics' }
    ];

    const categoryImages: Record<string, { before: string; after: string }> = {
        products: {
            before: '/demo/shoe-original.webp',
            after: '/demo/shoe-result.png'
        },
        people: {
            before: '/demo/People-original.webp',
            after: '/demo/People-result.webp'
        },
        animals: {
            before: '/demo/Animal-original.webp',
            after: '/demo/Animal-result.webp'
        },
        cars: {
            before: '/demo/Car-original.webp',
            after: '/demo/Car-result.webp'
        },
        graphics: {
            before: '/demo/Graphics-original.webp',
            after: '/demo/Graphics-result.webp'
        }
    };

    return (
        <div className="relative pt-8 pb-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex flex-col items-center text-center space-y-12">
                    {/* Header Content */}
                    <div className="space-y-8 max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 shadow-sm dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            {heroT.leadingAi}
                        </motion.div>

                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight leading-[1.1] dark:text-white">
                                {heroT.title}
                            </h1>
                            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed dark:text-slate-400">
                                {heroT.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Upload Box - Centered and Prominent */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: { delay: 0.1 }
                        }}
                        whileHover={{ y: -5 }}
                        className={`
                            relative w-full max-w-2xl p-12 rounded-[3rem] border-4 border-dashed transition-all duration-300
                            ${isDragging
                                ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-900/40 shadow-[0_0_50px_rgba(59,130,246,0.2)]'
                                : 'border-blue-200 bg-white shadow-2xl shadow-slate-200/60 dark:bg-slate-900/50 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors'}
                        `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onPaste={handlePaste}
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
                            <div className="relative inline-flex group/icon">
                                <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 group-hover/icon:opacity-40 animate-pulse transition-opacity" />
                                <motion.div
                                    animate={isFetching ? {
                                        rotate: [0, 360],
                                    } : {
                                        y: [0, -8, 0],
                                    }}
                                    transition={isFetching ? {
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear"
                                    } : {
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className={`relative p-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-xl shadow-blue-200 dark:shadow-blue-900/40 border border-blue-400/30 transition-transform ${isFetching ? 'scale-110' : ''}`}
                                >
                                    <Upload className="w-10 h-10 text-white" />
                                </motion.div>
                            </div>

                            <div className="space-y-6">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isFetching}
                                    className="px-12 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl text-lg font-black hover:from-blue-600 hover:to-blue-700 transition-all shadow-2xl shadow-slate-200 hover:shadow-blue-200/50 hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto uppercase tracking-wide dark:from-white dark:to-slate-100 dark:text-slate-900 dark:hover:from-blue-50 dark:hover:to-blue-100 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isFetching ? heroT.fetching : heroT.uploadButton} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="flex flex-col items-center gap-4">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] dark:text-slate-500">
                                        {isDragging ? heroT.dropImage : heroT.noRegistration}
                                    </p>

                                    <div className="w-full max-w-sm space-y-2">
                                        {urlError && (
                                            <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight bg-red-50 dark:bg-red-900/20 py-2 px-4 rounded-lg border border-red-100 dark:border-red-800/50">{urlError}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-wider dark:text-slate-500">
                                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">
                                    <ImageIcon className="w-3 h-3 text-slate-400 dark:text-slate-400" /> {heroT.formats}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stunning Quality Section */}
                    <div className="w-full max-w-5xl space-y-8 py-12">
                        <div className="text-center space-y-6">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                                {heroT.qualityTitle || 'Stunning quality'}
                            </h2>
                            <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-1.5 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl w-fit mx-auto border border-slate-200/50 dark:border-slate-800/50">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === cat.id
                                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg'
                                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="relative w-full"
                        >
                            <div className="absolute inset-0 bg-blue-600 blur-[120px] opacity-10" />
                            <ComparisonSlider
                                beforeImage={categoryImages[activeCategory].before}
                                afterImage={categoryImages[activeCategory].after}
                            />
                        </motion.div>

                        <div className="text-center">
                            <button
                                onClick={() => document.getElementById('samples')?.scrollIntoView({ behavior: 'smooth' })}
                                className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all group"
                            >
                                {heroT.seeSamples || 'See more samples'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-30 pointer-events-none">
                <div className="w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
            </div>
        </div>
    );
};
