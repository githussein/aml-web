'use client';

import React, { useState } from 'react';
import type { SearchResult } from '@/shared/types/sanctions';
import { buildReportData, generateAndDownloadPdf } from '@/shared/lib/generatePdf';

interface DownloadPdfButtonProps {
  result: SearchResult;
  query: string;
  /** Visual variant — 'card' for inline result cards, 'panel' for the detail panel */
  variant?: 'card' | 'panel';
}

type ButtonState = 'idle' | 'loading' | 'error';

export function DownloadPdfButton({ result, query, variant = 'card' }: DownloadPdfButtonProps) {
  const [state, setState] = useState<ButtonState>('idle');

  async function handleClick(e: React.MouseEvent) {
    // Prevent the card's own onClick (open detail panel) from firing
    e.stopPropagation();

    if (state === 'loading') return;
    setState('loading');

    try {
      const data = buildReportData(result, query);
      await generateAndDownloadPdf(data);
      setState('idle');
    } catch (err) {
      console.error('[DownloadPdfButton] PDF generation failed:', err);
      setState('error');
      // Reset error state after 3 s so the user can retry
      setTimeout(() => setState('idle'), 3000);
    }
  }

  // -----------------------------------------------------------------------
  // Shared icon elements
  // -----------------------------------------------------------------------
  const DownloadIcon = () => (
    <svg
      width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );

  const SpinnerIcon = () => (
    <svg
      width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="animate-spin" aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );

  const ErrorIcon = () => (
    <svg
      width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );

  // -----------------------------------------------------------------------
  // Card variant — compact inline button
  // -----------------------------------------------------------------------
  if (variant === 'card') {
    const base =
      'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold ' +
      'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ' +
      'focus:ring-offset-1 dark:focus:ring-offset-slate-900 shrink-0';

    const styles: Record<ButtonState, string> = {
      idle:
        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ' +
        'hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 ' +
        'ring-1 ring-inset ring-slate-200 dark:ring-slate-700',
      loading:
        'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ' +
        'ring-1 ring-inset ring-blue-200 dark:ring-blue-800 cursor-wait',
      error:
        'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 ' +
        'ring-1 ring-inset ring-red-200 dark:ring-red-800',
    };

    const labels: Record<ButtonState, string> = {
      idle: 'PDF',
      loading: 'Building…',
      error: 'Failed',
    };

    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={state === 'loading'}
        aria-label={`Download PDF report for ${result.record.name}`}
        title="Download PDF screening report"
        className={`${base} ${styles[state]}`}
      >
        {state === 'idle' && <DownloadIcon />}
        {state === 'loading' && <SpinnerIcon />}
        {state === 'error' && <ErrorIcon />}
        {labels[state]}
      </button>
    );
  }

  // -----------------------------------------------------------------------
  // Panel variant — larger button shown inside the detail panel
  // -----------------------------------------------------------------------
  const styles: Record<ButtonState, string> = {
    idle:
      'bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 shadow-sm',
    loading:
      'bg-blue-400 text-white cursor-wait',
    error:
      'bg-red-500 text-white',
  };

  const labels: Record<ButtonState, string> = {
    idle: 'Download PDF Report',
    loading: 'Generating…',
    error: 'Generation Failed — Retry',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === 'loading'}
      aria-label={`Download PDF report for ${result.record.name}`}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500
        focus:ring-offset-2 dark:focus:ring-offset-slate-950
        ${styles[state]}
      `}
    >
      {state === 'idle' && <DownloadIcon />}
      {state === 'loading' && <SpinnerIcon />}
      {state === 'error' && <ErrorIcon />}
      {labels[state]}
    </button>
  );
}
