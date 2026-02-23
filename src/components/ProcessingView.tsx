import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Star } from 'lucide-react';

interface ProcessingViewProps {
    imageUrl?: string;
    current?: number;
    total?: number;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ imageUrl, current, total }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] p-4 md:p-8 max-w-4xl mx-auto relative overflow-hidden">
            {/* Deep Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none animate-pulse" />

            {/* Magic Aura - Central Animation */}
            <div className="relative w-80 h-80 flex items-center justify-center">

                {/* Layered Pulsing Auras */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            scale: [1, 1.2 + i * 0.1, 1],
                            opacity: [0.3 - i * 0.1, 0.6 - i * 0.1, 0.3 - i * 0.1],
                            rotate: i % 2 === 0 ? 360 : -360
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 border border-blue-500/10 rounded-full blur-[2px]"
                        style={{
                            background: `radial-gradient(circle, rgba(59, 130, 246, ${0.05 - i * 0.01}) 0%, transparent 70%)`
                        }}
                    />
                ))}

                {/* Central Ethereal Core / Image Preview */}
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                        filter: ["blur(40px) brightness(1.2)", "blur(60px) brightness(1.5)", "blur(40px) brightness(1.2)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-40 h-40 bg-gradient-to-tr from-blue-600/30 via-indigo-500/30 to-cyan-400/30 rounded-full flex items-center justify-center relative overflow-hidden"
                >
                    {imageUrl && (
                        <motion.img
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 0.25, scale: 1 }}
                            src={imageUrl}
                            className="w-full h-full object-cover filter blur-[2px] contrast-125 saturate-150"
                        />
                    )}
                </motion.div>

                {/* Orbiting Magic Particles - Higher Density */}
                {[...Array(20)].map((_, i) => {
                    const Icon = i % 3 === 0 ? Sparkles : i % 3 === 1 ? Zap : Star;
                    return (
                        <motion.div
                            key={i}
                            animate={{
                                rotate: 360,
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 2 + Math.random() * 1.5,
                                delay: i * 0.2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute"
                            style={{
                                width: '100%',
                                height: '100%',
                                transformOrigin: 'center center'
                            }}
                        >
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2"
                                style={{
                                    transform: `translateY(${5 + Math.random() * 60}px) rotate(${Math.random() * 360}deg)`
                                }}
                            >
                                <Icon className="w-4 h-4 text-blue-400/80 fill-current drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                            </div>
                        </motion.div>
                    );
                })}

                {/* Inner Glowing Rings */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-16 border-[1px] border-dashed border-blue-500/20 rounded-full"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-24 border-[1px] border-dotted border-indigo-500/20 rounded-full"
                />
            </div>

            {/* Tiny File Info - Minimalist */}
            {(total && total > 1) ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.5em] text-[10px] flex items-center gap-4"
                >
                    <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800" />
                    MAGIC IN PROGRESS • {current} / {total}
                    <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800" />
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-12 text-blue-600/40 dark:text-blue-400/20 font-bold uppercase tracking-[0.6em] text-[9px] italic"
                >
                    AI Performance
                </motion.div>
            )}
        </div>
    );
};
