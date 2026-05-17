'use client';

import React from 'react';
import { useScreening } from '@/features/screening/hooks/useScreening';
import { SearchBar } from '@/features/screening/components/SearchBar';
import { ResultsList } from '@/features/screening/components/ResultsList';
import { DetailPanel } from '@/features/screening/components/DetailPanel';
import { SourceStatusBadge } from '@/features/screening/components/SourceStatusBadge';
import { Badge } from '@/shared/ui/Badge';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100">

      {/* Top Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm dark:shadow-none">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* SaaS Logo Mark */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-inner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                Compliance<span className="text-blue-600 dark:text-blue-500">OS</span>
              </h1>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-none mt-1">Sanctions Screening</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge label="Prototype" variant="demo" size="md" />
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
            <ThemeToggle />
            <button
              id="refresh-datasets-button"
              onClick={refresh}
              disabled={isPreloading}
              title="Reload datasets"
              className="group flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-40"
            >
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-500 ${isPreloading ? 'animate-spin' : ''}`}
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
              {isPreloading ? 'Syncing...' : 'Sync Data'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* Hero Search Section */}
        <section aria-label="Sanctions name search" className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Entity Screening
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Scan individuals and entities across the UN Security Council Consolidated List and the UAE Terrorist List in real-time.
            </p>
          </div>
          
          <div className="w-full max-w-2xl">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              onSearch={runSearch}
              isLoading={status === 'loading'}
              isDisabled={isPreloading}
            />
          </div>
        </section>

        {/* Dataset Status Cards */}
        <section aria-label="Dataset status" className="max-w-2xl mx-auto">
          <div className="flex gap-4 justify-center flex-wrap">
            <SourceStatusBadge meta={providerMeta.un} />
            <SourceStatusBadge meta={providerMeta.uae} />
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

      <DetailPanel result={selectedResult} onClose={clearSelection} />
    </div>
  );
}
