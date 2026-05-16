/**
 * Contract interface that every data provider must implement.
 * Implementing this interface means the rest of the app is completely
 * source-agnostic. Swap a provider for an API call and nothing else changes.
 */
import type { SanctionRecord, ProviderMetadata } from './sanctions';

export interface SanctionListProvider {
  /**
   * Load (or return cached) records from this provider's data source.
   */
  load(): Promise<SanctionRecord[]>;

  /**
   * Return current metadata (status, record count, load time, etc.)
   * without triggering a new load.
   */
  getMetadata(): ProviderMetadata;

  /**
   * Clear any cached data and force a fresh fetch on the next load().
   */
  clearCache(): void;
}
