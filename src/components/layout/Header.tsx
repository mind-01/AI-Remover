import React from 'react';
import { Layers, Github, ImageIcon, Eraser, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeaderProps {
    currentView?: 'remover' | 'enhancer';
    onViewChange?: (view: 'remover' | 'enhancer') => void;
}

export const Header: React.FC<HeaderProps> = ({
    currentView = 'remover',
    onViewChange
}) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div
                        className="flex items-center space-x-2.5 cursor-pointer group"
                        onClick={() => onViewChange?.('remover')}
                    >
                        <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-all duration-300">
                            {currentView === 'enhancer' ? (
                                <Sparkles className="w-5 h-5 text-white" />
                            ) : (
                                <Layers className="w-5 h-5 text-white" />
                            )}
                        </div>
                        <span className="text-xl font-black text-slate-800 tracking-tight">
                            AI {currentView === 'enhancer' ? 'Enhancer' : 'Remover'} <span className="text-blue-600">PRO</span>
                        </span>
                    </div>

                    <div className="flex items-center space-x-4 md:space-x-8">

                        {/* Navigation Links (Desktop) */}
                        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
                            <button
                                onClick={() => onViewChange?.('remover')}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                                    currentView === 'remover' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                <Eraser className="w-4 h-4" />
                                Remover
                            </button>
                            <button
                                onClick={() => onViewChange?.('enhancer')}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                                    currentView === 'enhancer' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                <ImageIcon className="w-4 h-4" />
                                Enhancer
                            </button>
                        </div>



                        <div className="hidden lg:flex items-center space-x-6 text-sm font-bold tracking-tight">
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
