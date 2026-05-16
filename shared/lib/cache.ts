/**
 * localStorage-backed cache with TTL support.
 * Used for caching UN sanctions data between browser sessions.
 * Replace this module with an API call layer when moving to a backend.
 */

interface CacheEntry<T> {
  data: T;
  cachedAt: string;  // ISO timestamp
  expiresAt: string; // ISO timestamp
}

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export function cacheGet<T>(key: string): { data: T; cachedAt: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > new Date(entry.expiresAt).getTime()) {
      localStorage.removeItem(key);
      return null;
    }
    return { data: entry.data, cachedAt: entry.cachedAt };
  } catch {
    return null;
  }
}

export function cacheSet<T>(key: string, data: T, ttlMs = DEFAULT_TTL_MS): void {
  if (typeof window === 'undefined') return;
  try {
    const now = new Date();
    const entry: CacheEntry<T> = {
      data,
      cachedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + ttlMs).toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Storage full or unavailable — fail silently
    console.warn('[cache] Failed to write to localStorage:', key);
  }
}

export function cacheClear(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}
