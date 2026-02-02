import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageComparisonProps {
    beforeImage: string; // Original background image (e.g. white background)
    afterImage: string;  // New background image (e.g. blue background)
    overlayImage?: string; // The static subject (should be a cutout if possible)
    isTransparentOverlay?: boolean;
    className?: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
    beforeImage,
    afterImage,
    overlayImage,
    isTransparentOverlay = false,
    className
}) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPosition(percent);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        handleMove(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchend', handleUp);
        return () => {
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchend', handleUp);
        };
    }, []);

    const imageStyle: React.CSSProperties = {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };

    return (
        <div
            ref={containerRef}
            className={cn("relative overflow-hidden rounded-[2.5rem] cursor-col-resize select-none border-8 border-white shadow-2xl bg-white aspect-video", className)}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            {/* Layer 1: The 'After' Background (New state - always at the bottom) */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: `url(${afterImage})`,
                    ...imageStyle
                }}
            />

            {/* Layer 2: The 'Before' Background (Original state - Clipped from the right) */}
            <div
                className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-hidden"
                style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` // Reveals from the left
                }}
            >
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `url(${beforeImage})`,
                        ...imageStyle
                    }}
                />
            </div>

            {/* Layer 3: The Static Subject (Always on top, covering both bgs) */}
            {overlayImage && (
                <div
                    className="absolute inset-0 w-full h-full p-6 md:p-10 z-20 pointer-events-none overflow-hidden"
                >
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `url(${overlayImage})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            // If it's a real cutout, we don't need multiply. 
                            // If it's the original image with white, multiply will make it look okay-ish 
                            // but the user wants the REAL color. 
                            // I'll stick to 'normal' if they provided a cutout.
                            mixBlendMode: isTransparentOverlay ? 'normal' : 'multiply'
                        }}
                    />
                </div>
            )}

            {/* Slider Divider */}
            <div
                className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_20px_rgba(0,0,0,0.2)] pointer-events-none z-30"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-blue-600 transition-transform active:scale-95">
                    <div className="flex items-center gap-0.5 text-blue-600">
                        <ChevronLeft className="w-5 h-5 fill-current" />
                        <ChevronRight className="w-5 h-5 fill-current" />
                    </div>
                </div>
            </div>

            {/* Labels */}
            <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.25em] px-5 py-2.5 rounded-full pointer-events-none z-40 transition-all duration-300"
                style={{ opacity: sliderPosition > 15 ? 1 : 0 }}>
                ORIGINAL
            </div>
            <div className="absolute top-8 right-8 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.25em] px-5 py-2.5 rounded-full pointer-events-none shadow-xl z-40 transition-all duration-300"
                style={{ opacity: sliderPosition < 85 ? 1 : 0 }}>
                NEW BACKGROUND
            </div>
        </div>
    );
};
