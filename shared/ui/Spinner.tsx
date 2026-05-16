'use client';

import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const SIZE_CLASSES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
};

export function Spinner({ size = 'md', label }: SpinnerProps) {
  return (
    <div className="flex items-center gap-2 text-slate-400">
      <div
        role="status"
        aria-label={label ?? 'Loading…'}
        className={`${SIZE_CLASSES[size]} rounded-full border-slate-700 border-t-slate-400 animate-spin`}
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
