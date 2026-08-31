'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';

interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
      alert('PDF Engine is initializing. Please try again in 2 seconds.');
      return;
    }

    setIsProcessing(true);
    setPages([]);
    setProgress(10);
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
            sizeKB: Math.round(blob.size / 1024),
            width: Math.round(viewport.width),
            height: Math.round(viewport.height),
          });
        }
        setProgress(Math.round((i / totalPages) * 90) + 10);
      }

      setPages(convertedList);
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const faqs = [
    {
      q: 'What is the maximum resolution and DPI for converted JPG images?',
      a: 'Formilo converts PDF pages at up to 300 to 450 DPI Ultra HD resolution using high-precision bi-cubic rasterization, ensuring all stamps, signatures, and fine text lines remain 100% razor sharp.',
    },
    {
      q: 'Is it safe to convert confidential PDF documents (Aadhaar, Pan, Marksheet)?',
      a: 'Yes, 100% safe. All conversions run locally in your device RAM using WebAssembly and HTML5 Canvas. No document or data is ever uploaded to any cloud server.',
    },
    {
      q: 'Can I compress the extracted JPGs under 20 KB or 50 KB for online exam forms?',
      a: 'Yes. Once you download the JPG pages, you can instantly resize and lock their file size under 20 KB, 50 KB, or 100 KB using Formilo Photo and Signature Resizer tools.',
    },
    {
      q: 'Does it support multi-page PDF documents?',
      a: 'Yes. Every single page of your multi-page PDF document is extracted separately into individual JPG cards with one-click single and bulk download options.',
    },
  ];

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        onLoad={initWorker}
      />

      <main className="min-h-screen bg-[#0a0d14] text-neutral-100 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-neutral-400">
            <Link href="/" className="hover:text-[#00e599] transition">Home</Link>
            <span>/</span>
            <Link href="/cyber-cafe" className="hover:text-[#00e599] transition">PDF Tools</Link>
            <span>/</span>
            <span className="text-[#00e599]">PDF To JPG Converter</span>
          </nav>

          {/* Official Badge & Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00e599]/10 border border-[#00e599]/20 text-[#00e599] text-xs font-semibold">
              <span>⚡ Official Dimension & Size Lock: 300 DPI Ultra HD</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              PDF To JPG Converter <span className="text-[#00e599]">Ultra HD Document</span> Resizer
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Free online high-resolution PDF to JPG document converter for Sarkari exam marksheets, certificates, and identity files. Automatically locks 300 DPI clarity with 100% private in-browser processing.
            </p>
          </div>

          {/* Top Ad Slot */}
          <div className="w-full h-24 sm:h-28 bg-[#111622]/60 border border-[#1f293d] rounded-2xl flex flex-col items-center justify-center text-center p-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">SPONSORED / ADVERTISEMENT</span>
          </div>

          {/* Main Converter Card */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Top Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1f293d] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse"></span>
                <span className="text-neutral-300 font-semibold uppercase tracking-wider">
                  Lock Target: <strong className="text-white">PDF PAGES TO HIGH-RES JPG</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-2 py-0.5 rounded bg-[#00e599]/15 text-[#00e599] font-mono font-bold border border-[#00e599]/30 text-[11px]">
                  300 DPI
                </span>
                <span className="px-2 py-0.5 rounded bg-[#182030] text-neutral-300 font-mono text-[11px] border border-[#1f293d]">
                  Lossless JPEG
                </span>
              </div>
            </div>

            {/* Quality Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0d14] p-3 rounded-xl border border-[#1f293d] text-xs">
              <span className="text-neutral-400 font-medium">Output Quality / DPI:</span>
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

            {/* File Dropzone */}
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf,.pdf"
              onChange={handlePdfUpload}
              className="hidden"
            />

            {pages.length === 0 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#1f293d] hover:border-[#00e599] rounded-2xl p-8 sm:p-12 cursor-pointer transition-all bg-[#0a0d14]/60 flex flex-col items-center justify-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#00e599]/10 border border-[#00e599]/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  📄
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-base sm:text-lg font-bold text-white group-hover:text-[#00e599] transition-colors">
                    Tap to Choose PDF Document
                  </p>
                  <p className="text-xs text-neutral-400">
                    HD Auto-Framing for Multi-Page Documents • PDF
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-2 px-6 py-2.5 bg-[#00e599] hover:bg-[#00c985] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#00e599]/20 transition-all"
                >
                  Select PDF Document
                </button>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-2">
                  <span className="text-[#00e599]">🛡️</span> Ultra HD Crisp Interpolation • Max Allowed Quality Retention
                </div>
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="space-y-3 py-4">
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

            {/* Converted Results Grid */}
            {pages.length > 0 && !isProcessing && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#1f293d]">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span>✅ Converted Pages</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/30">
                        {pages.length} Pages
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5 font-mono">{fileName}.pdf</p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {pages.length > 1 && (
                      <button
                        onClick={downloadAll}
                        className="flex-1 sm:flex-none px-4 py-2 bg-[#00e599] hover:bg-[#00c985] text-black font-bold text-xs rounded-xl shadow-md transition"
                      >
                        Download All JPGs ({pages.length})
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pages.map((p) => (
                    <div
                      key={p.pageNumber}
                      className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599]/50 rounded-xl p-3 flex flex-col justify-between gap-3 transition"
                    >
                      <div className="relative w-full aspect-[3/4] bg-white rounded-lg overflow-hidden flex items-center justify-center">
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
                          className="px-3 py-1.5 bg-[#00e599]/15 hover:bg-[#00e599] text-[#00e599] hover:text-black font-bold rounded-lg transition-all border border-[#00e599]/30 text-xs"
                        >
                          Download JPG
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Middle Ad Slot */}
          <div className="w-full h-24 sm:h-28 bg-[#111622]/60 border border-[#1f293d] rounded-2xl flex flex-col items-center justify-center text-center p-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">SPONSORED / ADVERTISEMENT</span>
          </div>

          {/* Official Upload Guidelines Matrix */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-[#00e599]">🛡️</span> PDF To JPG Converter Official Upload Guidelines
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3">
                <span className="text-[10px] text-neutral-400 block">Board / Authority</span>
                <span className="text-xs font-bold text-white">Official Examination Authority</span>
              </div>
              <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3">
                <span className="text-[10px] text-neutral-400 block">Allowed File Size</span>
                <span className="text-xs font-bold text-[#00e599]">20 KB - 50 KB / Original</span>
              </div>
              <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3">
                <span className="text-[10px] text-neutral-400 block">Exact Dimensions</span>
                <span className="text-xs font-bold text-white">350 × 450 px / A4 Scale</span>
              </div>
              <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3">
                <span className="text-[10px] text-neutral-400 block">Resolution & DPI</span>
                <span className="text-xs font-bold text-[#00e599]">300 DPI Ultra HD</span>
              </div>
            </div>

            <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3 flex items-start gap-2 text-xs">
              <span className="text-[#00e599]">🛡️</span>
              <div>
                <strong className="text-white">Background & Quality Requirement:</strong>
                <p className="text-neutral-400 mt-0.5">
                  Light / Crisp White Background. Ensure candidate facial features or signature strokes are crisp, evenly lit, and free from blur before submitting.
                </p>
              </div>
            </div>
          </div>

          {/* How to Resize & Zero Upload Guarantee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📄 How to Resize for Pdf To Jpg Converter</span>
              </h3>
              <ol className="text-xs text-neutral-400 space-y-2 list-decimal pl-4">
                <li>Tap <strong className="text-white">"Select PDF Document"</strong> and choose your PDF file.</li>
                <li>Select your desired output DPI (Standard 150 DPI or High Clarity 300 DPI).</li>
                <li>Review the high-resolution generated JPG cards.</li>
                <li>Click <strong className="text-white">"Download JPG"</strong> or <strong className="text-white">"Download All JPGs"</strong> to save.</li>
              </ol>
            </div>

            <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🔒 Zero Server Upload Guarantee</span>
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                All images and documents are processed locally inside your web browser RAM using HTML5 Canvas. No confidential identity documents or personal photographs are ever uploaded or stored on any server.
              </p>
            </div>
          </div>

          {/* Related Format Presets */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#00e599] uppercase tracking-wider flex items-center gap-1.5">
                <span>⚡</span> RELATED PDF TO JPG CONVERTER FORMAT PRESETS
              </span>
              <span className="text-[11px] text-neutral-500">Quick Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/tools/make-background-white-of-signature"
                className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599] rounded-xl p-3 space-y-2 block transition group"
              >
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182030] text-neutral-400">SIGN</span>
                <p className="text-xs font-bold text-white group-hover:text-[#00e599]">Pdf To Jpg Signature Crop & Compress</p>
                <div className="flex justify-between items-center text-[10px] text-neutral-500">
                  <span className="text-[#00e599]">&lt; 20 KB</span>
                  <span>Open &rarr;</span>
                </div>
              </Link>

              <Link
                href="/photo-resizer-20kb"
                className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599] rounded-xl p-3 space-y-2 block transition group"
              >
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182030] text-neutral-400">THUMB</span>
                <p className="text-xs font-bold text-white group-hover:text-[#00e599]">Pdf To Jpg Left Thumb Impression</p>
                <div className="flex justify-between items-center text-[10px] text-neutral-500">
                  <span className="text-[#00e599]">&lt; 20 KB</span>
                  <span>Open &rarr;</span>
                </div>
              </Link>

              <Link
                href="/photo-resizer-200kb"
                className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599] rounded-xl p-3 space-y-2 block transition group"
              >
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182030] text-neutral-400">&lt; 200 KB</span>
                <p className="text-xs font-bold text-white group-hover:text-[#00e599]">Pdf To Jpg Postcard Photo (4x6 Inch)</p>
                <div className="flex justify-between items-center text-[10px] text-neutral-500">
                  <span className="text-[#00e599]">&lt; 200 KB</span>
                  <span>Open &rarr;</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-[#00e599]">❓ Frequently Asked Questions</span>
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-[#0a0d14] border border-[#1f293d] rounded-xl overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-3.5 text-left text-xs font-bold text-white hover:text-[#00e599] flex justify-between items-center transition"
                  >
                    <span>{faq.q}</span>
                    <span className="text-neutral-500 text-sm ml-2">
                      {openFaq === i ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="p-3.5 pt-0 text-xs text-neutral-400 border-t border-[#1f293d]/50 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
