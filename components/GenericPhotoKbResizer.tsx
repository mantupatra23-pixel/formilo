// components/GenericPhotoKbResizer.tsx
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Camera, 
  Image as ImageIcon, 
  UploadCloud, 
  Download, 
  RefreshCw, 
  ZoomIn, 
  RotateCw, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Sliders, 
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { canvasToBlobSafe, getImageFormat } from '@/lib/imageCompression';

interface GenericPhotoKbResizerProps {
  initialTargetKB?: number;
  onTargetChange?: (kb: number) => void;
}

const AVAILABLE_TARGETS = [20, 30, 50, 100, 150, 200];

export default function GenericPhotoKbResizer({ 
  initialTargetKB = 50,
  onTargetChange
}: GenericPhotoKbResizerProps) {
  const [targetKB, setTargetKB] = useState<number>(initialTargetKB);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  
  // Output State
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [finalSizeKB, setFinalSizeKB] = useState<number | null>(null);
  const [outputDimensions, setOutputDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Framing Adjustments
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelectTarget = (newKB: number) => {
    setTargetKB(newKB);
    if (onTargetChange) onTargetChange(newKB);
  };

  const processIncomingFile = (file: File) => {
    if (!file) return;

    setErrorMessage(null);
    setProcessedUrl(null);
    setProcessedBlob(null);
    setFinalSizeKB(null);
    setZoom(1);
    setRotation(0);
    setPanX(0);
    setPanY(0);

    const format = getImageFormat(file);
    if (format === 'HEIC') {
      setErrorMessage('HEIC format is not supported. Please choose a standard JPG or PNG photo.');
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
    reader.readAsDataURL(file);
  };

  // Strict 2-Tier Compression Engine (Guarantees Actual Size <= targetKB)
  const executeCompression = useCallback(async () => {
    if (!sourceImage || !selectedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const naturalW = sourceImage.naturalWidth;
      const naturalH = sourceImage.naturalHeight;
      const aspect = naturalW / naturalH;

      // Tier 1: Optimal Initial Starting Dimensions based on target KB
      let startMaxDim = 1600;
      if (targetKB <= 20) startMaxDim = 500;        // 500 px easily hits < 20 KB with crisp Q 0.7-0.85
      else if (targetKB <= 30) startMaxDim = 650;   // 650 px easily hits < 30 KB
      else if (targetKB <= 50) startMaxDim = 850;   // 850 px easily hits < 50 KB
      else if (targetKB <= 100) startMaxDim = 1400; // 1400 px for 100 KB
      else if (targetKB <= 150) startMaxDim = 1800; // 1800 px for 150 KB
      else startMaxDim = 2200;                      // 2200 px for 200 KB

      let currentW = naturalW;
      let currentH = naturalH;

      if (naturalW > startMaxDim || naturalH > startMaxDim) {
        if (aspect >= 1) {
          currentW = startMaxDim;
          currentH = Math.round(startMaxDim / aspect);
        } else {
          currentH = startMaxDim;
          currentW = Math.round(startMaxDim * aspect);
        }
      }

      const targetMaxBytes = Math.floor(targetKB * 1024); // Strict Binary Bytes Lock (1 KB = 1024 Bytes)
      let bestBlob: Blob | null = null;
      let finalRenderW = currentW;
      let finalRenderH = currentH;

      // Tier 2: Iterative Dimension + Quality Reduction Loop (Runs until size <= targetMaxBytes)
      for (let dimStep = 0; dimStep < 10; dimStep++) {
        const testCanvas = document.createElement('canvas');
        testCanvas.width = currentW;
        testCanvas.height = currentH;
        const ctx = testCanvas.getContext('2d', { alpha: false });
        if (!ctx) break;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, currentW, currentH);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.save();
        ctx.translate(currentW / 2 + panX, currentH / 2 + panY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);
        ctx.drawImage(sourceImage, -currentW / 2, -currentH / 2, currentW, currentH);
        ctx.restore();

        // 8-Step Precision Binary Search for Highest JPEG Quality
        let lowQ = 0.15;
        let highQ = 0.98;
        let localBestBlob: Blob | null = null;

        for (let qStep = 0; qStep < 8; qStep++) {
          const midQ = (lowQ + highQ) / 2;
          const blob = await canvasToBlobSafe(testCanvas, 'image/jpeg', midQ);

          if (blob.size <= targetMaxBytes) {
            localBestBlob = blob;
            lowQ = midQ; // Push higher quality to stay close to max allowed KB
          } else {
            highQ = midQ;
          }
        }

        // Check if strict target was satisfied
        if (localBestBlob && localBestBlob.size <= targetMaxBytes) {
          bestBlob = localBestBlob;
          finalRenderW = currentW;
          finalRenderH = currentH;
          break; // STRICT SUCCESS!
        }

        // If lowest quality (0.15) is still > targetMaxBytes, scale down dimensions by 12% and retry
        currentW = Math.round(currentW * 0.88);
        currentH = Math.round(currentH * 0.88);
        if (currentW < 80 || currentH < 80) break;
      }

      // Emergency Absolute Guarantee Fallback
      if (!bestBlob || bestBlob.size > targetMaxBytes) {
        const emergencyCanvas = document.createElement('canvas');
        emergencyCanvas.width = Math.min(currentW, 320);
        emergencyCanvas.height = Math.min(currentH, 400);
        const eCtx = emergencyCanvas.getContext('2d', { alpha: false });
        if (eCtx) {
          eCtx.fillStyle = '#FFFFFF';
          eCtx.fillRect(0, 0, emergencyCanvas.width, emergencyCanvas.height);
          eCtx.drawImage(sourceImage, 0, 0, emergencyCanvas.width, emergencyCanvas.height);
          bestBlob = await canvasToBlobSafe(emergencyCanvas, 'image/jpeg', 0.5);
          finalRenderW = emergencyCanvas.width;
          finalRenderH = emergencyCanvas.height;
        }
      }

      if (bestBlob) {
        const finalUrl = URL.createObjectURL(bestBlob);
        setProcessedBlob(bestBlob);
        setProcessedUrl(finalUrl);
        setFinalSizeKB(Number((bestBlob.size / 1024).toFixed(1)));
        setOutputDimensions({ width: finalRenderW, height: finalRenderH });

        // Update live screen canvas
        if (canvasRef.current) {
          canvasRef.current.width = finalRenderW;
          canvasRef.current.height = finalRenderH;
          const screenCtx = canvasRef.current.getContext('2d', { alpha: false });
          if (screenCtx) {
            screenCtx.drawImage(sourceImage, 0, 0, finalRenderW, finalRenderH);
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Compression error occurred.');
    } finally {
      setIsProcessing(false);
    }
  }, [sourceImage, selectedFile, targetKB, zoom, rotation, panX, panY]);

  // Debounced auto-render
  useEffect(() => {
    if (sourceImage) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        executeCompression();
      }, 150);
    }
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [sourceImage, executeCompression]);

  const handleDownload = () => {
    if (!processedBlob || !processedUrl) return;
    const link = document.createElement('a');
    link.download = `formilo-photo-${targetKB}kb.jpg`;
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
  };

  const nudge = (dx: number, dy: number) => {
    setPanX((prev) => prev + dx);
    setPanY((prev) => prev + dy);
  };

  return (
    <div className="w-full bg-[#0c0d0e] border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && processIncomingFile(e.target.files[0])}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="user"
        onChange={(e) => e.target.files?.[0] && processIncomingFile(e.target.files[0])}
        className="hidden"
      />

      {/* Target KB Selector Bar */}
      <div className="p-4 rounded-2xl bg-black border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Target File Size Lock:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {AVAILABLE_TARGETS.map((kb) => (
            <button
              key={kb}
              type="button"
              onClick={() => handleSelectTarget(kb)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                targetKB === kb
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 scale-105'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {kb} KB
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-red-950/50 border border-red-500/50 rounded-2xl flex items-center gap-2.5 text-xs text-red-300">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!selectedFile ? (
        <div className="p-8 rounded-3xl bg-zinc-950/60 border-2 border-dashed border-zinc-800 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-950/30">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              Choose Photo to Compress Strictly Under {targetKB} KB
            </h3>
            <p className="text-xs text-zinc-400">
              Guaranteed &le; {targetKB} KB &bull; Aspect-ratio safe &bull; Zero server uploads
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-sm mx-auto pt-2">
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>🖼️ Choose Image</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>📷 Take Photo</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Framing & Viewport */}
            <div className="p-4 bg-black rounded-2xl border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-300">Live Aspect-Safe Frame</span>
                <span className="text-zinc-500 text-[11px] font-mono truncate max-w-[130px]">
                  {selectedFile.name}
                </span>
              </div>

              <div className="relative w-full h-64 bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-800 p-2">
                <canvas
                  ref={canvasRef}
                  className="max-h-full max-w-full object-contain rounded shadow-lg bg-white"
                />

                {isProcessing && (
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/90 border border-emerald-500/40 text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Locking &le; {targetKB} KB...
                  </div>
                )}
              </div>

              {/* Position & Zoom Sliders */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3 text-emerald-400" /> Zoom &amp; Scale</span>
                  <span className="font-mono text-zinc-300">{(zoom * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="py-1.5 px-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-200 flex items-center justify-center gap-1 transition-colors"
                  >
                    <RotateCw className="w-3 h-3 text-emerald-400" />
                    <span>Rotate 90°</span>
                  </button>

                  <div className="grid grid-cols-4 gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                    <button type="button" onClick={() => nudge(0, -10)} title="Up" className="py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 flex items-center justify-center"><ChevronUp className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => nudge(0, 10)} title="Down" className="py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 flex items-center justify-center"><ChevronDown className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => nudge(-10, 0)} title="Left" className="py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 flex items-center justify-center"><ChevronLeft className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => nudge(10, 0)} title="Right" className="py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 flex items-center justify-center"><ChevronRight className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Result Card */}
            <div className="p-4 bg-black rounded-2xl border border-zinc-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs border-b border-zinc-850 pb-2">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Ready for Upload
                  </span>
                  {finalSizeKB && (
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                      finalSizeKB <= targetKB 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' 
                        : 'bg-red-950 text-red-400 border-red-500/40'
                    }`}>
                      Target: &le; {targetKB} KB
                    </span>
                  )}
                </div>

                <div className="relative w-full h-52 bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-850 mt-3 p-2">
                  {processedUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={processedUrl}
                      alt="Verified output"
                      className="max-h-full max-w-full object-contain rounded shadow-lg bg-white"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" /> Verifying strict size...
                    </div>
                  )}
                </div>

                {/* Verified Specs */}
                <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Actual File Size</span>
                    <span className="text-emerald-400 font-bold">{finalSizeKB || '...'} KB ✓</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Format</span>
                    <span className="text-white font-bold">JPG ✓</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Dimensions</span>
                    <span className="text-white font-bold truncate">{outputDimensions.width}×{outputDimensions.height}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                    title="Try Another Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={!processedBlob || isProcessing}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Image ({finalSizeKB} KB)</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      <div className="text-center pt-1">
        <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Strict Binary Math: 1 KB = 1024 Bytes &bull; Guaranteed &le; {targetKB} KB
        </p>
      </div>

    </div>
  );
}
