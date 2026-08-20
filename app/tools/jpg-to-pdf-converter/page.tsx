// app/tools/jpg-to-pdf-converter/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UploadCloud, FileText, Download, Trash2, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';

export default function JpgToPdfPage() {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: { file: File; preview: string }[] = [];
    Array.from(files).forEach((file) => {
      newItems.push({
        file,
        preview: URL.createObjectURL(file),
      });
    });
    setImages((prev) => [...prev, ...newItems]);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsConverting(true);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();

        const imgData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(images[i].file);
        });

        // Fit image cleanly on A4 with 10mm margins
        pdf.addImage(imgData, 'JPEG', 10, 10, pageWidth - 20, pageHeight - 20, undefined, 'FAST');
      }

      pdf.save('formilo-converted-document.pdf');
    } catch (err) {
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Tools
        </Link>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">JPG to PDF Converter</h1>
          <p className="text-xs text-zinc-400">Combine multiple JPG, PNG, or WebP images into a single clean PDF document. 100% private in your browser.</p>
        </div>

        {/* File Dropzone */}
        <div className="relative w-full py-10 px-4 rounded-3xl border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 bg-zinc-950/60 text-center flex flex-col items-center justify-center space-y-3 cursor-pointer overflow-hidden">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={(e) => handleFiles(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-pointer"
          />
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Tap to Select Multiple Photos / Documents</p>
            <p className="text-xs text-zinc-500">Supports multi-image upload</p>
          </div>
        </div>

        {/* Selected Images Queue */}
        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span>{images.length} Document(s) Ready</span>
              <button onClick={() => setImages([])} className="text-red-400 hover:underline">Clear All</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <img src={img.preview} alt="Page" className="w-full h-28 object-cover rounded-lg" />
                  <span className="text-[10px] text-zinc-400 font-mono block truncate">Page {idx + 1}</span>
                </div>
              ))}
            </div>

            <button
              onClick={generatePdf}
              disabled={isConverting}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              {isConverting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{isConverting ? 'Generating PDF...' : 'Download Combined PDF Document'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
