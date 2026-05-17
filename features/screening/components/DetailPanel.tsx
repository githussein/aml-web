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
    <div className="space-y-3">
      <h3 className="text-[12px] font-bold text-slate-900 dark:text-slate-100 tracking-wide uppercase">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400 shrink-0 sm:w-36">{label}</span>
      <span className="text-[14px] text-slate-900 dark:text-slate-100 break-words flex-1 mt-1 sm:mt-0">{value}</span>
    </div>
  );
}

function IdentifierList({ identifiers }: { identifiers: Identifier[] }) {
  if (identifiers.length === 0) return <p className="text-[13px] text-slate-500 dark:text-slate-400">None on record</p>;
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {identifiers.map((id, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row sm:gap-4 p-3 border-b border-slate-200 dark:border-slate-800 last:border-0 bg-white dark:bg-slate-900">
          <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400 shrink-0 sm:w-32">{id.type}</span>
          <div className="flex flex-col flex-1 mt-1 sm:mt-0">
            <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 font-mono tracking-tight">{id.value}</span>
            {id.note && <span className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{id.note}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailPanel({ result, onClose }: DetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!result) return;
    closeButtonRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [result, onClose]);

  useEffect(() => {
    if (result) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [result]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          result ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Sanctions record details"
        className={`
          fixed top-0 right-0 h-full w-full max-w-2xl z-50
          bg-white dark:bg-slate-950 shadow-2xl ring-1 ring-slate-900/5 dark:ring-slate-800
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${result ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {result && (
          <>
            {/* Header */}
            <div className="flex flex-col gap-4 p-6 sm:px-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 relative">
              <div className="absolute top-6 right-6">
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  aria-label="Close panel"
                  className="p-2 rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="pr-12 space-y-3 mt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    label={result.record.source === 'UN' ? 'UN Consolidated' : 'UAE Terrorist List'}
                    variant={result.record.source === 'UN' ? 'un' : 'uae'}
                  />
                  <Badge
                    label={`${Math.round(result.score * 100)}% Match`}
                    variant="neutral"
                  />
                  <Badge
                    label={result.matchType}
                    variant={result.matchType === 'Exact' ? 'exact' : result.matchType === 'Alias' ? 'alias' : 'similar'}
                  />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                  {result.record.name}
                </h2>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:px-8 space-y-10">
              <Section title="Entity Profile">
                <div className="bg-white dark:bg-transparent">
                  <FieldRow label="Primary Name" value={result.record.name} />
                  <FieldRow label="Entity Type" value={result.record.type} />
                  <FieldRow label="Program / Sanction" value={result.record.program} />
                  <FieldRow label="Nationality" value={result.record.nationality} />
                  <FieldRow label="Date of Birth" value={result.record.dateOfBirth} />
                  <FieldRow label="Place of Birth" value={result.record.placeOfBirth} />
                  <FieldRow label="Last Updated" value={result.record.lastUpdated} />
                </div>
              </Section>

              <Section title="Also Known As (Aliases)">
                {result.record.aliases.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.record.aliases.map((alias, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-[13px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-200 dark:ring-slate-700"
                      >
                        {alias}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-slate-500 dark:text-slate-400">No aliases recorded.</p>
                )}
              </Section>

              <Section title="Recorded Identifiers">
                <IdentifierList identifiers={result.record.identifiers} />
              </Section>

              {result.record.remarks && (
                <Section title="Remarks & Context">
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/50 p-5">
                    <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {result.record.remarks}
                    </p>
                  </div>
                </Section>
              )}

              <Section title="Developer Payload (Raw Source)">
                <div className="bg-slate-900 rounded-xl p-5 overflow-x-auto shadow-inner">
                  <pre className="text-[12px] text-blue-300 font-mono whitespace-pre-wrap break-all leading-relaxed">
                    {typeof result.record.rawPayload === 'string'
                      ? result.record.rawPayload
                      : JSON.stringify(result.record.rawPayload, null, 2)}
                  </pre>
                </div>
              </Section>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-400 dark:text-slate-600 font-mono">System Record ID: {result.record.id}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
