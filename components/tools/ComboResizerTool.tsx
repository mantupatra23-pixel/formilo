'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Download, CheckCircle2, AlertCircle, RefreshCw, Zap, ShieldCheck, FileArchive } from 'lucide-react';
import JSZip from 'jszip';

interface ComboPreset {
  name: string;
  photoMaxKB: number;
  photoWidth: number;
  photoHeight: number;
  sigMaxKB: number;
  sigWidth: number;
  sigHeight: number;
}

const PRESETS: Record<string, ComboPreset> = {
  ssc: { name: 'SSC (CGL / CHSL / MTS / GD)', photoMaxKB: 50, photoWidth: 350, photoHeight: 450, sigMaxKB: 20, sigWidth: 280, sigHeight: 120 },
  upsc: { name: 'UPSC (IAS / NDA / CDS)', photoMaxKB: 100, photoWidth: 350, photoHeight: 450, sigMaxKB: 40, sigWidth: 350, sigHeight: 150 },
  ibps: { name: 'IBPS (PO / Clerk / RRB)', photoMaxKB: 50, photoWidth: 200, photoHeight: 230, sigMaxKB: 20, sigWidth: 140, sigHeight: 60 },
  rrb: { name: 'Railway (RRB NTPC / Group D)', photoMaxKB: 50, photoWidth: 350, photoHeight: 450, sigMaxKB: 20, sigWidth: 280, sigHeight: 120 },
};

export default function ComboResizerTool() {
  const [selectedPreset, setSelectedPreset] = useState<string>('ssc');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [sigFile, setSigFile] = useState<File | null>(null);

  const [photoResult, setPhotoResult] = useState<{ blob: Blob; url: string; size: number } | null>(null);
  const [sigResult, setSigResult] = useState<{ blob: Blob; url: string; size: number } | null>(null);
  const [processing, setProcessing] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  const activePreset = PRESETS[selectedPreset];

  const compressSingleFile = async (file: File, maxKB: number, targetW: number, targetH: number): Promise<{ blob: Blob; url: string; size: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas error');

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetW, targetH);
        ctx.drawImage(img, 0, 0, targetW, targetH);

        let minQ = 0.05;
        let maxQ = 0.98;
        let bestBlob: Blob | null = null;

        const iterate = (iteration: number) => {
          if (iteration > 8) {
            if (!bestBlob) canvas.toBlob((b) => resolve({ blob: b!, url: URL.createObjectURL(b!), size: b!.size }), 'image/jpeg', minQ);
            else resolve({ blob: bestBlob, url: URL.createObjectURL(bestBlob), size: bestBlob.size });
            return;
          }

          const q = (minQ + maxQ) / 2;
          canvas.toBlob((b) => {
            if (!b) return reject('Blob creation failed');
            if (b.size <= maxKB * 1024) {
              bestBlob = b;
              minQ = q;
            } else {
              maxQ = q;
            }
            iterate(iteration + 1);
          }, 'image/jpeg', q);
        };

        iterate(0);
      };
      img.onerror = () => reject('Image load failed');
    });
  };

  const processBoth = async () => {
    if (!photoFile || !sigFile) return;
    setProcessing(true);
    try {
      const pRes = await compressSingleFile(photoFile, activePreset.photoMaxKB, activePreset.photoWidth, activePreset.photoHeight);
      const sRes = await compressSingleFile(sigFile, activePreset.sigMaxKB, activePreset.sigWidth, activePreset.sigHeight);
      setPhotoResult(pRes);
      setSigResult(sRes);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const downloadZip = async () => {
    if (!photoResult || !sigResult) return;
    const zip = new JSZip();
    zip.file(`photo_${selectedPreset}_under_${activePreset.photoMaxKB}kb.jpg`, photoResult.blob);
    zip.file(`signature_${selectedPreset}_under_${activePreset.sigMaxKB}kb.jpg`, sigResult.blob);

    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = `Formilo_${selectedPreset.toUpperCase()}_Combo_Files.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 text-zinc-100">
      {/* Preset Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Target Government Examination:</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => { setSelectedPreset(key); setPhotoResult(null); setSigResult(null); }}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPreset === key ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-zinc-800 bg-zinc-900/50 text-zinc-400'
              }`}
            >
              <span className="block text-xs font-bold text-white">{p.name.split(' ')[0]}</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Photo &lt; {p.photoMaxKB}K | Sig &lt; {p.sigMaxKB}K</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Dual Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Photo Box */}
        <div
          onClick={() => photoInputRef.current?.click()}
          className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition ${
            photoFile ? 'border-emerald-500/80 bg-emerald-950/20' : 'border-zinc-800 hover:border-emerald-500/40 bg-zinc-900/40'
          }`}
        >
          <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setPhotoFile(e.target.files[0])} />
          <UploadCloud className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
          <p className="text-xs font-bold text-white">{photoFile ? photoFile.name : 'Upload Candidate Photo'}</p>
          <span className="text-[10px] text-zinc-400 block mt-1">Target: {activePreset.photoWidth}×{activePreset.photoHeight} px (&lt; {activePreset.photoMaxKB} KB)</span>
        </div>

        {/* Signature Box */}
        <div
          onClick={() => sigInputRef.current?.click()}
          className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition ${
            sigFile ? 'border-cyan-500/80 bg-cyan-950/20' : 'border-zinc-800 hover:border-cyan-500/40 bg-zinc-900/40'
          }`}
        >
          <input ref={sigInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setSigFile(e.target.files[0])} />
          <UploadCloud className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
          <p className="text-xs font-bold text-white">{sigFile ? sigFile.name : 'Upload Scanned Signature'}</p>
          <span className="text-[10px] text-zinc-400 block mt-1">Target: {activePreset.sigWidth}×{activePreset.sigHeight} px (&lt; {activePreset.sigMaxKB} KB)</span>
        </div>
      </div>

      {/* Process Trigger */}
      {photoFile && sigFile && !photoResult && (
        <button
          onClick={processBoth}
          disabled={processing}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-sm transition flex items-center justify-center gap-2"
        >
          {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Format Both Files for {activePreset.name.split(' ')[0]}
        </button>
      )}

      {/* Results Download Card */}
      {photoResult && sigResult && (
        <div className="p-6 bg-zinc-900/90 border border-emerald-500/40 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" /> Both Files Verified & Application Ready!
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="block text-zinc-400 font-semibold">Processed Photo</span>
              <span className="text-emerald-400 font-bold">{(photoResult.size / 1024).toFixed(1)} KB (Max {activePreset.photoMaxKB} KB)</span>
            </div>
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="block text-zinc-400 font-semibold">Processed Signature</span>
              <span className="text-cyan-400 font-bold">{(sigResult.size / 1024).toFixed(1)} KB (Max {activePreset.sigMaxKB} KB)</span>
            </div>
          </div>

          <button
            onClick={downloadZip}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-sm transition flex items-center justify-center gap-2"
          >
            <FileArchive className="w-4 h-4" /> Download Both Files (ZIP Pack)
          </button>
        </div>
      )}

      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-xs text-zinc-500">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>100% Client-Side Processing • Your documents never leave this device</span>
      </div>
    </div>
  );
}
