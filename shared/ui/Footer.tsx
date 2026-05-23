'use client';

import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-slate-100 dark:border-slate-800">
          
          {/* Column 1: Brand & Disclaimer */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-inner">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <span className="text-[14px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Compliance<span className="text-blue-600 dark:text-blue-500">OS</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Advanced identity screening infrastructure for sanctions, PEP, and adverse media verification. Built for modern financial systems.
            </p>

            <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 rounded-lg max-w-sm">
              <p className="text-[10px] text-amber-800 dark:text-amber-500 leading-normal">
                <strong>Disclaimer:</strong> This is a prototype system for demonstration and testing purposes. Screened lists may not reflect live regulatory updates instantly. Do not use as the sole basis for actual KYC/AML compliance sign-offs.
              </p>
            </div>
          </div>

          {/* Column 2: Sanctions Lists */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Sanctions Authorities
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <a 
                  href="https://www.un.org/securitycouncil/content/un-sc-consolidated-list" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors inline-flex items-center gap-1 group"
                >
                  UN Consolidated List
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.uaetec.gov.ae/en/un-sanctions-list" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors inline-flex items-center gap-1 group"
                >
                  UAE Local Terrorist List
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.centralbank.ae/en/compliance/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors inline-flex items-center gap-1 group"
                >
                  UAE Central Bank AML
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Resources */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Developer Resources
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">
                  API Documentation
                </span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">
                  Integration Guide
                </span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">
                  SDK References
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & System */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              System
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  All Systems Operational
                </span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright section */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <div>
            &copy; {currentYear} ComplianceOS. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by Next.js & Turbopack</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span>v0.1.0-alpha</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
