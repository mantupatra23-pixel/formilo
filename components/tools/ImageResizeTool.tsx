'use client';

import React, { useState } from 'react';
import { ToolConfig } from '@/config/tools';
import { compressImageToTarget, CompressionResult } from '@/lib/imageCompression';
import Dropzone from '@/components/ui/Dropzone';

interface ImageResizeToolProps {
  tool: ToolConfig;
}

export default function ImageResizeTool({ tool }: ImageResizeToolProps) {
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
          targetKB: tool.targetKB,
          forceJpeg: tool.isSignature || tool.targetKB !== undefined,
        },
        (stage) => setProgressStage(stage)
      );

      if (tool.targetKB && res.sizeBytes > tool.targetKB * 1024) {
        setError(`Could not reach the ${tool.targetKB} KB target with this image. Please try another image.`);
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
    a.download = `formilo_${tool.slug}_${file?.name || 'optimized.jpg'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
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
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-sm font-medium text-blue-600 animate-pulse">
                {progressStage}
              </p>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/50 rounded-xl space-y-3">
              <p className="font-semibold text-xs text-red-700 dark:text-red-400">Processing Error</p>
              <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed">{error}</p>
              <button
                onClick={handleReset}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
              >
                Try Another Photo
              </button>
            </div>
          )}

          {/* Results Display */}
          {result && !processing && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Processed Preview</p>
                  {result.dataUrl && (
                    /* eslint-disable-next-html-element-suppression */
                    <img
                      src={result.dataUrl}
                      alt="Processed Preview"
                      className="max-h-64 object-contain rounded-lg border border-slate-200 dark:border-slate-800"
                    />
                  )}
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Optimization Complete</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                      <span className="block text-xs text-slate-500 font-bold uppercase">Original</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 text-center">
                      <span className="block text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">Output</span>
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                        {(result.sizeBytes / 1024).toFixed(1)} KB
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 text-center">
                      <span className="block text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase">Reduced</span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {(((file.size - result.sizeBytes) / file.size) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1 pt-1">
                    <p><strong className="text-slate-700 dark:text-slate-300">Dimensions:</strong> {result.width} × {result.height} px</p>
                    <p><strong className="text-slate-700 dark:text-slate-300">Format:</strong> {result.mimeType === 'image/jpeg' ? 'JPEG' : 'PNG'}</p>
                    {tool.targetKB && result.sizeBytes <= tool.targetKB * 1024 && (
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                        ✓ Successfully compressed under {tool.targetKB} KB
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={handleDownload}
                      className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition"
                    >
                      Download Image
                    </button>
                    <button
                      onClick={handleReset}
                      className="py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm transition"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Banner */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-2 text-xs text-slate-500">
        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Your files are processed safely in your browser and are never uploaded to any server.</span>
      </div>
    </div>
  );
}
