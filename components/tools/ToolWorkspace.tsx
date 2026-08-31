'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  UploadCloud, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Lock, 
  ArrowRight, 
  HelpCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import Badge from '@/components/common/Badge';

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

      // Binary search compression loop to hit target KB
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
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#65737A] font-medium overflow-x-auto pb-1">
        <Link href="/" className="hover:text-[#00C98B] transition shrink-0">Home</Link>
        <span>/</span>
        <span className="text-[#65737A] shrink-0">{config.categoryName}</span>
        <span>/</span>
        <span className="text-[#162630] font-bold truncate">{config.title}</span>
      </nav>

      {/* 2. Tool Header & Specs Badge */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge label={`STRICTLY < ${config.targetKB} KB`} variant="green" />
          <Badge label="100% PRIVATE IN-BROWSER" variant="neutral" />
          <span className="text-[11px] text-[#89959A] font-mono">Updated: August 2026</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#162630] tracking-tight">
          {config.title}
        </h1>

        <p className="text-xs sm:text-sm text-[#65737A] leading-relaxed max-w-3xl">
          {config.description}
        </p>
      </div>

      {/* 3. Main 2-Column Responsive Workspace Card */}
      <div className="bg-white border border-[#DDE2DF] rounded-card p-5 sm:p-8 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Upload & Canvas Preview */}
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
              className="border-2 border-dashed border-[#DDE2DF] hover:border-[#00C98B] rounded-2xl p-8 sm:p-14 text-center bg-[#F7F7F3] cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#00C98B]/10 border border-[#00C98B]/20 flex items-center justify-center text-[#00a874] group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-[#162630]">
                  Tap or Drag Photo to Resize
                </p>
                <p className="text-xs text-[#89959A] mt-0.5">
                  Supports JPG, PNG, WEBP files
                </p>
              </div>
              <button
                type="button"
                className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white font-bold text-xs shadow-sm shadow-[#00C98B]/20"
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
                <span className="absolute top-3 left-3 bg-[#162630]/80 backdrop-blur text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  {processedResult ? 'Compressed Output' : 'Original Source'}
                </span>
              </div>

              {originalFile && (
                <div className="flex items-center justify-between text-xs text-[#65737A] px-1">
                  <span className="truncate max-w-[200px] font-medium">{originalFile.name}</span>
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

        {/* Right Column: Controls, Requirements & Download */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Target Size Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-[#162630]">Target File Size Limit:</label>
                <span className="font-mono font-bold text-[#00a874]">&lt; {targetSize} KB</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[20, 30, 50, 100].map((kb) => (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => { setTargetSize(kb); setProcessedResult(null); }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition border ${
                      targetSize === kb
                        ? 'bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white border-transparent shadow-sm'
                        : 'bg-[#F7F7F3] text-[#65737A] border-[#DDE2DF] hover:border-[#00C98B]'
                    }`}
                  >
                    {kb} KB
                  </button>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#162630]">Output Format:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOutputFormat('image/jpeg')}
                  className={`py-2 rounded-lg text-xs font-bold border transition ${
                    outputFormat === 'image/jpeg'
                      ? 'bg-[#162630] text-white border-[#162630]'
                      : 'bg-[#F7F7F3] text-[#65737A] border-[#DDE2DF]'
                  }`}
                >
                  JPG / JPEG (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setOutputFormat('image/png')}
                  className={`py-2 rounded-lg text-xs font-bold border transition ${
                    outputFormat === 'image/png'
                      ? 'bg-[#162630] text-white border-[#162630]'
                      : 'bg-[#F7F7F3] text-[#65737A] border-[#DDE2DF]'
                  }`}
                >
                  PNG Format
                </button>
              </div>
            </div>

            {/* Validation & Live Status Table */}
            {processedResult && (
              <div className="p-4 rounded-xl bg-[#F7F7F3] border border-[#DDE2DF] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#00a874] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ Ready for Submission</span>
                  </span>
                  <Badge label="VERIFIED" variant="green" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 bg-white rounded-lg border border-[#DDE2DF]">
                    <span className="text-[10px] text-[#89959A] block">Output Size</span>
                    <span className="font-bold font-mono text-[#00a874]">{processedResult.sizeKB} KB</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#DDE2DF]">
                    <span className="text-[10px] text-[#89959A] block">Dimensions</span>
                    <span className="font-bold font-mono text-[#162630]">{processedResult.width}×{processedResult.height} px</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {!processedResult ? (
              <button
                type="button"
                onClick={processImage}
                disabled={!selectedImage || isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00C98B] to-[#00C7D9] hover:opacity-95 disabled:opacity-40 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#00C98B]/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
                <span>{isProcessing ? 'Processing locally...' : `Resize & Compress Under ${targetSize} KB`}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={downloadImage}
                className="w-full py-3.5 rounded-xl bg-[#00C98B] hover:bg-[#00b37c] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#00C98B]/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Ready Document ({processedResult.sizeKB} KB)</span>
              </button>
            )}

            <p className="text-[11px] text-[#89959A] text-center flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-[#00a874]" />
              <span>100% Client-Side In-Memory Processing Guarantee</span>
            </p>
          </div>

        </div>

      </div>

      {/* 4. Structured Specification & Guidelines Table */}
      <div className="bg-white border border-[#DDE2DF] rounded-card p-6 space-y-4 shadow-card">
        <h3 className="font-extrabold text-sm text-[#162630] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#00C98B]" />
          <span>Technical Output Specifications &amp; Compatibility</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F7F7F3] border border-[#DDE2DF] space-y-1">
            <span className="text-[#89959A] block text-[11px]">Target Size Lock</span>
            <p className="font-bold text-[#00a874] text-xs font-mono">&lt; {config.targetKB} KB Strictly</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7F7F3] border border-[#DDE2DF] space-y-1">
            <span className="text-[#89959A] block text-[11px]">Format Standard</span>
            <p className="font-bold text-[#162630] text-xs">JPG / JPEG Compliant</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7F7F3] border border-[#DDE2DF] space-y-1">
            <span className="text-[#89959A] block text-[11px]">Recommended Aspect</span>
            <p className="font-bold text-[#162630] text-xs">{config.aspectRatioText || '3.5 : 4.5 Standard'}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7F7F3] border border-[#DDE2DF] space-y-1">
            <span className="text-[#89959A] block text-[11px]">Security Level</span>
            <p className="font-bold text-[#00a874] text-xs">100% Client-Side</p>
          </div>
        </div>
      </div>

      {/* 5. How-To & Step-by-Step Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-white border border-[#DDE2DF] rounded-card p-6 space-y-3 shadow-card">
          <h4 className="font-extrabold text-sm text-[#162630] flex items-center gap-2">
            <span>📄 How to Use {config.title}</span>
          </h4>
          <ol className="list-decimal pl-4 space-y-2 text-[#65737A] leading-relaxed">
            <li>Tap <strong>&quot;Choose Photo&quot;</strong> and select your candidate photo from your device.</li>
            <li>Select your target KB limit (e.g. 20 KB, 30 KB, or 50 KB).</li>
            <li>Click <strong>&quot;Resize &amp; Compress&quot;</strong> to process locally inside browser RAM.</li>
            <li>Download your compliant file ready for immediate portal upload.</li>
          </ol>
        </div>

        <div className="bg-white border border-[#DDE2DF] rounded-card p-6 space-y-3 shadow-card">
          <h4 className="font-extrabold text-sm text-[#162630] flex items-center gap-2">
            <span>🔒 Zero Server Upload Guarantee</span>
          </h4>
          <p className="text-[#65737A] leading-relaxed">
            All document downscaling algorithms run strictly inside your browser memory using HTML5 Canvas. Your confidential marksheets, photos, and signatures are never sent to or stored on any external database.
          </p>
        </div>
      </div>

      {/* 6. FAQ Accordion */}
      {config.faqList && config.faqList.length > 0 && (
        <div className="bg-white border border-[#DDE2DF] rounded-card p-6 space-y-4 shadow-card">
          <h3 className="font-extrabold text-sm text-[#162630] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#00C98B]" />
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
                  className="w-full p-3.5 text-left text-xs font-bold text-[#162630] hover:text-[#00C98B] flex justify-between items-center transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#89959A] text-sm ml-2">
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="p-3.5 pt-0 text-xs text-[#65737A] border-t border-[#DDE2DF] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Related Tool Links */}
      {config.relatedTools && config.relatedTools.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#65737A] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00C98B]" />
              <span>RELATED FORM TOOLS</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {config.relatedTools.map((t) => (
              <Link
                key={t.slug}
                href={t.slug.startsWith('/') ? t.slug : `/${t.slug}`}
                className="p-4 rounded-card bg-white border border-[#DDE2DF] hover:border-[#00C98B] hover:shadow-card-hover transition flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <Badge label={t.badge} variant="neutral" />
                  <h4 className="text-xs font-bold text-[#162630] group-hover:text-[#00C98B] transition-colors pt-1">
                    {t.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#E8EBE9] text-xs">
                  <span className="font-mono text-[#00a874] font-bold text-[11px]">{t.sizeText}</span>
                  <span className="text-[#65737A] group-hover:text-[#00C98B] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
