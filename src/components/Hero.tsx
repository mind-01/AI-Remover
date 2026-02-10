import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface HeroProps {
    onFilesSelect: (files: File[]) => void;
}

export const Hero: React.FC<HeroProps> = ({ onFilesSelect }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFilesSelect(acceptedFiles);
        }
    }, [onFilesSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/webp': ['.webp']
        },
        maxFiles: 20
    });

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
            <div className="text-center mb-6 max-w-3xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1f2e] mb-2 tracking-tight">
                        Remove & Enhance Backgrounds
                    </h1>

                    <div className="text-blue-600 font-black text-xs md:text-sm uppercase tracking-widest mb-4 bg-blue-50/50 px-4 py-1.5 rounded-full inline-block border border-blue-100 shadow-sm">
                        ✨ 100% Automatically and Free
                    </div>

                    <p className="text-base text-slate-500 mb-6 max-w-2xl mx-auto leading-relaxed">
                        Lightly enhanced detail reconstruction for crisp results
                    </p>

                </motion.div>
            </div>


            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full max-w-xl"
            >
                <div
                    {...getRootProps()}
                    className={cn(
                        "relative group cursor-pointer",
                        "bg-white/50 backdrop-blur-xl",
                        "border-2 border-dashed rounded-3xl p-12",
                        "transition-all duration-300 ease-out",
                        isDragActive
                            ? "border-indigo-500 bg-indigo-50/50 scale-102 shadow-2xl shadow-indigo-500/10"
                            : "border-slate-300 hover:border-indigo-400 hover:bg-white/80 hover:shadow-xl"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className={cn(
                            "p-4 rounded-2xl bg-indigo-50 text-indigo-600 transition-transform duration-300",
                            "group-hover:scale-110 group-hover:rotate-3"
                        )}>
                            <Upload className="w-10 h-10" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xl font-semibold text-slate-900">
                                {isDragActive ? "Drop image here" : "Upload an Image"}
                            </p>
                            <p className="text-sm text-slate-500">
                                Drag and drop or click to browse
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                <ImageIcon className="w-3 h-3 text-slate-400" /> JPG, PNG, WEBP (Max 15MB)
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-30 pointer-events-none">
                <div className="w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
            </div>
        </div>
    );
};
