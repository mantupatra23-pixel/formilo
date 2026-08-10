'use client';

import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import { getAcceptString, validateSelectedFile } from '@/config/fileValidation';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfCompressorTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [preset, setPreset] = useState<number>(0.65);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    const validation = validateSelectedFile(file, 'pdfCompressor');
    if (!validation.valid) {
      setErrorMsg(validation.message || 'Invalid PDF file.');
      return;
    }

    setSelectedFile(file);
    setOriginalSize(file.size);
    setCompressedBlob(null);
    setErrorMsg(null);
  };

  const compressPdf = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setProgressMsg('Reading PDF structure...');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;

      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 1; i <= pageCount; i++) {
        if (i > 1) doc.addPage();
        setProgressMsg(`Optimizing page ${i} of ${pageCount}...`);

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          await page.render({
            canvasContext: ctx,
            canvas: canvas,
            viewport: viewport,
          }).promise;
          const imgData = canvas.toDataURL('image/jpeg', preset);
          doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
        }
      }

      const outputArrayBuffer = doc.output('arraybuffer');
      let blob = new Blob([outputArrayBuffer], { type: 'application/pdf' });

      if (blob.size >= selectedFile.size) {
        // Fallback: If output is larger than original, return original PDF
        blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        setErrorMsg('Your PDF is already optimized. Original file retained.');
      }

      setCompressedBlob(blob);
      setCompressedSize(blob.size);
    } catch {
      setErrorMsg('Error optimizing PDF file.');
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const downloadPdf = () => {
    if (!compressedBlob) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formilo_compressed_${selectedFile?.name || 'document.pdf'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
      {!selectedFile ? (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-4">
          <input
            type="file"
            accept={getAcceptString('pdfCompressor')}
            onChange={handleFileChange}
            className="hidden"
            id="pdf-compress-input"
          />
          <label
            htmlFor="pdf-compress-input"
            className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition"
          >
            Select PDF File
          </label>
          <p className="text-xs text-slate-500">Supports PDF files</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{selectedFile.name}</h3>
              <p className="text-xs text-slate-500">{(originalSize / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                setCompressedBlob(null);
              }}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Change File
            </button>
          </div>

          {!compressedBlob && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Compression Level:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPreset(0.45)}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      preset === 0.45 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Strong
                  </button>
                  <button
                    onClick={() => setPreset(0.65)}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      preset === 0.65 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Balanced
                  </button>
                  <button
                    onClick={() => setPreset(0.85)}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      preset === 0.85 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    High Quality
                  </button>
                </div>
              </div>

              <button
                onClick={compressPdf}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl text-sm transition"
              >
                {isProcessing ? progressMsg : 'Compress PDF'}
              </button>
            </div>
          )}

          {compressedBlob && (
            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">Original</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {(originalSize / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-200 dark:border-blue-900">
                  <span className="block text-[10px] text-blue-600 font-bold uppercase">Compressed</span>
                  <span className="text-sm font-black text-blue-600">
                    {(compressedSize / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950 rounded-xl border border-emerald-200 dark:border-emerald-900">
                  <span className="block text-[10px] text-emerald-600 font-bold uppercase">Reduced</span>
                  <span className="text-sm font-black text-emerald-600">
                    {Math.max(0, (((originalSize - compressedSize) / originalSize) * 100)).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadPdf}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition"
                >
                  Download Compressed PDF
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setCompressedBlob(null);
                  }}
                  className="px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-xl text-sm transition"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 rounded-xl text-xs">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
