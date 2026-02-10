import React from 'react';
import { Layers, Github } from 'lucide-react';

interface HeaderProps {
}

export const Header: React.FC<HeaderProps> = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div
                        className="flex items-center space-x-2.5 cursor-pointer group"
                    >
                        <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-all duration-300">
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black text-slate-800 tracking-tight">
                            AI Remover <span className="text-blue-600">PRO</span>
                        </span>
                    </div>

                    <div className="flex items-center space-x-4 md:space-x-8">

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
