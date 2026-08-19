// components/ExamResizerTool.tsx
'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { Upload, Download, RefreshCw, CheckCircle, ShieldCheck, Image as ImageIcon } from 'lucide-react';

interface PresetProps {
  slug: string;
  examName: string;
  docType: string;
  maxKB: number;
  minKB: number;
  dimensions: { width: number; height: number; aspect: string; cm: string };
  format: string;
  bgColor: string;
}

export default function ExamResizerTool({ preset }: { preset: PresetProps }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [quality, setQuality] = useState<number>(0.85);
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

      canvas.width = preset.dimensions.width;
      canvas.height = preset.dimensions.height;

      // Clean white/neutral canvas background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw resized image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Recursive compression to enforce strictly under maxKB
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

  const handleQualityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQ = parseFloat(e.target.value);
    setQuality(newQ);
    if (selectedImage) {
      processImage(selectedImage, newQ);
    }
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

  return (
    <div className="w-full bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
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
          className="border-2 border-dashed border-zinc-700 hover:border-emerald-500 rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 bg-zinc-900/40 hover:bg-emerald-950/10 flex flex-col items-center justify-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-white">
              Tap to Upload {preset.docType}
            </p>
            <p className="text-xs text-zinc-400">
              Supports JPG, PNG, WEBP (Target: {preset.minKB} KB – {preset.maxKB} KB)
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400/90 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% In-Browser Private Processing
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Original Preview */}
            <div className="space-y-2 text-center">
              <span className="text-xs font-semibold text-zinc-400">Original File</span>
              <div className="relative aspect-square max-h-64 mx-auto rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedImage} alt="Original" className="max-h-full object-contain rounded-lg" />
              </div>
              <p className="text-xs font-mono text-zinc-500">
                Size: {originalSize ? `${Math.round(originalSize * 10) / 10} KB` : '--'}
              </p>
            </div>

            {/* Formatted Output Preview */}
            <div className="space-y-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified Output ({preset.dimensions.cm})</span>
              </div>
              <div className="relative aspect-square max-h-64 mx-auto rounded-xl bg-zinc-900 border border-emerald-500/40 flex items-center justify-center overflow-hidden p-2 shadow-lg shadow-emerald-500/10">
                {isProcessing ? (
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                ) : processedImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={processedImage} alt="Formatted Result" className="max-h-full object-contain rounded-lg" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-zinc-600" />
                )}
              </div>
              <p className="text-xs font-mono font-bold text-emerald-400">
                Optimized Size: {outputSize} KB (Target &lt; {preset.maxKB} KB)
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Compression Slider</span>
              <span className="font-mono text-zinc-200">{Math.round(quality * 100)}% Quality</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={quality}
              onChange={handleQualityChange}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Change Image</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex-[2] py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4 text-black" />
              <span>Download Formatted {preset.docType}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
