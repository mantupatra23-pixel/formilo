'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Download, RefreshCw, CheckCircle2, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

type CompressionLevel = 'strong' | 'balanced' | 'high';

export default function PdfCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('balanced');
  const [processing, setProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPdfJs = async () => {
    const pdfjsLib: any = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    return pdfjsLib;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setOutputBlob(null);
    setOutputUrl(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a valid PDF file.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const compressPDF = async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);
    setProgressStage('Initializing PDF engine...');

    try {
      const pdfjs = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const totalPages = pdf.numPages;

      const newPdfDoc = await PDFDocument.create();

      // Compression settings based on level
      let scale = 1.3;
      let quality = 0.65;
      if (compressionLevel === 'strong') {
        scale = 1.0;
        quality = 0.45;
      } else if (compressionLevel === 'high') {
        scale = 1.6;
        quality = 0.82;
      }

      for (let i = 1; i <= totalPages; i++) {
        setProgressStage(`Compressing page ${i} of ${totalPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({
            canvasContext: ctx,
            viewport: viewport,
            canvas: canvas as any,
          }).promise;

          const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
          const imgBytes = await fetch(imgDataUrl).then((res) => res.arrayBuffer());
          const embeddedImage = await newPdfDoc.embedJpg(imgBytes);

          // Standardize page to PDF points
          const originalViewport = page.getViewport({ scale: 1.0 });
          const newPage = newPdfDoc.addPage([originalViewport.width, originalViewport.height]);
          newPage.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: originalViewport.width,
            height: originalViewport.height,
          });
        }
      }

      setProgressStage('Building compressed document...');
      const compressedPdfBytes = await newPdfDoc.save();
      const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });

      setOutputBlob(blob);
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
    } catch (err: any) {
      console.error('Compression error:', err);
      setError('Unable to compress this PDF. Please check if the file is encrypted or corrupted.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `formilo_compressed_${file?.name || 'document.pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFile(null);
    setOutputBlob(null);
    setOutputUrl(null);
    setOutputSize(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 text-zinc-100">
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
          <p className="text-xs text-zinc-500 mt-1">Reduce PDF document size directly in your browser</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Selected Card */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">{file.name}</p>
              <p className="text-xs text-zinc-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-red-400 hover:text-red-300 font-medium"
            >
              Change File
            </button>
          </div>

          {/* Compression Level Selector */}
          {!outputUrl && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-300 block">Compression Level:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'strong', label: 'Strong', desc: 'Smallest size' },
                  { key: 'balanced', label: 'Balanced', desc: 'Recommended' },
                  { key: 'high', label: 'High Quality', desc: 'Best clarity' },
                ].map((level) => (
                  <button
                    key={level.key}
                    onClick={() => setCompressionLevel(level.key as CompressionLevel)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      compressionLevel === level.key
                        ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-lg shadow-emerald-500/5'
                        : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="block text-xs font-bold">{level.label}</span>
                    <span className="text-[10px] text-zinc-400">{level.desc}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={compressPDF}
                disabled={processing}
                className="w-full py-3.5 mt-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> {progressStage}
                  </>
                ) : (
                  'Compress PDF'
                )}
              </button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <p className="font-semibold text-xs">Compression Failed</p>
              </div>
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Output / Results */}
          {outputSize && outputUrl && (
            <div className="p-6 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> PDF Compressed Successfully
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
                  <span className="block text-[10px] text-zinc-400 font-bold uppercase">Original</span>
                  <span className="text-sm font-bold text-zinc-200">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                </div>

                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/40 text-center">
                  <span className="block text-[10px] text-emerald-400 font-bold uppercase">Compressed</span>
                  <span className="text-sm font-bold text-emerald-300">
                    {(outputSize / 1024).toFixed(0)} KB
                  </span>
                </div>

                <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-800/40 text-center">
                  <span className="block text-[10px] text-emerald-400 font-bold uppercase">Saved</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {file.size > outputSize
                      ? `${(((file.size - outputSize) / file.size) * 100).toFixed(1)}%`
                      : '0%'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Reduced PDF
                </button>
                <button
                  onClick={handleReset}
                  className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-xl text-sm transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> Compress Another
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Banner */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-center space-x-2 text-xs text-zinc-500">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>100% Client-Side Processing • Your PDF is never uploaded to any server</span>
      </div>
    </div>
  );
}
