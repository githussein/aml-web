'use client';

import React from 'react';
import { useScreening } from '@/features/screening/hooks/useScreening';
import { SearchBar } from '@/features/screening/components/SearchBar';
import { ResultsList } from '@/features/screening/components/ResultsList';
import { DetailPanel } from '@/features/screening/components/DetailPanel';
import { SourceStatusBadge } from '@/features/screening/components/SourceStatusBadge';
import { Badge } from '@/shared/ui/Badge';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { Footer } from '@/shared/ui/Footer';

export function ScreeningPage() {
  const {
    query,
    results,
    status,
    errorMessage,
    selectedResult,
    providerMeta,
    isPreloading,
    setQuery,
    runSearch,
    selectResult,
    clearSelection,
    refresh,
  } = useScreening();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 bg-dot-grid relative">
      {/* Dynamic glow effect in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-blue-500/5 to-transparent dark:from-blue-500/10 dark:to-transparent blur-[120px] pointer-events-none rounded-full z-0" />

      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-all">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* SaaS Logo Mark */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex items-center justify-center shadow-md dark:shadow-blue-900/30 group cursor-pointer hover:rotate-6 transition-all duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <div>
              <h1 className="text-[16px] font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-none">
                Compliance<span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">OS</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none mt-1">Sanctions Screening</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge label="Enterprise Prototype" variant="demo" size="md" />
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
            <ThemeToggle />
            <button
              id="refresh-datasets-button"
              onClick={refresh}
              disabled={isPreloading}
              title="Reload datasets"
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all disabled:opacity-40"
            >
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-500 ${isPreloading ? 'animate-spin' : ''}`}
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
              <span>{isPreloading ? 'Syncing...' : 'Sync Data'}</span>
            </button>
            <button
              title="Login"
              aria-label="Login"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>Login</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button
              title="Sign Up"
              aria-label="Sign Up"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white shadow-sm hover:shadow-indigo-500/10 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-400 dark:hover:to-indigo-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              <span>Sign Up</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* Hero Search Section */}
        <section aria-label="Sanctions name search" className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Individual & Entity Screening
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-loose">
              Scan individuals and entities across the
              <span className="inline-flex items-center mx-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-200/50 dark:border-blue-500/20 shadow-sm text-blue-700 dark:text-blue-300 font-semibold text-[13px] transition-all hover:-translate-y-0.5 hover:shadow-md cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mr-2 animate-pulse" />
                UN Security Council Consolidated List
              </span>
              and the
              <span className="inline-flex items-center mx-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-200/50 dark:border-emerald-500/20 shadow-sm text-emerald-700 dark:text-emerald-300 font-semibold text-[13px] transition-all hover:-translate-y-0.5 hover:shadow-md cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2 animate-pulse" />
                UAE Terrorist List
              </span>
              in real-time.
            </p>
          </div>

          <div className="w-full max-w-2xl space-y-4">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              onSearch={runSearch}
              isLoading={status === 'loading'}
              isDisabled={isPreloading}
            />
            {/* Example Search Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1">Try example:</span>
              {[
                { label: 'Kim Jong Un', term: 'Kim Jong Un' },
                { label: 'Al-Qaeda', term: 'Al-Qaeda' },
                { label: 'Yousef', term: 'Yousef' },
                { label: 'Taliban', term: 'Taliban' },
              ].map(pill => (
                <button
                  key={pill.label}
                  onClick={() => {
                    setQuery(pill.term);
                    runSearch(pill.term);
                  }}
                  disabled={isPreloading || status === 'loading'}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Dataset Status Cards */}
        <section aria-label="Dataset status" className="max-w-4xl mx-auto w-full">
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <SourceStatusBadge meta={providerMeta.un} />
            <SourceStatusBadge meta={providerMeta.uae} />

            {/* Compliance Engine Card */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-3 min-w-[280px] flex-1 max-w-[400px] shadow-sm border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/2 dark:hover:shadow-indigo-900/5 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500 pointer-events-none opacity-20 dark:opacity-30 bg-indigo-400" />

              {/* Header */}
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4 relative z-10">
                <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center shrink-0 shadow-sm border border-slate-100 dark:border-slate-800 text-indigo-500 transition-colors group-hover:bg-white dark:group-hover:bg-slate-800">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" ry="2" />
                    <path d="M12 2v9" />
                    <path d="M8 5h8" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                      Compliance Engine
                    </span>
                    <div className="relative flex h-3 w-3 items-center justify-center shrink-0" title="Engine Active">
                      <span className="animate-radar absolute inline-flex h-full w-full rounded-full opacity-75 bg-indigo-400"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engine detail */}
              <div className="pt-1.5 relative z-10 flex flex-col gap-2">
                <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Fuzzy Matcher</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">Fuse.js Jaro-Winkler</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Search Latency</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold tabular-nums">&lt; 20 ms</span>
                </p>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-300 dark:text-slate-600">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Fuzzy strictness: 0.25 index</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="w-24 h-px bg-slate-200 dark:bg-slate-800 mx-auto" />

        {/* Results Area */}
        <section aria-label="Screening results" className="max-w-3xl mx-auto pb-20">
          <ResultsList
            results={results}
            status={status}
            query={query}
            errorMessage={errorMessage}
            selectedResult={selectedResult}
            onSelectResult={selectResult}
          />
        </section>
      </main>

      <Footer />

      <DetailPanel result={selectedResult} query={query} onClose={clearSelection} />
    </div>
  );
}
