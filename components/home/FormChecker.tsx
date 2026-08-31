'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, UploadCloud, ArrowRight, ShieldCheck } from 'lucide-react';

interface ExamRule {
  name: string;
  maxKB: number;
  minKB: number;
  reqWidth: number;
  reqHeight: number;
  fixUrl: string;
}

const rules: Record<string, ExamRule> = {
  'ssc-photo': { name: 'SSC Photo (CGL/CHSL/GD)', maxKB: 50, minKB: 20, reqWidth: 350, reqHeight: 450, fixUrl: '/photo-resizer-50kb' },
  'ssc-sign': { name: 'SSC Signature', maxKB: 20, minKB: 10, reqWidth: 280, reqHeight: 120, fixUrl: '/exam/signature-resize-to-20kb' },
  'rrb-photo': { name: 'Railway RRB Photo', maxKB: 50, minKB: 20, reqWidth: 350, reqHeight: 450, fixUrl: '/photo-resizer-50kb' },
  'neet-postcard': { name: 'NEET Postcard Photo (4x6)', maxKB: 200, minKB: 50, reqWidth: 480, reqHeight: 720, fixUrl: '/photo-resizer-200kb' },
  'pan-photo': { name: 'PAN Card Photo (NSDL)', maxKB: 50, minKB: 10, reqWidth: 213, reqHeight: 213, fixUrl: '/exam/pan-card-photo-resizer' },
};

export default function FormChecker() {
  const [selectedRuleKey, setSelectedRuleKey] = useState('ssc-photo');
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    sizeKB: number;
    width: number;
    height: number;
    format: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeRule = rules[selectedRuleKey];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    img.onload = () => {
      setFileDetails({
        name: file.name,
        sizeKB: Math.round(file.size / 1024),
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: file.type.replace('image/', '').toUpperCase() || 'JPG',
      });
    };
  };

  const isSizeValid = fileDetails ? fileDetails.sizeKB >= activeRule.minKB && fileDetails.sizeKB <= activeRule.maxKB : false;
  const isReady = fileDetails && isSizeValid;

  return (
    <div className="w-full bg-white border border-[#DDE2DF] rounded-card p-5 sm:p-8 shadow-card space-y-6">
      
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00C98B]">
          <CheckCircle2 className="w-4 h-4" />
          <span>INSTANT REQUIREMENT VALIDATOR</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#162630] tracking-tight">
          Is Your Form File Ready?
        </h2>
        <p className="text-xs sm:text-sm text-[#65737A]">
          Select your exam and upload your candidate photo or signature to verify size and format requirements before final submission.
        </p>
      </div>

      {/* Select Exam Standard */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-xs font-bold text-[#162630] shrink-0">Select Target Form Requirement:</label>
        <select
          value={selectedRuleKey}
          onChange={(e) => setSelectedRuleKey(e.target.value)}
          className="w-full sm:w-auto flex-1 bg-[#F7F7F3] border border-[#DDE2DF] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#162630] focus:outline-none focus:border-[#00C98B]"
        >
          {Object.entries(rules).map(([key, rule]) => (
            <option key={key} value={key}>
              {rule.name} (Limit: {rule.minKB}–{rule.maxKB} KB)
            </option>
          ))}
        </select>
      </div>

      {/* Upload Zone */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {!fileDetails ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#DDE2DF] hover:border-[#00C98B] rounded-2xl p-6 sm:p-8 text-center bg-[#F7F7F3] cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
        >
          <UploadCloud className="w-10 h-10 text-[#89959A] group-hover:text-[#00C98B] transition-colors" />
          <p className="text-xs sm:text-sm font-bold text-[#162630]">
            Tap to Upload Photo or Signature to Test
          </p>
          <p className="text-[11px] text-[#89959A]">100% Client-Side Instant Rule Validation</p>
        </div>
      ) : (
        <div className="bg-[#F7F7F3] border border-[#DDE2DF] rounded-2xl p-5 space-y-4">
          
          {/* Status Result Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE2DF]">
            <span className="text-xs font-bold text-[#162630] truncate max-w-xs">{fileDetails.name}</span>
            {isReady ? (
              <span className="px-3 py-1 rounded-full bg-[#00C98B]/15 text-[#00a874] border border-[#00C98B]/30 text-xs font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>✓ READY TO UPLOAD</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-[#EBAA78]/20 text-[#c97b40] border border-[#EBAA78]/40 text-xs font-extrabold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>⚠ NEEDS FIXING</span>
              </span>
            )}
          </div>

          {/* Verification Specs Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-[#DDE2DF]">
              <span className="text-[10px] text-[#89959A] block">Current File Size</span>
              <span className={`font-bold font-mono text-sm ${isSizeValid ? 'text-[#00C98B]' : 'text-[#c97b40]'}`}>
                {fileDetails.sizeKB} KB
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#DDE2DF]">
              <span className="text-[10px] text-[#89959A] block">Allowed Rule Limit</span>
              <span className="font-bold text-[#162630] font-mono text-sm">
                {activeRule.minKB}–{activeRule.maxKB} KB
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#DDE2DF]">
              <span className="text-[10px] text-[#89959A] block">Image Resolution</span>
              <span className="font-bold text-[#162630] font-mono text-sm">
                {fileDetails.width}×{fileDetails.height} px
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#DDE2DF]">
              <span className="text-[10px] text-[#89959A] block">File Format</span>
              <span className="font-bold text-[#00C98B] font-mono text-sm">{fileDetails.format}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold text-[#65737A] hover:underline"
            >
              Check Another File
            </button>
            {!isReady && (
              <Link
                href={activeRule.fixUrl}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-[#00C98B]/20"
              >
                <span>Fix &amp; Compress to &lt; {activeRule.maxKB} KB Automatically</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
