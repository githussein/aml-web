'use client';

import React from 'react';
import type { SearchResult, MatchType } from '@/shared/types/sanctions';
import { Badge } from '@/shared/ui/Badge';
import { truncate } from '@/shared/lib/normalize';

interface ResultCardProps {
  result: SearchResult;
  isSelected: boolean;
  onSelect: (result: SearchResult) => void;
  rank: number;
}

const MATCH_BADGE_VARIANT: Record<MatchType, 'exact' | 'alias' | 'similar'> = {
  Exact: 'exact',
  Alias: 'alias',
  Similar: 'similar',
};

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 80 ? 'bg-indigo-600' :
    pct >= 60 ? 'bg-blue-500' :
    pct >= 40 ? 'bg-amber-500' :
    'bg-slate-300';

  return (
    <div className="flex items-center gap-3" title={`Match score: ${pct}%`}>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[12px] font-semibold text-slate-500 tabular-nums">{pct}% Match</span>
    </div>
  );
}

export function ResultCard({ result, isSelected, onSelect, rank }: ResultCardProps) {
  const { record, score, matchType } = result;
  const sourceVariant = record.source === 'UN' ? 'un' : 'uae';

  return (
    <button
      id={`result-card-${record.id}`}
      onClick={() => onSelect(result)}
      aria-pressed={isSelected}
      aria-label={`View details for ${record.name} from ${record.source} list`}
      className={`
        w-full text-left rounded-2xl px-6 py-5 transition-all duration-200 group relative
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isSelected
          ? 'bg-blue-50 ring-1 ring-inset ring-blue-200 shadow-sm'
          : 'bg-white ring-1 ring-inset ring-slate-200 shadow-sm hover:shadow-md hover:ring-slate-300 hover:-translate-y-0.5'
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* Rank Badge */}
        <div className={`
          flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold shrink-0 mt-0.5
          ${rank <= 3 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}
        `}>
          {rank}
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-[16px] leading-tight break-words group-hover:text-blue-700 transition-colors">
                {record.name}
              </h3>
              
              {/* Aliases preview */}
              {record.aliases.length > 0 && (
                <p className="text-[13px] text-slate-500 mt-1.5 leading-snug">
                  <span className="font-medium text-slate-400">AKA: </span>
                  {record.aliases.slice(0, 3).join(' • ')}
                  {record.aliases.length > 3 && (
                    <span className="text-slate-400 italic"> +{record.aliases.length - 3} more</span>
                  )}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <Badge label={record.source} variant={sourceVariant} />
              <Badge label={matchType} variant={MATCH_BADGE_VARIANT[matchType]} />
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap">
            {record.type && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                {record.type}
              </span>
            )}
            {record.program && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 truncate max-w-[250px]" title={record.program}>
                {record.program}
              </span>
            )}
            {record.nationality && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                {record.nationality}
              </span>
            )}
          </div>

          {/* Remarks preview */}
          {record.remarks && (
            <p className="text-[13px] text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {truncate(record.remarks, 120)}
            </p>
          )}

          {/* Score bar */}
          <div className="pt-1">
            <ScoreBar score={score} />
          </div>
        </div>
      </div>
    </button>
  );
}
