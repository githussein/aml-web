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
    pct >= 80 ? 'bg-violet-500' :
    pct >= 60 ? 'bg-blue-500' :
    pct >= 40 ? 'bg-amber-500' :
    'bg-slate-600';

  return (
    <div className="flex items-center gap-2" title={`Match score: ${pct}%`}>
      <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden max-w-[80px]">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] text-slate-500 tabular-nums">{pct}%</span>
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
        w-full text-left rounded-lg border px-4 py-3.5 transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-slate-950
        ${isSelected
          ? 'border-blue-600 bg-blue-950/30 shadow-[0_0_0_1px_rgb(37_99_235/0.4)]'
          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Rank number */}
        <span className="text-[11px] text-slate-600 tabular-nums pt-0.5 w-5 text-right shrink-0">
          {rank}
        </span>

        <div className="flex-1 min-w-0 space-y-2">
          {/* Name + badges row */}
          <div className="flex items-start gap-2 flex-wrap">
            <span className="font-medium text-slate-100 text-sm leading-snug break-words">
              {record.name}
            </span>
            <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
              <Badge label={record.source} variant={sourceVariant} />
              <Badge label={matchType} variant={MATCH_BADGE_VARIANT[matchType]} />
            </div>
          </div>

          {/* Aliases preview */}
          {record.aliases.length > 0 && (
            <p className="text-[12px] text-slate-500 leading-snug">
              <span className="text-slate-600">AKA: </span>
              {record.aliases.slice(0, 3).join(' · ')}
              {record.aliases.length > 3 && (
                <span className="text-slate-600"> +{record.aliases.length - 3} more</span>
              )}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            {record.type && (
              <span className="text-[11px] text-slate-600">{record.type}</span>
            )}
            {record.program && (
              <span className="text-[11px] text-slate-600 truncate max-w-[200px]" title={record.program}>
                {record.program}
              </span>
            )}
            {record.nationality && (
              <span className="text-[11px] text-slate-600">{record.nationality}</span>
            )}
          </div>

          {/* Remarks preview */}
          {record.remarks && (
            <p className="text-[12px] text-slate-600 leading-snug">
              {truncate(record.remarks, 120)}
            </p>
          )}

          {/* Score bar */}
          <ScoreBar score={score} />
        </div>

        {/* Chevron */}
        <div className={`shrink-0 mt-0.5 transition-colors ${isSelected ? 'text-blue-400' : 'text-slate-700'}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </div>
    </button>
  );
}
