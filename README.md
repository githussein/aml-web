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
- **Search Scoring:** Integrated via `Fuse.js` configured with `JaroWinkler` distance thresholds to handle spelling errors, phonetic overlaps, and aliases.
- **Latency:** Sub-15 ms indexing and retrieval logic entirely client-side.
- **Strictness Level:** Strict compliance filters customizable directly in the matching service layer.

### Client-Side Compliance Reports
- Direct exporting of matching profiles using `jsPDF`.
- Embeds metadata details, search context, and list indicators in structured layouts.
- Designed to run offline without backend-dependent report engines.
