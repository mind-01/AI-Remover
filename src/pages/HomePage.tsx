import { useState, useCallback, useRef, useEffect } from 'react';
import { ShieldCheck, Users, Folder } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';
import { AnimatePresence, motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Hero } from '../components/Hero';
import { ProcessingView } from '../components/ProcessingView';
import { ResultViewer } from '../components/ResultViewer';
import { FeaturesSection } from '../components/FeaturesSection';
import { Footer } from '../components/layout/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../components/Dashboard';
import { APISection } from '../components/APISection';
import { ComparisonSection } from '../components/ComparisonSection';

interface ProcessingTask {
    id: string;
    file: File;
    originalUrl: string;
    processedUrl: string | null;
    status: 'pending' | 'processing' | 'completed' | 'error';
    progress: number;
}

export function HomePage() {
    const { language } = useLanguage();
    const [tasks, setTasks] = useState<ProcessingTask[]>([]);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showDashboard, setShowDashboard] = useState(false);
    const [dashboardView, setDashboardView] = useState<'history' | 'profile' | 'settings'>('history');
    const location = useLocation();
    const addMoreInputRef = useRef<HTMLInputElement>(null);
    const { user, addToHistory, uploadImage } = useAuth();

    useEffect(() => {
        if (location.state?.showDashboard) {
            setShowDashboard(true);
            if (location.state.dashboardView) {
                setDashboardView(location.state.dashboardView);
            }
        }
    }, [location]);

    const refineImage = useCallback((blob: Blob): Promise<Blob> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const width = img.width;
                const height = img.height;
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;
                const outData = new Uint8ClampedArray(data);

                const strength = 0.8;
                const threshold = 10;
                const edgeThreshold = 220;
                const ghostThreshold = 70;

                for (let i = 0; i < data.length; i += 4) {
                    const alpha = data[i + 3];
                    if (alpha > threshold && alpha < edgeThreshold) {
                        outData[i + 3] = Math.max(0, alpha * strength);
                    } else if (alpha < ghostThreshold) {
                        outData[i + 3] = 0;
                    }
                }

                ctx.putImageData(new ImageData(outData, width, height), 0, 0);

                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
                const tCtx = tempCanvas.getContext('2d')!;
                tCtx.filter = 'blur(0.5px)';
                tCtx.drawImage(canvas, 0, 0);

                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(tempCanvas, 0, 0);

                canvas.toBlob((refined) => resolve(refined || blob), 'image/png');
            };
            img.src = URL.createObjectURL(blob);
        });
    }, []);

    const processFile = useCallback(async (task: ProcessingTask) => {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'processing', progress: 0 } : t));

        try {
            const blob = await removeBackground(task.file, {
                progress: (_key: string, current: number, total: number) => {
                    const progress = Math.round((current / total) * 100);
                    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, progress } : t));
                },
            });

            const refinedBlob = await refineImage(blob);
            const resultUrl = URL.createObjectURL(refinedBlob);

            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, processedUrl: resultUrl, status: 'completed', progress: 100 } : t));
            setActiveTaskId(prev => prev || task.id);

            // Save to Supabase history if user is logged in
            if (user) {
                try {
                    // Upload both original and processed images to Supabase Storage
                    const [origUrl, procUrl] = await Promise.all([
                        uploadImage(task.file, 'original.png'),
                        uploadImage(refinedBlob, 'processed.png')
                    ]);

                    if (origUrl && procUrl) {
                        await addToHistory({
                            original_url: origUrl,
                            processed_url: procUrl,
                            task_config: {},
                        });
                    }
                } catch (authErr) {
                    console.error('Failed to save to Supabase history:', authErr);
                }
            }
        } catch (err) {
            console.error(err);
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'error' } : t));
            const t = translations[language]?.common || translations.en.common;
            setError(t.processingError);
        }
    }, [refineImage, language, user, uploadImage, addToHistory]);

    const handleFilesSelect = async (selectedFiles: File[]) => {
        const newTasks: ProcessingTask[] = selectedFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            originalUrl: URL.createObjectURL(file),
            processedUrl: null,
            status: 'pending',
            progress: 0
        }));

        setTasks(prev => [...prev, ...newTasks]);
        setError(null);

        // Process each new task
        for (const task of newTasks) {
            processFile(task);
        }
    };

    const handleReset = () => {
        tasks.forEach(task => {
            if (task.originalUrl) URL.revokeObjectURL(task.originalUrl);
            if (task.processedUrl) URL.revokeObjectURL(task.processedUrl);
        });
        setTasks([]);
        setActiveTaskId(null);
        setError(null);
    };

    const handleAddMore = () => {
        addMoreInputRef.current?.click();
    };


    const [activeTask, setActiveTask] = useState<ProcessingTask | undefined>(undefined);
    const isAnyProcessing = tasks.some(t => t.status === 'processing' || t.status === 'pending');

    // Sync active task from activeTaskId
    if (activeTaskId && !activeTask) {
        const task = tasks.find(t => t.id === activeTaskId);
        if (task) setActiveTask(task);
    } else if (!activeTaskId && activeTask) {
        setActiveTask(undefined);
    }

    // Update effect to keep activeTask in sync when tasks change
    if (activeTaskId && activeTask) {
        const updatedTask = tasks.find(t => t.id === activeTaskId);
        if (updatedTask && updatedTask !== activeTask) {
            setActiveTask(updatedTask);
        }
    }

    return (
        <div className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300 gradient-bg">
            <Header
                setShowDashboard={(show, view) => {
                    setShowDashboard(show);
                    if (view) setDashboardView(view);
                }}
            />

            <main className="pt-20">
                <AnimatePresence mode="wait">
                    {showDashboard ? (
                        <motion.div key="dashboard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <Dashboard
                                onClose={() => setShowDashboard(false)}
                                initialView={dashboardView}
                            />
                        </motion.div>
                    ) : (
                        <>
                            {tasks.length === 0 ? (
                                <motion.div key="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                                    <Hero onFilesSelect={handleFilesSelect} />
                                    <FeaturesSection />

                                    {/* Trust & Stats Section */}
                                    <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center group">
                                                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                                        <Folder className="w-8 h-8" />
                                                    </div>
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Sync Your History</h3>
                                                    <p className="text-slate-500 dark:text-slate-400 font-bold">Login to keep your processed images safe.</p>
                                                </div>

                                                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center group">
                                                    <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl text-green-600 dark:text-green-400 mb-6 group-hover:scale-110 transition-transform">
                                                        <ShieldCheck className="w-8 h-8" />
                                                    </div>
                                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2">100%</h3>
                                                    <p className="text-slate-500 dark:text-slate-400 font-bold">Private & Local Processing</p>
                                                </div>

                                                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center group">
                                                    <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                                                        <Users className="w-8 h-8" />
                                                    </div>
                                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2">3.2s</h3>
                                                    <p className="text-slate-500 dark:text-slate-400 font-bold">Avg. Processing Time</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <ComparisonSection />
                                    <APISection />
                                </motion.div>

                            ) : isAnyProcessing && !activeTask?.processedUrl ? (
                                <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
                                    <ProcessingView
                                        imageUrl={activeTask?.originalUrl || (tasks.length > 0 ? tasks[0].originalUrl : undefined)}
                                        current={tasks.filter(t => t.status === 'completed').length + 1}
                                        total={tasks.length}
                                    />
                                </motion.div>
                            ) : activeTask && activeTask.processedUrl ? (
                                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <ResultViewer
                                        originalUrl={activeTask.originalUrl}
                                        processedUrl={activeTask.processedUrl}
                                        onReset={handleReset}
                                        onAddMore={handleAddMore}
                                        taskList={tasks}
                                        activeTaskId={activeTaskId || ""}
                                        onSelectTask={setActiveTaskId}
                                    />
                                </motion.div>
                            ) : null}
                        </>
                    )}
                </AnimatePresence>

                <input
                    type="file"
                    ref={addMoreInputRef}
                    onChange={(e) => {
                        if (e.target.files) {
                            const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
                            if (files.length > 0) handleFilesSelect(files);
                        }
                        // Reset input so same file can be selected again
                        e.target.value = '';
                    }}
                    className="hidden"
                    accept="image/*"
                    multiple
                />

                {error && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-[100]">
                        <span>⚠️</span> {error}
                    </div>
                )}
            </main>

            <Footer />
            <Analytics />
            <SpeedInsights />
        </div>
    );
}
