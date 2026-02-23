import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Zap, Layers, BarChart3, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

interface EcommerceSectionProps {
    onCtaClick?: () => void;
}

export const EcommerceSection: React.FC<EcommerceSectionProps> = ({ onCtaClick }) => {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    const ecommerceT = t.ecommerce || translations.en.ecommerce;

    const benefits = [
        {
            icon: Zap,
            title: ecommerceT.bulkTitle,
            desc: ecommerceT.bulkDesc,
            color: 'text-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-900/20'
        },
        {
            icon: Layers,
            title: ecommerceT.marketplaceTitle,
            desc: ecommerceT.marketplaceDesc,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            icon: BarChart3,
            title: ecommerceT.studioTitle,
            desc: ecommerceT.studioDesc,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20'
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Visual Comparison Area */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/10 to-transparent blur-3xl rounded-full" />
                        <div className="relative bg-slate-100 dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Row 1: Shoe Comparison */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700"
                                >
                                    <div className="aspect-square rounded-xl bg-slate-50 dark:bg-slate-950 mb-3 overflow-hidden relative group">
                                        <img src="/demo/shoe-original.jpg" alt="Original Product" className="w-full h-full object-cover" />
                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/50 backdrop-blur-md text-[8px] text-white font-bold uppercase rounded-full">Source</div>
                                    </div>
                                    <div className="h-1.5 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full mb-1.5" />
                                    <div className="h-1.5 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-full" />
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-blue-600 rounded-2xl p-4 shadow-xl shadow-blue-500/20 pt-8"
                                >
                                    <div className="aspect-square rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm mb-3 overflow-hidden relative flex items-center justify-center border border-white/10">
                                        <img
                                            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop"
                                            alt="Camera Processed"
                                            className="w-full h-full object-cover relative z-10"
                                        />
                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-white text-[8px] text-blue-600 font-bold uppercase rounded-full shadow-sm z-20">Camera</div>
                                    </div>
                                    <div className="h-1.5 w-2/3 bg-white/30 rounded-full mb-1.5" />
                                    <div className="h-1.5 w-1/2 bg-white/10 rounded-full" />
                                </motion.div>

                                {/* Row 2: Secondary Products */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 mt-[-1rem]"
                                >
                                    <div className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-900 mb-3 overflow-hidden relative flex items-center justify-center group/item">
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent z-10" />
                                        <img
                                            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"
                                            alt="Watch Example"
                                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/50 backdrop-blur-md text-[8px] text-white font-bold uppercase rounded-full z-20">Watch</div>
                                    </div>
                                    <div className="h-1.5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full mb-1.5" />
                                    <div className="h-1.5 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-full" />
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700"
                                >
                                    <div className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-900 mb-3 overflow-hidden relative flex items-center justify-center group/item">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent z-10" />
                                        <img
                                            src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop"
                                            alt="Handbag Example"
                                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/50 backdrop-blur-md text-[8px] text-white font-bold uppercase rounded-full z-20">Handbag</div>
                                    </div>
                                    <div className="h-1.5 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full mb-1.5" />
                                    <div className="h-1.5 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-full" />
                                </motion.div>
                            </div>

                            {/* Floating Platform Badges */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3">
                                <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">Shopify Ready</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Area */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50"
                            >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                {ecommerceT.title}
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                {ecommerceT.subtitle}
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {benefits.map((benefit, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-5 p-6 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                >
                                    <div className={`${benefit.bg} ${benefit.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                                        <benefit.icon className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{benefit.title}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{benefit.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onCtaClick}
                            className="px-10 py-5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl text-lg font-black flex items-center gap-3 shadow-xl shadow-slate-200 dark:shadow-none uppercase tracking-wide"
                        >
                            {ecommerceT.cta} <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </section>
    );
};
