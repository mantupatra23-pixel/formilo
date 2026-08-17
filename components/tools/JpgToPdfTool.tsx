'use client';

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, Download, RefreshCw, Trash2, ArrowUp, 
  ArrowDown, Plus, FileText, CheckCircle2, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function JpgToPdfTool() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'fit' | 'a4'>('fit');
  const [processing, setProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError(null);
    const newItems: ImageItem[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        newItems.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
    });

    if (newItems.length === 0) {
      setError('Please select valid image files (JPG, PNG, WebP).');
      return;
    }

    setImages((prev) => [...prev, ...newItems]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    setImages(newImages);
  };

  const removeImage = (index: number) => {
    const target = images[index];
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;

    setProcessing(true);
    setError(null);
    setProgressStage('Initializing PDF engine...');

    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < images.length; i++) {
        setProgressStage(`Processing image ${i + 1} of ${images.length}...`);
        const item = images[i];

        // Canvas scaling to prevent memory crash on large 4K images
        const img = new Image();
        img.src = item.previewUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const maxDimension = 2400;
        let w = img.width;
        let h = img.height;

        if (w > maxDimension || h > maxDimension) {
          if (w > h) {
            h = Math.round((h * maxDimension) / w);
            w = maxDimension;
          } else {
            w = Math.round((w * maxDimension) / h);
            h = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
        }

        const optimizedJpgUrl = canvas.toDataURL('image/jpeg', 0.88);
        const imageBytes = await fetch(optimizedJpgUrl).then((r) => r.arrayBuffer());
        const embeddedImg = await pdfDoc.embedJpg(imageBytes);

        if (pageSize === 'a4') {
          // Standard A4 Points: 595.28 x 841.89
          const a4Width = 595.28;
          const a4Height = 841.89;
          const page = pdfDoc.addPage([a4Width, a4Height]);

          const scale = Math.min(a4Width / w, a4Height / h) * 0.92;
          const scaledW = w * scale;
          const scaledH = h * scale;

          page.drawImage(embeddedImg, {
            x: (a4Width - scaledW) / 2,
            y: (a4Height - scaledH) / 2,
            width: scaledW,
            height: scaledH,
          });
        } else {
          // Fit to image's native aspect ratio
          const page = pdfDoc.addPage([w, h]);
          page.drawImage(embeddedImg, {
            x: 0,
            y: 0,
            width: w,
            height: h,
          });
        }
      }

      setProgressStage('Compiling PDF file...');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });

      setOutputBlob(blob);
      setOutputUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      console.error(err);
      setError('Failed to convert images to PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `formilo_document_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetAll = () => {
    images.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setImages([]);
    setOutputBlob(null);
    setOutputUrl(null);
    setError(null);
  };

  return (
    <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 text-zinc-100">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-700 hover:border-emerald-500/60 rounded-xl p-10 text-center cursor-pointer transition-all bg-zinc-950/40 group"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadCloud className="w-7 h-7" />
          </div>
          <p className="text-base font-semibold text-white">Choose Multiple Images or Drop here</p>
          <p className="text-xs text-zinc-500 mt-1">Select 1 to 50+ JPG, PNG, or WebP photos</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{images.length} Images Selected</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add More
              </button>
              <button
                onClick={resetAll}
                className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/50 hover:bg-red-900/50 text-xs font-semibold text-red-300 transition"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Page Orientation Mode */}
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
            <span>Page Sizing:</span>
            <div className="inline-flex rounded-lg border border-zinc-800 p-1 bg-zinc-900/80">
              <button
                onClick={() => setPageSize('fit')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  pageSize === 'fit' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Auto Fit (Original)
              </button>
              <button
                onClick={() => setPageSize('a4')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  pageSize === 'a4' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Standard A4 Document
              </button>
            </div>
          </div>

          {/* Thumbnail Reorder Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((item, index) => (
              <div
                key={item.id}
                className="relative group p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl flex flex-col items-center gap-2"
              >
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-zinc-200 border border-zinc-700">
                  #{index + 1}
                </span>

                <img
                  src={item.previewUrl}
                  alt={`Page ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-zinc-800"
                />

                <div className="w-full flex items-center justify-between pt-1 text-zinc-400">
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30"
                      title="Move Left/Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === images.length - 1}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30"
                      title="Move Right/Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeImage(index)}
                    className="p-1 rounded bg-red-950/60 text-red-400 hover:bg-red-900/60"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Trigger */}
          {!outputUrl && (
            <button
              onClick={convertToPdf}
              disabled={processing}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> {progressStage}
                </>
              ) : (
                `Convert ${images.length} Images to PDF`
              )}
            </button>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <p className="font-semibold text-xs">Processing Error</p>
              </div>
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Output / Download Card */}
          {outputBlob && outputUrl && (
            <div className="p-6 bg-zinc-900/90 border border-emerald-500/40 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>PDF Document Ready!</span>
                </div>
                <span className="text-xs text-zinc-400 font-semibold">
                  Size: {(outputBlob.size / 1024).toFixed(1)} KB ({images.length} Pages)
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PDF Document
                </button>
                <button
                  onClick={resetAll}
                  className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-xl text-sm transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> Start New
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Banner */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-center space-x-2 text-xs text-zinc-500">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>100% Client-Side Processing • Your photos never leave your device</span>
      </div>
    </div>
  );
}
