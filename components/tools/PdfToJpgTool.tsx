'use client';

import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { getAcceptString, validateSelectedFile } from '@/config/fileValidation';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PageItem {
  pageNumber: number;
  thumbnailUrl: string;
  selected: boolean;
}

export default function PdfToJpgTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [quality, setQuality] = useState<number>(0.85);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    const validation = validateSelectedFile(file, 'pdfToJpg');
    if (!validation.valid) {
      setErrorMsg(validation.message || 'Invalid PDF file.');
      return;
    }

    setSelectedFile(file);
    setErrorMsg(null);
    setIsProcessing(true);
    setProgressMsg('Loading PDF pages...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;
      const loadedPages: PageItem[] = [];

      for (let i = 1; i <= pageCount; i++) {
        setProgressMsg(`Generating thumbnail for page ${i} of ${pageCount}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.6);
          loadedPages.push({ pageNumber: i, thumbnailUrl, selected: true });
        }
      }

      setPages(loadedPages);
    } catch (err) {
      setErrorMsg('This PDF could not be opened or is password protected.');
      setSelectedFile(null);
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const togglePageSelection = (pageNumber: number) => {
    setPages((prev) =>
      prev.map((p) => (p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p))
    );
  };

  const selectAll = (status: boolean) => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: status })));
  };

  const convertAndDownload = async () => {
    if (!selectedFile) return;
    const selectedPages = pages.filter((p) => p.selected);
    if (selectedPages.length === 0) {
      alert('Please select at least one page to convert.');
      return;
    }

    setIsProcessing(true);
    setProgressMsg('Extracting high-resolution pages...');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      if (selectedPages.length === 1) {
        const pNum = selectedPages[0].pageNumber;
        const page = await pdf.getPage(pNum);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `formilo_page_${pNum}.jpg`;
                a.click();
                URL.revokeObjectURL(url);
              }
            },
            'image/jpeg',
            quality
          );
        }
      } else {
        const zip = new JSZip();

        for (let i = 0; i < selectedPages.length; i++) {
          const pNum = selectedPages[i].pageNumber;
          setProgressMsg(`Rendering page ${i + 1} of ${selectedPages.length}...`);
          const page = await pdf.getPage(pNum);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          if (ctx) {
            await page.render({ canvasContext: ctx, viewport }).promise;
            const blob = await new Promise<Blob | null>((resolve) =>
              canvas.toBlob(resolve, 'image/jpeg', quality)
            );
            if (blob) {
              zip.file(`formilo_page_${pNum}.jpg`, blob);
            }
          }
        }

        setProgressMsg('Creating ZIP archive...');
        const zipContent = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipContent);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formilo_pdf_pages.zip';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setErrorMsg('Failed to export selected pages.');
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
      {!selectedFile ? (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-4">
          <input
            type="file"
            accept={getAcceptString('pdfToJpg')}
            onChange={handleFileChange}
            className="hidden"
            id="pdf-to-jpg-input"
          />
          <label
            htmlFor="pdf-to-jpg-input"
            className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition"
          >
            Click to upload or drag & drop PDF
          </label>
          <p className="text-xs text-slate-500">Supports PDF files</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{selectedFile.name}</h3>
              <p className="text-xs text-slate-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                setPages([]);
              }}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Remove PDF
            </button>
          </div>

          {pages.length > 0 && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-x-2">
                  <button onClick={() => selectAll(true)} className="text-blue-600 hover:underline font-semibold">
                    Select All
                  </button>
                  <span>•</span>
                  <button onClick={() => selectAll(false)} className="text-slate-500 hover:underline">
                    Deselect All
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor="pdf-quality-select" className="text-slate-600 dark:text-slate-400">Quality:</label>
                  <select
                    id="pdf-quality-select"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-lg px-2 py-1"
                  >
                    <option value={0.55}>Low (Small file)</option>
                    <option value={0.70}>Medium</option>
                    <option value={0.85}>High (Recommended)</option>
                    <option value={0.95}>Maximum</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2 border border-slate-100 dark:border-slate-800 rounded-xl">
                {pages.map((item) => (
                  <div
                    key={item.pageNumber}
                    onClick={() => togglePageSelection(item.pageNumber)}
                    className={`relative cursor-pointer border-2 rounded-xl p-2 transition ${
                      item.selected
                        ? 'border-blue-600 bg-blue-50/20'
                        : 'border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    {/* eslint-disable-next-html-element-suppression */}
                    <img src={item.thumbnailUrl} alt={`Page ${item.pageNumber}`} className="w-full h-32 object-contain rounded-lg" />
                    <div className="mt-2 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Page {item.pageNumber}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={convertAndDownload}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl text-sm transition"
              >
                {isProcessing
                  ? progressMsg
                  : pages.filter((p) => p.selected).length === 1
                  ? 'Download Selected Page as JPG'
                  : `Download Selected Pages as ZIP (${pages.filter((p) => p.selected).length})`}
              </button>
            </>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 rounded-xl text-xs">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
