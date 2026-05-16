/**
 * String normalization utilities for fuzzy matching.
 * Centralizing here makes it easy to upgrade matching logic without
 * touching provider or search service code.
 */

/**
 * Normalize a string for comparison:
 * - Lowercase
 * - Remove diacritics / accents (NFD decomposition + strip combining chars)
 * - Trim whitespace
 * - Collapse multiple spaces
 */
export function normalizeString(input: string): string {
  if (!input) return '';
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // strip combining diacritics
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Normalize an Arabic string: strip diacritics (tashkeel), normalize
 * alef variants, and lowercase equivalent transforms.
 */
export function normalizeArabic(input: string): string {
  if (!input) return '';
  return input
    // Strip Arabic tashkeel (diacritics)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize alef variants → alef
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    // Normalize alef maqsura → ya
    .replace(/\u0649/g, '\u064A')
    // Normalize teh marbuta → ha
    .replace(/\u0629/g, '\u0647')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Return a display-safe truncated string with ellipsis.
 */
export function truncate(input: string, maxLength: number): string {
  if (!input) return '';
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength).trim() + '…';
}
