'use client';
 
import React from 'react';
import type { SearchResult } from '@/shared/types/sanctions';
import { ResultCard } from './ResultCard';
import { EmptyState } from '@/shared/ui/EmptyState';
import type { ScreeningStatus } from '@/features/screening/hooks/useScreening';

interface ResultsListProps {
  results: SearchResult[];
  status: ScreeningStatus;
  query: string;
  errorMessage?: string;
  selectedResult: SearchResult | null;
  onSelectResult: (result: SearchResult) => void;
}

const SearchIcon = () => (
  <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-sm ring-1 ring-blue-100 dark:ring-blue-900/50">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  </div>
);

const NoResultsIcon = () => (
  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M8 11h6" />
    </svg>
  </div>
);

const ErrorIcon = () => (
  <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400 mb-4 shadow-sm ring-1 ring-red-100 dark:ring-red-900/50">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  </div>
);

const SCANNING_STEPS = [
  'Connecting to secure AML data pipelines...',
  'Querying UN Consolidated Sanctions database...',
  'Cross-referencing UAE Terrorist List registry...',
  'Analyzing phonetic matches and known aliases...',
  'Computing Jaro-Winkler fuzzy match scoring...',
  'Finalizing threat vectors and compliance reports...'
];

function ScanningConsole() {
  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const intervals = [300, 350, 250, 200, 150];
    let index = 0;
    let timer: NodeJS.Timeout;
    
    const runNext = () => {
      if (index < SCANNING_STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
        const delay = intervals[index] || 200;
        index++;
        timer = setTimeout(runNext, delay);
      }
    };
    
    timer = setTimeout(runNext, 300);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 dark:bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl p-6 font-mono text-[13px] text-slate-400 space-y-4">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="text-slate-500 text-[11px] font-semibold pl-2">ComplianceOS - Sanctions Scanner v1.2</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Scanning</span>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="space-y-2.5 min-h-[160px] select-none text-left">
        {SCANNING_STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isActive = idx === currentStep;
          const isPending = idx > currentStep;

          return (
            <div
              key={step}
              className={`flex items-start gap-3 transition-opacity duration-300 ${
                isPending ? 'opacity-20' : 'opacity-100'
              }`}
            >
              <span className="shrink-0 leading-none mt-0.5">
                {isDone ? (
                  <span className="text-emerald-500 font-extrabold font-sans">✓</span>
                ) : isActive ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin shrink-0" />
                ) : (
                  <span className="text-slate-700 font-extrabold">•</span>
                )}
              </span>
              <div className="flex-1">
                <span className={`font-semibold ${
                  isDone ? 'text-slate-300' : isActive ? 'text-blue-400' : 'text-slate-600'
                }`}>
                  {step}
                </span>
                {isDone && (
                  <span className="text-emerald-500/80 text-[11px] ml-2 select-none uppercase font-bold tracking-wider">[Ready]</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-600 font-bold uppercase tracking-wider">
        <span>Fuzzy Match strictly active</span>
        <span className="animate-pulse text-blue-500/80">Securing compliance logs...</span>
      </div>
    </div>
  );
}

export function ResultsList({
  results,
  status,
  query,
  errorMessage,
  selectedResult,
  onSelectResult,
}: ResultsListProps) {
  if (status === 'idle') {
    return (
      <EmptyState
        icon={<SearchIcon />}
        title="Ready to Scan"
        description="Search across UN Consolidated and UAE Terrorist lists instantly."
      />
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <ScanningConsole />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <EmptyState
        icon={<ErrorIcon />}
        title="Scan Interrupted"
        description={errorMessage ?? 'An error occurred while connecting to the data sources. Please try again.'}
      />
    );
  }

  if (status === 'empty') {
    return (
      <EmptyState
        icon={<NoResultsIcon />}
        title="No matches found"
        description={`We couldn't find any exact or partial matches for "${query}".`}
      />
    );
  }

  return (
    <div className="space-y-4" role="list" aria-label="Sanctions screening results">
      {/* Results header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <p className="text-[15px] text-slate-500 dark:text-slate-400">
          Found <span className="text-slate-900 dark:text-slate-100 font-bold">{results.length}</span> result{results.length !== 1 ? 's' : ''} for{' '}
          <span className="text-slate-900 dark:text-slate-100 font-semibold">&quot;{query}&quot;</span>
        </p>
        <p className="text-[13px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sorted by Relevance</p>
      </div>

      {results.map((result, idx) => (
        <ResultCard
          key={result.record.id}
          result={result}
          rank={idx + 1}
          isSelected={selectedResult?.record.id === result.record.id}
          onSelect={onSelectResult}
          query={query}
        />
      ))}
    </div>
  );
}
