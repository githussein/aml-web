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
      timeZoneName: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const SOURCE_STYLES = {
  UN: {
    dot: 'bg-blue-500',
    label: 'text-blue-400',
    border: 'border-blue-900/40',
    bg: 'bg-blue-950/30',
  },
  UAE: {
    dot: 'bg-emerald-500',
    label: 'text-emerald-400',
    border: 'border-emerald-900/40',
    bg: 'bg-emerald-950/30',
  },
};

export function SourceStatusBadge({ meta }: SourceStatusBadgeProps) {
  const style = SOURCE_STYLES[meta.source];
  const isLoading = meta.status === 'loading';
  const isError = meta.status === 'error';
  const isReady = meta.status === 'ready';

  return (
    <div
      className={`
        rounded-lg border ${style.border} ${style.bg}
        px-3 py-2.5 flex flex-col gap-1.5 min-w-[180px]
      `}
      role="status"
      aria-label={`${meta.source} sanctions list status`}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <div
            className={`w-2 h-2 rounded-full ${isError ? 'bg-red-500' : style.dot} ${isReady ? 'animate-pulse' : ''}`}
          />
        )}
        <span className={`text-xs font-semibold ${style.label}`}>
          {meta.source === 'UN' ? 'UN Consolidated List' : 'UAE Terrorist List'}
        </span>
      </div>

      {/* Status detail */}
      {isLoading && (
        <p className="text-[11px] text-slate-500 ml-4">Loading data…</p>
      )}
      {isError && (
        <p className="text-[11px] text-red-400 ml-4 leading-snug">
          {meta.error ?? 'Failed to load'}
        </p>
      )}
      {isReady && (
        <div className="ml-4 flex flex-col gap-0.5">
          <p className="text-[11px] text-slate-400">
            <span className="text-slate-500">Records: </span>
            {meta.recordCount.toLocaleString()}
          </p>
          {meta.version && (
            <p className="text-[11px] text-slate-400">
              <span className="text-slate-500">Version: </span>
              {meta.version}
            </p>
          )}
          {meta.loadedAt && (
            <p className="text-[11px] text-slate-500" title={meta.loadedAt}>
              Loaded {formatTime(meta.loadedAt)}
            </p>
          )}
        </div>
      )}
      {meta.status === 'idle' && (
        <p className="text-[11px] text-slate-600 ml-4">Not yet loaded</p>
      )}
    </div>
  );
}
