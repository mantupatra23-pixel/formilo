'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  UploadCloud, 
  Download, 
  RefreshCw, 
  Sliders, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Sparkles, 
  AlertTriangle, 
  FileImage, 
  CheckCircle2,
  Trash2
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

  // Extract presets with safe fallbacks
  const targetKB = Number(activeConfig.targetKB || activeConfig.maxKB || 50);
  const minKB = Number(activeConfig.minKB || 10);
  const targetWidth = Number(activeConfig.width || 350);
  const targetHeight = Number(activeConfig.height || 450);
  const docType = activeConfig.docType || 'Document / Photo';
  const examName = activeConfig.examName || 'Official Exam';
  const dimensionText = activeConfig.dimensionText || `${targetWidth} × ${targetHeight} px`;

  // State Management
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [finalSizeKB, setFinalSizeKB] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Adjustment Controls
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Trigger Native File Dialog
  const handleDropzoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Load selected file
  const handleFileChange = (file: File) => {
    setErrorMessage(null);
    setProcessedUrl(null);
    setProcessedBlob(null);
    setFinalSizeKB(null);
    setZoom(1);
    setRotation(0);
    setBrightness(100);
    setContrast(100);

    const format = getImageFormat(file);
    if (format === 'HEIC') {
      setErrorMessage('HEIC/HEIF format is not supported directly. Please upload a JPG or PNG file.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = objectUrl;
    img.onload = () => {
      setSourceImage(img);
    };
    img.onerror = () => {
      setErrorMessage('Failed to read this image file. Please try another photo.');
    };
  };

  // Drag & Drop Handlers
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  // Frame and Compress Image
  const generateProcessedDocument = useCallback(async () => {
    if (!sourceImage || !selectedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage('Framing and adjusting canvas...');

    try {
      // 1. Create Frame Canvas with Target Dimensions
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { alpha: false });

      if (!ctx) throw new Error('Failed to create canvas processing context.');

      // Clear & Fill Background (White default for forms/signatures)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Apply Filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.save();
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Compute aspect fill
      const imgAspect = sourceImage.naturalWidth / sourceImage.naturalHeight;
      const canvasAspect = targetWidth / targetHeight;
      let drawW = targetWidth;
      let drawH = targetHeight;

      if (imgAspect > canvasAspect) {
        drawW = targetHeight * imgAspect;
      } else {
        drawH = targetWidth / imgAspect;
      }

      ctx.drawImage(sourceImage, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // 2. Convert Framed Canvas to Temp File for Strict Binary Search Compression
      setStatusMessage(`Locking file size strictly under ${targetKB} KB...`);
      const tempBlob: Blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95);
      });

      const tempFile = new File([tempBlob], selectedFile.name, { type: 'image/jpeg' });

      // 3. Binary Search Compression Target Loop
      const compressionResult = await compressImageToTarget(
        tempFile,
        {
          targetKB,
          width: targetWidth,
          height: targetHeight,
          forceJpeg: true,
          isSignature: activeConfig.slug?.includes('signature') || activeConfig.slug?.includes('thumb'),
        },
        (progress) => setStatusMessage(progress)
      );

      const finalUrl = URL.createObjectURL(compressionResult.blob);
      setProcessedBlob(compressionResult.blob);
      setProcessedUrl(finalUrl);
      setFinalSizeKB(Number((compressionResult.blob.size / 1024).toFixed(1)));
      setStatusMessage('Done! Document ready for submission.');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error processing document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [sourceImage, selectedFile, targetWidth, targetHeight, targetKB, zoom, rotation, brightness, contrast, activeConfig.slug]);

  // Trigger compression automatically when file is loaded
  useEffect(() => {
    if (sourceImage) {
      generateProcessedDocument();
    }
  }, [sourceImage]);

  // Download Output
  const handleDownload = () => {
    if (!processedBlob || !processedUrl) return;

    const link = document.createElement('a');
    const safeSlug = activeConfig.slug || 'formilo-processed-document';
    link.download = `${safeSlug}-verified.jpg`;
    link.href = processedUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset Tool
  const handleReset = () => {
    setSelectedFile(null);
    setSourceImage(null);
    setPreviewUrl(null);
    setProcessedUrl(null);
    setProcessedBlob(null);
    setFinalSizeKB(null);
    setErrorMessage(null);
    setZoom(1);
    setRotation(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full bg-[#0c0d0e] border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      
      {/* Hidden File Input */}
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
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-black/60 rounded-2xl border border-zinc-850 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-400">Target Requirements:</span>
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

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 bg-red-950/50 border border-red-500/50 rounded-2xl flex items-center gap-2.5 text-xs text-red-300">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Upload / Editor Area */}
      {!selectedFile ? (
        <div
          onClick={handleDropzoneClick}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`w-full py-12 px-4 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 ${
            isDragging 
              ? 'border-emerald-400 bg-emerald-950/20 scale-[0.99]' 
              : 'border-zinc-800 hover:border-emerald-500/50 bg-zinc-950/50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/30">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <p className="text-sm sm:text-base font-bold text-white">
              Tap to Choose Photo or Drag &amp; Drop Here
            </p>
            <p className="text-xs text-zinc-400">
              Supports JPG, JPEG, PNG • Instant auto-resize for {examName}
            </p>
          </div>
          <button
            type="button"
            className="mt-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all pointer-events-none"
          >
            Select Document
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Dual Preview Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Original Preview & Adjustment Framing */}
            <div className="p-4 bg-black rounded-2xl border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-400">Adjust &amp; Frame</span>
                <span className="text-zinc-500 text-[11px] font-mono truncate max-w-[150px]">
                  {selectedFile.name}
                </span>
              </div>

              <div className="relative w-full h-56 bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-850">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Original Upload"
                    className="max-h-full max-w-full object-contain transition-transform"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                    }}
                  />
                )}
              </div>

              {/* Controls Bar */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3 text-emerald-400" /> Zoom</span>
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

                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="flex-1 py-1.5 px-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-[11px] font-semibold text-zinc-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCw className="w-3 h-3 text-emerald-400" />
                    <span>Rotate 90°</span>
                  </button>

                  <button
                    onClick={generateProcessedDocument}
                    disabled={isProcessing}
                    className="flex-1 py-1.5 px-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 rounded-xl text-[11px] font-bold text-emerald-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                    <span>Apply Frame</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Final Formatted Result */}
            <div className="p-4 bg-black rounded-2xl border border-zinc-800 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Output Ready
                </span>
                {finalSizeKB && (
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                    finalSizeKB <= targetKB 
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' 
                      : 'bg-red-950/80 text-red-400 border-red-500/40'
                  }`}>
                    {finalSizeKB} KB / {targetKB} KB
                  </span>
                )}
              </div>

              <div className="relative w-full h-56 bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-850 p-2">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2 text-center p-4">
                    <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                    <span className="text-xs text-zinc-400 font-medium">{statusMessage}</span>
                  </div>
                ) : processedUrl ? (
                  <img
                    src={processedUrl}
                    alt="Formatted Document"
                    className="max-h-full max-w-full object-contain rounded shadow-md"
                  />
                ) : (
                  <span className="text-xs text-zinc-600">Processing output...</span>
                )}
              </div>

              {/* Status details & Reset */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
                  <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-850">
                    <span className="text-zinc-500 block text-[10px]">Exact Size</span>
                    <span className="text-emerald-400 font-bold">{finalSizeKB || '...'} KB</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-850">
                    <span className="text-zinc-500 block text-[10px]">Dimensions</span>
                    <span className="text-white font-bold">{targetWidth}x{targetHeight} px</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={!processedBlob || isProcessing}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

      {/* Privacy Guarantee Footer Pill */}
      <div className="text-center pt-1">
        <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          100% Client-Side Engine: Images are processed inside your browser and never uploaded to any server.
        </p>
      </div>

    </div>
  );
}
