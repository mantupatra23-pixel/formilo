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
  Move,
  Maximize2,
  Minimize2
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

  // State Management
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [finalSizeKB, setFinalSizeKB] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Framing & Adjustment State
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');

  // Dragging State
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; initialPanX: number; initialPanY: number }>({
    x: 0,
    y: 0,
    initialPanX: 0,
    initialPanY: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleDropzoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (file: File) => {
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
      setErrorMessage('HEIC format is not supported. Please choose a JPG or PNG file.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = objectUrl;
    img.onload = () => {
      setSourceImage(img);
    };
    img.onerror = () => {
      setErrorMessage('Failed to decode this photo. Please upload a standard JPG/PNG.');
    };
  };

  // Live Canvas Rendering Engine (Aspect-Ratio Safe, No Stretch)
  const renderCanvas = useCallback(
    (outputCanvas: HTMLCanvasElement) => {
      if (!sourceImage) return;

      outputCanvas.width = targetWidth;
      outputCanvas.height = targetHeight;
      const ctx = outputCanvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      // Clean White Background for official forms
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.save();
      // Move origin to center
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
        // Contain (Fit full image with margins)
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

  // Update Live Preview Canvas
  useEffect(() => {
    if (previewCanvasRef.current && sourceImage) {
      renderCanvas(previewCanvasRef.current);
    }
  }, [renderCanvas, sourceImage]);

  // Generate & Compress Output to exact target KB
  const handleGenerate = useCallback(async () => {
    if (!sourceImage || !selectedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const exportCanvas = document.createElement('canvas');
      renderCanvas(exportCanvas);

      const tempBlob: Blob = await new Promise((resolve) => {
        exportCanvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95);
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
      setErrorMessage(err.message || 'Compression error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [sourceImage, selectedFile, renderCanvas, targetKB, targetWidth, targetHeight]);

  // Auto generate on first load
  useEffect(() => {
    if (sourceImage) {
      handleGenerate();
    }
  }, [sourceImage]);

  // Touch / Mouse Dragging Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDraggingImage(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: panX,
      initialPanY: panY,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingImage) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setPanX(dragStartRef.current.initialPanX + deltaX);
    setPanY(dragStartRef.current.initialPanY + deltaY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingImage) {
      setIsDraggingImage(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full bg-[#0c0d0e] border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Target Spec Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-black/60 rounded-2xl border border-zinc-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-400">Target Spec:</span>
          <span className="font-bold text-white uppercase">{docType}</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold">
            &lt; {targetKB} KB
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
            {dimensionText}
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-red-950/50 border border-red-500/50 rounded-2xl flex items-center gap-2.5 text-xs text-red-300">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!selectedFile ? (
        <div
          onClick={handleDropzoneClick}
          className="w-full py-12 px-4 rounded-3xl border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 bg-zinc-950/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/30">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <p className="text-sm sm:text-base font-bold text-white">
              Tap to Choose Photo or Document
            </p>
            <p className="text-xs text-zinc-400">
              Supports JPG, PNG • Instant auto-resize for {examName}
            </p>
          </div>
          <button
            type="button"
            className="mt-2 px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs pointer-events-none"
          >
            Select Document
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Interactive Framing Box (Drag to adjust) */}
            <div className="p-4 bg-black rounded-2xl border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-emerald-400" /> Touch &amp; Drag to Move
                </span>
                <span className="text-zinc-500 text-[11px] font-mono truncate max-w-[130px]">
                  {selectedFile.name}
                </span>
              </div>

              {/* Viewport Box */}
              <div 
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="relative w-full h-64 bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-800 cursor-grab active:cursor-grabbing touch-none select-none"
              >
                <canvas
                  ref={previewCanvasRef}
                  className="max-h-full max-w-full object-contain rounded shadow-lg border border-zinc-700 pointer-events-none"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] text-zinc-400 font-mono pointer-events-none">
                  Live View
                </div>
              </div>

              {/* Tools Controls Bar */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3 text-emerald-400" /> Zoom</span>
                  <span className="font-mono text-zinc-300">{(zoom * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="py-2 px-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-[11px] font-semibold text-zinc-200 flex items-center justify-center gap-1 transition-colors"
                  >
                    <RotateCw className="w-3 h-3 text-emerald-400" />
                    <span>Rotate</span>
                  </button>

                  <button
                    onClick={() => setFitMode(fitMode === 'cover' ? 'contain' : 'cover')}
                    className="py-2 px-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-[11px] font-semibold text-zinc-200 flex items-center justify-center gap-1 transition-colors"
                  >
                    {fitMode === 'cover' ? <Minimize2 className="w-3 h-3 text-amber-400" /> : <Maximize2 className="w-3 h-3 text-emerald-400" />}
                    <span>{fitMode === 'cover' ? 'Fit Whole' : 'Fill Box'}</span>
                  </button>

                  <button
                    onClick={handleGenerate}
                    disabled={isProcessing}
                    className="py-2 px-1 bg-emerald-950 border border-emerald-500/50 rounded-xl text-[11px] font-bold text-emerald-300 flex items-center justify-center gap-1 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Output Verification Box */}
            <div className="p-4 bg-black rounded-2xl border border-zinc-800 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Output Ready
                </span>
                {finalSizeKB && (
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                    finalSizeKB <= targetKB 
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' 
                      : 'bg-red-950 text-red-400 border-red-500/40'
                  }`}>
                    {finalSizeKB} KB / {targetKB} KB
                  </span>
                )}
              </div>

              <div className="relative w-full h-64 bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-800 p-2">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2 text-center p-4">
                    <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                    <span className="text-xs text-zinc-400 font-medium">Compressing strictly under {targetKB} KB...</span>
                  </div>
                ) : processedUrl ? (
                  <img
                    src={processedUrl}
                    alt="Formatted Document"
                    className="max-h-full max-w-full object-contain rounded shadow-md border border-zinc-800"
                  />
                ) : (
                  <span className="text-xs text-zinc-600">Generating output...</span>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Exact File Size</span>
                    <span className="text-emerald-400 font-bold">{finalSizeKB || '...'} KB</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Exact Dimensions</span>
                    <span className="text-white font-bold">{targetWidth} × {targetHeight} px</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={!processedBlob || isProcessing}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Ready Image</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      <div className="text-center pt-1">
        <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Zero distortion engine &bull; No stretch &bull; 100% Client-Side Private
        </p>
      </div>

    </div>
  );
}
