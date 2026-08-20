// app/tools/jpg-to-pdf-converter/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UploadCloud, FileText, Download, Trash2, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';

interface SelectedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  sizeKB: number;
}

export default function JpgToPdfConverterPage() {
  const [imageList, setImageList] = useState<SelectedImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: SelectedImage[] = [];
    Array.from(files).forEach((file) => {
      newItems.push({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        sizeKB: Number((file.size / 1024).toFixed(1)),
      });
    });

    setImageList((prev) => [...prev, ...newItems]);
  };

  const removeImage = (id: string) => {
    setImageList((prev) => prev.filter((img) => img.id !== id));
  };

  const convertToPdf = async () => {
    if (imageList.length === 0) return;
    setIsConverting(true);

    try {
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;

      for (let i = 0; i < imageList.length; i++) {
        if (i > 0) pdf.addPage();

        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(imageList[i].file);
        });

        // Fit cleanly on A4 with 10mm padding
        pdf.addImage(dataUrl, 'JPEG', 10, 10, pageWidth - 20, pageHeight - 20, undefined, 'FAST');
      }

      pdf.save('formilo-combined-document.pdf');
    } catch (err) {
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Tools
        </Link>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Multi-Image Document Stitcher</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">JPG to PDF Converter</h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Select multiple JPG, PNG, or WebP files and combine them into a single professional A4 PDF file. 100% private in-browser generation.
          </p>
        </div>

        {/* Multi-File Upload Zone using semantic label */}
        <label
          htmlFor="multi-jpg-input"
          className="relative w-full py-12 px-4 rounded-3xl border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 bg-zinc-950/60 transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer group"
        >
          <input
            id="multi-jpg-input"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/30 group-hover:scale-105 transition-transform pointer-events-none">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1 pointer-events-none">
            <p className="text-base font-bold text-white">
              Tap to Select Multiple Photos / Documents
            </p>
            <p className="text-xs text-zinc-500">
              Select 1 or more images from your gallery or files
            </p>
          </div>

          <span className="mt-2 px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs pointer-events-none">
            Choose Images
          </span>
        </label>

        {/* Selected Image Queue */}
        {imageList.length > 0 && (
          <div className="p-6 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {imageList.length} Page(s) Added
              </span>
              <button
                type="button"
                onClick={() => setImageList([])}
                className="text-xs text-red-400 hover:underline font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {imageList.map((img, idx) => (
                <div key={img.id} className="relative p-2 rounded-2xl bg-black border border-zinc-800 space-y-1.5 group">
                  <div className="relative w-full h-32 rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center">
                    <img src={img.preview} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-black/80 text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] px-1 font-mono text-zinc-400">
                    <span>Page {idx + 1}</span>
                    <span className="text-emerald-400">{img.sizeKB} KB</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={convertToPdf}
              disabled={isConverting}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-[0.99]"
            >
              {isConverting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{isConverting ? 'Generating Combined PDF...' : `Download ${imageList.length} Page PDF Document`}</span>
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
