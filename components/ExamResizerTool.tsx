// components/ExamResizerTool.tsx
'use client';

import React, { useState, useRef, ChangeEvent, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle, 
  Sliders, 
  ZoomIn, 
  Move, 
  RotateCw,
  Sparkles,
  Crop,
  Maximize2
} from 'lucide-react';

interface PresetProps {
  slug: string;
  examName: string;
  docType: string;
  maxKB: number;
  minKB: number;
  dimensions: { width: number; height: number; aspect: string; cm: string; dpi?: number };
  format: string;
  bgColor: string;
}

export default function ExamResizerTool({ preset }: { preset: PresetProps }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  
  // Default Settings: Natural Contain (No auto zoom, No cutoff)
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [zoom, setZoom] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [quality, setQuality] = useState<number>(0.88);
  const [enhanceSign, setEnhanceSign] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSignature = preset.slug.includes('signature') || preset.slug.includes('sign');

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalSize(file.size / 1024);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setSelectedImage(src);

      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageElement(img);
        // Reset to full natural view on new upload
        setFitMode('contain');
        setZoom(1.0);
        setRotation(0);
        setPanX(0);
        setPanY(0);
      };
    };
    reader.readAsDataURL(file);
  };

  const renderCanvas = useCallback(() => {
    if (!imageElement) return;
    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    const targetW = preset.dimensions.width || 350;
    const targetH = preset.dimensions.height || 450;
    canvas.width = targetW;
    canvas.height = targetH;

    // 1. Pure White Clean Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);

    // 2. Center Origin for Rotation and Scaling
    ctx.save();
    ctx.translate(targetW / 2 + panX, targetH / 2 + panY);
    ctx.rotate((rotation * Math.PI) / 180);

    const isRotated90 = rotation % 180 !== 0;
    const imgW = isRotated90 ? imageElement.naturalHeight : imageElement.naturalWidth;
    const imgH = isRotated90 ? imageElement.naturalWidth : imageElement.naturalHeight;

    const imgRatio = imgW / imgH;
    const targetRatio = targetW / targetH;

    let drawW = targetW;
    let drawH = targetH;

    if (fitMode === 'contain') {
      // Natural Fit: Shows 100% of the photo without any crop
      if (imgRatio > targetRatio) {
        drawW = targetW * zoom;
        drawH = (targetW / imgRatio) * zoom;
      } else {
        drawH = targetH * zoom;
        drawW = (targetH * imgRatio) * zoom;
      }
    } else {
      // Cover: Fills the entire passport box
      if (imgRatio > targetRatio) {
        drawH = targetH * zoom;
        drawW = targetH * imgRatio * zoom;
      } else {
        drawW = targetW * zoom;
        drawH = (targetW / imgRatio) * zoom;
      }
    }

    // 3. Contrast Filter if enabled
    if (enhanceSign) {
      ctx.filter = 'contrast(1.8) brightness(1.05) grayscale(1)';
    } else {
      ctx.filter = 'none';
    }

    // Draw from center
    const actualW = isRotated90 ? drawH : drawW;
    const actualH = isRotated90 ? drawW : drawH;
    ctx.drawImage(imageElement, -actualW / 2, -actualH / 2, actualW, actualH);
    ctx.restore();

    // 4. Strict Under KB Enforcement
    let q = quality;
    let dataUrl = canvas.toDataURL('image/jpeg', q);
    let calculatedKB = (dataUrl.length * 3) / 4 / 1024;

    while (calculatedKB > preset.maxKB && q > 0.1) {
      q -= 0.05;
      dataUrl = canvas.toDataURL('image/jpeg', q);
      calculatedKB = (dataUrl.length * 3) / 4 / 1024;
    }

    setProcessedImage(dataUrl);
    setOutputSize(Math.round(calculatedKB * 10) / 10);
    setIsProcessing(false);
  }, [imageElement, preset, fitMode, zoom, rotation, panX, panY, enhanceSign, quality]);

  useEffect(() => {
    if (imageElement) {
      renderCanvas();
    }
  }, [imageElement, renderCanvas]);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageElement(null);
    setProcessedImage(null);
    setOriginalSize(null);
    setOutputSize(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `${preset.slug}-formilo.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppShare = () => {
    const text = `⚡ Formilo Tool — Resize & format ${preset.examName} ${preset.docType} strictly under ${preset.maxKB} KB without distortion:\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full bg-[#0c0d0e] border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {!selectedImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-800 hover:border-emerald-500 rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 bg-zinc-950/60 hover:bg-emerald-950/10 flex flex-col items-center justify-center gap-4 group"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-base sm:text-lg font-bold text-white">
              Click or Drag to Upload {preset.docType}
            </p>
            <p className="text-xs text-zinc-400 max-w-sm">
              Loads 100% full photo cleanly &bull; Target: {preset.minKB} KB – {preset.maxKB} KB
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side In-Browser RAM Processing
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dual Preview Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center justify-center">
            {/* Original Preview */}
            <div className="space-y-2 text-center">
              <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400">
                Original {originalSize ? `(${Math.round(originalSize)} KB)` : ''}
              </span>
              <div className="relative aspect-[3.5/4.5] max-h-64 sm:max-h-72 mx-auto rounded-2xl bg-black border border-zinc-800 flex items-center justify-center overflow-hidden p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedImage} alt="Original" className="max-h-full max-w-full object-contain rounded-xl" />
              </div>
            </div>

            {/* Formatted Output Preview */}
            <div className="space-y-2 text-center">
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Formatted ({outputSize} KB / {preset.dimensions.width}x{preset.dimensions.height}PX)
              </span>
              <div className="relative aspect-[3.5/4.5] max-h-64 sm:max-h-72 mx-auto rounded-2xl bg-black border-2 border-emerald-500/80 shadow-lg shadow-emerald-500/10 flex items-center justify-center overflow-hidden p-2">
                {isProcessing ? (
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                ) : processedImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={processedImage} alt="Formatted Result" className="max-h-full max-w-full object-contain rounded-xl" />
                ) : null}
              </div>
            </div>
          </div>

          {/* Quick Adjustment Options Toolbar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Image Adjustments (Optional)
              </span>

              {/* View Presets */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => { setFitMode('contain'); setZoom(1.0); setPanX(0); setPanY(0); }}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      fitMode === 'contain' ? 'bg-emerald-500 text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Full Natural View
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFitMode('cover'); }}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      fitMode === 'cover' ? 'bg-emerald-500 text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Auto Fill &amp; Crop
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleRotate}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCw className="w-3 h-3 text-emerald-400" />
                  <span>Rotate 90&deg;</span>
                </button>
              </div>
            </div>

            {/* Custom Sliders for Fine-Tuning */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-zinc-400">
                  <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3 text-emerald-400" /> Zoom Scale</span>
                  <span className="font-mono text-emerald-400">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-zinc-400">
                  <span className="flex items-center gap-1"><Move className="w-3 h-3 text-cyan-400" /> Shift X (Left/Right)</span>
                  <span className="font-mono text-zinc-300">{panX}px</span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="2"
                  value={panX}
                  onChange={(e) => setPanX(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-zinc-400">
                  <span className="flex items-center gap-1"><Move className="w-3 h-3 text-cyan-400" /> Shift Y (Up/Down)</span>
                  <span className="font-mono text-zinc-300">{panY}px</span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="2"
                  value={panY}
                  onChange={(e) => setPanY(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Signature Shadow Cleaner */}
            {isSignature && (
              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enhanceSign}
                    onChange={(e) => setEnhanceSign(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Clean Mobile Camera Shadow (Pure White Background &amp; Dark Ink)
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="flex-[2] py-4 px-6 rounded-2xl bg-[#00e676] hover:bg-[#00c853] text-black font-black text-sm tracking-wide transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-black stroke-[3]" />
              <span>Download Form Ready File</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="flex-1 py-4 px-4 rounded-2xl bg-[#14281d] hover:bg-[#1a3828] border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-400 text-transparent" />
              <span>WhatsApp Share</span>
            </button>

            <button
              onClick={handleReset}
              className="py-4 px-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 font-bold text-xs transition-all cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
