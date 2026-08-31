'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';

interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  sizeKB: number;
  width: number;
  height: number;
}

export default function PdfToJpgConverterPage() {
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [pages, setPages] = useState<ConvertedPage[]>([]);
  const [progress, setProgress] = useState(0);
  const [dpiScale, setDpiScale] = useState<number>(2.0); // 2.0 = ~300 DPI
  const [activeTab, setActiveTab] = useState<'upload' | 'result'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initWorker = () => {
    if (typeof window !== 'undefined' && (window as any).pdfjsLib) {
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setPdfJsLoaded(true);
    }
  };

  useEffect(() => {
    initWorker();
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF file (.pdf)');
      return;
    }

    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) {
      alert('PDF Engine is loading. Please retry in 2 seconds.');
      return;
    }

    setIsProcessing(true);
    setPages([]);
    setProgress(5);
    setFileName(file.name.replace(/\.[^/.]+$/, ''));

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      const convertedList: ConvertedPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: dpiScale });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;

          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          const res = await fetch(dataUrl);
          const blob = await res.blob();

          convertedList.push({
            pageNumber: i,
            dataUrl,
            blob,
            sizeKB: Math.round(blob.size / 1024),
            width: Math.round(viewport.width),
            height: Math.round(viewport.height),
          });
        }
        setProgress(Math.round((i / totalPages) * 90) + 10);
      }

      setPages(convertedList);
      setActiveTab('result');
    } catch (err) {
      console.error(err);
      alert('Could not render PDF. Password-protected PDFs are not supported.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSingle = (page: ConvertedPage) => {
    const a = document.createElement('a');
    a.href = page.dataUrl;
    a.download = `${fileName}_page_${page.pageNumber}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    pages.forEach((page, index) => {
      setTimeout(() => {
        downloadSingle(page);
      }, index * 250);
    });
  };

  const resetAll = () => {
    setPages([]);
    setProgress(0);
    setActiveTab('upload');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        onLoad={initWorker}
      />

      <main className="min-h-screen bg-[#0a0d14] text-neutral-100 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Top Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-neutral-400">
            <Link href="/" className="hover:text-[#00e599] transition">Home</Link>
            <span>/</span>
            <Link href="/cyber-cafe" className="hover:text-[#00e599] transition">Tools</Link>
            <span>/</span>
            <span className="text-[#00e599]">PDF to JPG Converter</span>
          </nav>

          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e599]/10 border border-[#00e599]/30 text-[#00e599] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse"></span>
              100% Client-Side Engine • Zero Server Upload
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              PDF To JPG Converter <span className="text-[#00e599]">Ultra HD</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto">
              Extract every PDF page into sharp, high-resolution 300 DPI JPG images. 100% private in-browser rendering for Sarkari forms, marksheets, and official documents.
            </p>
          </div>

          {/* Resolution / DPI Bar */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-300 font-medium">
              <span>⚙️ Output Quality (DPI):</span>
            </div>
            <div className="flex items-center gap-2">
              {[
                { label: 'Standard (150 DPI)', val: 1.5 },
                { label: 'High Clarity (300 DPI)', val: 2.0 },
                { label: 'Ultra HD (450 DPI)', val: 3.0 },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setDpiScale(item.val)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    dpiScale === item.val
                      ? 'bg-[#00e599] text-black shadow-md shadow-[#00e599]/20'
                      : 'bg-[#182030] text-neutral-400 hover:text-white border border-[#1f293d]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Upload Box */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 sm:p-10 text-center space-y-6">
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf,.pdf"
              onChange={handlePdfUpload}
              className="hidden"
            />

            {pages.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#1f293d] hover:border-[#00e599] rounded-2xl p-10 cursor-pointer transition-all bg-[#0a0d14]/60 flex flex-col items-center justify-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#00e599]/10 border border-[#00e599]/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  📄
                </div>
                <div className="space-y-1">
                  <p className="text-base sm:text-lg font-bold text-white group-hover:text-[#00e599] transition-colors">
                    Tap to Choose PDF Document
                  </p>
                  <p className="text-xs text-neutral-400">
                    Supports single & multi-page PDF files (.pdf)
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-2 px-6 py-2.5 bg-[#00e599] hover:bg-[#00c985] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#00e599]/20 transition-all"
                >
                  Select PDF Document
                </button>
              </div>
            ) : null}

            {/* Loading Progress */}
            {isProcessing && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs text-neutral-400 font-medium">
                  <span>Converting PDF Pages into High-Res JPGs...</span>
                  <span className="text-[#00e599] font-bold">{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#182030] rounded-full overflow-hidden border border-[#1f293d]">
                  <div
                    className="h-full bg-[#00e599] transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Rendered Converted Pages */}
            {pages.length > 0 && !isProcessing && (
              <div className="space-y-6 text-left">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#1f293d]">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span>✅ Conversion Ready</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/30">
                        {pages.length} {pages.length === 1 ? 'Page' : 'Pages'}
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Source: <span className="text-neutral-200 font-mono">{fileName}.pdf</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {pages.length > 1 && (
                      <button
                        onClick={downloadAll}
                        className="flex-1 sm:flex-none px-4 py-2 bg-[#00e599] hover:bg-[#00c985] text-black font-bold text-xs rounded-xl shadow-md transition"
                      >
                        ⚡ Download All JPGs ({pages.length})
                      </button>
                    )}
                    <button
                      onClick={resetAll}
                      className="px-3 py-2 bg-[#182030] hover:bg-[#222c42] text-neutral-300 font-medium text-xs rounded-xl border border-[#1f293d] transition"
                    >
                      Convert Another
                    </button>
                  </div>
                </div>

                {/* Page Thumbnails Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {pages.map((p) => (
                    <div
                      key={p.pageNumber}
                      className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599]/50 rounded-xl p-3 flex flex-col justify-between gap-3 transition group"
                    >
                      <div className="relative w-full aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center border border-[#182030]">
                        <img
                          src={p.dataUrl}
                          alt={`Page ${p.pageNumber}`}
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute top-2 left-2 bg-black/80 backdrop-blur text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">
                          Page {p.pageNumber}
                        </span>
                        <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur text-[#00e599] text-[10px] font-mono px-2 py-0.5 rounded border border-[#00e599]/30">
                          {p.width}×{p.height}px
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-neutral-400 font-mono">{p.sizeKB} KB</span>
                        <button
                          onClick={() => downloadSingle(p)}
                          className="px-3 py-1.5 bg-[#00e599]/15 hover:bg-[#00e599] text-[#00e599] hover:text-black font-bold rounded-lg transition-all border border-[#00e599]/30 text-xs flex items-center gap-1"
                        >
                          <span>Download JPG</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Resizer Tools Integration */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🎯 Need to Compress the Converted JPG?</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/photo-resizer-20kb"
                className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599] p-3 rounded-xl text-center space-y-1 block transition group"
              >
                <p className="text-xs font-bold text-white group-hover:text-[#00e599]">Resize to 20 KB</p>
                <p className="text-[10px] text-neutral-400">Strict SSC & Police limits</p>
              </Link>
              <Link
                href="/photo-resizer-50kb"
                className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599] p-3 rounded-xl text-center space-y-1 block transition group"
              >
                <p className="text-xs font-bold text-white group-hover:text-[#00e599]">Resize to 50 KB</p>
                <p className="text-[10px] text-neutral-400">Universal Govt Standard</p>
              </Link>
              <Link
                href="/photo-resizer-100kb"
                className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599] p-3 rounded-xl text-center space-y-1 block transition group"
              >
                <p className="text-xs font-bold text-white group-hover:text-[#00e599]">Resize to 100 KB</p>
                <p className="text-[10px] text-neutral-400">High-Res ID Proofs</p>
              </Link>
              <Link
                href="/tools/make-background-white-of-signature"
                className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599] p-3 rounded-xl text-center space-y-1 block transition group"
              >
                <p className="text-xs font-bold text-white group-hover:text-[#00e599]">Clean Signature</p>
                <p className="text-[10px] text-neutral-400">Make Background White</p>
              </Link>
            </div>
          </div>

          {/* Official Instructions & Security Guide */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-300">
            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm">🔒 100% Client-Side Privacy Guarantee</h4>
              <p className="text-neutral-400 leading-relaxed">
                Your PDF document is rendered directly inside your device's browser memory (RAM) via HTML5 Canvas. No confidential identity documents, Aadhaar cards, or marksheets are ever transmitted to any external server.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm">📋 High DPI Preservation</h4>
              <p className="text-neutral-400 leading-relaxed">
                Formilo utilizes a 2.0x/3.0x viewport matrix ensuring high text crispness and zero blur on scanned signatures, seals, and examination admit card credentials.
              </p>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
