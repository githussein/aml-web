'use client';

import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const SIZE_CLASSES = {
  sm: 'w-4 h-4 border-[2px]',
  md: 'w-6 h-6 border-[2px]',
  lg: 'w-10 h-10 border-[3px]',
};

export function Spinner({ size = 'md', label }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        role="status"
        aria-label={label ?? 'Loading...'}
        className={`${SIZE_CLASSES[size]} rounded-full border-blue-100 dark:border-blue-900/50 border-t-blue-600 dark:border-t-blue-400 animate-spin`}
      />
      {label && <span className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">{label}</span>}
    </div>
  );
}
