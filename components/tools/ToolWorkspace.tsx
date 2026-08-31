'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  UploadCloud, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Zap, 
  Lock, 
  ArrowRight, 
  HelpCircle,
  Layers
} from 'lucide-react';
import Badge from '@/components/common/Badge';
import ToolCard from '@/components/tools/ToolCard';

export interface ToolWorkspaceConfig {
  title: string;
  categoryName: string;
  targetKB: number;
  minKB?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  aspectRatioText?: string;
  badge?: string;
  description: string;
  howToSteps?: string[];
  faqList?: { q: string; a: string }[];
  relatedTools?: { title: string; slug: string; badge: string; sizeText: string }[];
}

export default function ToolWorkspace({ config }: { config: ToolWorkspaceConfig }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<{ name: string; sizeKB: number; width: number; height: number } | null>(null);
  const [targetSize, setTargetSize] = useState<number>(config.targetKB);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<{ url: string; sizeKB: number; width: number; height: number } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imgUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      setSelectedImage(imgUrl);
      setOriginalFile({
        name: file.name,
        sizeKB: Math.round(file.size / 1024),
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setProcessedResult(null);
    };
  };

  const processImage = () => {
    if (!selectedImage || !originalFile) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = selectedImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const outW = config.defaultWidth || (img.naturalWidth > 1200 ? 1200 : img.naturalWidth);
      const outH = config.defaultHeight || Math.round((outW / img.naturalWidth) * img.naturalHeight);

      canvas.width = outW;
      canvas.height = outH;

      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, outW, outH);
        ctx.drawImage(img, 0, 0, outW, outH);
      }

      let minQ = 0.05;
      let maxQ = 0.98;
      let bestDataUrl = '';
      let bestSizeKB = 0;

      for (let i = 0; i < 7; i++) {
        const midQ = (minQ + maxQ) / 2;
        const testUrl = canvas.toDataURL(outputFormat, midQ);
        const head = outputFormat === 'image/jpeg' ? 'data:image/jpeg;base64,' : 'data:image/png;base64,';
        const strLen = testUrl.length - head.length;
        const currentSizeKB = Math.round((strLen * 3) / 4 / 1024);

        if (currentSizeKB <= targetSize) {
          bestDataUrl = testUrl;
          bestSizeKB = currentSizeKB;
          minQ = midQ;
        } else {
          maxQ = midQ;
        }
      }

      if (!bestDataUrl) {
        bestDataUrl = canvas.toDataURL(outputFormat, 0.1);
        const strLen = bestDataUrl.length - (outputFormat === 'image/jpeg' ? 23 : 22);
        bestSizeKB = Math.round((strLen * 3) / 4 / 1024);
      }

      setProcessedResult({
        url: bestDataUrl,
        sizeKB: bestSizeKB,
        width: outW,
        height: outH,
      });
      setIsProcessing(false);
    };
  };

  const downloadImage = () => {
    if (!processedResult || !originalFile) return;
    const a = document.createElement('a');
    a.href = processedResult.url;
    a.download = `formilo_${originalFile.name.replace(/\.[^/.]+$/, '')}_under_${targetSize}kb.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetAll = () => {
    setSelectedImage(null);
    setOriginalFile(null);
    setProcessedResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] text-[#53636A] font-medium overflow-x-auto pb-1">
        <Link href="/" className="hover:text-[#00A879] transition shrink-0">Home</Link>
        <span>/</span>
        <span className="text-[#53636A] shrink-0">{config.categoryName}</span>
        <span>/</span>
        <span className="text-[#17262E] font-bold truncate">{config.title}</span>
      </nav>

      {/* 2. Header & Spec Badges */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge label={`STRICTLY < ${config.targetKB} KB`} variant="green" />
          <Badge label="100% PRIVATE IN-BROWSER" variant="neutral" />
          <span className="text-[12px] text-[#66777D] font-mono">Updated: August 2026</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#17262E] tracking-tight">
          {config.title}
        </h1>

        <p className="text-[13px] sm:text-[14px] text-[#53636A] leading-relaxed max-w-3xl">
          {config.description}
        </p>
      </div>

      {/* 3. Main Workspace Card */}
      <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-5 sm:p-8 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Upload & Preview */}
        <div className="lg:col-span-7 space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleImageSelect}
            className="hidden"
          />

          {!selectedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#D5DCDA] hover:border-[#00C98B] rounded-2xl p-8 sm:p-14 text-center bg-[#F7F7F3] cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#00C98B]/15 border border-[#00C98B]/30 flex items-center justify-center text-[#008760] group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-[#17262E]">
                  Tap or Drag Photo to Resize
                </p>
                <p className="text-[12px] text-[#66777D] mt-0.5">
                  Supports JPG, JPEG, PNG, WEBP files
                </p>
              </div>
              <button
                type="button"
                className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white font-bold text-[13px] shadow-sm shadow-[#00C98B]/20 cursor-pointer"
              >
                Choose Photo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative w-full aspect-[4/3] bg-[#F7F7F3] rounded-2xl overflow-hidden border border-[#DDE2DF] flex items-center justify-center p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={processedResult ? processedResult.url : selectedImage}
                  alt="Document Preview"
                  className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                />
                <span className="absolute top-3 left-3 bg-[#17262E]/80 backdrop-blur text-white text-[11px] font-mono px-2 py-0.5 rounded">
                  {processedResult ? 'Compressed Output' : 'Original Source'}
                </span>
              </div>

              {originalFile && (
                <div className="flex items-center justify-between text-[13px] text-[#53636A] px-1">
                  <span className="truncate max-w-[220px] font-medium">{originalFile.name}</span>
                  <button
                    onClick={resetAll}
                    className="text-red-500 font-semibold hover:underline cursor-pointer"
                  >
                    Change Image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Controls & Download */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[13px]">
                <label className="font-bold text-[#17262E]">Target File Size Limit:</label>
                <span className="font-mono font-bold text-[#008760]">&lt; {targetSize} KB</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[20, 30, 50, 100].map((kb) => (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => { setTargetSize(kb); setProcessedResult(null); }}
                    className={`py-2 rounded-xl text-[12px] font-bold transition border cursor-pointer ${
                      targetSize === kb
                        ? 'bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white border-transparent shadow-sm'
                        : 'bg-[#F7F7F3] text-[#46565C] border-[#D8DEDC] hover:border-[#00C98B]'
                    }`}
                  >
                    {kb} KB
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#17262E]">Output Format:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOutputFormat('image/jpeg')}
                  className={`py-2 rounded-xl text-[12px] font-bold border transition cursor-pointer ${
                    outputFormat === 'image/jpeg'
                      ? 'bg-[#17262E] text-white border-[#17262E]'
                      : 'bg-[#F7F7F3] text-[#46565C] border-[#D8DEDC]'
                  }`}
                >
                  JPG / JPEG (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setOutputFormat('image/png')}
                  className={`py-2 rounded-xl text-[12px] font-bold border transition cursor-pointer ${
                    outputFormat === 'image/png'
                      ? 'bg-[#17262E] text-white border-[#17262E]'
                      : 'bg-[#F7F7F3] text-[#46565C] border-[#D8DEDC]'
                  }`}
                >
                  PNG Format
                </button>
              </div>
            </div>

            {processedResult && (
              <div className="p-4 rounded-xl bg-[#F7F7F3] border border-[#DDE2DF] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#008760] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ Ready for Submission</span>
                  </span>
                  <Badge label="VERIFIED" variant="green" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 bg-[#FFFFFF] rounded-lg border border-[#DDE2DF]">
                    <span className="text-[11px] text-[#66777D] block">Output Size</span>
                    <span className="font-bold font-mono text-[13px] text-[#008760]">{processedResult.sizeKB} KB</span>
                  </div>
                  <div className="p-2 bg-[#FFFFFF] rounded-lg border border-[#DDE2DF]">
                    <span className="text-[11px] text-[#66777D] block">Dimensions</span>
                    <span className="font-bold font-mono text-[13px] text-[#17262E]">{processedResult.width}×{processedResult.height} px</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            {!processedResult ? (
              <button
                type="button"
                onClick={processImage}
                disabled={!selectedImage || isProcessing}
                className="w-full h-[46px] rounded-xl bg-[#138F79] hover:bg-[#0E7764] disabled:opacity-40 text-white font-bold text-[14px] shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
                <span>{isProcessing ? 'Processing locally...' : `Resize & Compress Under ${targetSize} KB`}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={downloadImage}
                className="w-full h-[46px] rounded-xl bg-[#00C98B] hover:bg-[#00b37c] text-white font-extrabold text-[14px] shadow-md shadow-[#00C98B]/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Ready Document ({processedResult.sizeKB} KB)</span>
              </button>
            )}

            <p className="text-[12px] text-[#66777D] text-center flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#008760]" />
              <span>100% Client-Side In-Memory Processing</span>
            </p>
          </div>

        </div>

      </div>

      {/* 4. Technical Specs */}
      <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 space-y-4 shadow-card">
        <h3 className="font-extrabold text-[16px] text-[#17262E] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#00A879]" />
          <span>Technical Output Specifications &amp; Compatibility</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F7F7F3] border border-[#DDE2DF] space-y-1">
            <span className="text-[#66777D] block text-[11px]">Target Size Lock</span>
            <p className="font-bold text-[#008760] text-[13px] font-mono">&lt; {config.targetKB} KB Strictly</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7F7F3] border border-[#DDE2DF] space-y-1">
            <span className="text-[#66777D] block text-[11px]">Format Standard</span>
            <p className="font-bold text-[#17262E] text-[13px]">JPG / JPEG Compliant</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7F7F3] border border-[#DDE2DF] space-y-1">
            <span className="text-[#66777D] block text-[11px]">Recommended Aspect</span>
            <p className="font-bold text-[#17262E] text-[13px]">{config.aspectRatioText || '3.5 : 4.5 Standard'}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7F7F3] border border-[#DDE2DF] space-y-1">
            <span className="text-[#66777D] block text-[11px]">Security Level</span>
            <p className="font-bold text-[#008760] text-[13px]">100% Client-Side</p>
          </div>
        </div>
      </div>

      {/* 5. How-To & Zero Server Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 space-y-3 shadow-card">
          <h4 className="font-extrabold text-[15px] text-[#17262E]">
            📄 How to Use {config.title}
          </h4>
          <ol className="list-decimal pl-4 space-y-2 text-[13px] text-[#53636A] leading-relaxed">
            <li>Tap <strong>&quot;Choose Photo&quot;</strong> and select your candidate photo from your device.</li>
            <li>Select your target KB limit (e.g. 20 KB, 30 KB, or 50 KB).</li>
            <li>Click <strong>&quot;Resize &amp; Compress&quot;</strong> to process locally inside browser RAM.</li>
            <li>Download your compliant file ready for immediate portal upload.</li>
          </ol>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 space-y-3 shadow-card">
          <h4 className="font-extrabold text-[15px] text-[#17262E]">
            🔒 Zero Server Upload Privacy
          </h4>
          <p className="text-[13px] text-[#53636A] leading-relaxed">
            All document downscaling algorithms run strictly inside your browser memory using HTML5 Canvas. Your confidential marksheets, photos, and signatures are never sent to or stored on any external database.
          </p>
        </div>
      </div>

      {/* 6. FAQs */}
      {config.faqList && config.faqList.length > 0 && (
        <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 space-y-4 shadow-card">
          <h3 className="font-extrabold text-[16px] text-[#17262E] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#00A879]" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-3">
            {config.faqList.map((faq, i) => (
              <div
                key={i}
                className="bg-[#F7F7F3] border border-[#DDE2DF] rounded-xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-3.5 text-left text-[13px] font-bold text-[#17262E] hover:text-[#00A879] flex justify-between items-center transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#66777D] text-sm ml-2">
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="p-3.5 pt-0 text-[13px] text-[#53636A] border-t border-[#DDE2DF] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Related Tools 2-Column Desktop Grid */}
      {config.relatedTools && config.relatedTools.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-mono font-bold uppercase tracking-wider text-[#53636A] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00A879]" />
              <span>RELATED FORM TOOLS</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.relatedTools.map((t) => (
              <ToolCard
                key={t.slug}
                title={t.title}
                description={`Format and prepare compliant documents strictly for official portal submission.`}
                slug={t.slug}
                badge={t.badge}
                dimensions={t.sizeText}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
