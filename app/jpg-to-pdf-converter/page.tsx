'use client';

import React, { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import GlobalToolPageTemplate from '@/components/tool-template/GlobalToolPageTemplate';
import { resolveToolPageData } from '@/lib/toolPageHelper';
import { UploadCloud, Trash2, ArrowUp, ArrowDown, Download, RefreshCw, Layers } from 'lucide-react';

interface SelectedImage {
  id: string;
  file: File;
  previewUrl: string;
  sizeKB: number;
  width: number;
  height: number;
}

export default function JpgToPdfConverterPage() {
  const [jsPdfLoaded, setJsPdfLoaded] = useState(false);
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageSize, setPageSize] = useState<'a4' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('auto');
  const [margin, setMargin] = useState<'none' | 'small' | 'normal'>('small');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toolData = resolveToolPageData('jpg-to-pdf-converter', {
    title: 'JPG to PDF Converter Online',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Merge multiple JPG, PNG, or WebP images into a single clean PDF document. Reorder pages, adjust margins, and download instantly with 100% client-side privacy.',
  });

  const initJsPdf = () => {
    if (typeof window !== 'undefined' && (window as any).jspdf) {
      setJsPdfLoaded(true);
    }
  };

  useEffect(() => {
    initJsPdf();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: SelectedImage[] = [];
    const fileList = Array.from(files);

    fileList.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const previewUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        newImages.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          previewUrl,
          sizeKB: Math.round(file.size / 1024),
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        if (newImages.length === fileList.length) {
          setImages((prev) => [...prev, ...newImages]);
        }
      };
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setImages(updated);
  };

  const convertToPdf = async () => {
    if (images.length === 0) {
      alert('Please select at least 1 image.');
      return;
    }

    const jspdfModule = (window as any).jspdf;
    if (!jspdfModule || !jspdfModule.jsPDF) {
      alert('PDF Engine is initializing. Please retry in 2 seconds.');
      return;
    }

    setIsProcessing(true);
    setProgress(15);

    try {
      const { jsPDF } = jspdfModule;
      let doc: any = null;

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        const isLandscape = item.width > item.height;
        const pageOrientation = orientation === 'auto' ? (isLandscape ? 'landscape' : 'portrait') : orientation;
        const a4Width = pageOrientation === 'landscape' ? 297 : 210;
        const a4Height = pageOrientation === 'landscape' ? 210 : 297;

        if (i === 0) {
          doc = new jsPDF({
            orientation: pageOrientation === 'landscape' ? 'l' : 'p',
            unit: 'mm',
            format: pageSize === 'fit' ? [item.width * 0.264583, item.height * 0.264583] : 'a4',
          });
        } else {
          doc.addPage(
            pageSize === 'fit' ? [item.width * 0.264583, item.height * 0.264583] : 'a4',
            pageOrientation === 'landscape' ? 'l' : 'p'
          );
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const imgObj = new Image();
        imgObj.src = item.previewUrl;
        await new Promise((res) => { imgObj.onload = res; });

        canvas.width = imgObj.naturalWidth;
        canvas.height = imgObj.naturalHeight;
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(imgObj, 0, 0);
        }

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const marginOffset = margin === 'none' ? 0 : margin === 'small' ? 5 : 12;
        const printW = a4Width - marginOffset * 2;
        const printH = a4Height - marginOffset * 2;

        if (pageSize === 'fit') {
          doc.addImage(compressedDataUrl, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
        } else {
          const imgRatio = item.width / item.height;
          const boxRatio = printW / printH;
          let finalW = printW;
          let finalH = printH;
          if (imgRatio > boxRatio) {
            finalH = printW / imgRatio;
          } else {
            finalW = printH * imgRatio;
          }
          const posX = (a4Width - finalW) / 2;
          const posY = (a4Height - finalH) / 2;
          doc.addImage(compressedDataUrl, 'JPEG', posX, posY, finalW, finalH, undefined, 'FAST');
        }

        setProgress(Math.round(((i + 1) / images.length) * 80) + 15);
      }

      doc.save(`formilo_combined_document_${Date.now()}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        onLoad={initJsPdf}
      />

      <main className="min-h-screen bg-[#F7F7F3] text-[#17262E] py-8 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <GlobalToolPageTemplate data={toolData}>
            
            {/* Functional In-Browser Multi-Image Workspace */}
            <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-5 sm:p-8 space-y-6 shadow-card">
              
              {/* Document Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F7F7F3] p-3.5 rounded-xl border border-[#DDE2DF] text-xs">
                <div className="space-y-1.5">
                  <label className="text-[#53636A] font-bold block">Page Sizing</label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setPageSize('a4')}
                      className={`flex-1 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                        pageSize === 'a4' ? 'bg-[#138F79] text-white shadow-sm' : 'bg-[#FFFFFF] text-[#46565C] border border-[#DDE2DF]'
                      }`}
                    >
                      Fit A4 Sheet
                    </button>
                    <button
                      type="button"
                      onClick={() => setPageSize('fit')}
                      className={`flex-1 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                        pageSize === 'fit' ? 'bg-[#138F79] text-white shadow-sm' : 'bg-[#FFFFFF] text-[#46565C] border border-[#DDE2DF]'
                      }`}
                    >
                      Same As Image
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#53636A] font-bold block">Orientation</label>
                  <div className="flex gap-1">
                    {['auto', 'portrait', 'landscape'].map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setOrientation(id as any)}
                        className={`flex-1 py-1.5 rounded-lg font-semibold capitalize transition cursor-pointer ${
                          orientation === id ? 'bg-[#138F79] text-white shadow-sm' : 'bg-[#FFFFFF] text-[#46565C] border border-[#DDE2DF]'
                        }`}
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#53636A] font-bold block">Margins</label>
                  <div className="flex gap-1">
                    {[
                      { id: 'none', label: 'None' },
                      { id: 'small', label: 'Small' },
                      { id: 'normal', label: 'Standard' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMargin(m.id as any)}
                        className={`flex-1 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                          margin === m.id ? 'bg-[#138F79] text-white shadow-sm' : 'bg-[#FFFFFF] text-[#46565C] border border-[#DDE2DF]'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upload Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp,image/jpg"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />

              {images.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#D5DCDA] hover:border-[#00C98B] rounded-2xl p-8 sm:p-14 text-center bg-[#F7F7F3] cursor-pointer transition flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#00C98B]/15 border border-[#00C98B]/30 flex items-center justify-center text-[#008760] group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-[#17262E]">
                      Tap to Choose Multiple Photos / Documents
                    </p>
                    <p className="text-[12px] text-[#66777D] mt-0.5">
                      Select 1 or more JPG, PNG, WEBP pages from gallery or files
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white font-bold text-[13px] shadow-sm shadow-[#00C98B]/20 cursor-pointer"
                  >
                    Select Images
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DDE2DF]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#008760] px-2.5 py-0.5 rounded-md bg-[#00C98B]/15 border border-[#00C98B]/30">
                        {images.length} Pages Selected
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#17262E] font-semibold text-xs rounded-lg border border-[#DDE2DF] transition cursor-pointer"
                      >
                        + Add More
                      </button>
                      <button
                        type="button"
                        onClick={() => setImages([])}
                        className="px-3 py-1.5 bg-[#FDF2E9] text-[#A85A20] font-semibold text-xs rounded-lg border border-[#EBAA78]/50 hover:underline transition cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div
                        key={img.id}
                        className="bg-[#F7F7F3] border border-[#DDE2DF] rounded-xl p-2.5 flex flex-col justify-between gap-2 relative group"
                      >
                        <div className="relative w-full aspect-[3/4] bg-white rounded-lg overflow-hidden flex items-center justify-center border border-[#DDE2DF]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.previewUrl}
                            alt={`Page ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                          <span className="absolute top-1 left-1 bg-[#17262E]/80 backdrop-blur text-white text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                            P{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs shadow-md transition cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-[10px] text-[#66777D] font-mono">{img.sizeKB} KB</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveImage(idx, 'up')}
                              className="w-5 h-5 rounded bg-white hover:bg-[#E8EBE9] disabled:opacity-30 text-[#17262E] border border-[#DDE2DF] flex items-center justify-center text-xs cursor-pointer"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={idx === images.length - 1}
                              onClick={() => moveImage(idx, 'down')}
                              className="w-5 h-5 rounded bg-white hover:bg-[#E8EBE9] disabled:opacity-30 text-[#17262E] border border-[#DDE2DF] flex items-center justify-center text-xs cursor-pointer"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {isProcessing && (
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs text-[#53636A]">
                        <span>Stitching {images.length} pages into PDF...</span>
                        <span className="text-[#008760] font-bold">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#E8EBE9] rounded-full overflow-hidden">
                        <div className="h-full bg-[#00C98B] transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={convertToPdf}
                      disabled={isProcessing}
                      className="w-full h-[46px] bg-[#138F79] hover:bg-[#0E7764] disabled:opacity-50 text-white font-bold text-[14px] rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      <span>{isProcessing ? 'Generating PDF...' : `Download ${images.length} Page PDF Document`}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </GlobalToolPageTemplate>
        </div>
      </main>
    </>
  );
}
