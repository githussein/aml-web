'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
      {icon && (
        <div className="text-slate-600 mb-2">{icon}</div>
      )}
      <p className="text-slate-400 font-medium">{title}</p>
      {description && (
        <p className="text-slate-600 text-sm max-w-sm">{description}</p>
      )}
    </div>
  );
}
