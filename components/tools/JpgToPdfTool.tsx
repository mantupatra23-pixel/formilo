'use client';

import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';

interface FileItem {
  id: string;
  file: File;
  previewUrl: string;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unable to load image'));
    };
    img.src = url;
  });
}

export default function JpgToPdfTool() {
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfSize, setPdfSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList).filter((file) => {
      const type = file.type.toLowerCase();
      const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
      return (
        type === 'image/jpeg' ||
        type === 'image/jpg' ||
        type === 'image/png' ||
        type === 'image/webp' ||
        type.startsWith('image/') ||
        ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
      );
    });

    console.log('[JPG-TO-PDF] selected files count:', incoming.length);

    if (incoming.length === 0) {
      setErrorMsg('Please select valid JPG, PNG, or WebP images.');
      return;
    }

    setErrorMsg(null);

    setSelectedFiles((prev) => {
      const existingKeys = new Set(prev.map((item) => `${item.file.name}_${item.file.size}_${item.file.lastModified}`));
      const uniqueNewItems: FileItem[] = [];

      for (const file of incoming) {
        const key = `${file.name}_${file.size}_${file.lastModified}`;
        if (!existingKeys.has(key)) {
          uniqueNewItems.push({
            id: Math.random().toString(36).substring(2, 9),
            file,
            previewUrl: URL.createObjectURL(file),
          });
        }
      }

      const combined = [...prev, ...uniqueNewItems];
      if (combined.length > 100) {
        setErrorMsg('Maximum 100 images allowed. Truncated to first 100 images.');
        return combined.slice(0, 100);
      }
      return combined;
    });

    setPdfBlob(null);
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
    setPdfBlob(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    setSelectedFiles((prev) => {
      const newArr = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newArr.length) return prev;
      const temp = newArr[index];
      newArr[index] = newArr[targetIndex];
      newArr[targetIndex] = temp;
      return newArr;
    });
    setPdfBlob(null);
  };

  const handleReset = () => {
    selectedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setSelectedFiles([]);
    setPdfBlob(null);
    setPdfSize(0);
    setErrorMsg(null);
  };

  const generatePdf = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    setProgressMsg('Reading images...');
    setErrorMsg(null);

    console.log('[JPG-TO-PDF] generating PDF from', selectedFiles.length, 'files');

    try {
      const firstImg = await loadImage(selectedFiles[0].file);
      const firstW = firstImg.naturalWidth;
      const firstH = firstImg.naturalHeight;

      const pdf = new jsPDF({
        orientation: firstW >= firstH ? 'landscape' : 'portrait',
        unit: 'px',
        format: [firstW, firstH],
        compress: true,
      });

      for (let i = 0; i < selectedFiles.length; i++) {
        setProgressMsg(`Creating PDF page ${i + 1} of ${selectedFiles.length}...`);

        const file = selectedFiles[i].file;
        const img = await loadImage(file);
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        // Bounded dimension optimization for large 10-15MB camera photos
        if (w > 2500 || h > 2500) {
          const ratio = Math.min(2500 / w, 2500 / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const ctx = tempCanvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);

        const imgMime = file.type.toLowerCase() === 'image/png' ? 'PNG' : 'JPEG';
        const imgData = tempCanvas.toDataURL(`image/${imgMime.toLowerCase()}`, 0.85);

        if (i > 0) {
          pdf.addPage([w, h], w >= h ? 'landscape' : 'portrait');
        }

        pdf.addImage(imgData, imgMime, 0, 0, w, h, undefined, 'FAST');
      }

      setProgressMsg('Exporting PDF document...');
      const blob = pdf.output('blob');

      if (!blob || blob.type !== 'application/pdf') {
        throw new Error('Generated file is not a valid PDF');
      }

      // Verify %PDF- signature
      const slice = await blob.slice(0, 5).arrayBuffer();
      const signature = new TextDecoder().decode(slice);

      if (signature !== '%PDF-') {
        throw new Error('Generated file signature is not a valid PDF');
      }

      console.log('[JPG-TO-PDF] PDF created successfully:', blob.type, blob.size);

      setPdfBlob(blob);
      setPdfSize(blob.size);
    } catch (err: any) {
      console.error('[JPG-TO-PDF] generation error:', err);
      setErrorMsg('Unable to create PDF. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
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
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        id="jpg-to-pdf-input"
      />

      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition"
        >
          Select JPG / PNG Images
        </button>
        <p className="text-xs text-slate-500">Supports up to 100 images (JPG, PNG, WebP)</p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 rounded-xl text-xs">
          {errorMsg}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Selected Images: {selectedFiles.length} / 100
            </h3>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              + Add More Images
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-1">
            {selectedFiles.map((item, idx) => (
              <div key={item.id} className="relative group border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-950 space-y-2">
                <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10">
                  {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow z-10"
                >
                  ✕
                </button>
                {/* eslint-disable-next-html-element-suppression */}
                <img src={item.previewUrl} alt={`Preview ${idx + 1}`} className="w-full h-28 object-cover rounded-lg" />
                <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveFile(idx, 'up')}
                    className="disabled:opacity-30 hover:text-blue-600 font-bold"
                  >
                    ← Move Up
                  </button>
                  <button
                    type="button"
                    disabled={idx === selectedFiles.length - 1}
                    onClick={() => moveFile(idx, 'down')}
                    className="disabled:opacity-30 hover:text-blue-600 font-bold"
                  >
                    Move Down →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!pdfBlob && (
            <button
              type="button"
              onClick={generatePdf}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl text-sm transition"
            >
              {isProcessing ? progressMsg : 'Generate PDF'}
            </button>
          )}
        </div>
      )}

      {pdfBlob && (
        <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">PDF Created Successfully</h3>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="block text-[10px] text-slate-500 font-bold uppercase">Pages</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {selectedFiles.length}
              </span>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900">
              <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">PDF Size</span>
              <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                {(pdfSize / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>

          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold pt-1">
            File Type: PDF
          </p>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={downloadPdf}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition"
            >
              Download PDF
            </button>
            <button
              type="button"
              onClick={handleReset}
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
