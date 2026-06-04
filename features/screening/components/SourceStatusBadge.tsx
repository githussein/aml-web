'use client';

import React from 'react';
import type { ProviderMetadata } from '@/shared/types/sanctions';
import { Spinner } from '@/shared/ui/Spinner';

interface SourceStatusBadgeProps {
  meta: ProviderMetadata;
}

function formatTime(iso?: string): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const SOURCE_STYLES = {
  UN: {
    dot: 'bg-blue-500',
    icon: 'text-blue-500',
    title: 'text-slate-900 dark:text-slate-100',
  },
  UAE: {
    dot: 'bg-emerald-500',
    icon: 'text-emerald-500',
    title: 'text-slate-900 dark:text-slate-100',
  },
};

export function SourceStatusBadge({ meta }: SourceStatusBadgeProps) {
  const style = SOURCE_STYLES[meta.source];
  const isLoading = meta.status === 'loading';
  const isError = meta.status === 'error';
  const isReady = meta.status === 'ready';

  return (
    <div
      className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-3 min-w-[280px] flex-1 max-w-[400px] shadow-sm border border-slate-200/50 dark:border-slate-800/50 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/2 dark:hover:shadow-blue-900/5 transition-all duration-300 relative group overflow-hidden"
      role="status"
      aria-label={`${meta.source} sanctions list status`}
    >
      {/* Glow Effect on Hover */}
      <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500 pointer-events-none opacity-20 dark:opacity-30 ${meta.source === 'UN' ? 'bg-blue-400' : 'bg-emerald-400'}`} />

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4 relative z-10">
        <div className={`w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center shrink-0 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-white dark:group-hover:bg-slate-800 ${style.icon}`}>
          {meta.source === 'UN' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18"/>
              <path d="M19 21v-4"/>
              <path d="M19 17a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4"/>
              <path d="M21 7v6h-6"/>
              <path d="M3 7v6h6"/>
              <path d="M12 22v-9"/>
              <path d="M12 7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2"/>
              <path d="M12 7a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"/>
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <span className={`text-[15px] font-extrabold tracking-tight ${style.title}`}>
              {meta.source === 'UN' ? 'UN Consolidated' : 'UAE Terrorist List'}
            </span>
            {isLoading ? (
              <Spinner size="sm" />
            ) : isReady ? (
              /* High-fidelity pulsing radar ring */
              <div className="relative flex h-3 w-3 items-center justify-center shrink-0" title="Ready & Synced">
                <span className={`animate-radar absolute inline-flex h-full w-full rounded-full opacity-75 ${meta.source === 'UN' ? 'bg-blue-400' : 'bg-emerald-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${meta.source === 'UN' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
              </div>
            ) : (
              <div
                className={`w-2.5 h-2.5 rounded-full ${isError ? 'bg-red-500' : 'bg-slate-400'} shadow-sm shrink-0`}
                title={meta.status}
              />
            )}
          </div>
        </div>
      </div>

      {/* Status detail */}
      <div className="pt-1.5 relative z-10">
        {isLoading && (
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold animate-pulse">Connecting to source...</p>
        )}
        {isError && (
          <div className="flex items-start gap-2 text-red-600 dark:text-red-400 font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="text-xs leading-normal">{meta.error ?? 'Connection failed'}</p>
          </div>
        )}
        {isReady && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold flex justify-between">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Active Records</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold tabular-nums">{meta.recordCount.toLocaleString()}</span>
            </p>
            {meta.version && (
              <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold flex justify-between gap-4">
                <span className="text-slate-400 dark:text-slate-500 font-medium">List Version</span>
                <span className="text-slate-900 dark:text-slate-200 font-bold truncate max-w-[200px]" title={meta.version}>{meta.version}</span>
              </p>
            )}
            {meta.loadedAt && (
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-300 dark:text-slate-600">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Synced {formatTime(meta.loadedAt)}</span>
              </p>
            )}
          </div>
        )}
        {meta.status === 'idle' && (
          <p className="text-sm text-slate-400 dark:text-slate-500">Offline</p>
        )}
      </div>
    </div>
  );
}
