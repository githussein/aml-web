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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
