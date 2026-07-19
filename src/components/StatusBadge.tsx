import React from 'react';

export type BadgeType = 
  | 'critical' 
  | 'high' 
  | 'medium' 
  | 'low' 
  | 'secured' 
  | 'scanning' 
  | 'flagged' 
  | 'verified' 
  | 'pending'
  | 'analysis_complete';

interface StatusBadgeProps {
  type: BadgeType;
  className?: string;
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  className = '',
  pulse = false,
}) => {
  const configs: Record<BadgeType, { label: string; style: string }> = {
    critical: {
      label: 'Critical Risk',
      style: 'bg-red-950/20 text-red-400 border-red-900/40'
    },
    high: {
      label: 'High Risk',
      style: 'bg-red-950/10 text-red-400 border-red-900/30'
    },
    medium: {
      label: 'Medium Risk',
      style: 'bg-amber-950/20 text-amber-400 border-amber-900/40'
    },
    low: {
      label: 'Low Risk',
      style: 'bg-zinc-900 text-zinc-400 border-zinc-800'
    },
    secured: {
      label: 'Secured',
      style: 'bg-emerald-950/20 text-emerald-450 border-emerald-900/40' // Green is reserved for success/secured
    },
    scanning: {
      label: 'Analyzing',
      style: 'bg-blue-950/10 text-blue-400 border-blue-900/30' // Blue for pending
    },
    flagged: {
      label: 'Flagged issues',
      style: 'bg-red-955/10 text-red-400 border-red-900/30'
    },
    verified: {
      label: 'Midnight Verified',
      style: 'bg-emerald-950/30 text-emerald-450 border-emerald-900/50' // Green is reserved for verified
    },
    pending: {
      label: 'Pending Proof',
      style: 'bg-zinc-900 text-zinc-500 border-zinc-800/80'
    },
    analysis_complete: {
      label: 'Technical Due Diligence Complete',
      style: 'bg-emerald-950/20 text-emerald-450 border-emerald-900/40'
    }
  };

  const current = configs[type] || { label: type, style: 'bg-zinc-900 text-zinc-300 border-zinc-800' };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold font-mono rounded border ${current.style} ${className}`}
    >
      {(pulse || type === 'scanning') && (
        <span className="relative flex h-1 w-1">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            type === 'scanning' ? 'bg-blue-400' : 'bg-red-400'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-1 w-1 ${
            type === 'scanning' ? 'bg-blue-500' : 'bg-red-500'
          }`}></span>
        </span>
      )}
      {current.label}
    </span>
  );
};
