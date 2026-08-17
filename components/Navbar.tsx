// components/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Zap } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Photo Tools', href: '/photo-tools' },
    { label: 'Signature Tools', href: '/signature-tools' },
    { label: 'PDF Tools', href: '/pdf-tools' },
    { label: 'Image Tools', href: '/image-tools' },
    { label: 'Exam Presets', href: '/form-tools' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#09090b]/85 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-emerald-500/30 group-hover:border-emerald-500/80 transition-all shadow-md shadow-emerald-500/10 flex-shrink-0">
            <Image 
              src="/logo.png" 
              alt="Formilo Logo" 
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              FORMILO
            </span>
            <span className="text-[10px] text-zinc-400 font-medium leading-none hidden sm:block">
              Document & Photo Tools
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold px-3 py-2 rounded-lg text-zinc-300 hover:text-emerald-400 hover:bg-zinc-900/60 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/tools/photo-resize-20kb"
            className="ml-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-all shadow-md shadow-emerald-500/10"
          >
            <Zap className="w-3.5 h-3.5 fill-black" /> 20 KB Preset
          </Link>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 py-4 bg-[#09090b] border-b border-zinc-800 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-emerald-400 hover:bg-zinc-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/tools/photo-resize-20kb"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-500 text-black text-xs font-black shadow-md shadow-emerald-500/10"
            >
              <Zap className="w-4 h-4 fill-black" /> Instant 20 KB Resizer
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
