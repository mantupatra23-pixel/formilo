'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles, Zap } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Photo Tools', href: '/photo-tools' },
    { label: 'Image Tools', href: '/image-tools' },
    { label: 'PDF Tools', href: '/pdf-tools' },
    { label: 'Signature Tools', href: '/signature-tools' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-black text-base shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            F
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-wider text-white group-hover:text-emerald-400 transition-colors">
              FORMILO
            </span>
            <span className="text-[10px] text-zinc-500 font-medium leading-none">
              Instant Client Tools
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold px-3.5 py-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900/60 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/tools/photo-resize-20kb"
            className="ml-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md shadow-emerald-500/10"
          >
            <Zap className="w-3.5 h-3.5" /> 20 KB Preset
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 bg-zinc-950 border-b border-zinc-800 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-emerald-400 hover:bg-zinc-900"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
