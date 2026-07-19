import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  variant?: 'primary' | 'accent' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animate?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  label,
  animate = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const isComplete = percentage === 100;

  // Green is strictly restricted to completed/successful verification states
  const colors = {
    primary: isComplete ? 'bg-emerald-650' : 'bg-primary',
    accent: isComplete ? 'bg-emerald-650' : 'bg-primary',
    danger: 'bg-danger',
    warning: 'bg-amber-600',
  };

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1 text-xs font-medium text-zinc-400">
          <span>{label}</span>
          <span className="font-mono text-zinc-200">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-black border border-border rounded-sm overflow-hidden">
        <div
          className={`${heights[size]} ${colors[variant]} rounded-sm transition-all duration-700 ease-out`}
          style={{
            width: `${percentage}%`,
            transitionDelay: animate ? '50ms' : '0ms'
          }}
        />
      </div>
    </div>
  );
};
