// components/ExamResizerTool.tsx
'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { Upload, Download, RefreshCw, MessageCircle, ShieldCheck, CheckCircle } from 'lucide-react';

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
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [quality, setQuality] = useState<number>(0.90);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalSize(file.size / 1024);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setSelectedImage(src);
      processImage(src, quality);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (imageSrc: string, targetQuality: number) => {
    setIsProcessing(true);
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
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

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Background Fill
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);

      // Clean Center Crop (Maintains original crispness without stretching)
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;
      const imgRatio = imgW / imgH;
      const targetRatio = targetW / targetH;

      let drawW = targetW;
      let drawH = targetH;

      if (imgRatio > targetRatio) {
        drawH = targetH;
        drawW = targetH * imgRatio;
      } else {
        drawW = targetW;
        drawH = targetW / imgRatio;
      }

      const drawX = (targetW - drawW) / 2;
      const drawY = (targetH - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // High Quality Compression under Max KB
      let q = targetQuality;
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
    };
  };

  const handleReset = () => {
    setSelectedImage(null);
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
    const text = `⚡ Formilo Tool — Resize & format ${preset.examName} ${preset.docType} strictly under ${preset.maxKB} KB:\n${window.location.href}`;
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
            <p className="text-xs text-zinc-400">
              Auto-formats to {preset.dimensions.width}x{preset.dimensions.height} px &bull; Target: {preset.minKB} KB – {preset.maxKB} KB
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side In-Browser Processing
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

            {/* Formatted Preview */}
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

          {/* Simple Size Slider */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs text-zinc-400 font-medium">
              <span>Fine-Tune File Size</span>
              <span className="font-mono text-emerald-400">{Math.round(quality * 100)}% Quality</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={quality}
              onChange={(e) => {
                const q = parseFloat(e.target.value);
                setQuality(q);
                if (selectedImage) processImage(selectedImage, q);
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Actions */}
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
