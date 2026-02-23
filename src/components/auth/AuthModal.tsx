import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../lib/translations';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const { language } = useLanguage();
    const t = translations[language]?.auth || translations.en.auth;

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!supabase) {
            setError("Supabase is not initialized. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file and restart the dev server.");
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onClose();
            } else {
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;

                // If session is present, it means email confirmation is disabled in Supabase
                if (data.session) {
                    onClose();
                } else {
                    setMessage(t.verificationSent || 'Check your email for the confirmation link!');
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!supabase) {
            setError("Supabase is not initialized. Please check your .env configuration.");
            return;
        }

        setError(null);
        setMessage(null);

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] overflow-y-auto outline-none focus:outline-none">
                    <div className="flex min-h-full items-start justify-center p-4 py-12 sm:items-center sm:py-20">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 transform transition-all dark:bg-slate-900 dark:border-slate-800"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all dark:hover:text-white dark:hover:bg-slate-800"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-8 sm:p-10">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight dark:text-white">
                                        {isLogin ? t.welcome : t.createAccount}
                                    </h2>
                                    <p className="text-slate-500 text-sm font-medium dark:text-slate-400">
                                        {isLogin ? t.loginDesc : t.signupDesc}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.emailLabel}</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
                                                placeholder="name@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.passwordLabel}</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 italic dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                            {error}
                                        </div>
                                    )}

                                    {message && (
                                        <div className="p-4 bg-blue-50 text-blue-600 text-xs font-bold rounded-2xl border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">
                                            {message}
                                        </div>
                                    )}

                                    <button
                                        disabled={loading}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 dark:shadow-none"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                            <>
                                                {isLogin ? t.signInBtn : t.signUpBtn} <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
                                    <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400">
                                        <span className="bg-white px-4 dark:bg-slate-900">{t.continueWith}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" />
                                    </svg>
                                    {t.googleBtn}
                                </button>

                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                                    >
                                        {isLogin ? t.noAccount : t.haveAccount}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};
