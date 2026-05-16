'use client';

import React from 'react';
import { useScreening } from '@/features/screening/hooks/useScreening';
import { SearchBar } from '@/features/screening/components/SearchBar';
import { ResultsList } from '@/features/screening/components/ResultsList';
import { DetailPanel } from '@/features/screening/components/DetailPanel';
import { SourceStatusBadge } from '@/features/screening/components/SourceStatusBadge';
import { Badge } from '@/shared/ui/Badge';

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
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-100 leading-none">AML Screening</h1>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">Sanctions Name Screening</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge label="Demo / Prototype" variant="demo" size="md" />
            <button
              id="refresh-datasets-button"
              onClick={refresh}
              disabled={isPreloading}
              title="Reload datasets"
              aria-label="Refresh datasets"
              className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-40"
            >
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={isPreloading ? 'animate-spin' : ''}
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Search section */}
        <section aria-label="Sanctions name search" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-100">Sanctions Name Screening</h2>
            <p className="text-sm text-slate-500">
              Search the UN Security Council Consolidated List and UAE Terrorist List simultaneously.
            </p>
          </div>
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSearch={runSearch}
            isLoading={status === 'loading'}
            isDisabled={isPreloading}
          />

          {/* Disclaimer */}
          <div className="flex items-start gap-2 rounded-lg border border-amber-900/30 bg-amber-950/10 px-3.5 py-2.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber-500 mt-0.5">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4M12 17h.01"/>
            </svg>
            <p className="text-[12px] text-amber-600 leading-snug">
              <strong className="text-amber-500">Demo only.</strong>{' '}
              This tool is a prototype for evaluation purposes. Data is not guaranteed to be real-time or complete.
              Do not use for live compliance decisions.
            </p>
          </div>
        </section>

        {/* Dataset status */}
        <section aria-label="Dataset status" className="space-y-2">
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">Data Sources</p>
          <div className="flex gap-3 flex-wrap">
            <SourceStatusBadge meta={providerMeta.un} />
            <SourceStatusBadge meta={providerMeta.uae} />
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-slate-800" />

        {/* Results */}
        <section aria-label="Screening results">
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

      {/* Detail panel */}
      <DetailPanel result={selectedResult} onClose={clearSelection} />
    </div>
  );
}
