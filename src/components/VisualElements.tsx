import React from 'react';
import { cn } from '@/lib/utils';

interface VisualStatusProps {
  status: 'active' | 'completed' | 'pending' | 'warning';
  className?: string;
}

export const VisualStatus: React.FC<VisualStatusProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'warning':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={cn('w-3 h-3 rounded-full animate-pulse', getStatusStyles(), className)} />
  );
};

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 40,
  strokeWidth = 4,
  className
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted-foreground/20"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

interface IconBadgeProps {
  icon: React.ReactNode;
  count?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  count,
  variant = 'default',
  className
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'error':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-blue-50 text-blue-600 border-blue-200';
    }
  };

  return (
    <div className={cn('relative p-3 rounded-full border-2', getVariantStyles(), className)}>
      {icon}
      {count !== undefined && (
        <div className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </div>
      )}
    </div>
  );
};