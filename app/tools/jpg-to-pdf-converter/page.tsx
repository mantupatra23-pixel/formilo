// app/tools/jpg-to-pdf-converter/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TelegramBanner from '@/components/TelegramBanner';
import { 
  UploadCloud, 
  FileText, 
  Download, 
  Trash2, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Lock, 
  HelpCircle, 
  ArrowRight, 
  FileCheck,
  Layers,
  Sparkles
} from 'lucide-react';
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

        // Clean A4 auto-fit with 10mm padding
        pdf.addImage(dataUrl, 'JPEG', 10, 10, pageWidth - 20, pageHeight - 20, undefined, 'FAST');
      }

      pdf.save('formilo-combined-document.pdf');
    } catch (err) {
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  const relatedTools = [
    {
      title: 'PDF Compressor (< 200 KB)',
      desc: 'Compress marksheet, caste certificate & form PDFs under 200 KB.',
      badge: 'SAFE',
      slug: '/tools/pdf-compressor-under-200kb',
    },
    {
      title: 'PDF to JPG Converter',
      desc: 'Extract PDF pages into 300 DPI high-resolution JPG images.',
      badge: 'FAST',
      slug: '/tools/pdf-to-jpg-converter',
    },
    {
      title: 'Name & Date on Photo Generator',
      desc: 'Add candidate name and DOP strip on passport photo (< 50 KB).',
      badge: 'NEW 2026',
      slug: '/name-date-on-photo',
    },
    {
      title: 'PAN Card Photo Resizer (213 × 213 px)',
      desc: 'Format photo to exact 213x213 px and 300 DPI for NSDL/UTIITSL.',
      badge: 'PAN NSDL',
      slug: '/exam/pan-card-photo-resizer',
    },
    {
      title: 'Photo Resize to 50 KB',
      desc: 'Compress passport photos under 50 KB for SSC, RRB & UPSC portals.',
      badge: 'POPULAR',
      slug: '/exam/photo-resize-to-50kb',
    },
    {
      title: 'Signature Resize to 20 KB',
      desc: 'Crop and compress signatures strictly under 20 KB with sharp contrast.',
      badge: 'POPULAR',
      slug: '/exam/signature-resize-to-20kb',
    },
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium overflow-x-auto pb-1">
          <Link href="/" className="hover:text-emerald-400 transition-colors shrink-0">Home</Link>
          <span>/</span>
          <Link href="/#pdf-suite" className="hover:text-emerald-400 transition-colors shrink-0">PDF Tools</Link>
          <span>/</span>
          <span className="text-emerald-400 font-semibold truncate">JPG to PDF Converter</span>
        </nav>

        {/* Header Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Multi-Image Document Stitcher &bull; Multi-Page A4</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            JPG to PDF <span className="text-rose-400">Converter</span> Online
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
            Combine multiple JPG, JPEG, PNG, or WebP photos into a single professional PDF document. Ideal for marksheet attachments, certificate submissions, and government form uploads with 100% private in-browser processing.
          </p>
        </div>

        {/* Top Ad Container */}
        <div className="w-full h-24 rounded-2xl bg-zinc-950 border border-zinc-850 flex items-center justify-center text-center p-4">
          <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
            Sponsored / Advertisement
          </span>
        </div>

        {/* Main Converter Tool Box */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-6 shadow-2xl">
          
          {/* Multi-File Upload Zone */}
          <label
            htmlFor="multi-jpg-upload"
            className="relative w-full py-12 px-4 rounded-3xl border-2 border-dashed border-zinc-800 hover:border-rose-500/50 bg-zinc-950/60 transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer select-none group"
          >
            <input
              id="multi-jpg-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = '';
              }}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950/30 group-hover:scale-105 transition-transform pointer-events-none">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1 pointer-events-none">
              <p className="text-base font-bold text-white">
                Tap to Select Photos / Document Pages
              </p>
              <p className="text-xs text-zinc-500">
                Choose 1 or multiple JPG, PNG, WebP images from gallery or files
              </p>
            </div>

            <span className="mt-2 px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-bold text-xs pointer-events-none">
              Choose Images
            </span>
          </label>

          {/* Selected Images Queue & Action Bar */}
          {imageList.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {imageList.length} Page(s) Selected
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.preview} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-black/80 text-zinc-400 hover:text-red-400 transition-colors"
                        title="Remove page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] px-1 font-mono text-zinc-400">
                      <span>Page {idx + 1}</span>
                      <span className="text-rose-400">{img.sizeKB} KB</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={convertToPdf}
                disabled={isConverting}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-[0.99]"
              >
                {isConverting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{isConverting ? 'Stitching Pages...' : `Download ${imageList.length} Page PDF Document`}</span>
              </button>
            </div>
          )}

          <div className="text-center pt-2">
            <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Client-Side In-Browser Conversion &bull; No Server Uploads
            </p>
          </div>
        </div>

        {/* Bottom Ad Container */}
        <div className="w-full h-24 rounded-2xl bg-zinc-950 border border-zinc-850 flex items-center justify-center text-center p-4">
          <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
            Sponsored / Advertisement
          </span>
        </div>

        {/* Specifications & Document Standards */}
        <div className="p-6 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <CheckCircle2 className="w-4 h-4 text-rose-400" />
            <span>PDF Output Specifications &amp; Compatibility</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-800/80 space-y-1">
              <span className="text-zinc-500">Page Standard</span>
              <p className="font-bold text-white text-xs truncate">Standard A4 Portrait</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-800/80 space-y-1">
              <span className="text-zinc-500">Supported Inputs</span>
              <p className="font-bold text-rose-400 text-xs">JPG, PNG, WebP</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-800/80 space-y-1">
              <span className="text-zinc-500">Page Margins</span>
              <p className="font-bold text-white text-xs">10 mm Uniform</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-800/80 space-y-1">
              <span className="text-zinc-500">Security</span>
              <p className="font-bold text-emerald-400 text-xs">100% Client-Side</p>
            </div>
          </div>
        </div>

        {/* Step-by-Step How to Use Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <FileCheck className="w-4 h-4 text-rose-400" />
              <span>How to Convert JPG to PDF Online</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-zinc-400 leading-relaxed">
              <li>Tap <strong>&quot;Choose Images&quot;</strong> and select your certificates or marksheets from your gallery.</li>
              <li>Review the page thumbnails and delete any unwanted images using the trash icon.</li>
              <li>Click <strong>&quot;Download PDF Document&quot;</strong> to stitch all pages instantly into a single file.</li>
            </ol>
          </div>

          <div className="p-5 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Zero Server Upload Privacy</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              All PDF assembly happens locally in your device RAM using client-side JavaScript. Your personal certificates, marksheet scans, and identity photos are never uploaded or saved to any remote server.
            </p>
          </div>
        </div>

        {/* Related Tool Presets */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" />
              RELATED PDF &amp; IMAGE TOOLS
            </h3>
            <span className="text-xs text-zinc-500 font-mono">Quick Access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedTools.map((t) => (
              <Link
                key={t.slug}
                href={t.slug}
                className="p-4 rounded-2xl bg-[#0c0d0e] border border-zinc-800 hover:border-rose-500/50 transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {t.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                    {t.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-850 text-xs">
                  <span className="text-[11px] text-zinc-500">Instant Tool</span>
                  <span className="text-rose-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="p-6 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <HelpCircle className="w-4 h-4 text-rose-400" />
            <span>Frequently Asked Questions</span>
          </div>

          <div className="space-y-3 text-xs text-zinc-400">
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-850 space-y-1">
              <p className="font-bold text-white">Can I combine multiple pages into a single PDF?</p>
              <p>Yes. You can select multiple JPG, PNG, or WebP files at once, and they will be stitched into a multi-page PDF document in the exact order selected.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-850 space-y-1">
              <p className="font-bold text-white">Is there any limit on the number of images?</p>
              <p>There are no artificial limits. Since all processing runs on your device, you can convert dozens of document pages quickly without queue limits.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-850 space-y-1">
              <p className="font-bold text-white">Is it safe to upload confidential government marksheets?</p>
              <p>Formilo operates with 100% client-side execution. None of your images or PDF files are uploaded to any external server or saved in any database.</p>
            </div>
          </div>
        </div>

        {/* Telegram Community Conversion */}
        <TelegramBanner />

      </div>
    </main>
  );
}
