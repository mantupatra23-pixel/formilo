'use client';

import React, { useState } from 'react';
import { ToolConfig } from '@/config/tools';
import { processImageToTargetKB, ProcessImageResult } from '@/lib/image/engine';
import Dropzone from '@/components/ui/Dropzone';
import { trackDownload, trackError, trackUpload } from '@/lib/analytics';

interface ImageResizeToolProps {
  tool: ToolConfig;
}

export default function ImageResizeTool({ tool }: ImageResizeToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    setResult(null);
    setFile(selectedFile);
    trackUpload(tool.slug, selectedFile.type, selectedFile.size);

    try {
      setProcessing(true);
      const res = await processImageToTargetKB({
        file: selectedFile,
        targetKB: tool.targetKB
      });
      setResult(res);
    } catch (err: any) {
      const errMsg = err?.message || 'Processing failed. Please upload a valid image file.';
      setError(errMsg);
      trackError(tool.slug, errMsg);
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
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.dataUrl;
    a.download = `formilo_${tool.slug}_${file?.name || 'processed.jpg'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    trackDownload(tool.slug);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      {!file ? (
        <Dropzone onFileSelect={handleFileSelect} accept="image/jpeg,image/png,image/webp" />
      ) : (
        <div className="space-y-6">
          {/* Status Indicator */}
          {processing && (
            <div className="py-12 text-center space-y-3">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Optimizing image to stay under {tool.targetKB} KB...
              </p>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-300 text-sm">
              <p className="font-semibold">Processing Failed</p>
              <p>{error}</p>
              <button
                onClick={handleReset}
                className="mt-3 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition"
              >
                Try Another Image
              </button>
            </div>
          )}

          {/* Results Display */}
          {result && !processing && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Preview</p>
                  <img
                    src={result.dataUrl}
                    alt="Processed Preview"
                    className="max-h-64 object-contain rounded-lg border border-slate-200 dark:border-slate-700"
                  />
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Optimization Complete</h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <span className="block text-xs text-slate-500">Original</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {(result.originalSizeBytes / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl">
                      <span className="block text-xs text-blue-600 dark:text-blue-400">Output</span>
                      <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                        {(result.sizeBytes / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950/40 rounded-xl">
                      <span className="block text-xs text-green-600 dark:text-green-400">Reduced</span>
                      <span className="text-sm font-bold text-green-700 dark:text-green-300">
                        {result.reductionPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <p>Dimensions: {result.width} × {result.height} px</p>
                    <p>Format: JPEG</p>
                    <p className="text-green-600 dark:text-green-400 font-medium pt-1">
                      ✓ Successfully compressed under {tool.targetKB} KB
                    </p>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={handleDownload}
                      className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
                    >
                      Download Image
                    </button>
                    <button
                      onClick={handleReset}
                      className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl text-sm transition"
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
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Your files are processed in your browser and are not uploaded to our server.</span>
      </div>
    </div>
  );
}
