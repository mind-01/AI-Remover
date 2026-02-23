import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronsLeftRight } from 'lucide-react';

interface ComparisonSliderProps {
    beforeImage: string;
    afterImage: string;
    className?: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ beforeImage, afterImage, className = "" }) => {
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Percentage from 0 to 100
    const [position, setPosition] = useState(50);

    const sliderX = useMotionValue(50);
    const springX = useSpring(sliderX, { stiffness: 400, damping: 30 });
    const clipPath = useTransform(springX, (v) => `inset(0 0 0 ${v}%)`);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

        setPosition(percentage);
        sliderX.set(percentage);
    }, [sliderX]);

    const onMouseDown = () => setIsDragging(true);

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative aspect-[16/10] w-full overflow-hidden rounded-[2.5rem] cursor-ew-resize select-none border-8 border-white dark:border-slate-800 shadow-2xl ${className}`}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onTouchMove={onTouchMove}
        >
            {/* Before Image (Background) */}
            <div className="absolute inset-0 bg-slate-900">
                <img
                    src={beforeImage}
                    alt="Original"
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-4 py-1.5 bg-slate-900/50 backdrop-blur-md text-xs text-white font-black uppercase rounded-full tracking-widest border border-white/20">
                    Original
                </div>
            </div>

            {/* After Image (Overlaid with clip-path) */}
            <motion.div
                className="absolute inset-0 z-10"
                style={{
                    clipPath,
                    backgroundColor: '#fff',
                    backgroundImage: `
                        linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                        linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                        linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
            >
                <img
                    src={afterImage}
                    alt="Processed"
                    className="w-full h-full object-cover relative z-10"
                />
                <div className="absolute top-4 right-4 px-4 py-1.5 bg-blue-600 text-xs text-white font-black uppercase rounded-full tracking-widest shadow-xl shadow-blue-500/20">
                    AI Cleaned
                </div>
            </motion.div>

            {/* Slider Handle */}
            <motion.div
                className="absolute top-0 bottom-0 z-20 w-1 bg-white cursor-ew-resize"
                style={{ left: `${position}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-blue-600 text-blue-600 group active:scale-90 transition-transform">
                    <ChevronsLeftRight className="w-6 h-6" />
                </div>
            </motion.div>
        </div>
    );
};
