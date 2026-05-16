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
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const NoResultsIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
    <path d="M8 11h6" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
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
        title="Enter a name to begin screening"
        description="Search across UN Consolidated and UAE Terrorist lists simultaneously."
      />
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" label="Searching both datasets…" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <EmptyState
        icon={<ErrorIcon />}
        title="Search failed"
        description={errorMessage ?? 'An error occurred. Please try again.'}
      />
    );
  }

  if (status === 'empty') {
    return (
      <EmptyState
        icon={<NoResultsIcon />}
        title={`No matches found for "${query}"`}
        description="Try a different spelling, partial name, or alias."
      />
    );
  }

  return (
    <div className="space-y-1.5" role="list" aria-label="Sanctions screening results">
      {/* Results header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-500">
          <span className="text-slate-300 font-medium">{results.length}</span> result{results.length !== 1 ? 's' : ''} for{' '}
          <span className="text-slate-300">"{query}"</span>
        </p>
        <p className="text-[11px] text-slate-600">Sorted by relevance</p>
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
