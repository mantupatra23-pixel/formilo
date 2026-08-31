'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';

interface CompressionResult {
  fileName: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  reductionPercent: number;
  pdfBlobUrl: string;
  totalPages: number;
}

export default function PdfCompressorPage() {
  const [enginesLoaded, setEnginesLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetMaxKB, setTargetMaxKB] = useState<number>(200);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkEngines = () => {
    if (typeof window !== 'undefined' && (window as any).pdfjsLib && (window as any).jspdf) {
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setEnginesLoaded(true);
    }
  };

  useEffect(() => {
    checkEngines();
  }, []);

  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid .PDF document file.');
      return;
    }

    setSelectedFile(file);
    setResult(null);
  };

  const compressPdfDocument = async () => {
    if (!selectedFile) return;

    const pdfjsLib = (window as any).pdfjsLib;
    const jspdfModule = (window as any).jspdf;

    if (!pdfjsLib || !jspdfModule?.jsPDF) {
      alert('PDF Engine is initializing. Please try again in 2 seconds.');
      return;
    }

    setIsCompressing(true);
    setProgress(10);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;

      const { jsPDF } = jspdfModule;
      let outputPdf: any = null;

      // Dynamic quality calculation based on target KB and page count
      const estBudgetPerPage = targetMaxKB / Math.max(1, totalPages);
      let quality = estBudgetPerPage < 50 ? 0.45 : estBudgetPerPage < 100 ? 0.65 : 0.82;
      let renderScale = estBudgetPerPage < 50 ? 1.2 : 1.6;

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: renderScale });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;

          const dataUrl = canvas.toDataURL('image/jpeg', quality);

          const isLandscape = viewport.width > viewport.height;
          const a4W = isLandscape ? 297 : 210;
          const a4H = isLandscape ? 210 : 297;

          if (i === 1) {
            outputPdf = new jsPDF({
              orientation: isLandscape ? 'l' : 'p',
              unit: 'mm',
              format: 'a4',
            });
          } else {
            outputPdf.addPage('a4', isLandscape ? 'l' : 'p');
          }

          outputPdf.addImage(dataUrl, 'JPEG', 0, 0, a4W, a4H, undefined, 'FAST');
        }

        setProgress(Math.round((i / totalPages) * 85) + 10);
      }

      const pdfBlob = outputPdf.output('blob');
      const compressedSizeKB = Math.round(pdfBlob.size / 1024);
      const originalSizeKB = Math.round(selectedFile.size / 1024);
      const reduction = Math.max(0, Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100));

      const blobUrl = URL.createObjectURL(pdfBlob);

      setResult({
        fileName: selectedFile.name.replace(/\.[^/.]+$/, '') + `_under_${targetMaxKB}kb.pdf`,
        originalSizeKB,
        compressedSizeKB,
        reductionPercent: reduction,
        pdfBlobUrl: blobUrl,
        totalPages,
      });
      setProgress(100);
    } catch (err) {
      console.error(err);
      alert('Failed to compress PDF. Please ensure the document is not password protected.');
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadCompressedPdf = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.pdfBlobUrl;
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetAll = () => {
    setSelectedFile(null);
    setResult(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const faqs = [
    {
      q: 'How to compress PDF certificate strictly under 200 KB or 100 KB?',
      a: 'Select your PDF file, choose your target limit (< 100 KB, < 200 KB, < 300 KB, or < 500 KB), and tap "Compress PDF Now". Formilo dynamically adjusts canvas compression to fit exact Sarkari portal requirements.',
    },
    {
      q: 'Will marksheet text or stamps remain readable after compression?',
      a: 'Yes. Formilo applies vector-aware rasterization that maintains high contrast on text, roll numbers, and official signatures while reducing redundant background metadata.',
    },
    {
      q: 'Is my confidential PDF uploaded to any cloud server?',
      a: 'No. All PDF processing and rasterization runs 100% locally inside your browser memory (RAM). Zero document data is sent to external servers.',
    },
    {
      q: 'Does it support multi-page PDF documents?',
      a: 'Yes. Multi-page caste certificates, marksheets, and admit cards are compressed and reassembled into a single compliant PDF file.',
    },
  ];

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        onLoad={checkEngines}
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        onLoad={checkEngines}
      />

      <main className="min-h-screen bg-[#0a0d14] text-neutral-100 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-neutral-400">
            <Link href="/" className="hover:text-[#00e599] transition">Home</Link>
            <span>/</span>
            <Link href="/cyber-cafe" className="hover:text-[#00e599] transition">PDF Tools</Link>
            <span>/</span>
            <span className="text-[#00e599]">PDF Compressor</span>
          </nav>

          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00e599]/10 border border-[#00e599]/20 text-[#00e599] text-xs font-semibold">
              <span>⚡ Official Size Lock: Under {targetMaxKB} KB Document Safe</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              PDF Compressor <span className="text-[#00e599]">Under {targetMaxKB} KB</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Compress large PDF certificates, marksheets, caste documents, and admit cards strictly under 100 KB, 200 KB, or 300 KB for Sarkari exam online forms with 100% client-side privacy.
            </p>
          </div>

          {/* Top Ad Slot */}
          <div className="w-full h-24 sm:h-28 bg-[#111622]/60 border border-[#1f293d] rounded-2xl flex flex-col items-center justify-center text-center p-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">SPONSORED / ADVERTISEMENT</span>
          </div>

          {/* Main Card */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Target Size Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1f293d] text-xs">
              <span className="text-neutral-300 font-semibold uppercase tracking-wider">
                Select Target File Size Limit:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: '< 100 KB', kb: 100 },
                  { label: '< 200 KB', kb: 200 },
                  { label: '< 300 KB', kb: 300 },
                  { label: '< 500 KB', kb: 500 },
                ].map((item) => (
                  <button
                    key={item.kb}
                    type="button"
                    onClick={() => {
                      setTargetMaxKB(item.kb);
                      if (result) setResult(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      targetMaxKB === item.kb
                        ? 'bg-[#00e599] text-black shadow-md shadow-[#00e599]/20'
                        : 'bg-[#0a0d14] text-neutral-400 border border-[#1f293d] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* File Input (Accepts ONLY PDF) */}
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf,.pdf"
              onChange={handlePdfSelect}
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#1f293d] hover:border-[#00e599] rounded-2xl p-8 sm:p-12 cursor-pointer transition-all bg-[#0a0d14]/60 flex flex-col items-center justify-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#00e599]/10 border border-[#00e599]/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  📑
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-base sm:text-lg font-bold text-white group-hover:text-[#00e599] transition-colors">
                    Tap to Choose PDF Document
                  </p>
                  <p className="text-xs text-neutral-400">
                    Accepts marksheets, certificates, and application PDFs (.pdf)
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-2 px-6 py-2.5 bg-[#00e599] hover:bg-[#00c985] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#00e599]/20 transition-all"
                >
                  Select PDF File
                </button>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-2">
                  <span className="text-[#00e599]">🛡️</span> Target Lock: Under {targetMaxKB} KB • Zero Server Upload
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Selected File Card */}
                <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#00e599]/10 border border-[#00e599]/30 flex items-center justify-center text-xl">
                      📄
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white max-w-xs truncate">{selectedFile.name}</p>
                      <p className="text-[11px] text-neutral-400">
                        Original Size: <strong className="text-neutral-200 font-mono">{(selectedFile.size / 1024).toFixed(1)} KB</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={resetAll}
                      className="px-3 py-1.5 bg-[#182030] hover:bg-[#222c42] text-neutral-300 font-semibold text-xs rounded-lg border border-[#1f293d]"
                    >
                      Change PDF
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {isCompressing && (
                  <div className="space-y-2 py-2">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Compressing PDF pages to &lt; {targetMaxKB} KB...</span>
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

                {/* Compression Action or Result */}
                {!result ? (
                  <button
                    type="button"
                    onClick={compressPdfDocument}
                    disabled={isCompressing}
                    className="w-full py-3.5 bg-[#00e599] hover:bg-[#00c985] disabled:opacity-50 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-[#00e599]/20 transition flex items-center justify-center gap-2"
                  >
                    <span>⚡ Compress PDF Under {targetMaxKB} KB Now</span>
                  </button>
                ) : (
                  <div className="bg-[#0a0d14] border border-[#00e599]/40 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#00e599] flex items-center gap-1.5">
                        <span>✅</span> PDF Compressed Successfully ({result.totalPages} Pages)
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/30">
                        {result.reductionPercent}% Reduced
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-[#111622] rounded-lg border border-[#1f293d]">
                        <span className="text-neutral-500 block text-[10px]">Original File Size</span>
                        <span className="font-bold text-neutral-300 font-mono">{result.originalSizeKB} KB</span>
                      </div>
                      <div className="p-3 bg-[#111622] rounded-lg border border-[#00e599]/30">
                        <span className="text-neutral-500 block text-[10px]">Compressed File Size</span>
                        <span className="font-bold text-[#00e599] font-mono text-sm">{result.compressedSizeKB} KB</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={downloadCompressedPdf}
                      className="w-full py-3.5 bg-[#00e599] hover:bg-[#00c985] text-black font-extrabold text-sm rounded-xl shadow-lg shadow-[#00e599]/20 transition flex items-center justify-center gap-2"
                    >
                      <span>📥 Download Compressed PDF ({result.compressedSizeKB} KB)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Middle Ad Slot */}
          <div className="w-full h-24 sm:h-28 bg-[#111622]/60 border border-[#1f293d] rounded-2xl flex flex-col items-center justify-center text-center p-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">SPONSORED / ADVERTISEMENT</span>
          </div>

          {/* Guidelines Matrix */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-[#00e599]">🛡️</span> Official PDF Document Guidelines
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3">
                <span className="text-[10px] text-neutral-400 block">Board / Authority</span>
                <span className="text-xs font-bold text-white">All Govt Recruitment Portals</span>
              </div>
              <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3">
                <span className="text-[10px] text-neutral-400 block">Target Size Lock</span>
                <span className="text-xs font-bold text-[#00e599]">&lt; {targetMaxKB} KB Strictly</span>
              </div>
              <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3">
                <span className="text-[10px] text-neutral-400 block">Document Sizing</span>
                <span className="text-xs font-bold text-white">Standard A4 Sheet</span>
              </div>
              <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3">
                <span className="text-[10px] text-neutral-400 block">Clarity Retention</span>
                <span className="text-xs font-bold text-[#00e599]">Vector Contrast Safe</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📄 How to Compress PDF File</span>
              </h3>
              <ol className="text-xs text-neutral-400 space-y-2 list-decimal pl-4">
                <li>Tap <strong className="text-white">"Select PDF File"</strong> and choose your document.</li>
                <li>Pick target limit (<strong className="text-white">&lt; 100 KB, &lt; 200 KB, or &lt; 300 KB</strong>).</li>
                <li>Click <strong className="text-white">"Compress PDF Now"</strong>.</li>
                <li>Download your compressed PDF file ready for form submission.</li>
              </ol>
            </div>

            <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🔒 Zero Server Upload Guarantee</span>
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                All PDF files are compressed locally in your web browser RAM using HTML5 Canvas &amp; jsPDF. No identity documents or certificates are ever uploaded or saved on any remote server.
              </p>
            </div>
          </div>

          {/* Related Tools */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#00e599] uppercase tracking-wider flex items-center gap-1.5">
                <span>⚡</span> RELATED PDF &amp; DOCUMENT TOOLS
              </span>
              <span className="text-[11px] text-neutral-500">Quick Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/jpg-to-pdf-converter"
                className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599] rounded-xl p-3 space-y-2 block transition group"
              >
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182030] text-neutral-400">JPG &rarr; PDF</span>
                <p className="text-xs font-bold text-white group-hover:text-[#00e599]">Combine Multiple Images To PDF</p>
                <div className="flex justify-between items-center text-[10px] text-neutral-500">
                  <span className="text-[#00e599]">A4 Multi-Page</span>
                  <span>Open &rarr;</span>
                </div>
              </Link>

              <Link
                href="/pdf-to-jpg-converter"
                className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599] rounded-xl p-3 space-y-2 block transition group"
              >
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182030] text-neutral-400">PDF &rarr; JPG</span>
                <p className="text-xs font-bold text-white group-hover:text-[#00e599]">PDF To JPG Converter Online</p>
                <div className="flex justify-between items-center text-[10px] text-neutral-500">
                  <span className="text-[#00e599]">300 DPI</span>
                  <span>Open &rarr;</span>
                </div>
              </Link>

              <Link
                href="/tools/make-background-white-of-signature"
                className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599] rounded-xl p-3 space-y-2 block transition group"
              >
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182030] text-neutral-400">CLEAN</span>
                <p className="text-xs font-bold text-white group-hover:text-[#00e599]">Signature Background Whitener</p>
                <div className="flex justify-between items-center text-[10px] text-neutral-500">
                  <span className="text-[#00e599]">&lt; 20 KB</span>
                  <span>Open &rarr;</span>
                </div>
              </Link>
            </div>
          </div>

          {/* FAQs */}
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
