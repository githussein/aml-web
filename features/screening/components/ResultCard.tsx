'use client';

import React from 'react';
import type { SearchResult, MatchType } from '@/shared/types/sanctions';
import { Badge } from '@/shared/ui/Badge';
import { truncate } from '@/shared/lib/normalize';
import { DownloadPdfButton } from './DownloadPdfButton';

interface ResultCardProps {
  result: SearchResult;
  isSelected: boolean;
  onSelect: (result: SearchResult) => void;
  rank: number;
  query: string;
}

const MATCH_BADGE_VARIANT: Record<MatchType, 'exact' | 'alias' | 'similar'> = {
  Exact: 'exact',
  Alias: 'alias',
  Similar: 'similar',
};

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const barGradient =
    pct >= 80 ? 'from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500' :
    pct >= 60 ? 'from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400' :
    pct >= 40 ? 'from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400' :
    'from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-600';

  const textColor =
    pct >= 80 ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' :
    pct >= 60 ? 'text-blue-600 dark:text-blue-400 font-extrabold' :
    pct >= 40 ? 'text-amber-600 dark:text-amber-400 font-extrabold' :
    'text-slate-500 dark:text-slate-400 font-semibold';

  return (
    <div className="flex items-center gap-3" title={`Match score: ${pct}%`}>
      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden w-[120px] sm:w-[140px] border border-slate-200/20 dark:border-slate-800/40 shadow-inner">
        <div
          className={`h-full bg-gradient-to-r ${barGradient} rounded-full transition-all duration-500 relative`}
          style={{ width: `${pct}%` }}
        >
          {/* Subtle shine highlights inside the bar */}
          <div className="absolute inset-0 bg-white/20 dark:bg-white/10 pointer-events-none" />
        </div>
      </div>
      <span className={`text-xs uppercase tracking-wider tabular-nums ${textColor}`}>{pct}% Match</span>
    </div>
  );
}

export function ResultCard({ result, isSelected, onSelect, rank, query }: ResultCardProps) {
  const { record, score, matchType } = result;
  const sourceVariant = record.source === 'UN' ? 'un' : 'uae';

  /**
   * The outer element is a <div role="button"> so we can safely nest the
   * <DownloadPdfButton> (a <button>) inside without invalid HTML.
   * Keyboard interaction mirrors a real button: Enter / Space triggers selection.
   */
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(result);
    }
  }

  return (
    <div
      id={`result-card-${record.id}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(result)}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      aria-label={`View details for ${record.name} from ${record.source} list`}
      className={`
        w-full text-left rounded-2xl px-6 py-5 transition-all duration-300 group relative cursor-pointer border
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
        ${isSelected
          ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800/60 shadow-lg shadow-blue-500/5 dark:shadow-blue-900/10'
          : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5'
        }
      `}
    >
      {/* Background soft color glow when selected */}
      {isSelected && (
        <div className="absolute -left-1 top-4 w-2 h-10 bg-blue-600 dark:bg-blue-500 rounded-r-lg" />
      )}

      <div className="flex items-start gap-4">
        {/* Rank Badge */}
        <div className={`
          flex items-center justify-center w-8 h-8 rounded-xl text-[13px] font-extrabold shrink-0 mt-0.5 shadow-sm border
          transition-all duration-300 group-hover:scale-105
          ${rank <= 3 
            ? 'bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-400' 
            : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400'
          }
        `}>
          {rank}
        </div>

        <div className="flex-1 min-w-0 space-y-3.5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-[18px] leading-tight break-words group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {record.name}
              </h3>
              
              {/* Aliases preview */}
              {record.aliases.length > 0 && (
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-2 leading-snug font-medium">
                  <span className="font-semibold text-slate-400 dark:text-slate-500">AKA: </span>
                  {record.aliases.slice(0, 3).join(' • ')}
                  {record.aliases.length > 3 && (
                    <span className="text-slate-400 dark:text-slate-500 italic"> +{record.aliases.length - 3} more</span>
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
          <div className="flex items-center gap-2.5 flex-wrap">
            {record.type && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/20 dark:border-slate-700/30">
                {record.type}
              </span>
            )}
            {record.program && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/20 dark:border-slate-700/30 truncate max-w-[280px]" title={record.program}>
                {record.program}
              </span>
            )}
            {record.nationality && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/20 dark:border-slate-700/30">
                {record.nationality}
              </span>
            )}
          </div>

          {/* Remarks preview */}
          {record.remarks && (
            <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-inner">
              {truncate(record.remarks, 150)}
            </p>
          )}

          {/* Score bar + PDF download */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/50">
            <ScoreBar score={score} />
            <DownloadPdfButton result={result} query={query} variant="card" />
          </div>
        </div>
      </div>
    </div>
  );
}
