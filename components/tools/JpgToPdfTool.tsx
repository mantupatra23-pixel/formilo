'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      files.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [files]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;

    const validFiles = selected.filter((file) => {
      const type = file.type.toLowerCase();
      const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
      return (
        type === 'image/jpeg' ||
        type === 'image/jpg' ||
        type === 'image/png' ||
        type === 'image/webp' ||
        ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
      );
    });

    if (validFiles.length === 0) {
      setError('Please select valid JPG, PNG, or WebP images.');
      return;
    }

    setError(null);

    setFiles((previous) => {
      const combined = [...previous, ...validFiles.map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
      }))];

      const unique = combined.filter(
        (item, index, array) =>
          index === array.findIndex(
            (other) =>
              other.file.name === item.file.name &&
              other.file.size === item.file.size &&
              other.file.lastModified === item.file.lastModified
          )
      );

      if (unique.length > 100) {
        setError('Maximum 100 images allowed.');
        return unique.slice(0, 100);
      }

      return unique;
    });

    setPdfBlob(null);
    // DO NOT reset event.target.value = "" to preserve Android native multi-select stability
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
    setProgressText('');
  };

  const generatePdf = async () => {
    if (files.length === 0) {
      setError('Please select at least one image.');
      return;
    }

    setGenerating(true);
    setProgressText('Preparing images...');
    setError(null);

    try {
      const firstImg = await loadImage(files[0].file);
      const firstW = firstImg.naturalWidth;
      const firstH = firstImg.naturalHeight;
      const firstOrientation = firstW >= firstH ? 'landscape' : 'portrait';

      const pdf = new jsPDF({
        orientation: firstOrientation,
        unit: 'px',
        format: [firstW, firstH],
        compress: true,
      });

      for (let i = 0; i < files.length; i++) {
        setProgressText(`Processing ${i + 1} / ${files.length} images...`);

        const image = await loadImage(files[i].file);
        let w = image.naturalWidth;
        let h = image.naturalHeight;

        if (w > 3000 || h > 3000) {
          const ratio = Math.min(3000 / w, 3000 / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const ctx = tempCanvas.getContext('2d');
        ctx?.drawImage(image, 0, 0, w, h);

        const fileType = files[i].file.type.toLowerCase();
        const format = fileType === 'image/png' ? 'PNG' : fileType === 'image/webp' ? 'WEBP' : 'JPEG';
        const imgData = tempCanvas.toDataURL(`image/${format.toLowerCase()}`, 0.85);

        if (i > 0) {
          const orientation = w >= h ? 'landscape' : 'portrait';
          pdf.addPage([w, h], orientation);
        }

        pdf.addImage(imgData, format, 0, 0, w, h, undefined, 'FAST');
      }

      setProgressText('Finalizing PDF...');
      const blob = pdf.output('blob');

      if (blob.type !== 'application/pdf') {
        throw new Error('Generated output is not a valid PDF');
      }

      const slice = await blob.slice(0, 5).arrayBuffer();
      const signature = new TextDecoder().decode(slice);

      if (signature !== '%PDF-') {
        throw new Error('Generated file is not a valid PDF signature');
      }

      setPdfBlob(blob);
    } catch (err) {
      console.error('[JPG TO PDF] ERROR:', err);
      setError('PDF creation failed. Please try again.');
    } finally {
      setGenerating(false);
      setProgressText('');
    }
  };

  const downloadPdf = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formilo-images.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const totalSizeMB = files.reduce((acc, item) => acc + item.file.size, 0) / (1024 * 1024);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        multiple
        onChange={handleFileChange}
        className="sr-only"
      />

      {files.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">JPG to PDF Converter</h2>
          <p className="text-xs text-slate-500">
            Select 1–100 JPG, JPEG, PNG, or WebP images and combine them into a single PDF.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition"
          >
            Select Images
          </button>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 pt-2">
            Selected Images: 0 / 100
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Selected Images: {files.length} / 100 ({totalSizeMB.toFixed(2)} MB approx.)
              </h3>
            </div>
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
                <img src={item.previewUrl} alt={item.file.name} className="w-full h-28 object-cover rounded-lg" />
                <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate px-1">
                  {item.file.name}
                </p>
                <div className="flex justify-between text-[10px] text-slate-500 pt-1 px-1">
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
              {generating ? progressText : 'Generate PDF'}
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
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">PDF Ready</h3>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="block text-[10px] text-slate-500 font-bold uppercase">Pages</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{files.length}</span>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900">
              <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">Type</span>
              <span className="text-sm font-black text-blue-600 dark:text-blue-400">PDF</span>
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
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
