import React from 'react';
import { Layers, Github, Sparkles, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeaderProps {
    isQualityBoost: boolean;
    onQualityBoostToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isQualityBoost, onQualityBoostToggle }) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2.5 cursor-pointer group">
                        <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-all duration-300">
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black text-slate-800 tracking-tight">
                            AI Remover <span className="text-blue-600">PRO</span>
                        </span>
                    </div>

                    <div className="flex items-center space-x-8">
                        {/* Stock-Safe Mode (Redesigned for Premium Look) */}
                        <div
                            className={cn(
                                "flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl transition-all duration-500 border relative group/toggle select-none",
                                isQualityBoost
                                    ? "bg-blue-50/50 border-blue-100 shadow-[0_0_20px_rgba(37,99,235,0.05)]"
                                    : "bg-slate-50/50 border-slate-200"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-1.5 rounded-lg transition-colors duration-300",
                                    isQualityBoost ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"
                                )}>
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className={cn(
                                        "text-[10px] sm:text-[11px] font-black uppercase tracking-wider leading-none mb-0.5",
                                        isQualityBoost ? "text-blue-700" : "text-slate-500"
                                    )}>
                                        AI Quality Booster
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap hidden sm:inline">
                                        {isQualityBoost ? 'Enhanced HD Refinement' : 'Standard Processing'}
                                    </span>
                                </div>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer ml-2">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isQualityBoost}
                                    onChange={onQualityBoostToggle}
                                />
                                <div className={cn(
                                    "w-11 h-6 bg-slate-200 rounded-full peer transition-all duration-300",
                                    "peer-checked:bg-blue-600",
                                    "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm",
                                    "peer-checked:after:translate-x-5",
                                    "shadow-inner"
                                )}></div>
                            </label>

                            {/* Info Tooltip */}
                            <div className="absolute top-full right-0 mt-3 opacity-0 group-hover/toggle:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover/toggle:translate-y-0">
                                <div className="bg-slate-900 text-white text-[11px] py-2 px-3 rounded-xl shadow-2xl border border-white/10 whitespace-nowrap flex items-center gap-2">
                                    <Info className="w-3.5 h-3.5 text-blue-400" />
                                    {isQualityBoost ? "Superior edge clarity and detail restoration" : "Fast background removal without enhancement"}
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center space-x-6 text-sm font-bold tracking-tight">
                            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">How it works</a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-slate-100">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
