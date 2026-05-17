'use client';

import React from 'react';
import type { SearchResult } from '@/shared/types/sanctions';
import { ResultCard } from './ResultCard';
import { Spinner } from '@/shared/ui/Spinner';
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
  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shadow-sm ring-1 ring-blue-100">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  </div>
);

const NoResultsIcon = () => (
  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-sm ring-1 ring-slate-200">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M8 11h6" />
    </svg>
  </div>
);

const ErrorIcon = () => (
  <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-4 shadow-sm ring-1 ring-red-100">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  </div>
);

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
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-slate-500 animate-pulse">Scanning watchlists...</p>
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
    <div className="space-y-3" role="list" aria-label="Sanctions screening results">
      {/* Results header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <p className="text-[13px] text-slate-500">
          Found <span className="text-slate-900 font-bold">{results.length}</span> result{results.length !== 1 ? 's' : ''} for{' '}
          <span className="text-slate-900 font-semibold">"{query}"</span>
        </p>
        <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Sorted by Relevance</p>
      </div>

      {results.map((result, idx) => (
        <ResultCard
          key={result.record.id}
          result={result}
          rank={idx + 1}
          isSelected={selectedResult?.record.id === result.record.id}
          onSelect={onSelectResult}
        />
      ))}
    </div>
  );
}
