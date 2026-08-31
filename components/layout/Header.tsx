'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap, ArrowRight } from 'lucide-react';

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
    { label: 'Photo Resizers', href: '/#photo-tools' },
    { label: 'Signature Tools', href: '/#signature-tools' },
    { label: 'PDF Tools', href: '/#pdf-tools' },
    { label: 'Exam Presets', href: '/#exam-presets' },
    { label: 'Cyber Cafe Hub', href: '/cyber-cafe' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[#FFFFFF] transition-shadow duration-200 border-b ${
        scrolled ? 'shadow-sm border-[#DDE2DF]' : 'border-[#E8EBE9]'
      }`}
    >
      <div className="max-w-[1200px] mx-auto h-[60px] sm:h-[66px] px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo with Official Image */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Formilo Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[17px] tracking-tight text-[#17262E] leading-none">
              FORMILO
            </span>
            <span className="text-[10px] font-bold text-[#66777D] tracking-wider uppercase mt-0.5">
              Document &amp; Photo Tools
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'text-[#00A879] bg-[#F7F7F3] font-semibold'
                    : 'text-[#34454C] hover:text-[#17262E] hover:bg-[#F7F7F3]'
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white text-[12px] font-bold shadow-sm shadow-[#00C98B]/20 hover:opacity-95 transition"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>20 KB Preset</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#17262E] hover:bg-[#F7F7F3] border border-[#DDE2DF] transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFFFF] border-b border-[#DDE2DF] px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-[#17262E] hover:bg-[#F7F7F3] transition flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-[#66777D]" />
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E8EBE9]">
            <Link
              href="/photo-resizer-20kb"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-sm"
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
