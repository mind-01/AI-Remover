import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Loader2, Sun, Moon, LogOut, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../lib/translations';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthModal } from '../auth/AuthModal';

export const Header: React.FC<{ setShowDashboard: (show: boolean, view?: 'history' | 'profile' | 'settings') => void }> = ({ setShowDashboard }) => {
    const { language } = useLanguage();
    const { user, signOut, loading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
    const t = translations[language]?.common || translations.en.common;

    console.log('Header: Rendered. User:', user ? user.email : 'NULL');

    // Custom "Dot and Dash" Menu Icon
    const MenuIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-800 dark:text-white">
            <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor" />
            <circle cx="5" cy="18" r="1" fill="currentColor" />
            <rect x="8" y="17" width="12" height="2" rx="1" fill="currentColor" />
        </svg>
    );

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl dark:bg-slate-900/80 dark:border-white/10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2.5 cursor-pointer group" onClick={() => setShowDashboard(false)}>
                        <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-all duration-300">
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black text-slate-800 tracking-tight dark:text-white transition-colors">
                            AI Remover <span className="text-blue-600">PRO</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-10">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <Link to="/" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wider dark:text-slate-300 dark:hover:text-blue-400">{t.tools}</Link>

                        {loading ? (
                            <div className="flex items-center gap-2 text-slate-400">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Checking...</span>
                            </div>
                        ) : user ? (
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setShowDashboard(true)}
                                    className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wider dark:text-slate-300 dark:hover:text-blue-400"
                                >
                                    {t.dashboard || 'Dashboard'}
                                </button>

                                <div
                                    className="relative"
                                    onMouseEnter={() => setIsUserDropdownOpen(true)}
                                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-100 uppercase ring-2 ring-white dark:ring-slate-800 cursor-pointer hover:scale-105 transition-transform">
                                        {user.email?.[0] || 'U'}
                                    </div>

                                    <AnimatePresence>
                                        {isUserDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-[60]"
                                            >
                                                <div className="px-5 py-4 border-b border-slate-50 dark:border-slate-800 mb-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Signed in as</p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                                                </div>

                                                <div className="space-y-1">
                                                    <button
                                                        onClick={() => { setShowDashboard(true, 'profile'); setIsUserDropdownOpen(false); }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                                                    >
                                                        <User className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
                                                        <span>My Profile</span>
                                                    </button>
                                                    <button
                                                        onClick={() => { setShowDashboard(true, 'settings'); setIsUserDropdownOpen(false); }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                                                    >
                                                        <Settings className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
                                                        <span>Account Settings</span>
                                                    </button>
                                                    <div className="h-px bg-slate-50 dark:bg-slate-800 my-1" />
                                                    <button
                                                        onClick={() => { signOut(); setIsUserDropdownOpen(false); }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors group"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        <span>Log Out</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wider dark:text-slate-300 dark:hover:text-blue-400">
                                {t.login || 'Login'}
                            </button>
                        )}

                        <Link to="/pricing" className="px-6 py-2.5 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:scale-105 active:scale-95 uppercase tracking-wide dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:shadow-none">
                            {t.getPro}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <MenuIcon />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Slide-out Drawer - Portaled to Root for Z-Index Fix */}
            {isMobileMenuOpen && (
                <MobileMenu
                    user={user}
                    t={t}
                    signOut={signOut}
                    onClose={() => setIsMobileMenuOpen(false)}
                    setShowDashboard={setShowDashboard}
                    setIsAuthModalOpen={setIsAuthModalOpen}
                    theme={theme}
                />
            )}

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </nav>
    );
};

// Extracted Mobile Menu Component for Portal Usage
const MobileMenu: React.FC<any> = ({ user, t, signOut, onClose, setShowDashboard, setIsAuthModalOpen, theme }) => {
    // Prevent background scrolling when menu is open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
            // Force re-enable scrolling on unmount to prevent lock-in
            document.body.style.overflowY = 'auto';
        };
    }, []);

    const menuContent = (
        <div className="fixed inset-0 z-[9999] flex justify-end md:hidden font-sans">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className="relative w-[280px] h-full shadow-2xl p-6 flex flex-col gap-6 transition-transform duration-300 transform border-l border-slate-100 dark:border-slate-800 overflow-y-auto"
                style={{ backgroundColor: theme === 'dark' ? '#020617' : '#ffffff' }}
            >
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-black text-slate-800 dark:text-white font-sans">Menu</span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {user ? (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm uppercase font-sans">
                                {user.email?.[0] || 'U'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px] font-sans">{user.email}</span>
                                <button onClick={signOut} className="text-xs text-red-500 font-bold text-left font-sans">Sign Out</button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setIsAuthModalOpen(true); onClose(); }}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 font-sans"
                        >
                            {t.login || 'Login / Sign Up'}
                        </button>
                    )}

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

                    <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold font-sans">
                        <span>{t.tools}</span>
                        <Layers className="w-4 h-4 opacity-50" />
                    </a>
                    <Link to="/pricing" onClick={onClose} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold font-sans">
                        <span>{t.pricing}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-sans">Save 20%</span>
                    </Link>
                    {user && (
                        <button
                            onClick={() => { setShowDashboard(true); onClose(); }}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold w-full text-left font-sans"
                        >
                            <span>{t.dashboard || 'Dashboard'}</span>
                        </button>
                    )}
                </div>

                <div className="mt-auto">
                    <Link to="/pricing" onClick={onClose} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black uppercase tracking-wide font-sans text-center block">
                        {t.getPro}
                    </Link>
                </div>
            </div>
        </div>
    );

    return createPortal(menuContent, document.body);
};
