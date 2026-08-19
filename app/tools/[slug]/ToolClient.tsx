// app/tools/[slug]/ToolClient.tsx
'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, CheckCircle2, Share2, Send, Copy, Check, Sparkles, X } from 'lucide-react';
import { Tool } from '@/lib/tools';

interface ToolClientProps {
  tool: Tool;
}

export default function ToolClient({ tool }: ToolClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [originalSizeKB, setOriginalSizeKB] = useState<number | null>(null);
  const [outputSizeKB, setOutputSizeKB] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentToolUrl = typeof window !== 'undefined' ? window.location.href : `https://formilo-jzcl.vercel.app/tools/${tool.slug}`;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setOriginalSizeKB(Math.round(selected.size / 1024));
      setPreview(URL.createObjectURL(selected));
      setProcessedUrl(null);
      setOutputSizeKB(null);
      setShowModal(false);
    }
  };

  const processImage = () => {
    if (!preview) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = preview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const targetW = tool.targetWidth || img.width;
      const targetH = tool.targetHeight || img.height;
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const targetBytes = (tool.targetKB || 20) * 1024;
      let quality = 0.92;

      const runCompress = (q: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setIsProcessing(false);
              return;
            }
            if (blob.size > targetBytes && q > 0.08) {
              runCompress(q - 0.08);
            } else {
              setProcessedUrl(URL.createObjectURL(blob));
              setOutputSizeKB(Math.round(blob.size / 1024));
              setIsProcessing(false);
            }
          },
          'image/jpeg',
          q
        );
      };

      runCompress(quality);
    };
  };

  const triggerDownload = () => {
    setTimeout(() => {
      setShowModal(true);
    }, 600);
  };

  const shareToWhatsApp = () => {
    const text = `⚡ Format documents easily for online forms using ${tool.name} (100% Free & Private): ${currentToolUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentToolUrl)}&text=${encodeURIComponent(`⚡ Free ${tool.name} tool:`)}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentToolUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#121215] border border-zinc-800 shadow-2xl space-y-6">
      
      {/* Tool Top Quick Share Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
        <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Share this tool with friends:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={shareToWhatsApp}
            className="px-3 py-1.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" /> WhatsApp
          </button>
          <button
            onClick={copyLink}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-medium text-xs flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-700 hover:border-emerald-500/70 rounded-2xl p-10 text-center cursor-pointer transition bg-zinc-950/40 group"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">Upload File to Resize</h3>
          <p className="text-xs text-zinc-400 mt-1">Supports JPG, PNG, WEBP • 100% Client-Side</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 bg-zinc-950/60 rounded-2xl border border-zinc-800">
            <div className="text-center space-y-2">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase">Original ({originalSizeKB} KB)</span>
              <div className="w-36 h-44 rounded-xl border border-zinc-700 overflow-hidden bg-black flex items-center justify-center">
                <img src={preview} alt="Original" className="max-w-full max-h-full object-contain" />
              </div>
            </div>

            {processedUrl && (
              <div className="text-center space-y-2 animate-fadeIn">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase">
                  Formatted ({outputSizeKB} KB)
                </span>
                <div className="w-36 h-44 rounded-xl border border-emerald-500/60 overflow-hidden bg-black flex items-center justify-center">
                  <img src={processedUrl} alt="Formatted" className="max-w-full max-h-full object-contain" />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {!processedUrl ? (
              <button
                onClick={processImage}
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isProcessing ? 'Processing...' : `Compress & Resize Now`}
              </button>
            ) : (
              <>
                <a
                  href={processedUrl}
                  download={`${tool.slug}-formilo.jpg`}
                  onClick={triggerDownload}
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Image
                </a>

                <button
                  onClick={shareToWhatsApp}
                  className="px-4 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#22c35e] text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-[#25D366]/20"
                >
                  <Share2 className="w-4 h-4" /> WhatsApp Share
                </button>

                <button
                  onClick={() => {
                    setPreview(null);
                    setProcessedUrl(null);
                    setShowModal(false);
                  }}
                  className="px-4 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Reset
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Post Download Viral Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#121215] border border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/80"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white">File Ready & Downloaded!</h3>
              <p className="text-xs text-zinc-400">Share this tool with your friends or study groups.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={shareToWhatsApp}
                className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#22c35e] text-black font-bold text-xs flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> WhatsApp
              </button>
              <button
                onClick={shareToTelegram}
                className="py-3 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1e8cc0] text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Telegram
              </button>
            </div>

            <button
              onClick={copyLink}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied!' : 'Copy Direct Tool Link'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
