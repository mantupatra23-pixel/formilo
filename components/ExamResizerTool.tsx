// components/ExamResizerTool.tsx
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  UploadCloud, 
  Download, 
  RefreshCw, 
  ZoomIn, 
  RotateCw, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { compressImageToTarget, getImageFormat } from '@/lib/imageCompression';

interface ExamResizerToolProps {
  preset?: {
    id?: string;
    slug?: string;
    examName?: string;
    docType?: string;
    targetKB?: number;
    maxKB?: number;
    minKB?: number;
    width?: number;
    height?: number;
    dpi?: number;
    dimensionText?: string;
    bgColor?: string;
    toolType?: string;
  };
  config?: any;
}

export default function ExamResizerTool({ preset, config }: ExamResizerToolProps) {
  const activeConfig = preset || config || {};

  const targetKB = Number(activeConfig.targetKB || activeConfig.maxKB || 50);
  const targetWidth = Number(activeConfig.width || 350);
  const targetHeight = Number(activeConfig.height || 450);
  const docType = activeConfig.docType || 'Document / Photo';
  const examName = activeConfig.examName || 'Official Exam';
  const dimensionText = activeConfig.dimensionText || `${targetWidth} × ${targetHeight} px`;

  const isSignature =
    docType?.toLowerCase().includes('signature') ||
    activeConfig.toolType?.toLowerCase().includes('signature') ||
    activeConfig.slug?.includes('signature');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [finalSizeKB, setFinalSizeKB] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('contain');

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; initialPanX: number; initialPanY: number }>({
    x: 0,
    y: 0,
    initialPanX: 0,
    initialPanY: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reliable Multi-Platform Image Loader
  const handleIncomingFile = (file: File) => {
    if (!file) return;

    setErrorMessage(null);
    setProcessedUrl(null);
    setProcessedBlob(null);
    setFinalSizeKB(null);
    setZoom(1);
    setRotation(0);
    setPanX(0);
    setPanY(0);
    setFitMode('contain');

    const format = getImageFormat(file);
    if (format === 'HEIC') {
      setErrorMessage('HEIC format is not supported. Please choose a JPG or PNG photo.');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = dataUrl;
      img.onload = () => {
        setSourceImage(img);
      };
      img.onerror = () => {
        setErrorMessage('Failed to decode this photo. Please try another image.');
      };
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read file from storage.');
    };
    reader.readAsDataURL(file);
  };

  const drawToCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (!sourceImage) return;

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.save();
      ctx.translate(targetWidth / 2 + panX, targetHeight / 2 + panY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      const naturalW = sourceImage.naturalWidth;
      const naturalH = sourceImage.naturalHeight;
      const imgAspect = naturalW / naturalH;
      const canvasAspect = targetWidth / targetHeight;

      let drawW = targetWidth;
      let drawH = targetHeight;

      if (fitMode === 'cover') {
        if (imgAspect > canvasAspect) {
          drawH = targetHeight;
          drawW = targetHeight * imgAspect;
        } else {
          drawW = targetWidth;
          drawH = targetWidth / imgAspect;
        }
      } else {
        if (imgAspect > canvasAspect) {
          drawW = targetWidth;
          drawH = targetWidth / imgAspect;
        } else {
          drawH = targetHeight;
          drawW = targetHeight * imgAspect;
        }
      }

      ctx.drawImage(sourceImage, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    },
    [sourceImage, targetWidth, targetHeight, panX, panY, zoom, rotation, fitMode]
  );

  const triggerCompression = useCallback(async () => {
    if (!sourceImage || !selectedFile) return;

    setIsProcessing(true);
    try {
      const exportCanvas = document.createElement('canvas');
      drawToCanvas(exportCanvas);

      const tempBlob: Blob = await new Promise((resolve) => {
        exportCanvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.98);
      });

      const tempFile = new File([tempBlob], selectedFile.name, { type: 'image/jpeg' });

      const compressionResult = await compressImageToTarget(tempFile, {
        targetKB,
        width: targetWidth,
        height: targetHeight,
        forceJpeg: true,
      });

      const finalUrl = URL.createObjectURL(compressionResult.blob);
      setProcessedBlob(compressionResult.blob);
      setProcessedUrl(finalUrl);
      setFinalSizeKB(Number((compressionResult.blob.size / 1024).toFixed(1)));
    } catch (err: any) {
      setErrorMessage(err.message || 'Compression error.');
    } finally {
      setIsProcessing(false);
    }
  }, [sourceImage, selectedFile, drawToCanvas, targetKB, targetWidth, targetHeight]);

  useEffect(() => {
    if (canvasRef.current && sourceImage) {
      drawToCanvas(canvasRef.current);

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        triggerCompression();
      }, 150);
    }
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [drawToCanvas, sourceImage, triggerCompression]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: panX,
      initialPanY: panY,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setPanX(dragStartRef.current.initialPanX + deltaX);
    setPanY(dragStartRef.current.initialPanY + deltaY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const nudge = (dx: number, dy: number) => {
    setPanX((prev) => prev + dx);
    setPanY((prev) => prev + dy);
  };

  const handleDownload = () => {
    if (!processedBlob || !processedUrl) return;
    const link = document.createElement('a');
    link.download = `${activeConfig.slug || 'formilo-document'}-ready.jpg`;
    link.href = processedUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSourceImage(null);
    setProcessedUrl(null);
    setProcessedBlob(null);
    setFinalSizeKB(null);
    setErrorMessage(null);
    setPanX(0);
    setPanY(0);
    setZoom(1);
    setRotation(0);
    setFitMode('contain');
  };

  return (
    <div className="w-full bg-[#0c0d0e] border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      
      {/* Target Lock Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-black/70 rounded-2xl border border-zinc-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-400 font-mono font-semibold uppercase tracking-wider">
            Lock Target:{' '}
            <strong className="text-white">
              {isSignature ? 'SIGNATURE' : 'PHOTO RESIZER'}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold">
            &le; {targetKB} KB
          </span>
          <button
            type="button"
            onClick={() =>
              alert(
                `Dimensions are locked to ${dimensionText} to comply with official recruitment portal standards.`
              )
            }
            className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono hover:border-emerald-500/50 cursor-pointer flex items-center gap-1"
            title="Click to view dimension specifications"
          >
            <span>🔒</span>
            <span>{dimensionText}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-red-950/50 border border-red-500/50 rounded-2xl flex items-center gap-2.5 text-xs text-red-300">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!selectedFile ? (
        <label
          htmlFor="exam-file-input"
          className="relative w-full py-12 px-4 rounded-3xl border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 bg-zinc-950/50 transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer select-none group"
        >
          <input
            id="exam-file-input"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleIncomingFile(e.target.files[0]);
                e.target.value = '';
              }
            }}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/30 group-hover:scale-105 transition-transform pointer-events-none">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div className="space-y-1 pointer-events-none">
            <p className="text-sm sm:text-base font-bold text-white">
              Tap to Choose Photo or Document
            </p>
            <p className="text-xs text-zinc-400">
              HD Auto-Framing for {examName} • JPG, PNG
            </p>
          </div>

          <span className="mt-2 px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs pointer-events-none">
            Select Document
          </span>
        </label>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-black rounded-2xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-300">
                Live HD Framing ({dimensionText})
              </span>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                {finalSizeKB && (
                  <span className={`px-2 py-0.5 rounded font-bold border ${
                    finalSizeKB <= targetKB 
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' 
                      : 'bg-red-950 text-red-400 border-red-500/40'
                  }`}>
                    {finalSizeKB} KB / {targetKB} KB (HD)
                  </span>
                )}
              </div>
            </div>

            <div 
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative w-full min-h-[280px] bg-[#101012] rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-zinc-700/80 cursor-grab active:cursor-grabbing touch-none select-none p-3"
            >
              <canvas
                ref={canvasRef}
                style={{
                  aspectRatio: `${targetWidth} / ${targetHeight}`,
                  maxHeight: '260px',
                  maxWidth: '100%',
                }}
                className="object-contain rounded-lg shadow-2xl border-2 border-emerald-500/60 bg-white"
              />

              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/80 backdrop-blur border border-zinc-800 text-[10px] text-zinc-300 font-mono pointer-events-none">
                👆 Drag photo to center face/signature
              </div>

              {isProcessing && (
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/90 backdrop-blur border border-emerald-500/40 text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 pointer-events-none">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Optimizing HD...
                </div>
              )}
            </div>

            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1 font-semibold">
                    <ZoomIn className="w-3.5 h-3.5 text-emerald-400" /> Zoom &amp; Scale
                  </span>
                  <span className="font-mono text-zinc-300">{(zoom * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFitMode(fitMode === 'cover' ? 'contain' : 'cover')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                    fitMode === 'contain'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                  }`}
                >
                  {fitMode === 'contain' ? <Minimize2 className="w-3.5 h-3.5 text-emerald-400" /> : <Maximize2 className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{fitMode === 'contain' ? 'Fit Full (No Cut)' : 'Fill & Crop'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="py-2 px-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-200 flex items-center justify-center gap-1 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rotate 90°</span>
                </button>

                <div className="grid grid-cols-4 col-span-2 gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                  <button type="button" onClick={() => nudge(0, -15)} title="Move Up" className="py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 flex items-center justify-center"><ChevronUp className="w-4 h-4" /></button>
                  <button type="button" onClick={() => nudge(0, 15)} title="Move Down" className="py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 flex items-center justify-center"><ChevronDown className="w-4 h-4" /></button>
                  <button type="button" onClick={() => nudge(-15, 0)} title="Move Left" className="py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
                  <button type="button" onClick={() => nudge(15, 0)} title="Move Right" className="py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!processedBlob || isProcessing}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download HD Verified Document ({finalSizeKB || targetKB} KB)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center pt-1">
        <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Ultra HD Crisp Interpolation &bull; Max Allowed Quality Retention
        </p>
      </div>

    </div>
  );
}
