'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';

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
  const [targetQuality, setTargetQuality] = useState<number>(0.85);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const pageOrientation =
          orientation === 'auto'
            ? isLandscape
              ? 'landscape'
              : 'portrait'
            : orientation;

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
        await new Promise((res) => {
          imgObj.onload = res;
        });

        canvas.width = imgObj.naturalWidth;
        canvas.height = imgObj.naturalHeight;
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(imgObj, 0, 0);
        }

        const compressedDataUrl = canvas.toDataURL('image/jpeg', targetQuality);

        const marginOffset = margin === 'none' ? 0 : margin === 'small' ? 5 : 12;
        const printW = a4Width - marginOffset * 2;
        const printH = a4Height - marginOffset * 2;

        if (pageSize === 'fit') {
          doc.addImage(
            compressedDataUrl,
            'JPEG',
            0,
            0,
            doc.internal.pageSize.getWidth(),
            doc.internal.pageSize.getHeight()
          );
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

  const faqs = [
    {
      q: 'How many JPG or PNG images can I combine into a single PDF?',
      a: 'You can select and merge unlimited JPG, PNG, and WebP images into one single multi-page PDF document without any file count restriction.',
    },
    {
      q: 'Can I reorder or delete specific images before converting?',
      a: 'Yes. Use the Move Up (↑), Move Down (↓), and Remove (✕) controls on each image card to arrange pages in the exact sequence required.',
    },
    {
      q: 'Will document text remain clear for online recruitment portals?',
      a: 'Yes. Formilo embeds images with high-DPI scaling and strict aspect-ratio retention, ensuring signatures, roll numbers, and official stamps remain 100% sharp and legible.',
    },
    {
      q: 'Are my uploaded certificates or identity files sent to any remote server?',
      a: 'No. All PDF generation runs 100% client-side inside your local browser memory (RAM) via jsPDF. Zero files or document data are transmitted over the network.',
    },
  ];

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        onLoad={initJsPdf}
      />

      <main className="min-h-screen bg-[#0a0d14] text-neutral-100 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-neutral-400">
            <Link href="/" className="hover:text-[#00e599] transition">Home</Link>
            <span>/</span>
            <Link href="/cyber-cafe" className="hover:text-[#00e599] transition">PDF Tools</Link>
            <span>/</span>
            <span className="text-[#00e599]">JPG To PDF Converter</span>
          </nav>

          {/* Official Badge & Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00e599]/10 border border-[#00e599]/20 text-[#00e599] text-xs font-semibold">
              <span>⚡ Multi-Image Merger: Unlimited Photos to 1 Compliant PDF</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              JPG To PDF Converter <span className="text-[#00e599]">Combine Multiple Images</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Select multiple JPG, PNG, or WebP images and merge them into a single clean PDF document. Reorder pages, adjust margins, and download instantly with 100% client-side privacy.
            </p>
          </div>

          {/* Top Ad Slot */}
          <div className="w-full h-24 sm:h-28 bg-[#111622]/60 border border-[#1f293d] rounded-2xl flex flex-col items-center justify-center text-center p-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">SPONSORED / ADVERTISEMENT</span>
          </div>

          {/* Main Tool Card */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Top Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1f293d] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse"></span>
                <span className="text-neutral-300 font-semibold uppercase tracking-wider">
                  Target Format: <strong className="text-white">MULTIPLE JPG &rarr; SINGLE PDF</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-2 py-0.5 rounded bg-[#00e599]/15 text-[#00e599] font-mono font-bold border border-[#00e599]/30 text-[11px]">
                  Multi-Select Active
                </span>
                <span className="px-2 py-0.5 rounded bg-[#182030] text-neutral-300 font-mono text-[11px] border border-[#1f293d]">
                  Auto-Orient
                </span>
              </div>
            </div>

            {/* Document Formatting Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0a0d14] p-3.5 rounded-xl border border-[#1f293d] text-xs">
              
              <div className="space-y-1.5">
                <label className="text-neutral-400 font-medium block">Page Sizing</label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setPageSize('a4')}
                    className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                      pageSize === 'a4'
                        ? 'bg-[#00e599] text-black shadow-md'
                        : 'bg-[#182030] text-neutral-400 border border-[#1f293d]'
                    }`}
                  >
                    Fit A4 Sheet
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageSize('fit')}
                    className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                      pageSize === 'fit'
                        ? 'bg-[#00e599] text-black shadow-md'
                        : 'bg-[#182030] text-neutral-400 border border-[#1f293d]'
                    }`}
                  >
                    Same As Image
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400 font-medium block">Page Orientation</label>
                <div className="flex gap-1">
                  {[
                    { id: 'auto', label: 'Auto' },
                    { id: 'portrait', label: 'Portrait' },
                    { id: 'landscape', label: 'Landscape' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setOrientation(item.id as any)}
                      className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                        orientation === item.id
                          ? 'bg-[#00e599] text-black shadow-md'
                          : 'bg-[#182030] text-neutral-400 border border-[#1f293d]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400 font-medium block">Document Margin</label>
                <div className="flex gap-1">
                  {[
                    { id: 'none', label: 'None' },
                    { id: 'small', label: 'Small' },
                    { id: 'normal', label: 'Standard' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMargin(item.id as any)}
                      className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                        margin === item.id
                          ? 'bg-[#00e599] text-black shadow-md'
                          : 'bg-[#182030] text-neutral-400 border border-[#1f293d]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Hidden Input for Multi-File Selection */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Dropzone Area */}
            {images.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#1f293d] hover:border-[#00e599] rounded-2xl p-8 sm:p-12 cursor-pointer transition-all bg-[#0a0d14]/60 flex flex-col items-center justify-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#00e599]/10 border border-[#00e599]/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🖼️
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-base sm:text-lg font-bold text-white group-hover:text-[#00e599] transition-colors">
                    Tap to Choose Multiple JPG / PNG Photos
                  </p>
                  <p className="text-xs text-neutral-400">
                    Hold and select multiple photos together • JPG, PNG, WEBP
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-2 px-6 py-2.5 bg-[#00e599] hover:bg-[#00c985] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#00e599]/20 transition-all"
                >
                  Select Multiple Images
                </button>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-2">
                  <span className="text-[#00e599]">🛡️</span> Instant Multi-Photo Stitching • Zero Server Upload
                </div>
              </div>
            ) : null}

            {/* Selected Images Management List */}
            {images.length > 0 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#1f293d]">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span>📑 Selected Images</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/30">
                        {images.length} Pages
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">Use arrow buttons to adjust page order</p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-[#182030] hover:bg-[#222c42] text-neutral-200 font-semibold text-xs rounded-xl border border-[#1f293d] transition"
                    >
                      + Add More Photos
                    </button>
                    <button
                      type="button"
                      onClick={() => setImages([])}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs rounded-xl border border-red-500/20 transition"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Thumbnails Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-2.5 flex flex-col justify-between gap-2 relative group hover:border-[#00e599]/40 transition"
                    >
                      <div className="relative w-full aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center border border-[#182030]">
                        <img
                          src={img.previewUrl}
                          alt={`Page ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute top-1.5 left-1.5 bg-black/85 backdrop-blur text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 font-bold">
                          Page {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center text-xs shadow-md transition"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-[10px] text-neutral-400 font-mono">{img.sizeKB} KB</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveImage(idx, 'up')}
                            className="w-6 h-6 rounded bg-[#182030] hover:bg-[#222c42] disabled:opacity-30 text-neutral-300 flex items-center justify-center text-xs"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            disabled={idx === images.length - 1}
                            onClick={() => moveImage(idx, 'down')}
                            className="w-6 h-6 rounded bg-[#182030] hover:bg-[#222c42] disabled:opacity-30 text-neutral-300 flex items-center justify-center text-xs"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                {isProcessing && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Merging {images.length} images into PDF...</span>
                      <span className="text-[#00e599] font-bold">{progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#182030] rounded-full overflow-hidden border border-[#1f293d]">
                      <div
                        className="h-full bg-[#00e599] transition-all duration-300 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Big Convert Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={convertToPdf}
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-[#00e599] hover:bg-[#00c985] disabled:opacity-50 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-[#00e599]/20 transition flex items-center justify-center gap-2"
                  >
                    <span>⚡ Convert {images.length} Images To PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Middle Ad Slot */}
          <div className="w-full h-24 sm:h-28 bg-[#111622]/60 border border-[#1f293d] rounded-2xl flex flex-col items-center justify-center text-center p-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">SPONSORED / ADVERTISEMENT</span>
          </div>

          {/* Official Guidelines Matrix */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-[#00e599]">🛡️</span> JPG To PDF Official Guidelines
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3">
                <span className="text-[10px] text-neutral-400 block">Board / Authority</span>
                <span className="text-xs font-bold text-white">All Govt Recruitment Portals</span>
              </div>
              <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3">
                <span className="text-[10px] text-neutral-400 block">Output Format</span>
                <span className="text-xs font-bold text-[#00e599]">Strict Compliant .PDF</span>
              </div>
              <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3">
                <span className="text-[10px] text-neutral-400 block">Page Boundary</span>
                <span className="text-xs font-bold text-white">Standard A4 Sheet</span>
              </div>
              <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3">
                <span className="text-[10px] text-neutral-400 block">DPI & Clarity</span>
                <span className="text-xs font-bold text-[#00e599]">300 DPI Vector Scale</span>
              </div>
            </div>

            <div className="bg-[#0a0d14] border border-[#1f293d] rounded-xl p-3 flex items-start gap-2 text-xs">
              <span className="text-[#00e599]">🛡️</span>
              <div>
                <strong className="text-white">Clean Paper Alignment:</strong>
                <p className="text-neutral-400 mt-0.5">
                  Make sure all certificate edges are visible. You can add both portrait documents (marksheets) and landscape documents (ID cards) together.
                </p>
              </div>
            </div>
          </div>

          {/* How to Merge & Zero Upload Guarantee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📄 How to Merge Multiple Photos</span>
              </h3>
              <ol className="text-xs text-neutral-400 space-y-2 list-decimal pl-4">
                <li>Tap <strong className="text-white">&quot;Select Multiple Images&quot;</strong> and choose all your photos.</li>
                <li>Use <strong className="text-white">↑</strong> and <strong className="text-white">↓</strong> buttons to reorder pages.</li>
                <li>Choose Page Size (Fit A4 or Same as Image).</li>
                <li>Click <strong className="text-white">&quot;Convert Images To PDF&quot;</strong> to download the merged file.</li>
              </ol>
            </div>

            <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🔒 Zero Server Upload Guarantee</span>
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                All photos are processed locally inside your web browser RAM using jsPDF. No confidential identity documents or personal photographs are ever uploaded or stored on any server.
              </p>
            </div>
          </div>

          {/* Related Format Presets */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#00e599] uppercase tracking-wider flex items-center gap-1.5">
                <span>⚡</span> RELATED DOCUMENT TOOLS
              </span>
              <span className="text-[11px] text-neutral-500">Quick Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/pdf-to-jpg-converter"
                className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599] rounded-xl p-3 space-y-2 block transition group"
              >
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182030] text-neutral-400">PDF &rarr; JPG</span>
                <p className="text-xs font-bold text-white group-hover:text-[#00e599]">PDF To JPG Converter Online</p>
                <div className="flex justify-between items-center text-[10px] text-neutral-500">
                  <span className="text-[#00e599]">300 DPI</span>
                  <span>Open &rarr;</span>
                </div>
              </Link>

              <Link
                href="/tools/make-background-white-of-signature"
                className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599] rounded-xl p-3 space-y-2 block transition group"
              >
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182030] text-neutral-400">CLEAN</span>
                <p className="text-xs font-bold text-white group-hover:text-[#00e599]">Signature Background Whitener</p>
                <div className="flex justify-between items-center text-[10px] text-neutral-500">
                  <span className="text-[#00e599]">&lt; 20 KB</span>
                  <span>Open &rarr;</span>
                </div>
              </Link>

              <Link
                href="/photo-resizer-200kb"
                className="bg-[#0a0d14] border border-[#1f293d] hover:border-[#00e599] rounded-xl p-3 space-y-2 block transition group"
              >
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182030] text-neutral-400">&lt; 200 KB</span>
                <p className="text-xs font-bold text-white group-hover:text-[#00e599]">Compress Document Under 200 KB</p>
                <div className="flex justify-between items-center text-[10px] text-neutral-500">
                  <span className="text-[#00e599]">&lt; 200 KB</span>
                  <span>Open &rarr;</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="bg-[#111622] border border-[#1f293d] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-[#00e599]">❓ Frequently Asked Questions</span>
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-[#0a0d14] border border-[#1f293d] rounded-xl overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-3.5 text-left text-xs font-bold text-white hover:text-[#00e599] flex justify-between items-center transition"
                  >
                    <span>{faq.q}</span>
                    <span className="text-neutral-500 text-sm ml-2">
                      {openFaq === i ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="p-3.5 pt-0 text-xs text-neutral-400 border-t border-[#1f293d]/50 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
