'use client';

import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'un' | 'uae' | 'exact' | 'alias' | 'similar' | 'demo' | 'neutral';
  size?: 'sm' | 'md';
}

const VARIANT_CLASSES: Record<NonNullable<BadgeProps['variant']>, string> = {
  un:      'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-500/30',
  uae:     'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/10 dark:ring-emerald-500/30',
  exact:   'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 ring-1 ring-inset ring-violet-700/10 dark:ring-violet-500/30',
  alias:   'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20 dark:ring-amber-500/30',
  similar: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/10 dark:ring-slate-600',
  demo:    'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-500 ring-1 ring-inset ring-amber-600/20 dark:ring-amber-500/30 shadow-sm',
  neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-500/10 dark:ring-slate-600',
};

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-[11px] font-semibold',
  md: 'px-2.5 py-1 text-[12px] font-semibold',
};

export function Badge({ label, variant = 'neutral', size = 'sm' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center justify-center rounded-md ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]}`}>
      {label}
    </span>
  );
}
