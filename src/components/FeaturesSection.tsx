import React, { useState } from 'react';
import { Zap, Shield, Image as ImageIcon, Download, CheckCircle2, Wand2, MousePointer2, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

export const FeaturesSection: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    // ✅ ADDED: Live Demo State
    const [demoStep, setDemoStep] = useState<'idle' | 'processing' | 'complete'>('idle');

    // ✅ ADDED: Live Demo Function
    const runLiveDemo = () => {
        setDemoStep('processing');
        setTimeout(() => {
            setDemoStep('complete');
        }, 2000);
    };

    const resetDemo = () => {
        setDemoStep('idle');
    };

    return (
        <section className="py-24 space-y-32">
            {/* How it Works - वैसा ही है */}
            <div id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest">{t.features.process}</h2>
                    <h3 className="text-4xl font-black text-slate-800 tracking-tight dark:text-white">{t.features.howToTitle}</h3>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium dark:text-slate-400">
                        {t.features.howToDesc}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { step: '01', title: t.features.uploadTitle, desc: t.features.uploadDesc, icon: ImageIcon },
                        { step: '02', title: t.features.aiTitle, desc: t.features.aiDesc, icon: Wand2 },
                        { step: '03', title: t.features.downloadTitle, desc: t.features.downloadDesc, icon: Download },
                    ].map((item, idx) => (
                        <div key={idx} className="relative p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 hover:scale-[1.02] transition-all duration-300 group dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
                            <div className="absolute top-8 right-10 text-6xl font-black text-slate-50 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity uppercase italic dark:text-slate-700">
                                {t.features.step} {item.step}
                            </div>
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">
                                <item.icon className="w-6 h-6" aria-label={item.title} />
                            </div>
                            <h4 className="text-xl font-black text-slate-800 mb-2 dark:text-white">{item.title}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium dark:text-slate-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Feature List */}
            <div className="bg-slate-900 py-24 rounded-[3.5rem] mx-4 sm:mx-8 px-8 overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h2 className="text-sm font-black text-blue-400 uppercase tracking-widest">{t.features.whyTitle}</h2>
                                <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                                    {t.features.whyHeading}
                                </h3>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-lg">
                                    {t.features.whyDesc}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { title: t.features.autoTitle, desc: t.features.autoDesc },
                                    { title: t.features.hdTitle, desc: t.features.hdDesc },
                                    { title: t.features.smartTitle, desc: t.features.smartDesc },
                                    { title: t.features.privacyTitle, desc: t.features.privacyDesc },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="p-1 px-2.5 rounded-lg border border-blue-500/20 bg-blue-500/10 mt-1">
                                            <CheckCircle2 className="w-4 h-4 text-blue-400" aria-label="Feature verified" />
                                        </div>
                                        <div>
                                            <h5 className="text-white font-bold text-sm tracking-tight">{item.title}</h5>
                                            <p className="text-slate-500 text-xs font-medium mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ✅ UPDATED: Live Demo Section */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-transparent blur-2xl rounded-full" />
                            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                                <Zap className="w-5 h-5 text-white" aria-label="AI powered" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-white uppercase tracking-wider">{t.features.aiAnalysis}</span>
                                                <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                    {t.features.online}
                                                </span>
                                            </div>
                                        </div>

                                        {/* ✅ DYNAMIC BUTTONS */}
                                        {demoStep === 'idle' && (
                                            <button
                                                onClick={runLiveDemo}
                                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all border border-blue-500 hover:border-blue-400 shadow-lg shadow-blue-600/20"
                                            >
                                                {t.features.liveDemo}
                                            </button>
                                        )}
                                        {demoStep === 'processing' && (
                                            <button
                                                disabled
                                                className="px-5 py-2.5 bg-slate-700 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-xl border border-slate-600 flex items-center gap-2"
                                            >
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                {t.common.processing}
                                            </button>
                                        )}
                                        {demoStep === 'complete' && (
                                            <button
                                                onClick={resetDemo}
                                                className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all border border-green-500"
                                            >
                                                {t.features.tryAgain}
                                            </button>
                                        )}
                                    </div>

                                    {/* ✅ DYNAMIC IMAGE CONTAINER - CHECKERED BG + TRANSPARENT SHOE */}
                                    <div className="h-64 rounded-2xl bg-slate-900 border border-white/5 relative overflow-hidden">

                                        {/* CHECKERED BACKGROUND - Visible when complete */}
                                        <div
                                            className={`absolute inset-0 transition-opacity duration-1000 ${demoStep === 'complete' ? 'opacity-100' : 'opacity-0'
                                                }`}
                                            style={{
                                                backgroundImage: `
                                                    linear-gradient(45deg, #e5e5e5 25%, transparent 25%), 
                                                    linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), 
                                                    linear-gradient(45deg, transparent 75%, #e5e5e5 75%), 
                                                    linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)
                                                `,
                                                backgroundSize: '20px 20px',
                                                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                                                backgroundColor: '#f8fafc'
                                            }}
                                        />

                                        {/* 1. ORIGINAL IMAGE */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                                            style={{
                                                backgroundImage: `url('/demo/shoe-original.jpg')`,
                                                opacity: demoStep === 'complete' ? 0 : 1
                                            }}
                                        />

                                        {/* 2. RESULT IMAGE - Centered IMG tag */}
                                        <div
                                            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${demoStep === 'complete' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                                }`}
                                        >
                                            <img
                                                src="/demo/shoe-result.png"
                                                alt="Shoe with transparent background"
                                                className="max-w-[90%] max-h-[90%] object-contain drop-shadow-2xl"
                                            />
                                        </div>

                                        {/* 3. PROCESSING OVERLAY */}
                                        {demoStep === 'processing' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-20">
                                                <div className="text-center space-y-3">
                                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                                                    <p className="text-xs font-black text-white uppercase tracking-widest">{t.common.processing}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. BOTTOM INFO - No green checkmark */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
                                        <div className="absolute bottom-5 left-6 right-6 z-10">
                                            <div className="flex justify-between items-end">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t.features.demoEfficiency}</p>
                                                    <p className="text-sm font-bold text-white tracking-tight">
                                                        {demoStep === 'complete' ? t.features.demoRemoved : t.features.demoPrecision}
                                                    </p>
                                                </div>
                                                <div className="p-2 bg-blue-600 rounded-lg">
                                                    <Shield className="w-4 h-4 text-blue-400" aria-label="Secure processing" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: t.features.demoSpeed, val: '0.4s' },
                                            { label: t.features.demoAccuracy, val: demoStep === 'complete' ? '100%' : '99.9%' }
                                        ].map(stat => (
                                            <div key={stat.label} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</span>
                                                <span className={`text-xl font-black tracking-tight italic ${demoStep === 'complete' && stat.label === t.features.demoAccuracy ? 'text-green-400' : 'text-white'
                                                    }`}>
                                                    {stat.val}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO FAQ Section - वैसा ही है */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest italic flex items-center justify-center gap-2 dark:text-blue-400">
                        {t.features.commonQuestions}
                    </h2>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-tight dark:text-white">{t.features.faqTitle}</h3>
                </div>

                <div className="space-y-6">
                    {(t.faq || translations.en.faq).map((faq: any, idx: number) => (
                        <div key={idx} className="p-8 bg-slate-50 rounded-3xl border border-slate-200 hover:border-blue-200 hover:bg-white transition-all cursor-default group dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:border-slate-700">
                            <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center justify-between dark:text-white">
                                {faq.q}
                                <MousePointer2 className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors dark:text-slate-600" aria-label="FAQ item" />
                            </h4>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium dark:text-slate-400">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
