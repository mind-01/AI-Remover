import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Github, Twitter, Mail, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../lib/translations';
import { LanguageSelector } from '../LanguageSelector';

interface FooterProps {
}

export const Footer: React.FC<FooterProps> = () => {
    const { language } = useLanguage();
    const t = translations[language]?.common || translations.en.common;

    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10 dark:bg-slate-900 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2.5">
                            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
                                <Layers className="w-4 h-4 text-white" aria-label="AI Remover PRO logo" />
                            </div>
                            <span className="text-lg font-black text-slate-800 tracking-tight dark:text-white">
                                AI Remover <span className="text-blue-600 dark:text-blue-400">PRO</span>
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium dark:text-slate-400">
                            {t.footerDesc}
                        </p>
                        <div className="flex items-center space-x-4">
                            {/* ✅ FIXED: Added aria-label and proper href */}
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow us on Twitter"
                                className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all border border-slate-200 hover:border-blue-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-blue-400"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            {/* ✅ FIXED: Changed to # or your actual repo */}
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); alert('GitHub repository coming soon!') }}
                                aria-label="View our GitHub"
                                className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-all border border-slate-200 hover:border-slate-300 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            {/* ✅ FIXED: Added aria-label */}
                            <a
                                href="mailto:support@airemover.pro"
                                aria-label="Email us at support@airemover.pro"
                                className="p-2 bg-white rounded-lg text-slate-400 hover:text-red-500 transition-all border border-slate-200 hover:border-red-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-red-400"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Tools */}
                    <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 dark:text-white">{t.onlineTools}</h4>
                        <ul className="space-y-4">
                            {[
                                { name: t.bgRemover, available: true },
                                { name: t.pngMaker, available: false },
                                { name: t.objectEraser, available: false }
                            ].map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.available ? "#" : "#"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (!item.available) {
                                                alert(`${item.name} - Coming soon!`);
                                            }
                                        }}
                                        aria-label={item.name}
                                        className="text-sm text-slate-500 hover:text-blue-600 font-bold transition-colors flex items-center gap-2 group cursor-pointer dark:text-slate-400 dark:hover:text-blue-400"
                                    >
                                        <div className="w-1 h-1 bg-slate-300 rounded-full group-hover:bg-blue-600 transition-colors dark:bg-slate-600 dark:group-hover:bg-blue-400" />
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 dark:text-white">{t.resources}</h4>
                        <ul className="space-y-4">
                            {[
                                { name: t.apiDoc, to: "/api-docs", available: true },
                                { name: t.devTools, href: "#", available: false },
                                { name: t.blog, to: "/blog", available: true }
                            ].map((item) => (
                                <li key={item.name}>
                                    {item.to ? (
                                        <Link
                                            to={item.to}
                                            className="text-sm text-slate-500 hover:text-blue-600 font-bold transition-colors flex items-center gap-2 group dark:text-slate-400 dark:hover:text-blue-400"
                                        >
                                            <div className="w-1 h-1 bg-slate-300 rounded-full group-hover:bg-blue-600 transition-colors dark:bg-slate-600 dark:group-hover:bg-blue-400" />
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <a
                                            href={item.href}
                                            onClick={!item.available ? (e) => { e.preventDefault(); alert(`${item.name} - Coming soon!`) } : undefined}
                                            aria-label={item.name}
                                            className="text-sm text-slate-500 hover:text-blue-600 font-bold transition-colors flex items-center gap-2 group dark:text-slate-400 dark:hover:text-blue-400"
                                        >
                                            <div className="w-1 h-1 bg-slate-300 rounded-full group-hover:bg-blue-600 transition-colors dark:bg-slate-600 dark:group-hover:bg-blue-400" />
                                            {item.name}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support & Legal */}
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 dark:text-white">Support</h3>
                        <ul className="space-y-4">
                            <li><Link to="/help" className="text-slate-600 hover:text-blue-600 font-medium transition-colors dark:text-slate-400 dark:hover:text-blue-400">Help & FAQs</Link></li>
                            <li><Link to="/contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors dark:text-slate-400 dark:hover:text-blue-400">Contact us</Link></li>
                            <li><Link to="/refund" className="text-slate-600 hover:text-blue-600 font-medium transition-colors dark:text-slate-400 dark:hover:text-blue-400">Refunds</Link></li>
                            <li><Link to="/status" className="text-slate-600 hover:text-blue-600 font-medium transition-colors dark:text-slate-400 dark:hover:text-blue-400">Platform Status</Link></li>
                            <li><Link to="/resources" className="text-slate-600 hover:text-blue-600 font-medium transition-colors dark:text-slate-400 dark:hover:text-blue-400">Resources</Link></li>
                            <li><Link to="/privacy" className="text-slate-600 hover:text-blue-600 font-medium transition-colors dark:text-slate-400 dark:hover:text-blue-400">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-slate-600 hover:text-blue-600 font-medium transition-colors dark:text-slate-400 dark:hover:text-blue-400">Terms of Service</Link></li>
                            <li><a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors dark:text-slate-400 dark:hover:text-blue-400">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <p className="text-[13px] text-slate-400 font-bold tracking-tight dark:text-slate-500">
                            © {new Date().getFullYear()} {t.allRightsReserved}
                        </p>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-900/30">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Real-time AI Engine Active</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                        <LanguageSelector />

                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                            {t.operational}
                        </span>
                        <div className="flex items-center gap-2 text-[13px] text-slate-400 font-bold dark:text-slate-500">
                            {t.madeWith} <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-label="sparkles" /> {t.forCreators}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};