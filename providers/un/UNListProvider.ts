/**
 * UN Consolidated Sanctions List Provider
 *
 * Data source: https://scsanctions.un.org/resources/xml/en/name/consolidated.xml
 *
 * Architecture note: This module is the only place in the app that knows about
 * the UN XML format. Replacing this with an API call only requires changing
 * this file — no other code changes needed.
 */

import type { SanctionRecord, ProviderMetadata, Identifier } from '@/shared/types/sanctions';
import type { SanctionListProvider } from '@/shared/types/provider';
import { cacheGet, cacheSet, cacheClear } from '@/shared/lib/cache';

// Uses local Next.js API proxy to avoid browser CORS restrictions.
// To migrate to a real backend: update this URL to your backend endpoint.
const UN_XML_URL = '/api/un-sanctions';
const CACHE_KEY = 'aml_un_sanctions_v1';

let metadata: ProviderMetadata = {
  source: 'UN',
  status: 'idle',
  recordCount: 0,
};

// ─── XML Parsing Helpers ─────────────────────────────────────────────────────

function getText(el: Element, tag: string): string {
  return el.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';
}

function getAttr(el: Element, tag: string, attr: string): string {
  return el.getElementsByTagName(tag)[0]?.getAttribute(attr)?.trim() ?? '';
}

function getAllElements(el: Element, tag: string): Element[] {
  return Array.from(el.getElementsByTagName(tag));
}

function parseAliases(individual: Element): string[] {
  const aliases: string[] = [];
  const aliasEls = getAllElements(individual, 'ALIAS');
  for (const a of aliasEls) {
    const quality = a.getAttribute('QUALITY') ?? '';
    const name = getText(a, 'ALIAS_NAME');
    if (name && quality !== 'Bad') {
      aliases.push(name);
    }
  }
  return aliases;
}

function parseIdentifiers(individual: Element): Identifier[] {
  const ids: Identifier[] = [];
  const docEls = getAllElements(individual, 'INDIVIDUAL_DOCUMENT');
  for (const doc of docEls) {
    const type = getText(doc, 'TYPE_OF_DOCUMENT');
    const number = getText(doc, 'NUMBER');
    const country = getText(doc, 'ISSUING_COUNTRY');
    if (number) {
      ids.push({
        type: type || 'Document',
        value: number,
        note: country || undefined,
      });
    }
  }
  // Passports
  const passportEls = getAllElements(individual, 'INDIVIDUAL_PASSPORT');
  for (const p of passportEls) {
    const number = getText(p, 'NUMBER');
    const country = getText(p, 'COUNTRY_OF_ISSUE');
    if (number) {
      ids.push({
        type: 'Passport',
        value: number,
        note: country || undefined,
      });
    }
  }
  return ids;
}

function parseNationalities(individual: Element): string {
  const nats = getAllElements(individual, 'INDIVIDUAL_NATIONALITY');
  return nats.map(n => getText(n, 'NATIONALITY')).filter(Boolean).join(', ');
}

function parseIndividual(el: Element, listVersion: string): SanctionRecord {
  const id = el.getAttribute('DATAID') ?? crypto.randomUUID();
  const firstName = getText(el, 'FIRST_NAME');
  const secondName = getText(el, 'SECOND_NAME');
  const thirdName = getText(el, 'THIRD_NAME');
  const fourthName = getText(el, 'FOURTH_NAME');
  const name = [firstName, secondName, thirdName, fourthName].filter(Boolean).join(' ');

  const aliases = parseAliases(el);
  const nationality = parseNationalities(el);
  const dobEl = el.getElementsByTagName('INDIVIDUAL_DATE_OF_BIRTH')[0];
  const dateOfBirth = dobEl ? getText(dobEl, 'DATE') || getText(dobEl, 'YEAR') : '';
  const pobEl = el.getElementsByTagName('INDIVIDUAL_PLACE_OF_BIRTH')[0];
  const placeOfBirth = pobEl ? getText(pobEl, 'CITY') || getText(pobEl, 'COUNTRY') : '';

  const remarks = getText(el, 'COMMENTS1');
  const program = getAttr(el, 'UN_LIST_TYPE', 'VALUE') || getText(el, 'UN_LIST_TYPE');

  return {
    id: `UN-${id}`,
    source: 'UN',
    name,
    aliases,
    type: 'Individual',
    program: program || 'UN Consolidated List',
    remarks,
    nationality,
    dateOfBirth,
    placeOfBirth,
    identifiers: parseIdentifiers(el),
    rawPayload: el.outerHTML,
    lastUpdated: listVersion,
  };
}

function parseEntity(el: Element, listVersion: string): SanctionRecord {
  const id = el.getAttribute('DATAID') ?? crypto.randomUUID();
  const name = getText(el, 'FIRST_NAME');
  const aliases = parseAliases(el);
  const remarks = getText(el, 'COMMENTS1');
  const program = getAttr(el, 'UN_LIST_TYPE', 'VALUE') || getText(el, 'UN_LIST_TYPE');

  return {
    id: `UN-${id}`,
    source: 'UN',
    name,
    aliases,
    type: 'Entity',
    program: program || 'UN Consolidated List',
    remarks,
    identifiers: [],
    rawPayload: el.outerHTML,
    lastUpdated: listVersion,
  };
}

function parseXML(xmlText: string): SanctionRecord[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'application/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error(`UN XML parse error: ${parseError.textContent}`);
  }

  // Extract list version/date from root element attributes
  const root = doc.documentElement;
  const listVersion =
    root.getAttribute('dateGenerated') ||
    root.getAttribute('Date') ||
    new Date().toISOString().split('T')[0];

  const records: SanctionRecord[] = [];

  const individuals = getAllElements(doc.documentElement, 'INDIVIDUAL');
  for (const ind of individuals) {
    try {
      records.push(parseIndividual(ind, listVersion));
    } catch (e) {
      console.warn('[UN] Skipped individual:', e);
    }
  }

  const entities = getAllElements(doc.documentElement, 'ENTITY');
  for (const ent of entities) {
    try {
      records.push(parseEntity(ent, listVersion));
    } catch (e) {
      console.warn('[UN] Skipped entity:', e);
    }
  }

  return records;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export const UNListProvider: SanctionListProvider = {
  async load(): Promise<SanctionRecord[]> {
    // Return from cache if available
    const cached = cacheGet<SanctionRecord[]>(CACHE_KEY);
    if (cached) {
      metadata = {
        source: 'UN',
        status: 'ready',
        recordCount: cached.data.length,
        loadedAt: cached.cachedAt,
        version: cached.data[0]?.lastUpdated ?? undefined,
      };
      return cached.data;
    }

    // Fetch fresh data
    metadata = { source: 'UN', status: 'loading', recordCount: 0 };
    try {
      const response = await fetch(UN_XML_URL);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const xmlText = await response.text();
      const records = parseXML(xmlText);

      const now = new Date().toISOString();
      cacheSet(CACHE_KEY, records);

      metadata = {
        source: 'UN',
        status: 'ready',
        recordCount: records.length,
        loadedAt: now,
        version: records[0]?.lastUpdated ?? undefined,
      };
      return records;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      metadata = {
        source: 'UN',
        status: 'error',
        recordCount: 0,
        error: message,
      };
      throw err;
    }
  },

  getMetadata(): ProviderMetadata {
    return { ...metadata };
  },

  clearCache(): void {
    cacheClear(CACHE_KEY);
    metadata = { source: 'UN', status: 'idle', recordCount: 0 };
  },
};
