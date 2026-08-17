'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, Download, Eraser, RefreshCw, 
  CheckCircle2, AlertCircle, Sliders, ShieldCheck, Undo2 
} from 'lucide-react';

export default function WatermarkRemoverTool() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState<number>(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [hasMask, setHasMask] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setResultUrl(null);
      setHasMask(false);
    }
  };

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      originalImageRef.current = img;
      initCanvases(img);
    };
  }, [imageSrc]);

  const initCanvases = (img: HTMLImageElement) => {
    const mainCanvas = mainCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!mainCanvas || !maskCanvas) return;

    mainCanvas.width = img.width;
    mainCanvas.height = img.height;
    maskCanvas.width = img.width;
    maskCanvas.height = img.height;

    const ctx = mainCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
    }

    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    }
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return { x: 0, y: 0 };
    const rect = maskCanvas.getBoundingClientRect();

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const scaleX = maskCanvas.width / rect.width;
    const scaleY = maskCanvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();

    setHasMask(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearMask = () => {
    const maskCanvas = maskCanvasRef.current;
    const mainCanvas = mainCanvasRef.current;
    if (!maskCanvas || !mainCanvas || !originalImageRef.current) return;

    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

    const mainCtx = mainCanvas.getContext('2d');
    if (mainCtx) {
      mainCtx.drawImage(originalImageRef.current, 0, 0);
    }

    setHasMask(false);
    setResultUrl(null);
  };

  // Client-Side Fast Inpainting / Pixel Interpolation Algorithm
  const removeWatermark = async () => {
    const mainCanvas = mainCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!mainCanvas || !maskCanvas) return;

    const mainCtx = mainCanvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    if (!mainCtx || !maskCtx) return;

    setProcessing(true);

    setTimeout(() => {
      const w = mainCanvas.width;
      const h = mainCanvas.height;

      const imgData = mainCtx.getImageData(0, 0, w, h);
      const maskData = maskCtx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const mData = maskData.data;

      const radius = 6;

      // Scan masked pixels and reconstruct using surrounding clean neighbors
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;

          // If pixel is painted in mask (Red Alpha > 20)
          if (mData[idx + 3] > 20) {
            let rSum = 0, gSum = 0, bSum = 0, count = 0;

            for (let dy = -radius; dy <= radius; dy++) {
              for (let dx = -radius; dx <= radius; dx++) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                  const nIdx = (ny * w + nx) * 4;
                  // Only blend from non-masked pixels
                  if (mData[nIdx + 3] <= 20) {
                    const weight = 1 / (1 + Math.hypot(dx, dy));
                    rSum += data[nIdx] * weight;
                    gSum += data[nIdx + 1] * weight;
                    bSum += data[nIdx + 2] * weight;
                    count += weight;
                  }
                }
              }
            }

            if (count > 0) {
              data[idx] = rSum / count;
              data[idx + 1] = gSum / count;
              data[idx + 2] = bSum / count;
            }
          }
        }
      }

      mainCtx.putImageData(imgData, 0, 0);

      // Clear the overlay mask
      maskCtx.clearRect(0, 0, w, h);
      setHasMask(false);

      const cleanedUrl = mainCanvas.toDataURL('image/jpeg', 0.95);
      setResultUrl(cleanedUrl);
      setProcessing(false);
    }, 100);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `formilo_clean_${imageFile?.name || 'photo.jpg'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleResetAll = () => {
    setImageFile(null);
    setImageSrc(null);
    setResultUrl(null);
    setHasMask(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 text-zinc-100">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-700 hover:border-emerald-500/60 rounded-xl p-10 text-center cursor-pointer transition-all bg-zinc-950/40 group"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Eraser className="w-7 h-7" />
          </div>
          <p className="text-base font-semibold text-white">Select Photo with Watermark or Stamp</p>
          <p className="text-xs text-zinc-500 mt-1">Erase unwanted timestamps, dates, watermarks, or stamps directly in your browser</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Brush Size:
              </label>
              <input
                type="range"
                min="5"
                max="80"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-32 accent-emerald-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-emerald-400">{brushSize}px</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearMask}
                disabled={!hasMask}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition flex items-center gap-1.5 disabled:opacity-40"
              >
                <Undo2 className="w-3.5 h-3.5" /> Clear Brush
              </button>
              <button
                onClick={handleResetAll}
                className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/50 hover:bg-red-900/50 text-xs font-semibold text-red-300 transition"
              >
                Change Photo
              </button>
            </div>
          </div>

          <p className="text-xs text-zinc-400 text-center">
            🖌️ <span className="font-semibold text-white">Instructions:</span> Touch or drag over the watermark or stamp on the image below to highlight it in red.
          </p>

          {/* Interactive Canvas Workspace */}
          <div className="relative w-full max-h-[500px] overflow-auto flex justify-center bg-black/60 rounded-xl border border-zinc-800 p-2">
            <div className="relative inline-block touch-none select-none">
              <canvas ref={mainCanvasRef} className="max-w-full h-auto block rounded-lg" />
              <canvas
                ref={maskCanvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
          </div>

          {/* Erase Watermark Button */}
          {!resultUrl ? (
            <button
              onClick={removeWatermark}
              disabled={!hasMask || processing}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Inpainting & Blending Background...
                </>
              ) : (
                'Erase Highlighted Watermark'
              )}
            </button>
          ) : (
            <div className="p-5 bg-zinc-900/90 border border-emerald-500/40 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" /> Watermark Successfully Removed!
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Clean Image
                </button>
                <button
                  onClick={clearMask}
                  className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-xl text-sm transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> Erase Another Area
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Security Guarantee */}
      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-xs text-zinc-500">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>100% Client-Side Inpainting • Photos never leave your browser memory</span>
      </div>
    </div>
  );
}
