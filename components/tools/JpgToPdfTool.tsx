'use client';

import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';

interface FileItem {
  id: string;
  file: File;
  previewUrl: string;
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

    console.log('[JPG TO PDF] selected files:', incoming.map(f => ({ name: f.name, type: f.type, size: f.size })));

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

      return [...prev, ...uniqueNewItems];
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

    console.log('[JPG TO PDF] generating PDF from', selectedFiles.length, 'files');

    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < selectedFiles.length; i++) {
        if (i > 0) doc.addPage('a4', 'p');
        setProgressMsg(`Preparing page ${i + 1} of ${selectedFiles.length}...`);

        const file = selectedFiles[i].file;
        let imageBitmap: ImageBitmap | null = null;

        if ('createImageBitmap' in window) {
          imageBitmap = await createImageBitmap(file, {
            resizeWidth: 3000,
            resizeQuality: 'high',
          }).catch(() => null);
        }

        if (!imageBitmap) {
          const img = new Image();
          img.src = selectedFiles[i].previewUrl;
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

        doc.addImage(imgData, 'JPEG', x, y, renderW, renderH, undefined, 'MEDIUM');
        imageBitmap.close();
      }

      setProgressMsg('Generating PDF file...');
      const outputArrayBuffer = doc.output('arraybuffer');
      const blob = new Blob([outputArrayBuffer], { type: 'application/pdf' });

      // Magic Header Signature Validation (%PDF-)
      const slice = await blob.slice(0, 5).arrayBuffer();
      const signature = new TextDecoder().decode(slice);

      if (signature !== '%PDF-') {
        throw new Error('Generated file signature is not a valid PDF.');
      }

      console.log('[JPG TO PDF] PDF generated:', blob.type, blob.size);

      setPdfBlob(blob);
      setPdfSize(blob.size);
    } catch {
      setErrorMsg('Unable to generate PDF. Please try another image.');
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const downloadPdf = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formilo-jpg-to-pdf.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
        className="hidden"
        id="jpg-to-pdf-input"
      />

      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-4">
        <label
          htmlFor="jpg-to-pdf-input"
          className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition"
        >
          Click to upload or drag & drop files
        </label>
        <p className="text-xs text-slate-500">Select multiple JPG, PNG or WebP images</p>
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
              Selected Images: {selectedFiles.length}
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              + Add More Images
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {selectedFiles.map((item, idx) => (
              <div key={item.id} className="relative group border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-950 space-y-2">
                <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10">
                  {idx + 1}
                </span>
                <button
                  onClick={() => removeFile(item.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow z-10"
                >
                  ✕
                </button>
                {/* eslint-disable-next-html-element-suppression */}
                <img src={item.previewUrl} alt={`Preview ${idx + 1}`} className="w-full h-28 object-cover rounded-lg" />
                <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveFile(idx, 'up')}
                    className="disabled:opacity-30 hover:text-blue-600 font-bold"
                  >
                    ← Move Up
                  </button>
                  <button
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
            Format: PDF
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={downloadPdf}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition"
            >
              Download PDF
            </button>
            <button
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
