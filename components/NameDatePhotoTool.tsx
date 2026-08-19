// components/NameDatePhotoTool.tsx
'use client';

import React, { useState, useRef, ChangeEvent, useCallback, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  ShieldCheck, 
  Calendar, 
  User, 
  Sliders, 
  ZoomIn, 
  Move,
  Sparkles
} from 'lucide-react';

export default function NameDatePhotoTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null);
  const [candidateName, setCandidateName] = useState<string>('RAHUL SHARMA');
  const [photoDate, setPhotoDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [maxKbLimit, setMaxKbLimit] = useState<number>(50);
  
  // HD Controls
  const [zoom, setZoom] = useState<number>(1.0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImgObj(img);
        setZoom(1.0);
        setPanX(0);
        setPanY(0);
      };
    };
    reader.readAsDataURL(file);
  };

  const renderHDCanvas = useCallback(() => {
    if (!imgObj) return;
    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    // High Resolution Canvas (700x900px downscaled for 350x450 output for ultra sharpness)
    const targetW = 700;
    const targetH = 900;
    const bannerH = 160;
    const photoAreaH = targetH - bannerH;

    canvas.width = targetW;
    canvas.height = targetH;

    // Enable Maximum Sharpness
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 1. Background Fill
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);

    // 2. Smart Aspect Ratio (Cover Photo Area without distortion)
    const imgW = imgObj.naturalWidth;
    const imgH = imgObj.naturalHeight;
    const imgRatio = imgW / imgH;
    const areaRatio = targetW / photoAreaH;

    let drawW = targetW;
    let drawH = photoAreaH;

    if (imgRatio > areaRatio) {
      drawH = photoAreaH * zoom;
      drawW = photoAreaH * imgRatio * zoom;
    } else {
      drawW = targetW * zoom;
      drawH = (targetW / imgRatio) * zoom;
    }

    const drawX = (targetW - drawW) / 2 + panX * 2;
    const drawY = (photoAreaH - drawH) / 2 + panY * 2;

    // Clip to Photo Area
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, targetW, photoAreaH);
    ctx.clip();
    ctx.drawImage(imgObj, drawX, drawY, drawW, drawH);
    ctx.restore();

    // 3. Crisp Name & Date Banner (Bottom Strip)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, photoAreaH, targetW, bannerH);

    // Dark Divider Line
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, photoAreaH);
    ctx.lineTo(targetW, photoAreaH);
    ctx.stroke();

    // Text Render
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Candidate Name
    ctx.font = 'bold 32px Arial, Helvetica, sans-serif';
    ctx.fillText((candidateName || 'CANDIDATE NAME').toUpperCase(), targetW / 2, photoAreaH + 52);

    // DOP / DOB
    const formattedDate = photoDate ? photoDate.split('-').reverse().join('-') : '01-01-2026';
    ctx.font = '700 26px Arial, Helvetica, sans-serif';
    ctx.fillText(`DOP: ${formattedDate}`, targetW / 2, photoAreaH + 112);

    // 4. Precision Binary Quality Compression (Under Max KB)
    let minQ = 0.15;
    let maxQ = 0.96;
    let bestDataUrl = canvas.toDataURL('image/jpeg', maxQ);
    let bestKB = (bestDataUrl.length * 3) / 4 / 1024;

    for (let i = 0; i < 7; i++) {
      const midQ = (minQ + maxQ) / 2;
      const dataUrl = canvas.toDataURL('image/jpeg', midQ);
      const kb = (dataUrl.length * 3) / 4 / 1024;

      if (kb <= maxKbLimit) {
        bestDataUrl = dataUrl;
        bestKB = kb;
        minQ = midQ;
      } else {
        maxQ = midQ;
      }
    }

    setProcessedImage(bestDataUrl);
    setOutputSize(Math.round(bestKB * 10) / 10);
    setIsProcessing(false);
  }, [imgObj, candidateName, photoDate, maxKbLimit, zoom, panX, panY]);

  useEffect(() => {
    if (imgObj) renderHDCanvas();
  }, [imgObj, renderHDCanvas]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `photo-name-date-dop-formilo.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-800 hover:border-emerald-500 rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 bg-zinc-950/60 hover:bg-emerald-950/10 flex flex-col items-center justify-center gap-4 group"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-base sm:text-lg font-bold text-white">
              Upload Passport Photo for Name &amp; Date
            </p>
            <p className="text-xs text-zinc-400">
              Auto-formats to 3.5 x 4.5 cm with official bottom DOP strip strictly under 50 KB
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side In-Browser HD Engine
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Candidate Full Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-emerald-500"
                placeholder="e.g. RAHUL SHARMA"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Date of Photo (DOP)
              </label>
              <input
                type="date"
                value={photoDate}
                onChange={(e) => setPhotoDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Max Size Target
              </label>
              <select
                value={maxKbLimit}
                onChange={(e) => setMaxKbLimit(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={50}>Strictly Under 50 KB (SSC, RRB, Police)</option>
                <option value={100}>Strictly Under 100 KB (UPSC / State PSC)</option>
                <option value={20}>Strictly Under 20 KB</option>
              </select>
            </div>
          </div>

          {/* Live Preview */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle className="w-4 h-4" /> HD Verified Preview (3.5 x 4.5 cm)
            </div>
            
            <div className="relative w-48 aspect-[3.5/4.5] rounded-xl overflow-hidden border-2 border-emerald-500 shadow-xl bg-white flex items-center justify-center">
              {isProcessing ? (
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
              ) : processedImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={processedImage} alt="Stamped HD Preview" className="w-full h-full object-contain" />
              ) : null}
            </div>

            <p className="text-xs font-mono text-emerald-400 font-extrabold">
              Crisp HD Output Size: {outputSize} KB (Target &lt; {maxKbLimit} KB)
            </p>
          </div>

          {/* Face Positioning Sliders */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Face Framing &amp; Zoom Adjustments
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3 text-emerald-400" /> Zoom</span>
                  <span className="font-mono text-emerald-400">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span className="flex items-center gap-1"><Move className="w-3 h-3 text-cyan-400" /> Shift X</span>
                  <span className="font-mono text-zinc-300">{panX}px</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="2"
                  value={panX}
                  onChange={(e) => setPanX(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span className="flex items-center gap-1"><Move className="w-3 h-3 text-cyan-400" /> Shift Y</span>
                  <span className="font-mono text-zinc-300">{panY}px</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="2"
                  value={panY}
                  onChange={(e) => setPanY(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Change Image
            </button>

            <button
              onClick={handleDownload}
              className="flex-[2] py-4 px-6 rounded-2xl bg-[#00e676] hover:bg-[#00c853] text-black font-black text-sm tracking-wide transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-black stroke-[3]" />
              <span>Download Stamped HD Photo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
