import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto text-slate-600 dark:text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                F
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                FORMILO
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Free online photo, PDF, image and form tools. Fast, browser-side processing focused on privacy.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/photo-tools" className="hover:text-blue-600 transition">Photo Tools</Link></li>
              <li><Link href="/image-tools" className="hover:text-blue-600 transition">Image Tools</Link></li>
              <li><Link href="/pdf-tools" className="hover:text-blue-600 transition">PDF Tools</Link></li>
              <li><Link href="/form-tools" className="hover:text-blue-600 transition">Form Tools</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-blue-600 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Formilo. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Free Tools. Instant Results.</p>
        </div>
      </div>
    </footer>
  );
}
