import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ProcessingViewProps {
    progress?: number;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ progress }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            <div className="relative">
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-indigo-600">
                    {progress ? `${Math.round(progress)}%` : ''}
                </div>
            </div>

            <div className="mt-8 text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">AI is Processing...</h2>
                <p className="text-slate-500 max-w-sm mx-auto">
                    We're removing the background and refining every edge for a professional result.
                </p>
            </div>

            {progress !== undefined && (
                <div className="w-full max-w-md mt-10 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-right from-indigo-500 to-blue-500 shadow-lg shadow-indigo-100"
                    />
                </div>
            )}
        </div>
    );
};
