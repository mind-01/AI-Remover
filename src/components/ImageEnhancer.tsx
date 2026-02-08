
import { useState, useCallback, useRef } from 'react';
import Upscaler from 'upscaler';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, Sparkles, Loader2, Image as ImageIcon, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from "../lib/utils";
import { useDropzone } from 'react-dropzone';

// We need to import the model path correctly based on how Vite handles public assets or node_modules
import esrganSlim from '@upscalerjs/esrgan-slim';

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
        <div className="max-w-6xl mx-auto px-4 py-8">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Background Remover
            </button>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                    AI Image Enhancer
                </h1>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                    Upscale and clarify your blurry photos instantly using advanced AI technology.
                    100% free and private - runs directly in your browser.
                </p>
            </div>

            {!originalImage ? (
                <div
                    {...getRootProps()}
                    className={cn(
                        "border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 min-h-[400px] flex flex-col items-center justify-center bg-white shadow-xl hover:shadow-2xl border-slate-200 hover:border-blue-500 group",
                        isDragActive && "border-blue-500 bg-blue-50"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                        Upload an Image to Enhance
                    </h3>
                    <p className="text-slate-500 mb-6">Drag & drop or click to browse</p>
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 group-hover:bg-blue-700 transition-all">
                        Upload Photo
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            Image Enhancer
                        </h3>
                        <button
                            onClick={() => {
                                setOriginalImage(null);
                                setEnhancedImage(null);
                            }}
                            className="text-sm text-red-500 hover:text-red-700 font-medium"
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
                                    <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
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
                                        <div className="absolute top-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg">
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
                                        Download Enhanced Image
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
