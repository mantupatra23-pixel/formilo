'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

interface FileItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function JpgToPdfTool() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfSize, setPdfSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

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

    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < files.length; i++) {
        if (i > 0) doc.addPage();

        const imgBitmap = await createImageBitmap(files[i].file);
        const canvas = document.createElement('canvas');
        canvas.width = imgBitmap.width;
        canvas.height = imgBitmap.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(imgBitmap, 0, 0);
        const imgData = canvas.toDataURL('image/jpeg', 0.85);

        const imgRatio = imgBitmap.width / imgBitmap.height;
        let renderW = pageWidth - 20;
        let renderH = renderW / imgRatio;

        if (renderH > pageHeight - 20) {
          renderH = pageHeight - 20;
          renderW = renderH * imgRatio;
        }

        const x = (pageWidth - renderW) / 2;
        const y = (pageHeight - renderH) / 2;

        doc.addImage(imgData, 'JPEG', x, y, renderW, renderH);
        imgBitmap.close();
      }

      const outputArrayBuffer = doc.output('arraybuffer');
      const blob = new Blob([outputArrayBuffer], { type: 'application/pdf' });
      
      setPdfBlob(blob);
      setPdfSize(blob.size);
    } catch (err) {
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsProcessing(false);
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
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-4">
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
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
        <p className="text-xs text-slate-500">Upload one or multiple images to merge into a PDF.</p>
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
              {isProcessing ? 'Generating PDF...' : 'Convert to PDF'}
            </button>
          )}
        </div>
      )}

      {pdfBlob && (
        <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 font-bold flex items-center justify-center text-sm">
              PDF
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">PDF Created Successfully</h4>
              <p className="text-xs text-slate-500">
                Pages: {files.length} | Size: {(pdfSize / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="flex gap-3">
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
              className="px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-xl text-sm transition"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
