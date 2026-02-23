import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Trash2, Clock, Image as ImageIcon, ExternalLink, User, Settings, Database, Sparkles, LogOut, Check, Globe, X, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { translations } from '../lib/translations';

interface DashboardProps {
    onClose: () => void;
    initialView?: 'history' | 'profile' | 'settings';
}

export const Dashboard: React.FC<DashboardProps> = ({ onClose, initialView = 'history' }) => {
    const { user, history, loading, deleteHistoryItem, deleteAllHistory, signOut, updateProfile } = useAuth();
    const { language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<'history' | 'profile' | 'settings'>(initialView);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const t = translations[language]?.dashboard || translations.en.dashboard;

    // Sync fullName when user metadata changes
    React.useEffect(() => {
        if (user?.user_metadata?.full_name) {
            setFullName(user.user_metadata.full_name);
        }
    }, [user?.user_metadata?.full_name]);

    const handleDownload = async (url: string, id: string) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `cleancut-${id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClearAll = async () => {
        if (window.confirm(t.clearConfirm || 'Are you sure you want to clear all history?')) {
            await deleteAllHistory();
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage(null);
        try {
            await updateProfile({ full_name: fullName });
            setMessage({ type: 'success', text: t.updateSuccess || 'Profile updated successfully!' });
            setTimeout(() => {
                setIsEditingProfile(false);
                setMessage(null);
            }, 2000);
        } catch (err) {
            setMessage({ type: 'error', text: t.updateError || 'Failed to update profile.' });
        } finally {
            setIsUpdating(false);
        }
    };

    const tabs = [
        { id: 'history', label: t.title || 'History', icon: Clock },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
    ] as const;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onClose}
                        className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-95 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:hover:text-white dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2 dark:text-white">
                            {activeTab === 'profile' ? 'My Profile' : activeTab === 'settings' ? 'Account Settings' : t.title}
                        </h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 dark:text-slate-400">
                            {activeTab === 'history' ? (
                                <><Clock className="w-3 h-3" /> {history.length} {t.cutouts}</>
                            ) : activeTab === 'profile' ? (
                                <><ImageIcon className="w-3 h-3" /> User Member Since 2024</>
                            ) : (
                                <><Database className="w-3 h-3" /> Manage your preferences</>
                            )}
                        </p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-[1.5rem] self-start md:self-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-md dark:bg-slate-700 dark:text-white'
                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {activeTab === 'history' && history.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95 border border-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                        <Trash2 className="w-4 h-4" />
                        {t.clearAll || 'All Clear'}
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'history' ? (
                        <>
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                                    <div className="w-12 h-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.loading}</span>
                                </div>
                            ) : history.length === 0 ? (
                                <div className="bg-white rounded-[3rem] border border-slate-100 p-24 text-center dark:bg-slate-900 dark:border-slate-800">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-slate-800">
                                        <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2 dark:text-white">{t.emptyTitle}</h2>
                                    <p className="text-slate-500 font-medium max-w-xs mx-auto text-sm dark:text-slate-400">{t.emptyDesc}</p>
                                    <button
                                        onClick={onClose}
                                        className="mt-8 px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 dark:shadow-none"
                                    >
                                        {t.startEditing}
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {history.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 dark:bg-slate-900 dark:border-slate-800 dark:hover:shadow-black/20"
                                        >
                                            <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden dark:bg-slate-800">
                                                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                                <img
                                                    src={item.processed_url}
                                                    className="w-full h-full object-contain relative z-10 p-6 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                                                    alt="Process Result"
                                                />
                                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                    <button
                                                        onClick={() => handleDownload(item.processed_url, item.id)}
                                                        className="p-2.5 bg-white border border-slate-100 rounded-xl text-blue-600 shadow-xl hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full dark:bg-slate-800 dark:text-slate-500">
                                                        {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                    <button
                                                        onClick={() => deleteHistoryItem(item.id)}
                                                        className="text-slate-300 hover:text-red-500 transition-all active:scale-90 dark:text-slate-600 dark:hover:text-red-400"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => window.open(item.processed_url, '_blank')}
                                                        className="flex-grow py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" /> {t.viewFull}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : activeTab === 'profile' ? (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-blue-900/5 transition-all">
                                <div className="flex flex-col md:flex-row items-center gap-12">
                                    <div className="relative group">
                                        <div className="w-40 h-40 rounded-full bg-blue-600 flex items-center justify-center text-white text-6xl font-black shadow-2xl ring-8 ring-blue-50 dark:ring-blue-900/20 group-hover:scale-105 transition-all duration-500 uppercase">
                                            {user?.email?.[0] || 'U'}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-50 dark:border-slate-700">
                                            <Sparkles className="w-6 h-6 text-amber-500" />
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-6 text-center md:text-left min-h-[300px] flex flex-col justify-center">
                                        <AnimatePresence mode="wait">
                                            {!isEditingProfile ? (
                                                <motion.div
                                                    key="profile-view"
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="space-y-6"
                                                >
                                                    <div>
                                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                                                            {user?.user_metadata?.full_name || t.memberAccount}
                                                        </h2>
                                                        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">{user?.email}</p>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100/50 dark:border-slate-700/50">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Cutouts</p>
                                                            <p className="text-3xl font-black text-slate-900 dark:text-white">{history.length}</p>
                                                        </div>
                                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100/50 dark:border-slate-700/50">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Account Status</p>
                                                            <p className="text-lg font-black text-green-600 dark:text-green-400 uppercase tracking-tight">Active Pro</p>
                                                        </div>
                                                    </div>

                                                    <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                                                        <button
                                                            onClick={() => setIsEditingProfile(true)}
                                                            className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-slate-200 dark:shadow-none hover:bg-slate-800 transition-all active:scale-95"
                                                        >
                                                            {t.editProfile}
                                                        </button>
                                                        <button onClick={() => signOut()} className="px-8 py-3 bg-red-50 text-red-600 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95 flex items-center gap-2">
                                                            <LogOut className="w-4 h-4" /> Sign Out
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.form
                                                    key="profile-edit"
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                    onSubmit={handleUpdateProfile}
                                                    className="space-y-6"
                                                >
                                                    <div>
                                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">{t.editProfile}</h2>

                                                        <div className="space-y-4">
                                                            <div className="relative group/field">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">{t.displayName}</label>
                                                                <input
                                                                    type="text"
                                                                    value={fullName}
                                                                    onChange={(e) => setFullName(e.target.value)}
                                                                    placeholder="Enter your name"
                                                                    disabled={isUpdating}
                                                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 outline-none rounded-2xl font-bold text-slate-700 dark:text-white transition-all"
                                                                />
                                                            </div>
                                                            <div className="relative group/field opacity-50 cursor-not-allowed">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">{t.emailLabel}</label>
                                                                <input
                                                                    type="email"
                                                                    value={user?.email || ''}
                                                                    disabled
                                                                    className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-900 border-2 border-transparent rounded-2xl font-bold text-slate-400 dark:text-slate-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {message && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className={`p-4 rounded-xl font-bold text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                                                                }`}
                                                        >
                                                            {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                            {message.text}
                                                        </motion.div>
                                                    )}

                                                    <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                                                        <button
                                                            type="submit"
                                                            disabled={isUpdating}
                                                            className="px-8 py-3.5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isUpdating ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                                                            {t.saveChanges}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => { setIsEditingProfile(false); setFullName(user?.user_metadata?.full_name || ''); setMessage(null); }}
                                                            disabled={isUpdating}
                                                            className="px-8 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 flex items-center gap-2"
                                                        >
                                                            <X className="w-4 h-4" /> {t.cancel}
                                                        </button>
                                                    </div>
                                                </motion.form>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-8">
                            {/* Theme Settings */}
                            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-900/5">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl">
                                            <Database className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Appearance</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customize how the app looks</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleTheme}
                                        className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                    >
                                        Theme: {theme === 'dark' ? 'Dark' : 'Light'}
                                    </button>
                                </div>
                                <div className="h-px bg-slate-50 dark:bg-slate-800 mb-8" />

                                {/* Language Settings */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                                            <Globe className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Language</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Change application language</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {(['en', 'hi', 'ur'] as const).map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => setLanguage(lang)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${language === lang
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                                                    : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700'
                                                    }`}
                                            >
                                                {lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Urdu'}
                                                {language === lang && <Check className="w-3 h-3 inline ml-1" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Data Control */}
                            <div className="bg-red-50/50 dark:bg-red-900/10 rounded-[3rem] p-10 border border-red-100 dark:border-red-900/30">
                                <h3 className="text-lg font-black text-red-900 dark:text-red-400 uppercase tracking-tight mb-4">Danger Zone</h3>
                                <p className="text-red-600/60 dark:text-red-400/60 font-bold mb-8 text-sm">Once you clear your history, it cannot be undone. Please be careful.</p>
                                <button onClick={handleClearAll} className="px-8 py-3 bg-red-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-red-200 dark:shadow-none hover:bg-red-700 transition-all active:scale-95">Clear All Data</button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
