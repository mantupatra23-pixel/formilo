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
      reject(new Error('Image loading failed'));
    };
    img.src = url;
  });
}

export default function JpgToPdfTool() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfSize, setPdfSize] = useState<number>(0);
  const [generating, setGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);

    console.log('[JPG TO PDF] picker selected:', selected.length);

    const valid = selected.filter((file) => {
      const type = file.type.toLowerCase();
      const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
      return (
        ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(type) ||
        ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ||
        type.startsWith('image/')
      );
    });

    if (valid.length === 0) {
      setError('Please select valid JPG, PNG, or WEBP images.');
      return;
    }

    setError(null);

    setFiles((prev) => {
      const existingKeys = new Set(prev.map((item) => `${item.file.name}_${item.file.size}_${item.file.lastModified}`));
      const uniqueNew: FileItem[] = [];

      for (const f of valid) {
        const key = `${f.name}_${f.size}_${f.lastModified}`;
        if (!existingKeys.has(key)) {
          uniqueNew.push({
            id: Math.random().toString(36).substring(2, 9),
            file: f,
            previewUrl: URL.createObjectURL(f),
          });
        }
      }

      const combined = [...prev, ...uniqueNew];
      if (combined.length > 100) {
        setError('Maximum 100 images allowed. Truncated to first 100 images.');
        return combined.slice(0, 100);
      }
      return combined;
    });

    setPdfBlob(null);
    event.target.value = '';
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
    setPdfBlob(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    setFiles((prev) => {
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
    files.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setFiles([]);
    setPdfBlob(null);
    setPdfSize(0);
    setError(null);
    setProgress(0);
  };

  const generatePdf = async () => {
    if (!files.length) {
      setError('Please select at least one image.');
      return;
    }

    setGenerating(true);
    setProgress(0);
    setError(null);

    try {
      const first = await loadImage(files[0].file);
      const firstW = first.naturalWidth;
      const firstH = first.naturalHeight;

      const firstOrientation = firstW >= firstH ? 'landscape' : 'portrait';

      const pdf = new jsPDF({
        orientation: firstOrientation,
        unit: 'px',
        format: [firstW, firstH],
        compress: true,
      });

      for (let i = 0; i < files.length; i++) {
        const image = await loadImage(files[i].file);
        let w = image.naturalWidth;
        let h = image.naturalHeight;

        // Bounded working resolution for large camera photos
        if (w > 2500 || h > 2500) {
          const ratio = Math.min(2500 / w, 2500 / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const ctx = tempCanvas.getContext('2d');
        ctx?.drawImage(image, 0, 0, w, h);

        const mimeFormat = files[i].file.type.toLowerCase() === 'image/png' ? 'PNG' : 'JPEG';
        const imgData = tempCanvas.toDataURL(`image/${mimeFormat.toLowerCase()}`, 0.85);

        if (i > 0) {
          const orientation = w >= h ? 'landscape' : 'portrait';
          pdf.addPage([w, h], orientation);
        }

        pdf.addImage(imgData, mimeFormat, 0, 0, w, h, undefined, 'FAST');
        setProgress(i + 1);
      }

      const blob = pdf.output('blob');

      if (blob.type !== 'application/pdf') {
        throw new Error('Generated output is not a PDF');
      }

      // Verify PDF signature (%PDF-)
      const slice = await blob.slice(0, 5).arrayBuffer();
      const signature = new TextDecoder().decode(slice);

      if (signature !== '%PDF-') {
        throw new Error('Generated file signature is not a valid PDF');
      }

      console.log('[JPG TO PDF] PDF generated successfully:', blob.type, blob.size);

      setPdfBlob(blob);
      setPdfSize(blob.size);
    } catch (err: any) {
      console.error('[JPG TO PDF] ERROR:', err);
      setError('PDF creation failed. Please try again.');
    } finally {
      setGenerating(false);
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
    link.remove();
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {files.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">JPG to PDF Converter</h2>
          <p className="text-xs text-slate-500">
            Select 1–100 JPG, JPEG, PNG or WEBP images and combine them into one PDF.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition"
          >
            Select Images
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Selected Images: {files.length} / 100
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
            {files.map((item, idx) => (
              <div
                key={item.id}
                className="relative group border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-950 space-y-2"
              >
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
                    disabled={idx === files.length - 1}
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
              disabled={generating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl text-sm transition"
            >
              {generating ? `Creating PDF... Page ${progress} / ${files.length}` : 'Generate PDF'}
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 rounded-xl text-xs">
          {error}
        </div>
      )}

      {pdfBlob && (
        <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">PDF Created Successfully</h3>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="block text-[10px] text-slate-500 font-bold uppercase">Pages</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{files.length}</span>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900">
              <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">PDF Size</span>
              <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                {(pdfSize / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>

          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold pt-1">Format: PDF</p>

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
