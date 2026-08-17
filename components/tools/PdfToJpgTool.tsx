'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Download, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
}

export default function PdfToJpgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<ConvertedPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPdfJs = async () => {
    const pdfjsLib: any = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    return pdfjsLib;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPages([]);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a valid PDF document.');
        return;
      }

      setFile(selectedFile);
      setLoading(true);
      setProgress('Reading PDF document...');

      try {
        const pdfjs = await loadPdfJs();
        const arrayBuffer = await selectedFile.arrayBuffer();
        const typedarray = new Uint8Array(arrayBuffer);

        const pdf = await pdfjs.getDocument({ data: typedarray }).promise;
        const totalPages = pdf.numPages;
        const convertedPages: ConvertedPage[] = [];

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          setProgress(`Rendering page ${pageNum} of ${totalPages}...`);
          const page = await pdf.getPage(pageNum);
          
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (context) {
            context.fillStyle = '#FFFFFF';
            context.fillRect(0, 0, canvas.width, canvas.height);

            const renderContext: any = {
              canvasContext: context,
              viewport: viewport,
              canvas: canvas,
            };

            await page.render(renderContext).promise;

            const blob: Blob | null = await new Promise((resolve) =>
              canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92)
            );

            if (blob) {
              convertedPages.push({
                pageNumber: pageNum,
                dataUrl: URL.createObjectURL(blob),
                blob: blob,
              });
            }
          }
        }

        setPages(convertedPages);
      } catch (err: any) {
        console.error('PDF parsing error:', err);
        setError('Could not render this PDF. Ensure it is not corrupted or password-protected.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownloadSingle = (page: ConvertedPage) => {
    const a = document.createElement('a');
    a.href = page.dataUrl;
    a.download = `formilo-page-${page.pageNumber}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    pages.forEach((page, idx) => {
      setTimeout(() => {
        handleDownloadSingle(page);
      }, idx * 250);
    });
  };

  const handleReset = () => {
    pages.forEach((p) => URL.revokeObjectURL(p.dataUrl));
    setFile(null);
    setPages([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-700 hover:border-emerald-500/60 rounded-xl p-10 text-center cursor-pointer transition-all bg-zinc-950/40 group"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadCloud className="w-7 h-7" />
          </div>
          <p className="text-base font-semibold text-white">Choose PDF File or Drop here</p>
          <p className="text-xs text-zinc-500 mt-1">Extract high-resolution JPG pages instantly</p>
        </div>
      ) : (
        <div className="space-y-6">
          {loading && (
            <div className="py-12 text-center space-y-3">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
              <p className="text-sm font-medium text-emerald-400 animate-pulse">{progress}</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <p className="font-semibold text-xs uppercase tracking-wider">Extraction Failed</p>
              </div>
              <p className="text-xs text-red-300 leading-relaxed">{error}</p>
              <button
                onClick={handleReset}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition"
              >
                Try Another PDF
              </button>
            </div>
          )}

          {pages.length > 0 && !loading && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{pages.length} {pages.length === 1 ? 'Page' : 'Pages'} Extracted</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadAll}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg transition"
                  >
                    Download All Pages
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {pages.map((p) => (
                  <div
                    key={p.pageNumber}
                    className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col items-center gap-3"
                  >
                    <img
                      src={p.dataUrl}
                      alt={`Page ${p.pageNumber}`}
                      className="max-h-56 object-contain rounded border border-zinc-800 shadow-md"
                    />
                    <div className="w-full flex items-center justify-between text-xs text-zinc-400 pt-1">
                      <span>Page {p.pageNumber}</span>
                      <button
                        onClick={() => handleDownloadSingle(p)}
                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
