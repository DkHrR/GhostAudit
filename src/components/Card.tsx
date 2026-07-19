import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'accent' | 'danger';
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  glow: _glow = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-xl bg-surface border border-border transition-all duration-200 overflow-hidden';
  
  const variants = {
    default: '',
    interactive: 'hover:border-zinc-700 active:border-zinc-600',
    accent: 'border-l-2 border-l-primary',
    danger: 'border-l-2 border-l-danger',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`px-6 py-4.5 border-b border-border bg-black/10 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`px-6 py-4.5 border-t border-border bg-black/15 ${className}`} {...props}>
      {children}
    </div>
  );
};
