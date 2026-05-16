/**
 * Screening Search Service
 *
 * Orchestrates loading from both providers, runs Fuse.js fuzzy search
 * across name + aliases, and returns merged ranked results.
 *
 * Architecture note: This service knows about providers but not about UI.
 * It can be replaced with an API call to a backend search endpoint without
 * changing any component code.
 */

import Fuse, { type IFuseOptions } from 'fuse.js';
import type { SanctionRecord, SearchResult, MatchType } from '@/shared/types/sanctions';
import type { ProviderMetadata } from '@/shared/types/sanctions';
import { UNListProvider } from '@/providers/un/UNListProvider';
import { UAEListProvider } from '@/providers/uae/UAEListProvider';

// ─── Fuse.js Configuration ────────────────────────────────────────────────────
// Keys are weighted so name matches rank higher than alias or remarks matches.
const FUSE_OPTIONS: IFuseOptions<SanctionRecord> = {
  keys: [
    { name: 'name', weight: 0.5 },
    { name: 'aliases', weight: 0.35 },
    { name: 'program', weight: 0.05 },
    { name: 'remarks', weight: 0.05 },
    { name: 'nationality', weight: 0.05 },
  ],
  threshold: 0.4,          // 0 = exact, 1 = anything. 0.4 is permissive but not noisy.
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true,    // Match anywhere in the string, not just at the start
  useExtendedSearch: false,
};

// ─── Match type classification ────────────────────────────────────────────────

function classifyMatch(query: string, record: SanctionRecord, score: number): MatchType {
  const q = query.toLowerCase().trim();
  const name = record.name.toLowerCase();
  if (name === q) return 'Exact';
  if (record.aliases.some(a => a.toLowerCase() === q)) return 'Alias';
  return 'Similar';
}

// ─── Service Functions ────────────────────────────────────────────────────────

let unRecords: SanctionRecord[] | null = null;
let uaeRecords: SanctionRecord[] | null = null;

/**
 * Load both data sources. Called on app init so the first search is fast.
 * Subsequent calls are cheap (cached).
 */
export async function preloadProviders(): Promise<void> {
  const [un, uae] = await Promise.allSettled([
    UNListProvider.load(),
    UAEListProvider.load(),
  ]);

  if (un.status === 'fulfilled') unRecords = un.value;
  if (uae.status === 'fulfilled') uaeRecords = uae.value;
}

/**
 * Search both datasets with the given query.
 * Returns merged results sorted by relevance score (highest first).
 */
export async function search(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  // Load providers if not yet loaded
  if (!unRecords) {
    try { unRecords = await UNListProvider.load(); } catch { unRecords = []; }
  }
  if (!uaeRecords) {
    try { uaeRecords = await UAEListProvider.load(); } catch { uaeRecords = []; }
  }

  const allRecords = [...(unRecords ?? []), ...(uaeRecords ?? [])];
  if (allRecords.length === 0) return [];

  const fuse = new Fuse(allRecords, FUSE_OPTIONS);
  const fuseResults = fuse.search(query);

  return fuseResults.map((result): SearchResult => {
    const rawScore = result.score ?? 1;
    // Fuse score is 0 (perfect) to 1 (no match). Invert for display.
    const score = parseFloat((1 - rawScore).toFixed(3));
    return {
      record: result.item,
      score,
      matchType: classifyMatch(query, result.item, score),
    };
  });
}

/**
 * Get current metadata for both providers without triggering a load.
 */
export function getProviderMetadata(): { un: ProviderMetadata; uae: ProviderMetadata } {
  return {
    un: UNListProvider.getMetadata(),
    uae: UAEListProvider.getMetadata(),
  };
}

/**
 * Force refresh both providers (clears caches).
 */
export async function refreshProviders(): Promise<void> {
  unRecords = null;
  uaeRecords = null;
  UNListProvider.clearCache();
  UAEListProvider.clearCache();
  await preloadProviders();
}
