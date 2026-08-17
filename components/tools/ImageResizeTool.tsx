'use client';

import React, { useState } from 'react';
import { compressImageToTarget, CompressionResult } from '@/lib/imageCompression';
import Dropzone from '@/components/ui/Dropzone';
import { Download, RefreshCw, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface ImageResizeToolProps {
  tool: any;
}

export default function ImageResizeTool({ tool }: ImageResizeToolProps) {
  const toolName = tool?.name || tool?.title || 'Image Resizer';
  const targetKB = tool?.targetKB;
  const isSignature = tool?.category === 'signature' || tool?.isSignature || false;

  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [progressStage, setProgressStage] = useState<string>('Processing...');
  const [result, setResult] = useState<(CompressionResult & { dataUrl?: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    setResult(null);
    setFile(selectedFile);
    setProcessing(true);

    try {
      const res = await compressImageToTarget(
        selectedFile,
        {
          targetKB: targetKB,
          forceJpeg: isSignature || targetKB !== undefined,
        },
        (stage: string) => setProgressStage(stage)
      );

      if (targetKB && res.sizeBytes > targetKB * 1024) {
        setError(`Could not reach the ${targetKB} KB target with this image. Please try another image.`);
      } else {
        const dataUrl = URL.createObjectURL(res.blob);
        setResult({ ...res, dataUrl });
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to process image file.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    if (result?.dataUrl) {
      URL.revokeObjectURL(result.dataUrl);
    }
    setFile(null);
    setResult(null);
    setError(null);
  };

  const handleDownload = () => {
    if (!result || !result.dataUrl) return;
    const a = document.createElement('a');
    a.href = result.dataUrl;
    a.download = `formilo_${tool?.slug || 'resized'}_${file?.name || 'optimized.jpg'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
        />
      ) : (
        <div className="space-y-6">
          {/* Status Indicator */}
          {processing && (
            <div className="py-12 text-center space-y-3">
              <div className="inline-block animate-spin rounded-full h-9 w-9 border-4 border-emerald-500 border-t-transparent"></div>
              <p className="text-sm font-medium text-emerald-400 animate-pulse">
                {progressStage}
              </p>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <p className="font-semibold text-xs uppercase tracking-wider">Processing Error</p>
              </div>
              <p className="text-xs text-red-300 leading-relaxed">{error}</p>
              <button
                onClick={handleReset}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition"
              >
                Try Another Photo
              </button>
            </div>
          )}

          {/* Results Display */}
          {result && !processing && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col items-center justify-center p-4 bg-zinc-900/80 rounded-xl border border-zinc-800">
                  <p className="text-xs font-semibold text-zinc-400 mb-3">Processed Output Preview</p>
                  {result.dataUrl && (
                    <img
                      src={result.dataUrl}
                      alt="Processed Preview"
                      className="max-h-64 object-contain rounded-lg border border-zinc-800"
                    />
                  )}
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Optimization Complete
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 text-center">
                      <span className="block text-[11px] text-zinc-400 font-bold uppercase">Original</span>
                      <span className="text-sm font-black text-zinc-200">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/40 text-center">
                      <span className="block text-[11px] text-emerald-400 font-bold uppercase">Output</span>
                      <span className="text-sm font-black text-emerald-300">
                        {(result.sizeBytes / 1024).toFixed(1)} KB
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-800/40 text-center">
                      <span className="block text-[11px] text-emerald-400 font-bold uppercase">Saved</span>
                      <span className="text-sm font-black text-emerald-400">
                        {file.size > result.sizeBytes 
                          ? `${(((file.size - result.sizeBytes) / file.size) * 100).toFixed(1)}%`
                          : '0%'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-400 space-y-1.5 pt-1">
                    <p><strong className="text-zinc-300">Dimensions:</strong> {result.width} × {result.height} px</p>
                    <p><strong className="text-zinc-300">Format:</strong> {result.mimeType === 'image/jpeg' ? 'JPEG' : 'PNG'}</p>
                    {targetKB && result.sizeBytes <= targetKB * 1024 && (
                      <p className="text-emerald-400 font-bold pt-1">
                        ✓ Target achieved: &lt; {targetKB} KB
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={handleDownload}
                      className="flex-1 py-3 px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-sm transition flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download Image
                    </button>
                    <button
                      onClick={handleReset}
                      className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-xl text-sm transition flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4" /> Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Banner */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-center space-x-2 text-xs text-zinc-500">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Your files are processed 100% locally in your browser memory and are never uploaded to any server.</span>
      </div>
    </div>
  );
}
