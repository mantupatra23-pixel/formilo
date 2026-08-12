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
  const [generating, setGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    console.log('[JPG PDF] FILE COUNT:', selectedFiles.length);

    if (!selectedFiles.length) {
      return;
    }

    const validFiles = selectedFiles.filter((file) => file.type.startsWith('image/'));

    if (validFiles.length === 0) {
      setError('Please select valid image files.');
      event.target.value = '';
      return;
    }

    setError(null);

    setFiles((previous) => {
      const existingKeys = new Set(
        previous.map((item) => `${item.file.name}_${item.file.size}_${item.file.lastModified}`)
      );
      const uniqueNew: FileItem[] = [];

      for (const file of validFiles) {
        const key = `${file.name}_${file.size}_${file.lastModified}`;
        if (!existingKeys.has(key)) {
          uniqueNew.push({
            id: Math.random().toString(36).substring(2, 9),
            file,
            previewUrl: URL.createObjectURL(file),
          });
        }
      }

      const combined = [...previous, ...uniqueNew];
      if (combined.length > 100) {
        setError('Maximum 100 images allowed.');
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
        const w = image.naturalWidth;
        const h = image.naturalHeight;

        if (i > 0) {
          const orientation = w >= h ? 'landscape' : 'portrait';
          pdf.addPage([w, h], orientation);
        }

        const format =
          files[i].file.type === 'image/png' ? 'PNG' : files[i].file.type === 'image/webp' ? 'WEBP' : 'JPEG';

        pdf.addImage(image, format, 0, 0, w, h, undefined, 'FAST');
        setProgress(i + 1);
      }

      const blob = pdf.output('blob');

      if (blob.type !== 'application/pdf') {
        throw new Error('Generated output is not a PDF');
      }

      setPdfBlob(blob);
    } catch (error) {
      console.error('[JPG TO PDF] ERROR:', error);
      setError('PDF creation failed. Please try again.');
    } finally {
      setGenerating(false);
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
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
      <input
        id="jpg-pdf-multi-input"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        hidden
      />

      {files.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">JPG to PDF Converter</h2>
          <p className="text-xs text-slate-500">
            Combine 1–100 JPG, JPEG, PNG or WEBP images into one PDF.
          </p>
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById('jpg-pdf-multi-input') as HTMLInputElement | null;
              console.log('[JPG PDF] MULTIPLE:', input?.multiple);
              console.log('[JPG PDF] ACCEPT:', input?.accept);
              console.log('[JPG PDF] TOTAL FILE INPUTS:', document.querySelectorAll('input[type="file"]').length);
              input?.click();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition"
          >
            Select Images
          </button>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 pt-2">
            Selected: 0 / 100
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Selected: {files.length} / 100
            </h3>
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById('jpg-pdf-multi-input') as HTMLInputElement | null;
                input?.click();
              }}
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

          <div className="grid grid-cols-1 text-center">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="block text-[10px] text-slate-500 font-bold uppercase">Pages</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{files.length}</span>
            </div>
          </div>

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
              Start Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
