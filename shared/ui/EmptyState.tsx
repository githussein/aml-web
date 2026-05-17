'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {icon && (
        <div className="mb-6">{icon}</div>
      )}
      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-slate-500 max-w-sm leading-relaxed">{description}</p>
      )}
    </div>
  );
}
