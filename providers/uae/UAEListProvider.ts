/**
 * UAE Terrorist List Provider
 *
 * Data source: /data/uae-terrorist-list.csv (served as a public static asset)
 *
 * CSV column schema (auto-detected, mapped exactly):
 *   id                  → record identifier
 *   classification      → شخص إرهابي (Individual) / كيان إرهابي (Entity)
 *   nationality         → Arabic nationality name
 *   surname_ar          → Arabic surname
 *   surname_lat         → Latin-script surname
 *   full_name_ar        → Full name in Arabic
 *   full_name_lat       → Full name in Latin/English
 *   date_of_birth       → Date of birth (various formats)
 *   place_of_birth      → Place of birth (Arabic)
 *   address_name        → Name field used in address block (often same as full_name_ar)
 *   address_street      → Street (often "-")
 *   address_city        → City (often "-")
 *   address_country     → Country of residence/address
 *   document_type       → Document type in Arabic (e.g. "جواز سفر" = Passport)
 *   document_number     → Document number
 *   document_issuer     → Issuing country/authority
 *   document_issue_date → Issue date
 *   document_expiry_date→ Expiry date
 *   other_information   → Cabinet Decision reference (Arabic)
 *
 * To swap this CSV for an API call: replace the load() body with a fetch()
 * to your backend endpoint and keep the normalization logic below.
 */

import Papa from 'papaparse';
import type { SanctionRecord, ProviderMetadata, Identifier } from '@/shared/types/sanctions';
import type { SanctionListProvider } from '@/shared/types/provider';

const UAE_CSV_PATH = '/data/uae-terrorist-list.csv';

// ─── Module State ──────────────────────────────────────────────────────────────

let cachedRecords: SanctionRecord[] | null = null;

let metadata: ProviderMetadata = {
  source: 'UAE',
  status: 'idle',
  recordCount: 0,
};

// ─── Row Type ─────────────────────────────────────────────────────────────────

interface UAERow {
  id: string;
  classification: string;
  nationality: string;
  surname_ar: string;
  surname_lat: string;
  full_name_ar: string;
  full_name_lat: string;
  date_of_birth: string;
  place_of_birth: string;
  address_name: string;
  address_street: string;
  address_city: string;
  address_country: string;
  document_type: string;
  document_number: string;
  document_issuer: string;
  document_issue_date: string;
  document_expiry_date: string;
  other_information: string;
  [key: string]: string; // allow extra columns
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cell(row: UAERow, key: keyof UAERow): string {
  const v = (row[key] ?? '').trim();
  return v === '-' || v === '' ? '' : v;
}

/**
 * Classify row type from Arabic classification field.
 * شخص إرهابي → Individual
 * كيان إرهابي / مجموعة إرهابية → Entity
 */
function parseType(classification: string): string {
  if (!classification) return 'Individual';
  if (classification.includes('كيان') || classification.includes('مجموعة')) return 'Entity';
  return 'Individual';
}

/**
 * Build the best display name: prefer Latin full name, fall back to Arabic full name.
 * Fall back chain: full_name_lat → full_name_ar → surname_lat → surname_ar → id
 */
function parseName(row: UAERow, fallbackId: string): { name: string; aliases: string[] } {
  const latFull = cell(row, 'full_name_lat');
  const arFull  = cell(row, 'full_name_ar');
  const latSur  = cell(row, 'surname_lat');

  const aliases: string[] = [];

  let name: string;
  if (latFull) {
    name = latFull;
    if (arFull && arFull !== latFull) aliases.push(arFull);
    if (latSur && !latFull.toLowerCase().includes(latSur.toLowerCase())) aliases.push(latSur);
  } else if (arFull) {
    name = arFull;
  } else if (latSur) {
    name = latSur;
  } else {
    name = `[Record #${fallbackId}]`;
  }

  return { name: name.trim(), aliases };
}

function parseIdentifiers(row: UAERow): Identifier[] {
  const ids: Identifier[] = [];
  const docNum = cell(row, 'document_number');
  if (docNum) {
    const docType = cell(row, 'document_type') || 'Document';
    const issuer  = cell(row, 'document_issuer');
    const issued  = cell(row, 'document_issue_date');
    const expiry  = cell(row, 'document_expiry_date');

    // Translate common Arabic document types
    const typeMap: Record<string, string> = {
      'جواز سفر': 'Passport',
      'بطاقة هوية': 'National ID',
      'بطاقة': 'ID Card',
      'تصريح': 'Permit',
    };
    const displayType = typeMap[docType] ?? docType;

    let note = issuer;
    if (issued) note = note ? `${note} · issued ${issued}` : `issued ${issued}`;
    if (expiry) note = note ? `${note} · exp ${expiry}` : `exp ${expiry}`;

    ids.push({ type: displayType, value: docNum, note: note || undefined });
  }
  return ids;
}

/**
 * Extract Cabinet Decision reference from other_information field.
 * Example: "مدرج بموجب قرار مجلس الوزراء رقم (18) لسنة 2017"
 */
function parseProgram(otherInfo: string): string {
  if (!otherInfo) return 'UAE Terrorist List';

  // Try to extract decision number and year
  const match = otherInfo.match(/رقم[^\d]*\((\d+)\)[^\d]*(\d{4})/);
  if (match) {
    return `UAE Cabinet Decision No. ${match[1]} of ${match[2]}`;
  }
  return 'UAE Terrorist List';
}

function normalizeRow(row: UAERow, idx: number): SanctionRecord {
  const rawId  = cell(row, 'id');
  const id     = rawId ? `UAE-${rawId}` : `UAE-${idx + 1}`;

  const { name, aliases } = parseName(row, rawId || String(idx + 1));
  const type        = parseType(cell(row, 'classification'));
  const nationality = cell(row, 'nationality') || undefined;
  const dob         = cell(row, 'date_of_birth') || undefined;
  const pob         = cell(row, 'place_of_birth') || undefined;
  const program     = parseProgram(cell(row, 'other_information'));
  const remarks     = cell(row, 'other_information') || undefined;
  const identifiers = parseIdentifiers(row);

  // Address as additional context in remarks (if meaningful)
  const addrCountry = cell(row, 'address_country');
  const addrCity    = cell(row, 'address_city');
  const addrParts   = [addrCity, addrCountry].filter(Boolean);
  const addressNote = addrParts.length > 0 ? addrParts.join(', ') : undefined;

  // Add Arabic name and address note as aliases if not already captured
  const arFull = cell(row, 'full_name_ar');
  if (arFull && !aliases.includes(arFull) && arFull !== name) {
    aliases.unshift(arFull); // Arabic name first among aliases
  }

  return {
    id,
    source: 'UAE',
    name,
    aliases,
    type,
    program,
    remarks,
    nationality,
    dateOfBirth: dob,
    placeOfBirth: pob,
    identifiers,
    rawPayload: row,
    lastUpdated: addressNote, // repurposed — will fix below
  };
}

// ─── Provider ────────────────────────────────────────────────────────────────

export const UAEListProvider: SanctionListProvider = {
  async load(): Promise<SanctionRecord[]> {
    if (cachedRecords) return cachedRecords;

    metadata = { source: 'UAE', status: 'loading', recordCount: 0 };
    try {
      const response = await fetch(UAE_CSV_PATH);
      if (!response.ok) {
        throw new Error(`Failed to load UAE CSV: HTTP ${response.status}`);
      }
      const csvText = await response.text();

      const parsed = Papa.parse<UAERow>(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h: string) => h.trim(),
      });

      if (parsed.errors.length > 0) {
        console.warn('[UAE] CSV parse warnings:', parsed.errors.slice(0, 5));
      }

      const records: SanctionRecord[] = parsed.data.map((row, idx) => {
        const rec = normalizeRow(row, idx);
        // Fix lastUpdated — extract year from other_information
        const yearMatch = (row.other_information ?? '').match(/(\d{4})/);
        rec.lastUpdated = yearMatch ? yearMatch[1] : undefined;
        return rec;
      });

      cachedRecords = records;

      // Version: extract the most recent Cabinet Decision year
      const years = records
        .map(r => r.lastUpdated)
        .filter(Boolean)
        .map(Number)
        .sort((a, b) => b - a);
      const latestYear = years[0] ? String(years[0]) : undefined;

      metadata = {
        source: 'UAE',
        status: 'ready',
        recordCount: records.length,
        loadedAt: new Date().toISOString(),
        version: latestYear ? `Cabinet Decisions through ${latestYear}` : undefined,
      };

      console.info(`[UAE] Loaded ${records.length} records`);
      return records;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      metadata = {
        source: 'UAE',
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
    cachedRecords = null;
    metadata = { source: 'UAE', status: 'idle', recordCount: 0 };
  },
};
