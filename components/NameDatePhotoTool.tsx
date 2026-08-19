// components/NameDatePhotoTool.tsx
'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { Upload, Download, RefreshCw, CheckCircle, ShieldCheck, Calendar, User, Sliders } from 'lucide-react';

export default function NameDatePhotoTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [candidateName, setCandidateName] = useState<string>('RAHUL SHARMA');
  const [photoDate, setPhotoDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [maxKbLimit, setMaxKbLimit] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      renderNameDate(src, candidateName, photoDate, maxKbLimit);
    };
    reader.readAsDataURL(file);
  };

  const renderNameDate = (
    source: string,
    name: string,
    date: string,
    targetKb: number
  ) => {
    setIsProcessing(true);
    const img = new Image();
    img.src = source;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // Standard 3.5 x 4.5 ratio (350x450 px)
      canvas.width = 350;
      canvas.height = 450;

      // Draw original photo
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Bottom White Banner
      const bannerHeight = 80;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

      // Thin Top Border on banner
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - bannerHeight);
      ctx.lineTo(canvas.width, canvas.height - bannerHeight);
      ctx.stroke();

      // Render Text
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Candidate Name
      ctx.font = 'bold 15px Arial, sans-serif';
      ctx.fillText(name.toUpperCase() || 'CANDIDATE NAME', canvas.width / 2, canvas.height - bannerHeight + 25);

      // Date of Photo (DOP)
      const formattedDate = date ? date.split('-').reverse().join('-') : '01-01-2026';
      ctx.font = '600 13px Arial, sans-serif';
      ctx.fillText(`DOP: ${formattedDate}`, canvas.width / 2, canvas.height - bannerHeight + 55);

      // Recursive compression under Target KB
      let q = 0.90;
      let dataUrl = canvas.toDataURL('image/jpeg', q);
      let calculatedKB = (dataUrl.length * 3) / 4 / 1024;

      while (calculatedKB > targetKb && q > 0.1) {
        q -= 0.05;
        dataUrl = canvas.toDataURL('image/jpeg', q);
        calculatedKB = (dataUrl.length * 3) / 4 / 1024;
      }

      setProcessedImage(dataUrl);
      setOutputSize(Math.round(calculatedKB * 10) / 10);
      setIsProcessing(false);
    };
  };

  const updateFields = (name: string, date: string, kb: number) => {
    setCandidateName(name);
    setPhotoDate(date);
    setMaxKbLimit(kb);
    if (imageSrc) {
      renderNameDate(imageSrc, name, date, kb);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `photo-with-name-date-formilo.jpg`;
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

      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-700 hover:border-emerald-500 rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 bg-zinc-900/40 hover:bg-emerald-950/10 flex flex-col items-center justify-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-white">Upload Passport Photo</p>
            <p className="text-xs text-zinc-400">Add Name &amp; Date of Photo (DOP) bar instantly</p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% In-Browser Private
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Candidate Full Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => updateFields(e.target.value, photoDate, maxKbLimit)}
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
                onChange={(e) => updateFields(candidateName, e.target.value, maxKbLimit)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Target Max Size (KB)
              </label>
              <select
                value={maxKbLimit}
                onChange={(e) => updateFields(candidateName, photoDate, Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={50}>Strictly Under 50 KB (SSC / Railway)</option>
                <option value={100}>Strictly Under 100 KB (UPSC / State PSC)</option>
                <option value={20}>Strictly Under 20 KB (Small)</option>
              </select>
            </div>
          </div>

          {/* Live Preview */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <CheckCircle className="w-4 h-4" /> Live Portal Preview
            </div>
            
            <div className="relative w-48 aspect-[3.5/4.5] rounded-xl overflow-hidden border-2 border-emerald-500/50 bg-black flex items-center justify-center shadow-xl">
              {isProcessing ? (
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
              ) : processedImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={processedImage} alt="Stamped Preview" className="w-full h-full object-cover" />
              ) : null}
            </div>

            <p className="text-xs font-mono text-emerald-400 font-bold">
              Size: {outputSize} KB (Target &lt; {maxKbLimit} KB)
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold text-xs flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Change Image
            </button>

            <button
              onClick={handleDownload}
              className="flex-[2] py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4 text-black" /> Download Stamped Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
