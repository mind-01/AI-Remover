import { useState, useCallback } from 'react';
import Upscaler from 'upscaler';
import { Download, Sparkles, Loader2, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "../lib/utils";
import { useDropzone } from 'react-dropzone';

// We need to import the model path correctly based on how Vite handles public assets or node_modules
import { x2 as esrganSlim } from '@upscalerjs/esrgan-slim';

interface ImageEnhancerProps {
    onBack: () => void;
}

export function ImageEnhancer({ onBack }: ImageEnhancerProps) {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        try {
            const url = URL.createObjectURL(file);
            setOriginalImage(url);
            setEnhancedImage(null);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to load image");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1
    });

    const handleEnhance = async () => {
        if (!originalImage) return;

        setIsProcessing(true);
        setProgress(0);
        setError(null);

        try {
            const upscaler = new Upscaler({
                model: esrganSlim,
            });

            const refinedUrl = await upscaler.execute(originalImage, {
                patchSize: 64,
                padding: 2,
                progress: (rate: number) => {
                    setProgress(Math.round(rate * 100));
                }
            });

            setEnhancedImage(refinedUrl);
        } catch (err) {
            console.error("Upscaling failed:", err);
            setError("Failed to enhance image. Please try a smaller image.");
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadImage = () => {
        if (enhancedImage) {
            const link = document.createElement('a');
            link.href = enhancedImage;
            link.download = 'enhanced-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
            {!originalImage ? (
                <>
                    <div className="text-center mb-6 max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1f2e] mb-2 tracking-tight">
                                AI Image Enhancer
                            </h1>

                            <div className="text-blue-600 font-black text-xs md:text-sm uppercase tracking-widest mb-4 bg-blue-50/50 px-4 py-1.5 rounded-full inline-block border border-blue-100 shadow-sm">
                                ✨ Upscale images up to 4x clarity
                            </div>

                            <p className="text-base text-slate-500 mb-6 max-w-2xl mx-auto leading-relaxed">
                                Instantly unblur and upscale your photos using advanced AI technology.
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
                                    ? "border-blue-500 bg-blue-50/50 scale-102 shadow-2xl shadow-blue-500/10"
                                    : "border-slate-300 hover:border-blue-400 hover:bg-white/80 hover:shadow-xl"
                            )}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                <div className={cn(
                                    "p-4 rounded-2xl bg-blue-50 text-blue-600 transition-transform duration-300",
                                    "group-hover:scale-110 group-hover:rotate-3"
                                )}>
                                    <Sparkles className="w-10 h-10" />
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
                </>
            ) : (
                <div className="w-full max-w-6xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>
                            <div className="flex items-center gap-2 font-black text-slate-700">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                                AI Enhancer
                            </div>
                            <button
                                onClick={() => {
                                    setOriginalImage(null);
                                    setEnhancedImage(null);
                                }}
                                className="text-sm text-red-500 hover:text-red-700 font-bold"
                            >
                                Start Over
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">

                                {/* Original */}
                                <div className="flex-1 w-full max-w-lg">
                                    <div className="bg-slate-100 rounded-2xl overflow-hidden relative group aspect-square flex items-center justify-center border border-slate-200">
                                        <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain" />
                                        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm uppercase tracking-wider">
                                            Original
                                        </div>
                                    </div>
                                </div>

                                {/* Action Area */}
                                <div className="flex flex-col items-center gap-4">
                                    {!enhancedImage && !isProcessing && (
                                        <button
                                            onClick={handleEnhance}
                                            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/30 hover:scale-105 hover:bg-blue-700 transition-all flex items-center gap-3 text-lg"
                                        >
                                            <Sparkles className="w-6 h-6" />
                                            Enhance Image
                                        </button>
                                    )}

                                    {isProcessing && (
                                        <div className="text-center">
                                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3 mx-auto" />
                                            <p className="text-slate-600 font-medium">Enhancing Image...</p>
                                            <p className="text-slate-400 text-sm">{progress}%</p>
                                            <div className="w-48 h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="text-red-500 text-center max-w-xs bg-red-50 p-4 rounded-xl border border-red-100">
                                            <p className="font-medium">Error</p>
                                            <p className="text-sm">{error}</p>
                                            <button onClick={handleEnhance} className="mt-2 text-sm text-blue-600 hover:underline">Try Again</button>
                                        </div>
                                    )}
                                </div>

                                {/* Enhanced */}
                                <div className="flex-1 w-full max-w-lg">
                                    <div className={cn(
                                        "bg-slate-100 rounded-2xl overflow-hidden relative aspect-square flex items-center justify-center border border-slate-200 transition-all",
                                        !enhancedImage && "opacity-50 grayscale border-dashed"
                                    )}>
                                        {enhancedImage ? (
                                            <img src={enhancedImage} alt="Enhanced" className="max-w-full max-h-full object-contain" />
                                        ) : (
                                            <div className="text-center p-8">
                                                <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                                <p className="text-slate-400 font-medium">Enhanced image will appear here</p>
                                            </div>
                                        )}

                                        {enhancedImage && (
                                            <div className="absolute top-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm shadow-lg uppercase tracking-wider">
                                                ✨ Enhanced
                                            </div>
                                        )}
                                    </div>

                                    {enhancedImage && (
                                        <button
                                            onClick={downloadImage}
                                            className="w-full mt-4 bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Download className="w-5 h-5" />
                                            Download Result
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-30 pointer-events-none">
                <div className="w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            </div>
        </div>
    );
}
