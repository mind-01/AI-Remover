import { useState, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { AnimatePresence, motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { Header } from './components/layout/Header';
import { Hero } from './components/Hero';
import { ProcessingView } from './components/ProcessingView';
import { ResultViewer } from './components/ResultViewer';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/layout/Footer';

interface ProcessingTask {
  id: string;
  file: File;
  originalUrl: string;
  processedUrl: string | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

function App() {
  const [tasks, setTasks] = useState<ProcessingTask[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isQualityBoost, setIsQualityBoost] = useState(false);

  const refineImage = useCallback((blob: Blob): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const width = img.width;
        const height = img.height;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const outData = new Uint8ClampedArray(data);

        const strength = isQualityBoost ? 1.5 : 0.8;

        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            if (data[idx + 3] > 10) {
              let minAlpha = 255;
              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  const nIdx = ((y + dy) * width + (x + dx)) * 4;
                  if (data[nIdx + 3] < minAlpha) minAlpha = data[nIdx + 3];
                }
              }
              if (minAlpha < 220) {
                outData[idx + 3] = Math.max(0, data[idx + 3] - (255 - minAlpha) * strength);
              }
            }
          }
        }

        const ghostThreshold = isQualityBoost ? 110 : 70;
        for (let i = 0; i < outData.length; i += 4) {
          if (outData[i + 3] < ghostThreshold) outData[i + 3] = 0;
        }

        ctx.putImageData(new ImageData(outData, width, height), 0, 0);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tCtx = tempCanvas.getContext('2d')!;
        tCtx.filter = 'blur(0.5px)';
        tCtx.drawImage(canvas, 0, 0);

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(tempCanvas, 0, 0);

        canvas.toBlob((refined) => resolve(refined || blob), 'image/png');
      };
      img.src = URL.createObjectURL(blob);
    });
  }, [isQualityBoost]);

  const processFile = useCallback(async (task: ProcessingTask) => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'processing', progress: 0 } : t));

    try {
      const blob = await removeBackground(task.file, {
        progress: (_key: string, current: number, total: number) => {
          const progress = Math.round((current / total) * 100);
          setTasks(prev => prev.map(t => t.id === task.id ? { ...t, progress } : t));
        },
      });

      const refinedBlob = await refineImage(blob);
      const resultUrl = URL.createObjectURL(refinedBlob);

      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, processedUrl: resultUrl, status: 'completed', progress: 100 } : t));
      setActiveTaskId(prev => prev || task.id);
    } catch (err) {
      console.error(err);
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'error' } : t));
      setError("Failed to process one or more images.");
    }
  }, [refineImage]);

  const handleFilesSelect = async (selectedFiles: File[]) => {
    const newTasks: ProcessingTask[] = selectedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      originalUrl: URL.createObjectURL(file),
      processedUrl: null,
      status: 'pending',
      progress: 0
    }));

    setTasks(prev => [...prev, ...newTasks]);
    setError(null);

    // Process each new task
    for (const task of newTasks) {
      processFile(task);
    }
  };

  const handleReset = () => {
    tasks.forEach(task => {
      if (task.originalUrl) URL.revokeObjectURL(task.originalUrl);
      if (task.processedUrl) URL.revokeObjectURL(task.processedUrl);
    });
    setTasks([]);
    setActiveTaskId(null);
    setError(null);
  };

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const isAnyProcessing = tasks.some(t => t.status === 'processing' || t.status === 'pending');

  return (
    <div className="min-h-screen text-slate-900 overflow-x-hidden font-sans bg-[#fcfcfd]">
      <Header
        isQualityBoost={isQualityBoost}
        onQualityBoostToggle={() => setIsQualityBoost(!isQualityBoost)}
      />

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {tasks.length === 0 ? (
            <motion.div key="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
              <Hero onFilesSelect={handleFilesSelect} />
              <FeaturesSection />
            </motion.div>

          ) : isAnyProcessing && !activeTask?.processedUrl ? (
            <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
              <ProcessingView progress={tasks.reduce((acc, t) => acc + t.progress, 0) / (tasks.length || 1)} />
            </motion.div>
          ) : activeTask && activeTask.processedUrl ? (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ResultViewer
                originalUrl={activeTask.originalUrl}
                processedUrl={activeTask.processedUrl}
                onReset={handleReset}
                taskList={tasks}
                activeTaskId={activeTaskId || ""}
                onSelectTask={setActiveTaskId}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {error && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-[100]">
            <span>⚠️</span> {error}
          </div>
        )}
      </main>

      <Footer />
      <Analytics />
    </div>
  );
}

export default App;
