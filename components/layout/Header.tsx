'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, FileText, Image as ImageIcon, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Photo Tools', href: '/#photo-tools' },
    { label: 'Signature Tools', href: '/#signature-tools' },
    { label: 'PDF Suite', href: '/#pdf-tools' },
    { label: 'Exam Presets', href: '/#exam-presets' },
    { label: 'Cyber Cafe Hub', href: '/cyber-cafe' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 border-b ${
        scrolled ? 'shadow-sm border-[#DDE2DF]' : 'border-[#E8EBE9]'
      }`}
    >
      <div className="max-w-[1200px] mx-auto h-[60px] sm:h-[66px] px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00C98B] to-[#00C7D9] flex items-center justify-center text-white font-black text-lg shadow-sm shadow-[#00C98B]/20 group-hover:scale-105 transition-transform">
            F
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[#162630] leading-none">
              FORMILO
            </span>
            <span className="text-[9px] font-bold text-[#65737A] tracking-wider uppercase mt-0.5">
              Document & Photo Tools
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'text-[#00C98B] bg-[#F7F7F3]'
                    : 'text-[#65737A] hover:text-[#162630] hover:bg-[#F7F7F3]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Quick Action & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          <Link
            href="/photo-resizer-20kb"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white text-xs font-bold shadow-sm shadow-[#00C98B]/20 hover:opacity-95 transition"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>20 KB Preset</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#162630] hover:bg-[#F7F7F3] border border-[#DDE2DF] transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#DDE2DF] px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold text-[#162630] hover:bg-[#F7F7F3] transition flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#89959A]" />
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E8EBE9]">
            <Link
              href="/photo-resizer-20kb"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Quick 20 KB Photo Resizer</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
