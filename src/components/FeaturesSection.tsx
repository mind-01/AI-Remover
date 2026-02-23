import React, { useState } from 'react';
import { Zap, Shield, Image as ImageIcon, Download, CheckCircle2, Wand2, Loader2, Sparkles, Cpu, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

export const FeaturesSection: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;
    const featuresT = t.features || translations.en.features || {};
    const commonT = t.common || translations.en.common || {};

    const [demoStep, setDemoStep] = useState<'idle' | 'processing' | 'complete'>('idle');

    const runLiveDemo = () => {
        setDemoStep('processing');
        setTimeout(() => {
            setDemoStep('complete');
        }, 2000);
    };

    const resetDemo = () => {
        setDemoStep('idle');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-32 space-y-40 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] -right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            {/* How it Works */}
            <div id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32 relative z-10">
                <div className="text-center space-y-6 mb-20">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full w-fit mx-auto"
                    >
                        {featuresT.process}
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight dark:text-white"
                    >
                        How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Works</span>
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500 max-w-2xl mx-auto font-bold dark:text-slate-400"
                    >
                        {featuresT.howDesc || 'Remove backgrounds from any image in seconds with our advanced AI engine.'}
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-10"
                >
                    {[
                        { step: '01', title: featuresT.uploadTitle, desc: featuresT.uploadDesc, icon: ImageIcon, color: 'blue' },
                        { step: '02', title: featuresT.aiTitle, desc: featuresT.aiDesc, icon: Wand2, color: 'indigo' },
                        { step: '03', title: featuresT.downloadTitle, desc: featuresT.downloadDesc, icon: Download, color: 'emerald' },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className="relative p-12 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-500 group"
                        >
                            <div className="absolute top-10 right-10 text-7xl font-black text-slate-200 dark:text-slate-800/80 group-hover:opacity-10 transition-opacity italic select-none">
                                {item.step}
                            </div>
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100 dark:border-slate-800 relative z-10">
                                <item.icon className="w-7 h-7" />
                            </div>
                            <h4 className="text-2xl font-black text-slate-800 mb-3 dark:text-white relative z-10">{item.title}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed font-bold dark:text-slate-400 relative z-10">{item.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Why Choose Us - Enhanced with Glows */}
            <div className="relative mx-4 sm:mx-12 lg:mx-20 overflow-hidden rounded-[4rem] group/section">
                <div className="absolute inset-0 bg-slate-900 dark:bg-black transition-colors duration-500" />

                {/* Dynamic Mesh Gradients */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-8 py-32 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full"
                                >
                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                    <span className="text-xs font-black text-blue-400 uppercase tracking-widest">{featuresT.whyTitle}</span>
                                </motion.div>
                                <h3 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                                    Unmatched <span className="text-blue-500 text-glow">Precision</span> for every pixel.
                                </h3>
                                <p className="text-slate-400 text-lg font-bold leading-relaxed max-w-lg">
                                    {featuresT.whyDesc || 'Our AI model is trained on millions of studio-grade images.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {[
                                    { title: featuresT.autoTitle, desc: featuresT.autoDesc, icon: <Zap className="w-5 h-5" /> },
                                    { title: featuresT.hdTitle, desc: featuresT.hdDesc, icon: <ImageIcon className="w-5 h-5" /> },
                                    { title: featuresT.smartTitle, desc: featuresT.smartDesc, icon: <Cpu className="w-5 h-5" /> },
                                    { title: featuresT.privacyTitle, desc: featuresT.privacyDesc, icon: <Shield className="w-5 h-5" /> },
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-blue-400 mt-1">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h5 className="text-white font-black text-base tracking-tight">{item.title}</h5>
                                            <p className="text-slate-500 text-sm font-bold mt-1 text-balance">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Live Demo Console */}
                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-slate-800/80 backdrop-blur-3xl border border-white/10 p-8 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden group/demo"
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover/demo:opacity-10 transition-opacity pointer-events-none">
                                    <Globe className="w-32 h-32 text-white" />
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40">
                                                <Zap className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <span className="block text-xs font-black text-white uppercase tracking-wider">{featuresT.aiAnalysis}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                                                    <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">{featuresT.online}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <AnimatePresence mode="wait">
                                            {demoStep === 'idle' && (
                                                <motion.button
                                                    key="idle"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    onClick={runLiveDemo}
                                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-[0.15em] rounded-2xl transition-all shadow-xl shadow-blue-600/30 active:scale-95"
                                                >
                                                    {featuresT.liveDemo}
                                                </motion.button>
                                            )}
                                            {demoStep === 'processing' && (
                                                <motion.div
                                                    key="proc"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="px-6 py-3 bg-white/5 border border-white/10 text-slate-400 text-xs font-black uppercase tracking-widest rounded-2xl flex items-center gap-3"
                                                >
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    {commonT.processing}
                                                </motion.div>
                                            )}
                                            {demoStep === 'complete' && (
                                                <motion.button
                                                    key="done"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    onClick={resetDemo}
                                                    className="px-6 py-3 bg-white text-slate-900 text-xs font-black uppercase tracking-[0.15em] rounded-2xl transition-all hover:bg-white/90 active:scale-95"
                                                >
                                                    {featuresT.tryAgain}
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Demo Visualizer */}
                                    <div className="h-72 rounded-[2.5rem] bg-slate-900/50 border border-white/5 relative overflow-hidden group/visual">
                                        <AnimatePresence>
                                            {demoStep === 'complete' && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="absolute inset-0"
                                                    style={{
                                                        backgroundImage: `
                                                            linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%), 
                                                            linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%), 
                                                            linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%), 
                                                            linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%)
                                                        `,
                                                        backgroundSize: '24px 24px'
                                                    }}
                                                />
                                            )}
                                        </AnimatePresence>

                                        {/* Original */}
                                        <motion.div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url('/demo/shoe-original.webp')` }}
                                            animate={{ opacity: demoStep === 'complete' ? 0 : 1 }}
                                            transition={{ duration: 1 }}
                                        />

                                        {/* Result */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <AnimatePresence>
                                                {demoStep === 'complete' && (
                                                    <motion.img
                                                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        src="/demo/shoe-result.png"
                                                        className="max-w-[85%] max-h-[85%] object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.6)]"
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Scanning Effect */}
                                        {demoStep === 'processing' && (
                                            <motion.div
                                                className="absolute inset-0 z-10 pointer-events-none"
                                                initial={{ y: '-100%' }}
                                                animate={{ y: '100%' }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                            >
                                                <div className="h-[2px] w-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)]" />
                                            </motion.div>
                                        )}

                                        {/* Info Badge */}
                                        <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center pointer-events-none">
                                            <div className="space-y-1">
                                                <span className="block text-[10px] font-black text-blue-400 uppercase tracking-widest">{featuresT.demoEfficiency}</span>
                                                <span className="block text-sm font-bold text-white tracking-tight">
                                                    {demoStep === 'complete' ? featuresT.demoRemoved : featuresT.demoPrecision}
                                                </span>
                                            </div>
                                            <motion.div
                                                animate={demoStep === 'complete' ? { scale: [1, 1.2, 1] } : {}}
                                                className="p-3 bg-blue-600 rounded-xl shadow-lg border border-blue-400/20"
                                            >
                                                <CheckCircle2 className="w-5 h-5 text-white" />
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: featuresT.demoSpeed, val: '0.42s', color: 'text-white' },
                                            { label: featuresT.demoAccuracy, val: demoStep === 'complete' ? '100%' : '99.9%', color: demoStep === 'complete' ? 'text-green-400' : 'text-white' }
                                        ].map(stat => (
                                            <div key={stat.label} className="bg-white/5 border border-white/5 p-5 rounded-3xl flex flex-col items-center group/stat">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover/stat:text-blue-400 transition-colors uppercase tracking-[0.2em]">{stat.label}</span>
                                                <span className={`text-2xl font-black italic tracking-tighter ${stat.color}`}>{stat.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
