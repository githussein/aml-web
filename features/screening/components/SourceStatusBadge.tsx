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
    title: 'text-slate-900',
  },
  UAE: {
    dot: 'bg-emerald-500',
    icon: 'text-emerald-500',
    title: 'text-slate-900',
  },
};

export function SourceStatusBadge({ meta }: SourceStatusBadgeProps) {
  const style = SOURCE_STYLES[meta.source];
  const isLoading = meta.status === 'loading';
  const isError = meta.status === 'error';
  const isReady = meta.status === 'ready';

  return (
    <div
      className="bg-white rounded-2xl p-4 flex flex-col gap-2 min-w-[220px] shadow-sm ring-1 ring-slate-200"
      role="status"
      aria-label={`${meta.source} sanctions list status`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 ${style.icon}`}>
          {meta.source === 'UN' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[13px] font-bold ${style.title} truncate`}>
              {meta.source === 'UN' ? 'UN Consolidated' : 'UAE Terrorist List'}
            </span>
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <div
                className={`w-2 h-2 rounded-full ${isError ? 'bg-red-500' : style.dot} ${isReady ? 'animate-pulse' : ''} shadow-sm`}
                title={meta.status}
              />
            )}
          </div>
        </div>
      </div>

      {/* Status detail */}
      <div className="pt-1">
        {isLoading && (
          <p className="text-[12px] text-slate-500 font-medium">Connecting...</p>
        )}
        {isError && (
          <p className="text-[12px] text-red-600 font-medium leading-snug">
            {meta.error ?? 'Connection failed'}
          </p>
        )}
        {isReady && (
          <div className="flex flex-col gap-1">
            <p className="text-[12px] text-slate-600 font-medium flex justify-between">
              <span className="text-slate-400">Records</span>
              <span className="text-slate-900">{meta.recordCount.toLocaleString()}</span>
            </p>
            {meta.version && (
              <p className="text-[12px] text-slate-600 font-medium flex justify-between">
                <span className="text-slate-400">Version</span>
                <span className="text-slate-900 truncate max-w-[100px]" title={meta.version}>{meta.version}</span>
              </p>
            )}
            {meta.loadedAt && (
              <p className="text-[10px] text-slate-400 mt-1">
                Synced at {formatTime(meta.loadedAt)}
              </p>
            )}
          </div>
        )}
        {meta.status === 'idle' && (
          <p className="text-[12px] text-slate-400">Offline</p>
        )}
      </div>
    </div>
  );
}
