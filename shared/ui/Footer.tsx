'use client';

import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors mt-auto text-[13px] text-slate-500 dark:text-slate-400">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left Side: Brand, Copyright & Demo Indicator */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <span className="font-bold text-slate-850 dark:text-slate-200">
            Compliance<span className="text-blue-600 dark:text-blue-500">OS</span>
          </span>
          <span className="hidden sm:inline text-slate-200 dark:text-slate-800">|</span>
          <span>&copy; {currentYear} All rights reserved.</span>
          <span className="hidden sm:inline text-slate-200 dark:text-slate-800">|</span>
        </div>

        {/* Right Side: Legal Info (Deactivated) */}
        <div className="flex items-center gap-4 font-medium text-[12px] text-slate-400 dark:text-slate-600">
          <span className="cursor-not-allowed">
            Privacy Policy
          </span>
          <span className="cursor-not-allowed">
            Terms of Service
          </span>
        </div>

      </div>
    </footer>
  );
}
