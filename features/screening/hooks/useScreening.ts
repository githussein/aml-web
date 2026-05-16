'use client';

/**
 * useScreening — Central hook for the screening feature.
 *
 * Encapsulates all state and side-effects for the search flow.
 * Components only interact with this hook — they never import providers
 * or services directly.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { SearchResult, ProviderMetadata } from '@/shared/types/sanctions';
import {
  search,
  preloadProviders,
  getProviderMetadata,
  refreshProviders,
} from '@/features/screening/services/searchService';

export type ScreeningStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface ScreeningState {
  query: string;
  results: SearchResult[];
  status: ScreeningStatus;
  errorMessage?: string;
  selectedResult: SearchResult | null;
  providerMeta: { un: ProviderMetadata; uae: ProviderMetadata };
  isPreloading: boolean;
}

export interface ScreeningActions {
  setQuery: (q: string) => void;
  runSearch: (q?: string) => Promise<void>;
  selectResult: (result: SearchResult) => void;
  clearSelection: () => void;
  refresh: () => Promise<void>;
}

export function useScreening(): ScreeningState & ScreeningActions {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<ScreeningStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [providerMeta, setProviderMeta] = useState<{ un: ProviderMetadata; uae: ProviderMetadata }>({
    un: { source: 'UN', status: 'idle', recordCount: 0 },
    uae: { source: 'UAE', status: 'idle', recordCount: 0 },
  });
  const [isPreloading, setIsPreloading] = useState(true);

  // Abort controller for cancelling in-flight searches
  const searchAbortRef = useRef<AbortController | null>(null);

  // Preload providers on mount
  useEffect(() => {
    setIsPreloading(true);
    preloadProviders()
      .catch(console.error)
      .finally(() => {
        setProviderMeta(getProviderMetadata());
        setIsPreloading(false);
      });
  }, []);

  const runSearch = useCallback(async (overrideQuery?: string) => {
    const q = (overrideQuery ?? query).trim();
    if (!q) return;

    // Cancel any previous in-flight search
    searchAbortRef.current?.abort();
    searchAbortRef.current = new AbortController();

    setStatus('loading');
    setResults([]);
    setSelectedResult(null);
    setErrorMessage(undefined);

    try {
      const found = await search(q);
      setResults(found);
      setStatus(found.length === 0 ? 'empty' : 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Search failed. Please try again.';
      setErrorMessage(msg);
      setStatus('error');
    } finally {
      setProviderMeta(getProviderMetadata());
    }
  }, [query]);

  const selectResult = useCallback((result: SearchResult) => {
    setSelectedResult(result);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedResult(null);
  }, []);

  const refresh = useCallback(async () => {
    setIsPreloading(true);
    setStatus('idle');
    setResults([]);
    setSelectedResult(null);
    try {
      await refreshProviders();
    } finally {
      setProviderMeta(getProviderMetadata());
      setIsPreloading(false);
    }
  }, []);

  return {
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
  };
}
