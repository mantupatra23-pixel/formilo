'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { getAcceptString } from '@/config/fileValidation';

interface FileItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function JpgToPdfTool() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfSize, setPdfSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressStage, setProgressStage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    
    const newItems: FileItem[] = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...newItems]);
    setPdfBlob(null);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      const removed = prev.find((item) => item.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
    setPdfBlob(null);
  };

  const generatePdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgressStage('Reading images...');

    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < files.length; i++) {
        if (i > 0) doc.addPage();
        setProgressStage(`Preparing page ${i + 1} of ${files.length}...`);

        const file = files[i].file;
        let imageBitmap: ImageBitmap | null = null;

        if ('createImageBitmap' in window) {
          imageBitmap = await createImageBitmap(file, {
            resizeWidth: 3000,
            resizeQuality: 'high',
          }).catch(() => null);
        }

        if (!imageBitmap) {
          const img = new Image();
          img.src = files[i].previewUrl;
          await new Promise((res) => (img.onload = res));

          const tempCanvas = document.createElement('canvas');
          let w = img.naturalWidth;
          let h = img.naturalHeight;
          if (w > 3000 || h > 3000) {
            const ratio = Math.min(3000 / w, 3000 / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }
          tempCanvas.width = w;
          tempCanvas.height = h;
          const ctx = tempCanvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, w, h);
          imageBitmap = await createImageBitmap(tempCanvas);
        }

        const canvas = document.createElement('canvas');
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(imageBitmap, 0, 0);

        const imgData = canvas.toDataURL('image/jpeg', 0.85);
        const imgRatio = imageBitmap.width / imageBitmap.height;
        
        let renderW = pageWidth - 20;
        let renderH = renderW / imgRatio;

        if (renderH > pageHeight - 20) {
          renderH = pageHeight - 20;
          renderW = renderH * imgRatio;
        }

        const x = (pageWidth - renderW) / 2;
        const y = (pageHeight - renderH) / 2;

        doc.addImage(imgData, 'JPEG', x, y, renderW, renderH);
        imageBitmap.close();
      }

      setProgressStage('Generating PDF...');
      const outputArrayBuffer = doc.output('arraybuffer');
      const blob = new Blob([outputArrayBuffer], { type: 'application/pdf' });

      if (!blob || blob.size === 0) {
        throw new Error('PDF generation returned no data');
      }

      setPdfBlob(blob);
      setPdfSize(blob.size);
    } catch {
      alert('Error generating PDF file. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgressStage('');
    }
  };

  const downloadPdf = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formilo-jpg-to-pdf.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const totalOriginalSize = files.reduce((acc, item) => acc + item.file.size, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-4">
        <input
          type="file"
          multiple
          accept={getAcceptString('jpgToPdf')}
          onChange={handleFileChange}
          className="hidden"
          id="jpg-to-pdf-input"
        />
        <label
          htmlFor="jpg-to-pdf-input"
          className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition"
        >
          Select JPG/PNG Images
        </label>
        <p className="text-xs text-slate-500">Supports JPG, JPEG, PNG, and WebP files.</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Selected Images ({files.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {files.map((item) => (
              <div key={item.id} className="relative group border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-950">
                {/* eslint-disable-next-html-element-suppression */}
                <img src={item.previewUrl} alt="Preview" className="w-full h-24 object-cover rounded-lg" />
                <button
                  onClick={() => removeFile(item.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {!pdfBlob && (
            <button
              onClick={generatePdf}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl text-sm transition"
            >
              {isProcessing ? progressStage : 'Convert to PDF'}
            </button>
          )}
        </div>
      )}

      {pdfBlob && (
        <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Conversion Complete</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="block text-[10px] text-slate-500 font-bold uppercase">Original</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900">
              <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">Output</span>
              <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                {(pdfSize / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="block text-[10px] text-slate-500 font-bold uppercase">Pages</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {files.length}
              </span>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900">
              <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Format</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                PDF
              </span>
            </div>
          </div>

          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold pt-1">
            ✓ PDF successfully created
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={downloadPdf}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition"
            >
              Download PDF
            </button>
            <button
              onClick={() => {
                setFiles([]);
                setPdfBlob(null);
              }}
              className="px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-xl text-sm transition"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
