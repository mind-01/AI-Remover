import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Github, Twitter, Mail, Sparkles, Send, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../lib/translations';
import { LanguageSelector } from '../LanguageSelector';

export const Footer: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language]?.common || translations.en.common || {};
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setTimeout(() => {
                setSubscribed(false);
                setEmail('');
            }, 3000);
        }
    };

    const footerLinks = {
        tools: [
            { name: t.bgRemover, available: true, to: '/' },
            { name: t.pngMaker, available: false },
            { name: t.objectEraser, available: false },
            { name: "Batch Editor", available: false }
        ],
        resources: [
            { name: t.apiDoc, to: "/api-docs", available: true },
            { name: t.blog, to: "/blog", available: true },
            { name: "Support Center", to: "/help", available: true },
            { name: "Community", available: false }
        ],
        legal: [
            { name: "Privacy Policy", to: "/privacy" },
            { name: "Terms of Service", to: "/terms" },
            { name: "Cookie Policy", to: "/cookies" },
            { name: "Refund Policy", to: "/refund" }
        ]
    };

    return (
        <footer className="relative bg-white dark:bg-slate-950 pt-24 pb-12 border-t border-slate-100 dark:border-slate-800/50 transition-colors duration-300 overflow-hidden">
            {/* Mesh Gradients */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 dark:opacity-20 transition-opacity">
                <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
                    {/* Brand & Newsletter Column */}
                    <div className="lg:col-span-5 space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <div className="space-y-6">
                            <Link to="/" className="flex items-center space-x-3 group">
                                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                    <Layers className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                                    AI Remover <span className="text-blue-600">PRO</span>
                                </span>
                            </Link>
                            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md">
                                {t.footerDesc || "Professional background removal for photographers, e-commerce, and creators. Studio quality results in seconds."}
                            </p>
                        </div>

                        {/* Newsletter Block */}
                        <div className="p-6 md:p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 backdrop-blur-xl relative overflow-hidden group/news w-full max-w-md mx-auto lg:mx-0">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/news:opacity-30 transition-opacity">
                                <Mail className="w-10 h-10 text-blue-600" />
                            </div>
                            <h4 className="text-lg font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight">Join the newsletter</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-6">Get tips, updates, and exclusive creator offers.</p>

                            <form onSubmit={handleSubscribe} className="relative flex items-center">
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-6 py-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-sm dark:text-white placeholder:text-slate-400"
                                />
                                <button
                                    type="submit"
                                    disabled={subscribed}
                                    className="absolute right-2 p-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                                >
                                    <AnimatePresence mode="wait">
                                        {subscribed ? (
                                            <motion.div key="success" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                            </motion.div>
                                        ) : (
                                            <motion.div key="arrow" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                                                <Send className="w-5 h-5" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </form>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {[
                                { icon: <Twitter className="w-5 h-5" />, href: "#", color: "hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" },
                                { icon: <Github className="w-5 h-5" />, href: "#", color: "hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800" },
                                { icon: <Mail className="w-5 h-5" />, href: "mailto:hello@airemover.pro", color: "hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 transition-all duration-300 shadow-sm ${social.color}`}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        {/* Tools Column */}
                        <div className="space-y-8">
                            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Tools</h4>
                            <ul className="space-y-5">
                                {footerLinks.tools.map((link, i) => (
                                    <li key={i}>
                                        <button
                                            disabled={!link.available}
                                            className={`group flex items-center gap-2 text-sm font-bold transition-all ${link.available
                                                ? 'text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400'
                                                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                                }`}
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors" />
                                            {link.name}
                                            {!link.available && <span className="text-[10px] font-black uppercase text-slate-300 dark:text-slate-700 ml-1">Soon</span>}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources Column */}
                        <div className="space-y-8">
                            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Resources</h4>
                            <ul className="space-y-5">
                                {footerLinks.resources.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            to={link.to || "#"}
                                            className={`group flex items-center gap-2 text-sm font-bold transition-all ${link.available
                                                ? 'text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400'
                                                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                                }`}
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal Column */}
                        <div className="space-y-8">
                            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Legal</h4>
                            <ul className="space-y-5">
                                {footerLinks.legal.map((link, i) => (
                                    <li key={i}>
                                        <Link to={link.to} className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-all">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-slate-100 dark:border-slate-800/80 flex flex-col lg:flex-row justify-between items-center gap-8">
                    {/* Copyright & Language */}
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p className="text-sm text-slate-400 dark:text-slate-500 font-bold tracking-tight text-center md:text-left">
                            © {new Date().getFullYear()} AI Remover PRO. All rights reserved.
                        </p>
                        <div className="hidden md:block h-4 w-px bg-slate-200 dark:bg-slate-800" />
                        <LanguageSelector />
                    </div>

                    {/* Stats & Made With */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-end gap-6 md:gap-8">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-full border border-slate-100 dark:border-slate-800/80 group">
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                Privacy First
                            </span>
                        </div>

                        <div className="flex items-center gap-2 group">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.operational || translations.en.common.operational}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-sm font-black text-slate-400 dark:text-slate-500">
                            <span>Made with</span>
                            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};