# ComplianceOS — Sanctions Screening

> **Enterprise Prototype** · Real-time AML name screening against the UN Security Council Consolidated List and the UAE Terrorist List.

ComplianceOS is a Next.js web application that lets compliance teams instantly screen individuals and entities against two authoritative sanctions databases. It uses [Fuse.js](https://www.fusejs.io/) with Jaro-Winkler scoring for sub-15 ms fuzzy matching, and generates downloadable PDF compliance reports via jsPDF.


## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) + React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Fuzzy search | [Fuse.js 7](https://www.fusejs.io/) — Jaro-Winkler algorithm |
| Data parsing | [PapaParse](https://www.papaparse.com/) — CSV stream parsing |
| PDF export | [jsPDF](https://github.com/parallax/jsPDF) — client-side report generation |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) — dark / light mode |

## Getting Started


First, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The main screening interface lives in `features/screening/ScreeningPage.tsx` and hot-reloads as you edit.


## Project Structure

```text
├── app/                  # Next.js App Router configuration and routes
├── features/             # Feature-specific modules (domain logic)
│   └── screening/        # Screening search page, components, and hooks
├── shared/               # Shared UI elements, typescript types, and utility functions
└── providers/            # React context providers (e.g., ThemeProvider)
```

## Key Features

### Fuzzy Matching Engine
- **Search Scoring**: Powered by [Fuse.js](https://www.fusejs.io/) using the **Jaro-Winkler distance** algorithm.
- **Search Parameters**:
  - **Strictness**: Configured with a threshold of `0.25` (lower thresholds require closer matches to minimize noisy results).
  - **Field Weights**: Primary name matching is weighted at `0.7`, and alias matching is weighted at `0.5`.
  - **Minimum Length**: Requires a minimum query length of `3` characters.
  - **Cutoff Filter**: Only results with an inverted similarity score of $\ge 40\%$ (`0.4`) are shown.
- **Latency**: Sub-15 ms indexing and matching, executed entirely client-side.

### Dual Data Sources
- **UN Consolidated List**:
  - Fetched from the [UN Security Council Consolidated List](https://scsanctions.un.org/resources/xml/en/name/consolidated.xml).
  - Proxied server-side via `app/api/un-sanctions/route.ts` to bypass browser CORS restrictions.
  - Parsed on-the-fly using browser DOMParser and cached in `localStorage` for 24 hours.
- **UAE Terrorist List**:
  - Parsed from a local static asset [uae-terrorist-list.csv](file:///Users/mhussein/Develop/aml-web/public/data/uae-terrorist-list.csv) using `PapaParse`.
  - Normalizes Arabic classifications into `Individual` (`شخص إرهابي`) vs. `Entity` (`كيان إرهابي`), with smart fallback rules for English/Arabic names.

### Client-Side Compliance Reports
- Direct exporting of matching profiles using `jsPDF`.
- Embeds metadata details, query context, timestamp, matching score, list origin, and identifier documents (Passports, National IDs) in structured layouts.
- Designed to run offline without backend-dependent report engines.
