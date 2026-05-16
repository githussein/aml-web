'use client';

import React, { useEffect, useRef } from 'react';
import type { SearchResult, Identifier } from '@/shared/types/sanctions';
import { Badge } from '@/shared/ui/Badge';

interface DetailPanelProps {
  result: SearchResult | null;
  onClose: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 py-1.5 border-b border-slate-800/60 last:border-0">
      <span className="text-xs text-slate-500 shrink-0 w-28">{label}</span>
      <span className="text-xs text-slate-300 break-words flex-1">{value}</span>
    </div>
  );
}

function IdentifierList({ identifiers }: { identifiers: Identifier[] }) {
  if (identifiers.length === 0) return <p className="text-xs text-slate-600">None on record</p>;
  return (
    <div className="space-y-1">
      {identifiers.map((id, idx) => (
        <div key={idx} className="flex gap-2 py-1 border-b border-slate-800/60 last:border-0">
          <span className="text-xs text-slate-500 shrink-0 w-28">{id.type}</span>
          <span className="text-xs text-slate-300 font-mono">{id.value}</span>
          {id.note && <span className="text-xs text-slate-600">({id.note})</span>}
        </div>
      ))}
    </div>
  );
}

export function DetailPanel({ result, onClose }: DetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and Escape key handler
  useEffect(() => {
    if (!result) return;
    closeButtonRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [result, onClose]);

  // Prevent body scroll while panel is open
  useEffect(() => {
    if (result) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [result]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 ${
          result ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Sanctions record details"
        className={`
          fixed top-0 right-0 h-full w-full max-w-[520px] z-50
          bg-slate-950 border-l border-slate-800
          flex flex-col
          transition-transform duration-250 ease-in-out
          ${result ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {result && (
          <>
            {/* Panel header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-800 shrink-0">
              <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    label={result.record.source}
                    variant={result.record.source === 'UN' ? 'un' : 'uae'}
                    size="md"
                  />
                  <Badge
                    label={result.matchType}
                    variant={result.matchType === 'Exact' ? 'exact' : result.matchType === 'Alias' ? 'alias' : 'similar'}
                    size="md"
                  />
                  <span className="text-xs text-slate-500">
                    {Math.round(result.score * 100)}% match
                  </span>
                </div>
                <h2 className="text-base font-semibold text-slate-100 leading-snug break-words">
                  {result.record.name}
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                id="detail-panel-close"
                onClick={onClose}
                aria-label="Close details panel"
                className="shrink-0 p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-600"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {/* Core info */}
              <Section title="Record Details">
                <div className="space-y-0">
                  <FieldRow label="Name" value={result.record.name} />
                  <FieldRow label="Source List" value={
                    result.record.source === 'UN'
                      ? 'UN Security Council Consolidated List'
                      : 'UAE Terrorist List'
                  } />
                  <FieldRow label="Type" value={result.record.type} />
                  <FieldRow label="Program" value={result.record.program} />
                  <FieldRow label="Nationality" value={result.record.nationality} />
                  <FieldRow label="Date of Birth" value={result.record.dateOfBirth} />
                  <FieldRow label="Place of Birth" value={result.record.placeOfBirth} />
                  <FieldRow label="Last Updated" value={result.record.lastUpdated} />
                </div>
              </Section>

              {/* Aliases */}
              <Section title="Aliases / Also Known As">
                {result.record.aliases.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {result.record.aliases.map((alias, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-800 text-slate-300 border border-slate-700 rounded px-2 py-1"
                      >
                        {alias}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600">No aliases on record</p>
                )}
              </Section>

              {/* Identifiers */}
              <Section title="Identifiers">
                <IdentifierList identifiers={result.record.identifiers} />
              </Section>

              {/* Remarks */}
              {result.record.remarks && (
                <Section title="Remarks">
                  <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {result.record.remarks}
                  </p>
                </Section>
              )}

              {/* Raw payload */}
              <Section title="Raw Source Data">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 max-h-[280px] overflow-y-auto">
                  <pre className="text-[11px] text-slate-500 font-mono whitespace-pre-wrap break-all leading-relaxed">
                    {typeof result.record.rawPayload === 'string'
                      ? result.record.rawPayload
                      : JSON.stringify(result.record.rawPayload, null, 2)}
                  </pre>
                </div>
              </Section>

              {/* Record ID */}
              <p className="text-[11px] text-slate-700 font-mono">ID: {result.record.id}</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
