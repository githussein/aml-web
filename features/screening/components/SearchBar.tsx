'use client';

import React, { useRef, useEffect } from 'react';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSearch: (q: string) => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

export function SearchBar({ query, onQueryChange, onSearch, isLoading, isDisabled }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      onSearch(query);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="flex gap-2 items-stretch">
        <div className="relative flex-1">
          {/* Search icon */}
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            ref={inputRef}
            id="sanctions-search-input"
            type="search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            placeholder="Search by name, alias, or partial keyword…"
            aria-label="Search sanctions lists"
            className={`
              w-full pl-10 pr-4 py-3 rounded-lg text-sm
              bg-slate-900 border border-slate-700
              text-slate-100 placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            `}
          />
        </div>
        <button
          id="sanctions-search-button"
          type="submit"
          disabled={isLoading || isDisabled || !query.trim()}
          aria-label="Run sanctions search"
          className={`
            px-5 py-3 rounded-lg text-sm font-semibold
            bg-blue-600 text-white
            hover:bg-blue-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors
            flex items-center gap-2 whitespace-nowrap
          `}
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Searching…
            </>
          ) : 'Search'}
        </button>
      </div>
    </form>
  );
}
