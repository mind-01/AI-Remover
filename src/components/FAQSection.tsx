import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

export const FAQSection: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    return (
        <section className="py-24 relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center space-y-6 mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em]"
                    >
                        Questions?
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight dark:text-white"
                    >
                        Detailed <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-black">Answers</span>
                    </motion.h3>
                </div>

                <div className="grid gap-6">
                    {(t.faq || translations.en.faq).map((faq: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-10 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-300 group cursor-default"
                        >
                            <h4 className="text-xl font-black text-slate-800 mb-4 flex items-center justify-between dark:text-white">
                                {faq.q}
                                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                    <MousePointer2 className="w-4 h-4" />
                                </div>
                            </h4>
                            <p className="text-slate-500 text-base leading-relaxed font-bold dark:text-slate-400">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
