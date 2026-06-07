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
    <form onSubmit={handleSubmit} className="w-full relative group" noValidate>
      {/* Subtle backdrop shadow for the search bar */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-500" />
      
      <div className="relative flex bg-white dark:bg-slate-900 rounded-full p-1.5 shadow-sm ring-1 ring-slate-900/5 dark:ring-slate-700 hover:ring-slate-900/10 dark:hover:ring-slate-600 focus-within:!ring-blue-500 dark:focus-within:!ring-blue-500 focus-within:!ring-2 transition-all">
        <div className="flex-1 relative flex items-center">
          <div className="absolute left-5 text-slate-400 dark:text-slate-500 pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            placeholder="Search by entity name or alias..."
            aria-label="Search sanctions lists"
            className="w-full pl-12 pr-4 py-3.5 bg-transparent text-slate-900 dark:text-slate-100 text-[15px] font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal focus:outline-none disabled:opacity-50"
          />
        </div>
        <button
          id="sanctions-search-button"
          type="submit"
          disabled={isLoading || isDisabled || !query.trim()}
          aria-label="Run sanctions search"
          className="px-8 py-3.5 rounded-full text-[15px] font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-[2.5px] border-white/30 border-t-white animate-spin" />
              <span>Scanning</span>
            </>
          ) : (
            <>
              <span>Scan</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
