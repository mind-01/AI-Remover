import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, Sparkles, Image as ImageIcon, Eraser, Trash2, Wand2, Sliders, Undo2, Redo2, Loader2, Palette, Maximize, ZoomIn, Download, Scissors, Layers as LayersIcon, Archive } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import JSZip from 'jszip';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

interface ZoomPosition {
    x: number;
    y: number;
    clientX: number;
    clientY: number;
}

interface ProcessingTask {
    id: string;
    file: File;
    originalUrl: string;
    processedUrl: string | null;
    status: 'pending' | 'processing' | 'completed' | 'error';
    progress: number;
}

interface ResultViewerProps {
    originalUrl: string;
    processedUrl: string;
    onReset: () => void;
    onAddMore: () => void;
    taskList: ProcessingTask[];
    activeTaskId: string;
    onSelectTask: (id: string) => void;
}

interface EditorState {
    mask: string;
    bgColor: string;
    bgImage: string | null;
    isBlurEnabled: boolean;
    bgBlur: number;
    isShadowEnabled: boolean;
    shadowOpacity: number;
    shadowIntensity: number;
    isReflectionEnabled: boolean;
    brightness: number;
    contrast: number;
    aspectRatio: string;
    objectPadding: number;
}

type EditorTab = 'cutout' | 'background' | 'effects' | 'adjust' | 'resize' | 'zoom';

export const ResultViewer: React.FC<ResultViewerProps> = ({
    originalUrl, processedUrl, onReset, onAddMore, taskList, activeTaskId, onSelectTask
}) => {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    const [activeTab, setActiveTab] = useState<EditorTab>('zoom');
    const [bgSubTab, setBgSubTab] = useState<'photo' | 'color'>('photo');
    const [zoomPosition, setZoomPosition] = useState<ZoomPosition>({ x: 50, y: 50, clientX: 0, clientY: 0 });

    // Core States
    const [bgColor, setBgColor] = useState('transparent');
    const [bgImage, setBgImage] = useState<string | null>(null);
    const [shadowIntensity, setShadowIntensity] = useState(6);
    const [shadowOpacity, setShadowOpacity] = useState(40);
    const [isReflectionEnabled, setIsReflectionEnabled] = useState(false);
    const [isBlurEnabled, setIsBlurEnabled] = useState(false);
    const [isShadowEnabled, setIsShadowEnabled] = useState(false);
    const [bgBlur, setBgBlur] = useState(8);
    const [aspectRatio, setAspectRatio] = useState('aspect-[4/3]');
    const [objectPadding, setObjectPadding] = useState(0);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);

    // UI States
    const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
    const [estimatedSizes, setEstimatedSizes] = useState<Record<string, string>>({});
    const [watermarkText] = useState('');
    const [editMode, setEditMode] = useState<'erase' | 'restore'>('erase');
    const [brushSize, setBrushSize] = useState(60);
    const [isMagicBrush] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [customColor, setCustomColor] = useState('#6366f1');
    const [applyToAll, setApplyToAll] = useState(false);
    const [taskConfigs, setTaskConfigs] = useState<Record<string, Omit<EditorState, 'mask'>>>({});

    // Canvas Refs
    const displayCanvasRef = useRef<HTMLCanvasElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement>(null);
    const selectionCanvasRef = useRef<HTMLCanvasElement>(null);
    const loupeCanvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const colorPickerRef = useRef<HTMLInputElement>(null);
    const originalImageRef = useRef<HTMLImageElement | null>(null);
    const processedImageRef = useRef<HTMLImageElement | null>(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // History Management
    const [history, setHistory] = useState<EditorState[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const isUndoingRedoingRef = useRef(false);

    // Background Detection State
    const [detectedBgColor, setDetectedBgColor] = useState<{ r: number, g: number, b: number } | null>(null);

    // Initialize Editor
    useEffect(() => {
        const loadImages = async () => {
            const orig = new Image();
            orig.crossOrigin = "anonymous";
            orig.src = originalUrl;

            const proc = new Image();
            proc.crossOrigin = "anonymous";
            proc.src = processedUrl;

            await Promise.all([
                new Promise(r => orig.onload = r),
                new Promise(r => proc.onload = r)
            ]);

            originalImageRef.current = orig;
            processedImageRef.current = proc;

            // Detect Background Color
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = orig.width;
            tempCanvas.height = orig.height;
            const tCtx = tempCanvas.getContext('2d')!;
            tCtx.drawImage(orig, 0, 0);
            const points = [
                tCtx.getImageData(10, 10, 1, 1).data,
                tCtx.getImageData(orig.width - 10, 10, 1, 1).data,
                tCtx.getImageData(10, orig.height - 10, 1, 1).data,
                tCtx.getImageData(orig.width - 10, orig.height - 10, 1, 1).data
            ];
            setDetectedBgColor({
                r: Math.round(points.reduce((acc, p) => acc + p[0], 0) / points.length),
                g: Math.round(points.reduce((acc, p) => acc + p[1], 0) / points.length),
                b: Math.round(points.reduce((acc, p) => acc + p[2], 0) / points.length)
            });

            const maskCanvas = maskCanvasRef.current;
            const selectionCanvas = selectionCanvasRef.current;
            if (maskCanvas && selectionCanvas) {
                maskCanvas.width = proc.width;
                maskCanvas.height = proc.height;
                selectionCanvas.width = proc.width;
                selectionCanvas.height = proc.height;
                const mCtx = maskCanvas.getContext('2d', { willReadFrequently: true })!;
                mCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

                const savedConfig = taskConfigs[activeTaskId];
                if (savedConfig && (savedConfig as any).mask) {
                    const savedMask = new Image();
                    savedMask.onload = () => {
                        mCtx.drawImage(savedMask, 0, 0);
                        renderDisplay();
                    };
                    savedMask.src = (savedConfig as any).mask;
                } else {
                    mCtx.drawImage(proc, 0, 0);
                }

                // Initial History State
                const initialState: EditorState = {
                    mask: maskCanvas.toDataURL(),
                    bgColor: 'transparent',
                    bgImage: null,
                    isBlurEnabled: false,
                    bgBlur: 8,
                    isShadowEnabled: false,
                    shadowOpacity: 40,
                    shadowIntensity: 6,
                    isReflectionEnabled: false,
                    brightness: 100,
                    contrast: 100,
                    aspectRatio: 'aspect-[4/3]',
                    objectPadding: 0
                };
                setHistory([initialState]);
                setHistoryIndex(0);
                // Auto-redirect to Zoom tab
                setActiveTab('zoom');
            }

            renderDisplay();
        };

        loadImages();
    }, [processedUrl, originalUrl, activeTaskId]);

    // Main Render Function
    const renderDisplay = useCallback(() => {
        const dCanvas = displayCanvasRef.current;
        const mCanvas = maskCanvasRef.current;
        const sCanvas = selectionCanvasRef.current;
        const proc = processedImageRef.current;

        if (!dCanvas || !mCanvas || !sCanvas || !proc) return;

        dCanvas.width = mCanvas.width;
        dCanvas.height = mCanvas.height;
        const ctx = dCanvas.getContext('2d')!;

        ctx.clearRect(0, 0, dCanvas.width, dCanvas.height);

        // Final Output Render
        ctx.save();
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        if (isShadowEnabled && shadowOpacity > 0) {
            ctx.shadowColor = `rgba(0,0,0,${shadowOpacity / 100})`;
            ctx.shadowBlur = shadowIntensity * 3;
            ctx.shadowOffsetX = shadowIntensity;
            ctx.shadowOffsetY = shadowIntensity;
        }
        ctx.drawImage(mCanvas, 0, 0);
        ctx.restore();

        if (isReflectionEnabled) {
            ctx.save();
            ctx.scale(1, -0.3);
            ctx.translate(0, -dCanvas.height * 3.3);
            ctx.globalAlpha = 0.2;
            ctx.drawImage(mCanvas, 0, 0);
            ctx.restore();
        }

        if (isDrawing) {
            ctx.globalAlpha = 0.5;
            ctx.drawImage(sCanvas, 0, 0);
            ctx.globalAlpha = 1.0;
        }

        if (watermarkText) {
            ctx.font = `bold ${dCanvas.width / 30}px Arial`;
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.textAlign = 'center';
            ctx.fillText(watermarkText, dCanvas.width / 2, dCanvas.height - (dCanvas.height * 0.05));
        }

        updateEstimatedSizes();
    }, [brightness, contrast, isShadowEnabled, shadowIntensity, shadowOpacity, isReflectionEnabled, watermarkText, isDrawing]);

    useEffect(() => {
        renderDisplay();
    }, [renderDisplay]);

    // History Logic
    const saveToHistory = useCallback(() => {
        if (isUndoingRedoingRef.current) return;

        const mCanvas = maskCanvasRef.current;
        if (!mCanvas) return;

        const newState: EditorState = {
            mask: mCanvas.toDataURL(),
            bgColor,
            bgImage,
            isBlurEnabled,
            bgBlur,
            isShadowEnabled,
            shadowOpacity,
            shadowIntensity,
            isReflectionEnabled,
            brightness,
            contrast,
            aspectRatio,
            objectPadding
        };

        setHistory(prev => {
            const nextHistory = prev.slice(0, historyIndex + 1);
            nextHistory.push(newState);
            if (nextHistory.length > 50) nextHistory.shift();
            return nextHistory;
        });
        setHistoryIndex(prev => Math.min(prev + 1, 49));
    }, [bgColor, bgImage, isBlurEnabled, bgBlur, isShadowEnabled, shadowOpacity, shadowIntensity, isReflectionEnabled, brightness, contrast, aspectRatio, objectPadding, historyIndex]);

    // Update all tasks or single task
    const updateConfig = useCallback((updates: Partial<Omit<EditorState, 'mask'>>) => {
        if (applyToAll) {
            const nextConfigs = { ...taskConfigs };
            taskList.forEach(task => {
                nextConfigs[task.id] = {
                    ...(nextConfigs[task.id] || {
                        bgColor: 'transparent', bgImage: null, isBlurEnabled: false, bgBlur: 8,
                        isShadowEnabled: false, shadowOpacity: 40, shadowIntensity: 6,
                        isReflectionEnabled: false, brightness: 100, contrast: 100,
                        aspectRatio: 'aspect-[4/3]', objectPadding: 0
                    }),
                    ...updates
                };
            });
            setTaskConfigs(nextConfigs);
        } else {
            setTaskConfigs(prev => ({
                ...prev,
                [activeTaskId]: {
                    ...(prev[activeTaskId] || {
                        bgColor: 'transparent', bgImage: null, isBlurEnabled: false, bgBlur: 8,
                        isShadowEnabled: false, shadowOpacity: 40, shadowIntensity: 6,
                        isReflectionEnabled: false, brightness: 100, contrast: 100,
                        aspectRatio: 'aspect-[4/3]', objectPadding: 0
                    }),
                    ...updates
                }
            }));
        }
    }, [applyToAll, taskConfigs, activeTaskId, taskList]);

    // Sync local states to config
    useEffect(() => {
        // Save current mask to previous task before switching
        return () => {
            const mCanvas = maskCanvasRef.current;
            if (mCanvas && activeTaskId) {
                setTaskConfigs(prev => ({
                    ...prev,
                    [activeTaskId]: {
                        ...(prev[activeTaskId] || {
                            bgColor: 'transparent', bgImage: null, isBlurEnabled: false, bgBlur: 8,
                            isShadowEnabled: false, shadowOpacity: 40, shadowIntensity: 6,
                            isReflectionEnabled: false, brightness: 100, contrast: 100,
                            aspectRatio: 'aspect-[4/3]', objectPadding: 0
                        }),
                        mask: mCanvas.toDataURL()
                    } as any
                }));
            }
        };
    }, [activeTaskId]); // Removed taskConfigs dependency to avoid infinite loop

    useEffect(() => {
        const config = taskConfigs[activeTaskId];
        if (config) {
            setBgColor(config.bgColor);
            setBgImage(config.bgImage);
            setIsBlurEnabled(config.isBlurEnabled);
            setBgBlur(config.bgBlur);
            setIsShadowEnabled(config.isShadowEnabled);
            setShadowOpacity(config.shadowOpacity);
            setShadowIntensity(config.shadowIntensity);
            setIsReflectionEnabled(config.isReflectionEnabled);
            setBrightness(config.brightness);
            setContrast(config.contrast);
            setAspectRatio(config.aspectRatio);
            setObjectPadding(config.objectPadding);
        }
    }, [activeTaskId]);

    // Apply specific history state
    const applyHistoryState = useCallback((state: EditorState) => {
        isUndoingRedoingRef.current = true;

        setBgColor(state.bgColor);
        setBgImage(state.bgImage);
        setIsBlurEnabled(state.isBlurEnabled);
        setBgBlur(state.bgBlur);
        setIsShadowEnabled(state.isShadowEnabled);
        setShadowOpacity(state.shadowOpacity);
        setShadowIntensity(state.shadowIntensity);
        setIsReflectionEnabled(state.isReflectionEnabled);
        setBrightness(state.brightness);
        setContrast(state.contrast);
        setAspectRatio(state.aspectRatio);
        setObjectPadding(state.objectPadding);

        const mCanvas = maskCanvasRef.current;
        if (mCanvas) {
            const img = new Image();
            img.onload = () => {
                const mCtx = mCanvas.getContext('2d')!;
                mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height);
                mCtx.drawImage(img, 0, 0);
                renderDisplay();
                isUndoingRedoingRef.current = false;
            };
            img.src = state.mask;
        }
    }, [renderDisplay]);

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            applyHistoryState(history[newIndex]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            applyHistoryState(history[newIndex]);
        }
    };

    // Auto-save on discrete changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isUndoingRedoingRef.current && history.length > 0) {
                const current = history[historyIndex];
                const hasChanged =
                    current.bgColor !== bgColor ||
                    current.bgImage !== bgImage ||
                    current.isBlurEnabled !== isBlurEnabled ||
                    current.isShadowEnabled !== isShadowEnabled ||
                    current.isReflectionEnabled !== isReflectionEnabled ||
                    current.aspectRatio !== aspectRatio ||
                    Math.abs(current.bgBlur - bgBlur) > 2 ||
                    Math.abs(current.shadowOpacity - shadowOpacity) > 5 ||
                    Math.abs(current.brightness - brightness) > 5 ||
                    Math.abs(current.contrast - contrast) > 5 ||
                    Math.abs(current.objectPadding - objectPadding) > 2;

                if (hasChanged) saveToHistory();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [bgColor, bgImage, isBlurEnabled, bgBlur, isShadowEnabled, shadowOpacity, isReflectionEnabled, brightness, contrast, aspectRatio, objectPadding]);


    // Smart Auto Restore All function
    const handleSmartRestoreAll = async () => {
        if (!detectedBgColor || !originalImageRef.current || !maskCanvasRef.current) return;

        setIsProcessing(true);
        // Removed artificial delay for faster processing

        const mCanvas = maskCanvasRef.current;
        const orig = originalImageRef.current;
        const mCtx = mCanvas.getContext('2d')!;

        const w = mCanvas.width;
        const h = mCanvas.height;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tCtx = tempCanvas.getContext('2d')!;
        tCtx.drawImage(orig, 0, 0);

        const imageData = tCtx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const threshold = 55;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const distance = Math.sqrt(Math.pow(r - detectedBgColor.r, 2) + Math.pow(g - detectedBgColor.g, 2) + Math.pow(b - detectedBgColor.b, 2));
            if (distance < threshold) data[i + 3] = 0;
        }

        tCtx.putImageData(imageData, 0, 0);
        mCtx.globalCompositeOperation = 'source-over';
        mCtx.drawImage(tempCanvas, 0, 0);

        setIsProcessing(false);
        saveToHistory();
        renderDisplay();
    };

    // Drawing Logic
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (activeTab !== 'cutout') return;
        setIsDrawing(true);
        const sCanvas = selectionCanvasRef.current;
        if (sCanvas) {
            const sCtx = sCanvas.getContext('2d')!;
            sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
        }
        draw(e);
    };

    const stopDrawing = async () => {
        if (isDrawing) {
            setIsDrawing(false);
            setIsProcessing(true);

            await new Promise(r => setTimeout(r, 600));

            const mCanvas = maskCanvasRef.current;
            const sCanvas = selectionCanvasRef.current;
            const orig = originalImageRef.current;
            if (!mCanvas || !sCanvas || !orig) return;

            const mCtx = mCanvas.getContext('2d')!;
            const sCtx = sCanvas.getContext('2d')!;

            if (editMode === 'erase') {
                mCtx.globalCompositeOperation = 'destination-out';
                mCtx.drawImage(sCanvas, 0, 0);
            } else {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = mCanvas.width;
                tempCanvas.height = mCanvas.height;
                const tCtx = tempCanvas.getContext('2d')!;

                tCtx.drawImage(sCanvas, 0, 0);
                tCtx.globalCompositeOperation = 'source-in';
                tCtx.drawImage(orig, 0, 0);

                if (isMagicBrush && detectedBgColor) {
                    const imageData = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                    const data = imageData.data;
                    const threshold = 55;
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                        if (a > 0) {
                            const distance = Math.sqrt(Math.pow(r - detectedBgColor.r, 2) + Math.pow(g - detectedBgColor.g, 2) + Math.pow(b - detectedBgColor.b, 2));
                            if (distance < threshold) data[i + 3] = 0;
                        }
                    }
                    tCtx.putImageData(imageData, 0, 0);
                }

                mCtx.globalCompositeOperation = 'source-over';
                mCtx.drawImage(tempCanvas, 0, 0);
            }

            sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
            setIsProcessing(false);
            saveToHistory();
            renderDisplay();
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        const sCanvas = selectionCanvasRef.current;
        const dCanvas = displayCanvasRef.current;
        if (!sCanvas || !dCanvas) return;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // Magnifier Loupe Logic (Available ONLY in zoom tab)
        if (!isProcessing && activeTab === 'zoom') {
            const rect = dCanvas.getBoundingClientRect();
            const x = ((clientX - rect.left) / rect.width) * 100;
            const y = ((clientY - rect.top) / rect.height) * 100;
            setZoomPosition({ x, y, clientX, clientY });

            // Update Live Loupe Canvas from displayCanvas
            const lCanvas = loupeCanvasRef.current;
            if (lCanvas && dCanvas) {
                const lCtx = lCanvas.getContext('2d');
                if (lCtx) {
                    const zoomLevel = 2.5;
                    const baseSize = 192; // 48 * 4
                    const dpr = window.devicePixelRatio || 1;

                    // High-DPI Scaling for ultimate sharpness
                    lCanvas.width = baseSize * dpr;
                    lCanvas.height = baseSize * dpr;

                    const sourceX = (x / 100) * dCanvas.width;
                    const sourceY = (y / 100) * dCanvas.height;
                    const sourceSize = (baseSize / zoomLevel);

                    lCtx.imageSmoothingEnabled = true;
                    lCtx.imageSmoothingQuality = 'high';
                    lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height);

                    lCtx.save();
                    lCtx.scale(dpr, dpr);
                    lCtx.drawImage(
                        dCanvas,
                        sourceX - (sourceSize / 2),
                        sourceY - (sourceSize / 2),
                        sourceSize,
                        sourceSize,
                        0,
                        0,
                        baseSize,
                        baseSize
                    );
                    lCtx.restore();
                }
            }
        }

        if (cursorRef.current && activeTab === 'cutout') {
            cursorRef.current.style.left = '0px';
            cursorRef.current.style.top = '0px';
            cursorRef.current.style.transform = `translate3d(${clientX - brushSize / 2}px, ${clientY - brushSize / 2}px, 0)`;
        }

        if (!isDrawing || activeTab !== 'cutout') return;

        const rect = dCanvas.getBoundingClientRect();
        const scaleX = sCanvas.width / rect.width;
        const scaleY = sCanvas.height / rect.height;

        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        const radius = (brushSize * scaleX) / 2;

        const sCtx = sCanvas.getContext('2d')!;
        sCtx.lineJoin = 'round';
        sCtx.lineCap = 'round';
        sCtx.fillStyle = editMode === 'erase' ? '#3b82f6' : '#22c55e';

        sCtx.beginPath();
        sCtx.arc(x, y, radius, 0, Math.PI * 2);
        sCtx.fill();

        renderDisplay();
    };

    const updateEstimatedSizes = async () => {
        interface QualityOption { id: string, scale: number }
        const sizes: Record<string, string> = {};
        const q: QualityOption[] = [{ id: 'high', scale: 1 }, { id: 'medium', scale: 0.7 }, { id: 'low', scale: 0.4 }];
        for (const opt of q) {
            const size = await getCanvasFileSize(opt.scale);
            sizes[opt.id] = size;
        }
        setEstimatedSizes(sizes);
    };

    const getCanvasFileSize = (scale: number): Promise<string> => {
        return new Promise((r) => {
            const mCanvas = maskCanvasRef.current;
            if (!mCanvas) return r('0 KB');
            const temp = document.createElement('canvas');
            temp.width = mCanvas.width * scale;
            temp.height = mCanvas.height * scale;
            const tCtx = temp.getContext('2d')!;
            if (bgImage) {
                r('~ ' + (scale * 2.5).toFixed(1) + ' MB');
                return;
            }
            if (bgColor !== 'transparent') {
                tCtx.fillStyle = bgColor;
                tCtx.fillRect(0, 0, temp.width, temp.height);
            }
            tCtx.drawImage(mCanvas, 0, 0, temp.width, temp.height);
            temp.toBlob(b => {
                if (!b) return r('0 KB');
                const kb = b.size / 1024;
                r(kb > 1024 ? (kb / 1024).toFixed(1) + ' MB' : Math.round(kb) + ' KB');
            }, 'image/png');
        });
    };

    const handleDownload = async (scale: number = 1) => {
        const mCanvas = maskCanvasRef.current;
        if (!mCanvas) return;

        let targetW = mCanvas.width * scale;
        let targetH = mCanvas.height * scale;

        if (aspectRatio !== 'aspect-[4/3]') {
            let ratio = 4 / 3;
            if (aspectRatio === 'aspect-square') ratio = 1;
            if (aspectRatio === 'aspect-[9/16]') ratio = 9 / 16;
            if (aspectRatio === 'aspect-video') ratio = 16 / 9;

            const currentRatio = targetW / targetH;
            if (currentRatio > ratio) {
                targetH = targetW / ratio;
            } else {
                targetW = targetH * ratio;
            }
        }

        const temp = document.createElement('canvas');
        temp.width = targetW;
        temp.height = targetH;
        const tCtx = temp.getContext('2d')!;

        // Background
        if (bgImage) {
            const bgImg = new Image();
            bgImg.crossOrigin = "anonymous";
            bgImg.src = bgImage;
            await new Promise(r => bgImg.onload = r);
            tCtx.save();
            if (isBlurEnabled && bgBlur > 0) tCtx.filter = `blur(${bgBlur * 2}px)`;
            const scaleBg = Math.max(temp.width / bgImg.width, temp.height / bgImg.height);
            const x = (temp.width - bgImg.width * scaleBg) / 2;
            const y = (temp.height - bgImg.height * scaleBg) / 2;
            tCtx.drawImage(bgImg, x, y, bgImg.width * scaleBg, bgImg.height * scaleBg);
            tCtx.restore();
        } else if (bgColor !== 'transparent') {
            tCtx.save();
            if (isBlurEnabled && bgBlur > 0) tCtx.filter = `blur(${bgBlur * 2}px)`;
            tCtx.fillStyle = bgColor;
            tCtx.fillRect(0, 0, temp.width, temp.height);
            tCtx.restore();
        }

        // Object
        tCtx.save();
        tCtx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        const pad = (objectPadding / 100) * Math.min(temp.width, temp.height);
        const availableW = temp.width - (pad * 2);
        const availableH = temp.height - (pad * 2);
        const scaleFit = Math.min(availableW / (mCanvas.width * scale), availableH / (mCanvas.height * scale));
        const finalW = mCanvas.width * scale * scaleFit;
        const finalH = mCanvas.height * scale * scaleFit;
        const xOffset = (temp.width - finalW) / 2;
        const yOffset = (temp.height - finalH) / 2;

        if (isReflectionEnabled) {
            tCtx.save();
            tCtx.scale(1, -0.3);
            tCtx.translate(0, -temp.height * 3.3);
            tCtx.globalAlpha = 0.2;
            tCtx.drawImage(mCanvas, xOffset, yOffset, finalW, finalH);
            tCtx.restore();
        }

        if (isShadowEnabled && shadowOpacity > 0) {
            tCtx.shadowColor = `rgba(0,0,0,${shadowOpacity / 100})`;
            tCtx.shadowBlur = shadowIntensity * 3 * scale;
            tCtx.shadowOffsetX = shadowIntensity * scale;
            tCtx.shadowOffsetY = shadowIntensity * scale;
        }

        tCtx.drawImage(mCanvas, xOffset, yOffset, finalW, finalH);
        tCtx.restore();

        if (watermarkText) {
            tCtx.font = `bold ${(temp.width / 30)}px Arial`;
            tCtx.fillStyle = 'rgba(255,255,255,0.5)';
            tCtx.textAlign = 'center';
            tCtx.fillText(watermarkText, temp.width / 2, temp.height - (temp.height * 0.05));
        }

        const link = document.createElement('a');
        link.href = temp.toDataURL('image/png');
        link.download = `ai-studio-pro-${Date.now()}.png`;
        link.click();
    };

    const handleDownloadAll = async () => {
        const zip = new JSZip();
        const completedTasks = taskList.filter(t => t.status === 'completed' && t.processedUrl);

        if (completedTasks.length === 0) return;

        // Add a small indicator that we are zipping
        setIsProcessing(true);

        const promises = completedTasks.map(async (task, index) => {
            const response = await fetch(task.processedUrl!);
            const blob = await response.blob();
            zip.file(`ai-remover-pro-${index + 1}.png`, blob);
        });

        await Promise.all(promises);
        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `ai-remover-batch-${Date.now()}.zip`;
        link.click();

        setIsProcessing(false);
    };

    const toolbarItems = [
        { id: 'zoom', label: t.common.zoom, icon: <ZoomIn className="w-4 h-4" /> },
        { id: 'cutout', label: t.common.cutout, icon: <Eraser className="w-4 h-4" /> },
        { id: 'background', label: t.common.background, icon: <ImageIcon className="w-4 h-4" /> },
        { id: 'effects', label: t.common.effects, icon: <Sparkles className="w-4 h-4" /> },
        { id: 'adjust', label: t.common.adjust, icon: <Sliders className="w-4 h-4" /> },
        { id: 'resize', label: t.common.resize, icon: <Maximize className="w-4 h-4" /> },
    ];

    const socialRatios = [
        { label: t.editor.original, value: 'aspect-[4/3]' },
        { label: t.editor.square, value: 'aspect-square' },
        { label: t.editor.story, value: 'aspect-[9/16]' },
        { label: t.editor.video, value: 'aspect-video' },
    ];

    const photoPresets = [
        'https://images.unsplash.com/photo-1542319630-55fb7f7c944a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505409859467-3a799be57c8f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1473186578172-c141e6798ee4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
    ];

    const colorGridItems = [
        'transparent',
        'custom',
        '#ffffff',
        '#ff4d4d',
        '#ff0066',
        '#a126ba',
        '#4d4dff',
        '#0099ff',
        '#00ccff',
        '#00ff99',
        '#33cc33',
        '#ffff00',
        '#ff9900',
        '#000000'
    ];

    return (
        <div className="fixed inset-0 z-[60] h-[100dvh] flex flex-col bg-white sm:bg-slate-50 overflow-hidden font-sans dark:bg-slate-900">
            {/* Mobile Top Bar */}
            <div className="lg:hidden flex-none flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-b dark:border-slate-800">
                <button className="p-2 text-slate-800 dark:text-white">
                    <LayersIcon className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-6">
                    <button className="p-2 text-slate-400 dark:text-slate-500">
                        <ZoomIn className="w-5 h-5" />
                    </button>
                    <button onClick={undo} className="p-2 text-slate-400 dark:text-slate-500">
                        <Undo2 className="w-5 h-5" />
                    </button>
                    <button onClick={redo} className="p-2 text-slate-400 dark:text-slate-500">
                        <Redo2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Mobile Task Strip (Top) */}
            <div className="lg:hidden flex-none flex items-center gap-3 px-4 py-2 overflow-x-auto no-scrollbar bg-white shadow-sm border-b border-slate-50 dark:bg-slate-900 dark:border-slate-800">
                <button
                    onClick={onAddMore}
                    className="w-14 h-14 flex-shrink-0 bg-blue-50 rounded-xl flex items-center justify-center border-2 border-blue-100 text-blue-600 active:scale-90 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-blue-400"
                >
                    <div className="text-xl font-black">+</div>
                </button>
                {taskList.map((task) => (
                    <button
                        key={task.id}
                        onClick={() => onSelectTask(task.id)}
                        className={cn(
                            "relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0",
                            activeTaskId === task.id ? "border-blue-600 scale-105 z-10" : "border-slate-100 opacity-60"
                        )}
                        disabled={task.status === 'processing' || task.status === 'pending'}
                    >
                        <img src={task.processedUrl || task.originalUrl} className="w-full h-full object-cover" alt="Task" />
                        {task.status === 'processing' && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                            </div>
                        )}
                        {activeTaskId === task.id && task.status === 'completed' && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full shadow-lg" />
                        )}
                    </button>
                ))}
            </div>

            <div className="flex-none hidden sm:flex items-center justify-between mt-4 mb-4 sm:mb-8 px-4 sm:px-0">
                <div className="hidden sm:flex items-center gap-4">
                    {/* Top Toolbar - Heightened Z-Index to prevent clipping */}
                    <div className="flex items-center justify-center w-full relative z-[60]">
                        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-full px-2 py-1.5 flex items-center gap-1 lg:gap-3 dark:bg-slate-900/90 dark:border-slate-800 dark:shadow-none">
                            {toolbarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as EditorTab)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-xs font-black uppercase tracking-tight",
                                        activeTab === item.id
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-105 dark:shadow-none"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                    )}
                                >
                                    {item.icon}
                                    <span className="hidden sm:inline">{item.label}</span>
                                </button>
                            ))}

                            <div className="w-[1px] h-6 bg-slate-100 mx-2 hidden sm:block dark:bg-slate-800" />

                            <div className="flex items-center gap-1 sm:gap-2 mr-2">
                                <button onClick={undo} disabled={historyIndex <= 0} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all disabled:opacity-20 dark:hover:bg-slate-800 dark:hover:text-white">
                                    <Undo2 className="w-4 h-4" />
                                </button>
                                <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all disabled:opacity-20 dark:hover:bg-slate-800 dark:hover:text-white">
                                    <Redo2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 flex items-center gap-2 transition-all active:scale-95 dark:shadow-none"
                                >
                                    {t.download} <ChevronRight className={cn("w-3 h-3 transition-transform", isDownloadMenuOpen && "rotate-90")} />
                                </button>

                                {isDownloadMenuOpen && (
                                    <div className="absolute top-full right-0 mt-4 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden z-[100] min-w-[240px] animate-in fade-in slide-in-from-top-4 duration-300 dark:bg-slate-900 dark:border-slate-800 dark:shadow-black/50">
                                        <div className="p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm dark:bg-slate-800/80 dark:border-slate-800">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.editor.downloadMenuTitle}</p>
                                        </div>
                                        <div className="p-2 bg-white dark:bg-slate-900">
                                            {[{ id: 'high', label: t.editor.qualityHigh, sub: t.editor.qualityHighSub, scale: 1 }, { id: 'medium', label: t.editor.qualityMedium, sub: t.editor.qualityMediumSub, scale: 0.7 }, { id: 'low', scale: 0.4, label: t.editor.qualityLow, sub: t.editor.qualityLowSub }].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => {
                                                        handleDownload(opt.scale);
                                                        setIsDownloadMenuOpen(false);
                                                    }}
                                                    className="w-full text-left p-4 hover:bg-blue-600 group rounded-2xl transition-all duration-200 mb-1 last:mb-0"
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="text-[13px] font-black text-slate-800 group-hover:text-white transition-colors dark:text-white">{opt.label}</p>
                                                        <p className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg group-hover:bg-white/20 group-hover:text-white transition-all dark:bg-blue-900/30 dark:text-blue-400">
                                                            {estimatedSizes[opt.id] || '...'}
                                                        </p>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-100 transition-colors uppercase tracking-tight">
                                                        {opt.sub}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 flex-grow flex-shrink min-h-0 overflow-hidden px-0 sm:px-4">
                {/* Desktop Task Strip (Sidebar) */}
                <div className="hidden lg:flex w-56 flex-shrink-0 flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar no-scrollbar py-2">
                    <div className="space-y-2 mb-2">
                        <button
                            onClick={handleDownloadAll}
                            disabled={taskList.every(t => t.status !== 'completed')}
                            className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-30 active:scale-95"
                        >
                            <Archive className="w-4 h-4" /> {t.common.downloadAll}
                        </button>
                        <button
                            onClick={onReset}
                            className="w-full py-3 bg-white text-slate-400 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> {t.common.clearAll}
                        </button>

                        <div className="pt-2 px-1">
                            <div className="flex p-1 bg-slate-100/80 rounded-2xl w-full border border-slate-100/50">
                                <button
                                    onClick={() => setApplyToAll(false)}
                                    className={cn(
                                        "flex-grow py-2 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all",
                                        !applyToAll ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-500"
                                    )}
                                >
                                    {t.common.singleEdit}
                                </button>
                                <button
                                    onClick={() => setApplyToAll(true)}
                                    className={cn(
                                        "flex-grow py-2 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all",
                                        applyToAll ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-500"
                                    )}
                                >
                                    {t.common.applyToAll}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-slate-100 mb-2" />

                    {taskList.map((task) => (
                        <button
                            key={task.id}
                            onClick={() => onSelectTask(task.id)}
                            disabled={task.status === 'processing' || task.status === 'pending'}
                            className={cn(
                                "relative w-full h-36 rounded-[2rem] overflow-hidden border-2 transition-all flex-shrink-0 group",
                                activeTaskId === task.id ? "border-blue-600 shadow-2xl scale-[1.03] z-10" : "border-slate-50 opacity-50 hover:opacity-100 hover:border-slate-200"
                            )}
                        >
                            <img src={task.processedUrl || task.originalUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Task" />

                            {task.status === 'processing' && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-2" />
                                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${task.progress}%` }}
                                            className="h-full bg-blue-600"
                                        />
                                    </div>
                                    <span className="text-[8px] font-black text-blue-600 mt-1 uppercase tracking-widest">{task.progress}%</span>
                                </div>
                            )}

                            {task.status === 'completed' && (
                                <div className="absolute top-3 right-3 w-3 h-3 bg-blue-600 rounded-full shadow-lg border-2 border-white" />
                            )}

                            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                <span className="text-[8px] font-black text-white uppercase tracking-widest">Select to Edit</span>
                            </div>
                        </button>
                    ))}

                    <button
                        onClick={onAddMore}
                        className="w-full h-32 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all flex-shrink-0 group mt-2"
                    >
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <span className="text-2xl font-light group-hover:font-bold">+</span>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest">Add More</span>
                    </button>
                </div>

                <div className="flex-grow flex-shrink min-h-0 flex flex-col gap-4 min-w-0 lg:min-h-[400px]">
                    <div className="flex-grow flex-shrink min-h-0 relative flex items-center justify-center bg-slate-100/50 sm:rounded-[3rem] border-y sm:border border-slate-100 shadow-inner overflow-hidden group/editor p-2 sm:p-4 dark:bg-slate-800/50 dark:border-slate-800">
                        <div
                            className={cn(
                                "relative overflow-hidden shadow-2xl flex items-center justify-center transition-all duration-300 rounded-[2.5rem]",
                                aspectRatio === 'aspect-[4/3]' ? "w-[80%] h-[80%]" :
                                    aspectRatio === 'aspect-square' ? "w-[70%] aspect-square" :
                                        aspectRatio === 'aspect-[9/16]' ? "h-[90%] aspect-[9/16]" :
                                            "w-[90%] aspect-video"
                            )}
                            style={{
                                transform: 'none',
                                transformOrigin: 'center center',
                                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: bgImage
                                        ? `url(${bgImage}) center/cover no-repeat`
                                        : (bgColor === 'transparent' ? 'white' : bgColor),
                                    filter: isBlurEnabled ? `blur(${bgBlur}px)` : 'none',
                                    transform: isBlurEnabled ? 'scale(1.15)' : 'scale(1)'
                                }}
                            />

                            {bgColor === 'transparent' && !bgImage && (
                                <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
                                    style={{
                                        backgroundImage: `
                                            linear-gradient(45deg, #000 25%, transparent 25%),
                                            linear-gradient(-45deg, #000 25%, transparent 25%),
                                            linear-gradient(45deg, transparent 75%, #000 75%),
                                            linear-gradient(-45deg, transparent 75%, #000 75%)
                                         `,
                                        backgroundSize: '24px 24px',
                                        backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px'
                                    }}
                                />
                            )}

                            <div className="relative z-20 flex items-center justify-center w-full h-full" style={{ padding: `${objectPadding}%` }}>
                                <canvas
                                    ref={displayCanvasRef}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={() => { stopDrawing(); setIsHovering(false); }}
                                    onMouseEnter={() => { setIsHovering(true); }}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                    className={cn(
                                        "max-w-full max-h-full object-contain relative transition-all duration-300",
                                        activeTab === 'cutout' ? "cursor-none" : "cursor-default",
                                        isProcessing && "opacity-80 grayscale-[0.5]"
                                    )}
                                    style={{ touchAction: 'none' }}
                                />
                            </div>

                            {!isProcessing && isHovering && activeTab === 'cutout' && (
                                <div
                                    ref={cursorRef}
                                    className="fixed pointer-events-none z-[100] border-[3px] border-white rounded-full shadow-[0_0_15px_rgba(255,0,0,0.6)] bg-red-600/40"
                                    style={{
                                        width: brushSize + 'px',
                                        height: brushSize + 'px',
                                        borderColor: '#ffffff',
                                        top: 0,
                                        left: 0,
                                        transform: 'translate(-100% , -100%)'
                                    }}
                                />
                            )}

                            {isProcessing && (
                                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
                                    <div className="bg-white/90 p-4 rounded-full shadow-2xl animate-spin">
                                        <Loader2 className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                            )}

                            <canvas ref={maskCanvasRef} className="hidden" />
                            <canvas ref={selectionCanvasRef} className="hidden" />

                            {/* Magnifier Loupe - Zoom Tab Only */}
                            {isHovering && displayCanvasRef.current && activeTab === 'zoom' && (
                                <div
                                    className="fixed pointer-events-none z-[100] w-48 h-48 border-4 border-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden bg-slate-900"
                                    style={{
                                        left: 0,
                                        top: 0,
                                        transform: `translate3d(${zoomPosition.clientX - 96}px, ${zoomPosition.clientY - 96}px, 0)`,
                                        backgroundImage: `
                                            linear-gradient(45deg, #ccc 25%, transparent 25%),
                                            linear-gradient(-45deg, #ccc 25%, transparent 25%),
                                            linear-gradient(45deg, transparent 75%, #ccc 75%),
                                            linear-gradient(-45deg, transparent 75%, #ccc 75%)
                                        `,
                                        backgroundRepeat: 'repeat',
                                        backgroundSize: `${24 * 4}px ${24 * 4}px`,
                                        backgroundPosition: `0 0, 0 ${12 * 4}px, ${12 * 4}px -${12 * 4}px, -${12 * 4}px 0px`,
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <canvas
                                        ref={loupeCanvasRef}
                                        className="w-full h-full object-contain relative z-10"
                                    />
                                </div>
                            )}

                            {activeTab !== 'cutout' && (
                                <div className="absolute inset-x-0 bottom-4 text-center lg:hidden pointer-events-none">
                                    <p className="text-[9px] text-slate-500/60 leading-tight font-bold uppercase tracking-widest">{t.editor.hoverZoomNote || 'Hover to Zoom'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:hidden flex-none bg-white border-t border-slate-100 px-2 pb-safe z-50">
                    <div className="w-full h-1 flex justify-center py-2">
                        <div className="w-8 h-1 bg-slate-200 rounded-full" />
                    </div>

                    {/* Mobile Batch Toggle */}
                    <div className="px-4 py-1">
                        <div className="flex p-1 bg-slate-100/50 rounded-xl w-full border border-slate-100/30">
                            <button
                                onClick={() => setApplyToAll(false)}
                                className={cn(
                                    "flex-grow py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
                                    !applyToAll ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                                )}
                            >
                                {t.common.singleEdit}
                            </button>
                            <button
                                onClick={() => setApplyToAll(true)}
                                className={cn(
                                    "flex-grow py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
                                    applyToAll ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                                )}
                            >
                                {t.common.applyToAll}
                            </button>
                        </div>
                    </div>
                    {/* Active Tool Panel (Slide-up context) */}
                    <div className="relative overflow-hidden bg-white h-[140px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="w-full h-full flex flex-col py-2"
                            >
                                {activeTab === 'cutout' && (
                                    <div className="flex items-center gap-4 px-4 w-full h-full">
                                        <button className={cn("p-2.5 rounded-xl border-2 transition-all flex-shrink-0", editMode === 'erase' ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-slate-50 border-slate-100 text-slate-400")} onClick={() => setEditMode('erase')}><Eraser className="w-6 h-6" /></button>
                                        <button className={cn("p-2.5 rounded-xl border-2 transition-all flex-shrink-0", editMode === 'restore' ? "bg-green-50 border-green-200 text-green-600" : "bg-slate-50 border-slate-100 text-slate-400")} onClick={() => setEditMode('restore')}><Wand2 className="w-6 h-6" /></button>
                                        <div className="h-10 w-px bg-slate-100 mx-1 flex-shrink-0" />
                                        <div className="flex-grow min-w-[120px]">
                                            <input type="range" value={brushSize} min="10" max="150" onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full h-2 accent-blue-600" />
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'adjust' && (
                                    <div className="flex flex-col justify-center gap-4 px-6 w-full h-full">
                                        <div className="flex items-center gap-4">
                                            <span className="w-16 text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t.editor.brightness}</span>
                                            <input type="range" value={brightness} min="50" max="150" onChange={(e) => { const val = parseInt(e.target.value); setBrightness(val); updateConfig({ brightness: val }); }} className="flex-grow h-2 accent-blue-600" />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="w-16 text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t.editor.contrast}</span>
                                            <input type="range" value={contrast} min="50" max="150" onChange={(e) => { const val = parseInt(e.target.value); setContrast(val); updateConfig({ contrast: val }); }} className="flex-grow h-2 accent-blue-600" />
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'background' && (
                                    <div className="flex flex-col gap-3 px-4 w-full h-full overflow-hidden">
                                        <div className="flex-none flex items-center justify-between gap-3">
                                            <div className="flex-grow flex gap-1 p-0.5 bg-slate-100 rounded-lg">
                                                {['photo', 'color'].map((tab) => (
                                                    <button key={tab} onClick={() => setBgSubTab(tab as any)} className={cn("flex-grow py-1.5 rounded-md text-[10px] font-black uppercase transition-all", bgSubTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}>
                                                        {tab === 'photo' ? t.editor.photoTab : t.editor.colorTab}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => window.open('https://canva.com', '_blank')}
                                                className="flex-shrink-0 bg-gradient-to-tr from-cyan-500 to-purple-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-bold flex items-center gap-2 active:scale-95 transition-all shadow-md"
                                            >
                                                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[8px] font-black">C</div>
                                                CANVA
                                            </button>
                                        </div>
                                        <div className="flex-grow overflow-y-auto no-scrollbar scroll-smooth p-0.5">
                                            {bgSubTab === 'photo' ? (
                                                <div className="grid grid-cols-4 gap-2 pb-1">
                                                    <button onClick={() => setBgImage(null)} className={cn("aspect-square rounded-lg border-2 flex items-center justify-center bg-slate-50", !bgImage ? "border-blue-600 shadow-sm" : "border-slate-100")}>
                                                        <div className="text-[8px] font-black text-slate-400 uppercase">{t.editor.noneOption}</div>
                                                    </button>
                                                    {photoPresets.map((url, i) => (
                                                        <button key={i} onClick={() => setBgImage(url)} className={cn("aspect-square rounded-lg border-2 overflow-hidden transition-all", bgImage === url ? "border-blue-600 shadow-md scale-95" : "border-slate-100")}>
                                                            <img src={url} className="w-full h-full object-cover" alt="" />
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-6 gap-2 pb-1">
                                                    {colorGridItems.map((item) => (
                                                        <button
                                                            key={item}
                                                            onClick={() => {
                                                                if (item === 'transparent') { setBgColor('transparent'); setBgImage(null); }
                                                                else if (item === 'custom') colorPickerRef.current?.click();
                                                                else { setBgColor(item); setBgImage(null); }
                                                            }}
                                                            className={cn("aspect-square rounded-full border-2 transition-all flex items-center justify-center", bgColor === item && !bgImage ? "border-blue-600 scale-105 shadow-md" : "border-slate-100")}
                                                            style={{ background: item === 'custom' ? 'conic-gradient(red, yellow, green, cyan, blue, magenta, red)' : item === 'transparent' ? '#fff' : item }}
                                                        >
                                                            {item === 'transparent' && <div className="w-full h-[2px] bg-red-500 rotate-45 transform" />}
                                                            {item === 'custom' && <Palette className="w-4 h-4 text-white drop-shadow-sm" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'effects' && (
                                    <div className="flex flex-col justify-center gap-4 px-6 w-full h-full">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => { setIsBlurEnabled(!isBlurEnabled); updateConfig({ isBlurEnabled: !isBlurEnabled }); }} className={cn("flex-shrink-0 p-2 rounded-xl border-2 transition-all", isBlurEnabled ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm" : "bg-slate-50 border-slate-100 text-slate-400")}>
                                                <Sparkles className="w-5 h-5" />
                                            </button>
                                            <input type="range" value={bgBlur} min="0" max="40" onChange={(e) => { const val = parseInt(e.target.value); setBgBlur(val); updateConfig({ bgBlur: val }); }} disabled={!isBlurEnabled} className="flex-grow h-2 accent-blue-600" />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => { setIsShadowEnabled(!isShadowEnabled); updateConfig({ isShadowEnabled: !isShadowEnabled }); }} className={cn("flex-shrink-0 p-2 rounded-xl border-2 transition-all", isShadowEnabled ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm" : "bg-slate-50 border-slate-100 text-slate-400")}>
                                                <LayersIcon className="w-5 h-5" />
                                            </button>
                                            <input type="range" value={shadowOpacity} min="0" max="100" onChange={(e) => { const val = parseInt(e.target.value); setShadowOpacity(val); updateConfig({ shadowOpacity: val }); }} disabled={!isShadowEnabled} className="flex-grow h-2 accent-blue-600" />
                                        </div>
                                        <div className="flex justify-center">
                                            <button onClick={() => { setIsReflectionEnabled(!isReflectionEnabled); updateConfig({ isReflectionEnabled: !isReflectionEnabled }); }} className={cn("px-6 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all", isReflectionEnabled ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-50 border-slate-100 text-slate-400")}>
                                                {t.editor.reflectionLabel}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'zoom' && (
                                    <div className="flex flex-col justify-center items-center gap-2 w-full h-full px-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                            <ZoomIn className="w-6 h-6" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{t.editor.hoverZoomNote}</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Main Navigation Tabs */}
                    <div className="flex justify-around items-center h-20 bg-white">
                        <button onClick={() => setActiveTab('background')} className={cn("flex flex-col items-center gap-1.5 transition-all active:scale-95", activeTab === 'background' ? "text-blue-600" : "text-slate-400")}>
                            <ImageIcon className="w-6 h-6" /><span className="text-[10px] font-bold">{t.common.background}</span>
                        </button>
                        <button onClick={() => setActiveTab('cutout')} className={cn("flex flex-col items-center gap-1.5 transition-all active:scale-95", activeTab === 'cutout' ? "text-blue-600" : "text-slate-400")}>
                            <Scissors className="w-6 h-6" /><span className="text-[10px] font-bold">{t.common.cutout}</span>
                        </button>
                        <button onClick={() => handleDownload()} className="flex flex-col items-center gap-1.5 -translate-y-2">
                            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-200 active:scale-90 transition-all">
                                <Download className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-blue-600">{t.common.download}</span>
                        </button>
                        <button onClick={() => setActiveTab('adjust')} className={cn("flex flex-col items-center gap-1.5 transition-all active:scale-95", activeTab === 'adjust' ? "text-blue-600" : "text-slate-400")}>
                            <Sliders className="w-6 h-6" /><span className="text-[10px] font-bold">{t.common.adjust}</span>
                        </button>
                        <button onClick={() => setActiveTab('effects')} className={cn("flex flex-col items-center gap-1.5 transition-all active:scale-95", activeTab === 'effects' ? "text-blue-600" : "text-slate-400")}>
                            <Wand2 className="w-6 h-6" /><span className="text-[10px] font-bold">{t.common.effects}</span>
                        </button>
                        <button onClick={() => setActiveTab('zoom')} className={cn("flex flex-col items-center gap-1.5 transition-all active:scale-95", activeTab === 'zoom' ? "text-blue-600" : "text-slate-400")}>
                            <ZoomIn className="w-6 h-6" /><span className="text-[10px] font-bold">{t.common.zoom}</span>
                        </button>
                    </div>
                </div>

                <div className="hidden lg:flex w-full lg:w-80 flex-shrink-0 flex flex-col h-full">
                    <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col h-full overflow-hidden dark:bg-slate-900 dark:border-slate-800 dark:shadow-black/20">
                        <div className="flex-grow p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto no-scrollbar">

                            {activeTab === 'cutout' && (
                                <section className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <button
                                        onClick={handleSmartRestoreAll}
                                        disabled={isProcessing}
                                        className={cn(
                                            "p-6 rounded-3xl flex items-center gap-4 border transition-all w-full text-left group bg-white border-slate-100 hover:border-blue-200 active:scale-[0.98] shadow-sm disabled:opacity-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-700"
                                        )}
                                    >
                                        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors dark:bg-blue-900/30 dark:text-blue-400">
                                            <Wand2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-tight text-slate-800 dark:text-white">{t.editor.smartRestoreTitle}</p>
                                            <p className="text-[10px] font-bold leading-tight text-blue-600 dark:text-blue-400">
                                                {isProcessing ? t.common.processing : t.editor.smartRestoreDesc}
                                            </p>
                                        </div>
                                    </button>

                                    <div className="grid grid-cols-2 gap-3 pb-2">
                                        <button onClick={() => setEditMode('erase')} className={cn("flex flex-col items-center gap-2 p-5 rounded-3xl border-2 transition-all", editMode === 'erase' ? "border-blue-600 bg-blue-50/50 text-blue-600 shadow-lg dark:bg-blue-900/20 dark:text-blue-400" : "border-slate-100 bg-white text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500")}>
                                            <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center font-black">-</div>
                                            <span className="text-[11px] font-black uppercase tracking-tight">{t.editor.erase}</span>
                                        </button>
                                        <button onClick={() => setEditMode('restore')} className={cn("flex flex-col items-center gap-2 p-5 rounded-3xl border-2 transition-all", editMode === 'restore' ? "border-blue-600 bg-blue-50/50 text-blue-600 shadow-lg dark:bg-blue-900/20 dark:text-blue-400" : "border-slate-100 bg-white text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500")}>
                                            <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center font-black">+</div>
                                            <span className="text-[11px] font-black uppercase tracking-tight">{t.editor.restore}</span>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[11px] font-black text-slate-800 uppercase tracking-tighter dark:text-white">{t.editor.brushSizeLabel}</label>
                                            <span className="text-[11px] font-black text-blue-600 dark:text-blue-400">{brushSize}px</span>
                                        </div>
                                        <input type="range" min="10" max="250" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:bg-slate-700" />
                                    </div>
                                </section>
                            )}

                            {activeTab === 'background' && (
                                <section className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div className="flex p-1 bg-slate-100 rounded-2xl w-full dark:bg-slate-800">
                                        {(['photo', 'color'] as const).map(tab => (
                                            <button key={tab} onClick={() => setBgSubTab(tab)} className={cn("flex-grow py-2.5 rounded-xl text-[11px] font-black uppercase transition-all", bgSubTab === tab ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-400 dark:text-slate-500")}>
                                                {tab === 'photo' ? t.editor.photoTab : t.editor.colorTab}
                                            </button>
                                        ))}
                                    </div>

                                    {bgSubTab === 'photo' && (
                                        <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2">
                                            <button onClick={() => { setBgImage(null); updateConfig({ bgImage: null }); }} className={cn("h-24 rounded-2xl border-2 flex items-center justify-center bg-slate-50", !bgImage ? "border-blue-600" : "border-slate-100 dark:border-slate-700 dark:bg-slate-800")}>
                                                <div className="text-[10px] font-black text-slate-400 uppercase">{t.editor.noneOption}</div>
                                            </button>
                                            {photoPresets.map((url, i) => (
                                                <button key={i} onClick={() => { setBgImage(url); updateConfig({ bgImage: url }); }} className={cn("h-24 rounded-2xl border-2 overflow-hidden transition-all group relative", bgImage === url ? "border-blue-600 scale-102 shadow-lg" : "border-slate-100 dark:border-slate-700")}>
                                                    <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" onError={(e) => (e.target as HTMLImageElement).parentElement?.classList.add('hidden')} />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {bgSubTab === 'color' && (
                                        <div className="grid grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-2">
                                            {colorGridItems.map((item) => {
                                                if (item === 'transparent') {
                                                    return (
                                                        <button key="none" onClick={() => { setBgColor('transparent'); setBgImage(null); updateConfig({ bgColor: 'transparent', bgImage: null }); }} className={cn("h-12 rounded-xl border-2 flex items-center justify-center transition-all", bgColor === 'transparent' && !bgImage ? "border-blue-600 scale-105 shadow-md" : "border-slate-50 dark:border-slate-700")}>
                                                            <div className="w-5 h-5 border-2 border-slate-300 rounded-full flex items-center justify-center relative">
                                                                <div className="absolute w-full h-[2px] bg-slate-300 rotate-45" />
                                                            </div>
                                                        </button>
                                                    );
                                                }
                                                if (item === 'custom') {
                                                    return (
                                                        <button key="custom" onClick={() => colorPickerRef.current?.click()} className={cn("h-12 rounded-xl border-2 flex items-center justify-center transition-all bg-gradient-to-tr from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400", bgColor !== 'transparent' && !colorGridItems.includes(bgColor) && !bgImage ? "border-blue-600 scale-105 shadow-md" : "border-slate-50 dark:border-slate-700")}>
                                                            <Palette className="w-5 h-5 text-white drop-shadow-md" />
                                                            <input ref={colorPickerRef} type="color" value={customColor} onChange={(e) => { const col = e.target.value; setCustomColor(col); setBgColor(col); setBgImage(null); updateConfig({ bgColor: col, bgImage: null }); }} className="sr-only" />
                                                        </button>
                                                    );
                                                }
                                                return <button key={item} onClick={() => { setBgColor(item); setBgImage(null); updateConfig({ bgColor: item, bgImage: null }); }} className={cn("h-12 rounded-xl border-2 transition-all", bgColor === item && !bgImage ? "border-blue-600 scale-105 shadow-md" : "border-slate-50 dark:border-slate-700")} style={{ background: item }} />;
                                            })}
                                        </div>
                                    )}
                                </section>
                            )}

                            {activeTab === 'effects' && (
                                <section className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-10 h-5 rounded-full transition-all relative cursor-pointer", isBlurEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600")} onClick={() => { setIsBlurEnabled(!isBlurEnabled); updateConfig({ isBlurEnabled: !isBlurEnabled }); }}>
                                                <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm", isBlurEnabled ? "right-1" : "left-1")} />
                                            </div>
                                            <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter dark:text-white">{t.editor.blurBackground}</span>
                                        </div>
                                        <input type="range" min="0" max="40" step="1" value={bgBlur} onChange={(e) => { const val = parseInt(e.target.value); setBgBlur(val); updateConfig({ bgBlur: val }); }} className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:bg-slate-700" />
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 font-black text-[11px] text-slate-800 uppercase tracking-tighter dark:text-white">
                                            <div className={cn("w-10 h-5 rounded-full transition-all relative cursor-pointer", isShadowEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600")} onClick={() => { setIsShadowEnabled(!isShadowEnabled); updateConfig({ isShadowEnabled: !isShadowEnabled }); }}>
                                                <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm", isShadowEnabled ? "right-1" : "left-1")} />
                                            </div>
                                            <span>{t.editor.productShadow}</span>
                                        </div>
                                        <input type="range" min="0" max="100" value={shadowOpacity} onChange={(e) => { const val = parseInt(e.target.value); setShadowOpacity(val); updateConfig({ shadowOpacity: val }); }} className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:bg-slate-700" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-3xl border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
                                        <span className="text-[11px] font-black text-blue-900 uppercase tracking-tighter dark:text-blue-400">{t.editor.reflectionLabel}</span>
                                        <button onClick={() => { setIsReflectionEnabled(!isReflectionEnabled); updateConfig({ isReflectionEnabled: !isReflectionEnabled }); }} className={cn("w-10 h-5 rounded-full transition-all relative", isReflectionEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600")}>
                                            <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm", isReflectionEnabled ? "right-1" : "left-1")} />
                                        </button>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'adjust' && (
                                <section className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div className="space-y-4 p-5 bg-slate-50 rounded-3xl dark:bg-slate-800">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase dark:text-slate-400"><span>{t.editor.brightness}</span><span>{brightness}%</span></div>
                                            <input type="range" min="50" max="150" value={brightness} onChange={(e) => { const val = parseInt(e.target.value); setBrightness(val); updateConfig({ brightness: val }); }} className="w-full h-1 bg-white rounded-lg appearance-none cursor-pointer accent-blue-600 dark:bg-slate-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase dark:text-slate-400"><span>{t.editor.contrast}</span><span>{contrast}%</span></div>
                                            <input type="range" min="50" max="150" value={contrast} onChange={(e) => { const val = parseInt(e.target.value); setContrast(val); updateConfig({ contrast: val }); }} className="w-full h-1 bg-white rounded-lg appearance-none cursor-pointer accent-blue-600 dark:bg-slate-700" />
                                        </div>
                                    </div>
                                </section>
                            )}
                            {activeTab === 'resize' && (
                                <section className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 px-1">
                                            <Maximize className="w-4 h-4 text-blue-600" />
                                            <label className="text-[11px] font-black text-slate-800 uppercase tracking-tighter dark:text-white">{t.editor.socialResizing}</label>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {socialRatios.map(r => (
                                                <button key={r.value} onClick={() => { setAspectRatio(r.value); updateConfig({ aspectRatio: r.value }); }} className={cn("px-4 py-4 text-[11px] font-black rounded-2xl border-2 transition-all text-center leading-tight", aspectRatio === r.value ? "bg-blue-600 border-blue-600 text-white shadow-xl scale-105" : "bg-white border-slate-100 text-slate-600 hover:border-blue-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-900")}>{r.label}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2"><ZoomIn className="w-4 h-4 text-blue-600" /><span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter dark:text-white">{t.editor.fitPadding}</span></div>
                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">{objectPadding}%</span>
                                        </div>
                                        <input type="range" min="0" max="40" value={objectPadding} onChange={(e) => { const val = parseInt(e.target.value); setObjectPadding(val); updateConfig({ objectPadding: val }); }} className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-blue-600 dark:bg-slate-700" />
                                    </div>
                                </section>
                            )}
                            {activeTab === 'zoom' && (
                                <section className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 flex flex-col items-center text-center space-y-4">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center dark:bg-slate-800">
                                            <ZoomIn className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-black text-slate-800 uppercase tracking-tight dark:text-white mb-1">
                                                {t.common.zoom}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic max-w-[200px]">
                                                "{t.editor.hoverZoomNote}"
                                            </p>
                                        </div>
                                        <div className="pt-4 w-full">
                                            <div className="h-px bg-blue-100 w-full dark:bg-blue-900/30" />
                                            <p className="mt-4 text-[9px] font-black text-blue-600 uppercase tracking-widest">{t.editor.qualityHigh}</p>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                        <div className="p-6 border-t border-slate-50 bg-white dark:bg-slate-900 dark:border-slate-800">
                            <button onClick={onReset} className="w-full py-4 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-all flex items-center justify-center gap-2 text-[10px] uppercase border border-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20">
                                <Trash2 className="w-3.5 h-3.5" /> Clear Workspace
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
