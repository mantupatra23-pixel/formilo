'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md">
            F
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              FORMILO
            </span>
            <span className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:inline">
              Free Tools. Instant Results.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <Link href="/tools/photo" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Photo Tools
          </Link>
          <Link href="/tools/image" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Image Tools
          </Link>
          <Link href="/tools/pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            PDF Tools
          </Link>
          <Link href="/tools/signature" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Signature Tools
          </Link>
          <Link href="/tools/form" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Form Tools
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          <Link
            href="/tools/photo"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Photo Tools
          </Link>
          <Link
            href="/tools/image"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Image Tools
          </Link>
          <Link
            href="/tools/pdf"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            PDF Tools
          </Link>
          <Link
            href="/tools/signature"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Signature Tools
          </Link>
          <Link
            href="/tools/form"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Form Tools
          </Link>
        </div>
      )}
    </header>
  );
}
