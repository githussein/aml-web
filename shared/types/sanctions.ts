/**
 * Shared domain types for AML sanctions screening.
 * These types are source-agnostic — all providers must normalize to these shapes.
 */

export type SanctionSource = 'UN' | 'UAE';

export type MatchType = 'Exact' | 'Alias' | 'Similar';

export interface Identifier {
  type: string;
  value: string;
  note?: string;
}

/**
 * Normalized internal record shared by all sanction list providers.
 * rawPayload holds the original parsed data for full-detail display.
 */
export interface SanctionRecord {
  id: string;
  source: SanctionSource;
  name: string;
  aliases: string[];
  type?: string;           // e.g. "Individual" | "Entity"
  program?: string;        // Sanctions program or UAE category
  remarks?: string;
  nationality?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  identifiers: Identifier[];
  rawPayload: unknown;
  lastUpdated?: string;    // ISO date string
}

export interface SearchResult {
  record: SanctionRecord;
  score: number;           // 0–1, higher = more relevant
  matchType: MatchType;
}

export interface ProviderMetadata {
  source: SanctionSource;
  status: 'idle' | 'loading' | 'ready' | 'error';
  recordCount: number;
  loadedAt?: string;       // ISO timestamp
  version?: string;        // e.g. CSV date or UN list version
  error?: string;
}
