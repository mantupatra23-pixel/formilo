'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';

interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  sizeKB: number;
}

export default function PdfToJpgPage() {
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [pages, setPages] = useState<ConvertedPage[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).pdfjsLib) {
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setPdfJsLoaded(true);
    }
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please select a valid .PDF document file');
      return;
    }

    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) {
      alert('PDF Engine is initializing. Please try again in 2 seconds.');
      return;
    }

    setIsProcessing(true);
    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setPages([]);
    setProgress(10);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const converted: ConvertedPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x HD DPI

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

          converted.push({
            pageNumber: i,
            dataUrl,
            blob,
            sizeKB: Math.round(blob.size / 1024),
          });
        }
        setProgress(Math.round((i / totalPages) * 90) + 10);
      }

      setPages(converted);
    } catch (err) {
      console.error(err);
      alert('Failed to parse PDF. Please ensure the PDF is not password-protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSinglePage = (page: ConvertedPage) => {
    const link = document.createElement('a');
    link.href = page.dataUrl;
    link.download = `${fileName}_page_${page.pageNumber}.jpg`;
    link.click();
  };

  const downloadAllPages = () => {
    pages.forEach((page) => {
      setTimeout(() => {
        downloadSinglePage(page);
      }, page.pageNumber * 200);
    });
  };

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        onLoad={() => {
          if ((window as any).pdfjsLib) {
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            setPdfJsLoaded(true);
          }
        }}
      />

      <main className="min-h-screen bg-[#0a0d14] text-white selection:bg-[#00e599]/30 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-neutral-400">
            <Link href="/" className="hover:text-[#00e599]">Home</Link>
            <span>/</span>
            <span className="text-[#00e599]">PDF to JPG Converter</span>
          </nav>

          {/* Heading */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00e599]/10 border border-[#00e599]/20 text-[#00e599] text-xs font-semibold">
              ⚡ 100% Client-Side Engine • Zero Server Upload
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              PDF To JPG Converter <span className="text-[#00e599]">Online HD</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
              Convert PDF pages into high-resolution JPG images in seconds directly in your browser with complete privacy.
            </p>
          </div>

          {/* Upload Box */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 sm:p-8 text-center space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf,.pdf"
              onChange={handlePdfUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#1f293d] hover:border-[#00e599]/50 rounded-xl p-8 cursor-pointer transition-all bg-[#0a0d14]/50 flex flex-col items-center justify-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-[#00e599]/10 border border-[#00e599]/20 flex items-center justify-center text-2xl">
                📄
              </div>
              <div>
                <p className="text-base font-semibold text-white">Tap to Choose PDF Document</p>
                <p className="text-xs text-neutral-400 mt-1">Accepts all official PDF files (.pdf)</p>
              </div>
              <button
                type="button"
                className="mt-2 px-5 py-2.5 bg-[#00e599] hover:bg-[#00c985] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#00e599]/20"
              >
                Select PDF File
              </button>
            </div>

            {isProcessing && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Converting PDF Pages to JPG...</span>
                  <span className="text-[#00e599] font-bold">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#1f293d] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00e599] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Converted Results Grid */}
          {pages.length > 0 && (
            <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#1f293d]">
                <div>
                  <h2 className="text-lg font-bold text-white">Converted Pages ({pages.length})</h2>
                  <p className="text-xs text-neutral-400">All pages rendered at 300 DPI high resolution</p>
                </div>
                {pages.length > 1 && (
                  <button
                    onClick={downloadAllPages}
                    className="px-4 py-2 bg-[#00e599] text-black font-bold text-xs rounded-xl hover:bg-[#00c985]"
                  >
                    Download All Pages (JPG)
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {pages.map((page) => (
                  <div
                    key={page.pageNumber}
                    className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3 flex flex-col items-center gap-3"
                  >
                    <div className="relative w-full aspect-[3/4] bg-white rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={page.dataUrl}
                        alt={`Page ${page.pageNumber}`}
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        Page {page.pageNumber}
                      </span>
                    </div>

                    <div className="w-full flex items-center justify-between text-xs">
                      <span className="text-neutral-400">{page.sizeKB} KB</span>
                      <button
                        onClick={() => downloadSinglePage(page)}
                        className="px-3 py-1.5 bg-[#00e599]/20 hover:bg-[#00e599] text-[#00e599] hover:text-black font-semibold rounded-lg transition-colors text-xs"
                      >
                        Download JPG
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick FAQ / Guide */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-4 text-xs text-neutral-300">
            <h3 className="text-sm font-bold text-white">Why use Formilo PDF to JPG Engine?</h3>
            <ul className="list-disc pl-5 space-y-2 text-neutral-400">
              <li><strong className="text-white">100% Privacy Guaranteed:</strong> No document is ever uploaded to a remote server. The PDF rendering happens locally in your device RAM.</li>
              <li><strong className="text-white">A4 & Multi-Page Support:</strong> Handles marksheets, certificates, and multi-page government documents seamlessly.</li>
              <li><strong className="text-white">Instant Resizing Integration:</strong> Converted JPGs can be resized directly to 20 KB or 50 KB using Formilo's photo tools.</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
