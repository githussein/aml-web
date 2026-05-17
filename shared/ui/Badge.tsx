'use client';

import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'un' | 'uae' | 'exact' | 'alias' | 'similar' | 'demo' | 'neutral';
  size?: 'sm' | 'md';
}

const VARIANT_CLASSES: Record<NonNullable<BadgeProps['variant']>, string> = {
  un:      'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10',
  uae:     'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10',
  exact:   'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-700/10',
  alias:   'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20',
  similar: 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10',
  demo:    'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-600/20 shadow-sm',
  neutral: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/10',
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
