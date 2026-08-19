'use client';

import { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Lock, Sparkles, Share2, Check } from 'lucide-react';

interface ToolConfig {
  slug: string;
  title: string;
  examName: string;
  targetKB: number;
  minKB: number;
  width: number;
  height: number;
  dpi: number;
}

export default function UniversalExamToolClient({ tool }: { tool: ToolConfig }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [outputSizeKB, setOutputSizeKB] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setProcessedUrl(null);
      setOutputSizeKB(null);
    }
  };

  const processImage = () => {
    if (!preview) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.src = preview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = tool.width;
      canvas.height = tool.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let quality = 0.92;
      const targetBytes = tool.targetKB * 1024;

      const compressLoop = (q: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setIsProcessing(false);
              return;
            }
            if (blob.size > targetBytes && q > 0.1) {
              compressLoop(q - 0.08);
            } else {
              const finalUrl = URL.createObjectURL(blob);
              setProcessedUrl(finalUrl);
              setOutputSizeKB(Math.round(blob.size / 1024));
              setIsProcessing(false);
            }
          },
          'image/jpeg',
          q
        );
      };

      compressLoop(quality);
    };
  };

  const shareOnWhatsApp = () => {
    const shareText = `Fill your ${tool.examName} form easily! Auto-resize photo & signature under ${tool.targetKB} KB directly in your browser: https://formilo-jzcl.vercel.app/exam/${tool.slug}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl space-y-6">
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-700 hover:border-emerald-500/60 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-zinc-950/40 group"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">Upload Candidate Image</h3>
          <p className="text-xs text-zinc-400 mt-1">Supports JPG, JPEG, PNG, or WebP</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 bg-zinc-950/60 rounded-2xl border border-zinc-800">
            <div className="text-center space-y-2">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase">Original</span>
              <div className="w-36 h-44 rounded-xl border border-zinc-700 overflow-hidden bg-black flex items-center justify-center">
                <img src={preview} alt="Original Preview" className="max-w-full max-h-full object-contain" />
              </div>
            </div>

            {processedUrl && (
              <div className="text-center space-y-2 animate-fadeIn">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase">
                  Formatted ({outputSizeKB} KB / {tool.width}x{tool.height}px)
                </span>
                <div className="w-36 h-44 rounded-xl border border-emerald-500/60 overflow-hidden bg-black flex items-center justify-center">
                  <img src={processedUrl} alt="Processed Preview" className="max-w-full max-h-full object-contain" />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {!processedUrl ? (
              <button
                onClick={processImage}
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isProcessing ? 'Processing In Browser...' : `Format for ${tool.examName}`}
              </button>
            ) : (
              <>
                <a
                  href={processedUrl}
                  download={`${tool.slug}-formilo.jpg`}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Form Ready File
                </a>
                <button
                  onClick={shareOnWhatsApp}
                  className="px-4 py-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 font-semibold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" /> Share with Friends
                </button>
                <button
                  onClick={() => {
                    setPreview(null);
                    setProcessedUrl(null);
                  }}
                  className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                >
                  Reset
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
