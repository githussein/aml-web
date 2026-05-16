/**
 * API Route: UN Sanctions XML Proxy
 *
 * Proxies the UN Consolidated Sanctions XML file server-side to avoid
 * browser CORS restrictions. This is the only backend code in Phase 1.
 *
 * When migrating to a real backend, replace this with a call to your
 * own API endpoint and update UNListProvider to point to it.
 */

import { NextResponse } from 'next/server';

const UN_XML_URL = 'https://scsanctions.un.org/resources/xml/en/name/consolidated.xml';

export async function GET() {
  try {
    const response = await fetch(UN_XML_URL, {
      headers: {
        'User-Agent': 'AML-Screening-Demo/1.0 (prototype)',
        'Accept': 'application/xml, text/xml, */*',
      },
      // No caching at the HTTP level — we cache in localStorage on the client
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `UN source returned HTTP ${response.status}` },
        { status: 502 }
      );
    }

    const xmlText = await response.text();

    return new NextResponse(xmlText, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        // Allow browser to cache this response for 1 hour
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[UN proxy] Fetch failed:', message);
    return NextResponse.json(
      { error: `Failed to fetch UN sanctions data: ${message}` },
      { status: 502 }
    );
  }
}
