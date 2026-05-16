'use client';

import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'un' | 'uae' | 'exact' | 'alias' | 'similar' | 'demo' | 'neutral';
  size?: 'sm' | 'md';
}

const VARIANT_CLASSES: Record<NonNullable<BadgeProps['variant']>, string> = {
  un:      'bg-blue-950 text-blue-300 border border-blue-800 ring-1 ring-blue-900',
  uae:     'bg-emerald-950 text-emerald-300 border border-emerald-800 ring-1 ring-emerald-900',
  exact:   'bg-violet-950 text-violet-300 border border-violet-800',
  alias:   'bg-amber-950 text-amber-300 border border-amber-800',
  similar: 'bg-slate-800 text-slate-400 border border-slate-700',
  demo:    'bg-amber-500/10 text-amber-400 border border-amber-500/30',
  neutral: 'bg-slate-800 text-slate-400 border border-slate-700',
};

const SIZE_CLASSES = {
  sm: 'px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
  md: 'px-2 py-1 text-xs font-semibold tracking-wide uppercase',
};

export function Badge({ label, variant = 'neutral', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-sm ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]}`}
    >
      {label}
    </span>
  );
}
