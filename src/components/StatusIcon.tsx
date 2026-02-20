import { CheckCircle, AlertTriangle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DeploymentStatus, DependencyStatus } from '@/types/deployment';

interface StatusIconProps {
  deploymentStatus: DeploymentStatus;
  dependencyStatus?: DependencyStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusIcon({
  deploymentStatus,
  dependencyStatus,
  size = 'md',
  className,
}: StatusIconProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  if (deploymentStatus === 'NOT_DEPLOYED') {
    return (
      <XCircle
        className={cn(sizeClasses[size], 'text-destructive', className)}
        aria-label="Not deployed"
      />
    );
  }

  
  if (deploymentStatus === 'OVERWRITTEN') {
    return (
      <AlertTriangle
        className={cn(sizeClasses[size], 'text-status-error', className)}
        aria-label="Deployed with dependency issues"
      />
    );
  }

  if (dependencyStatus === 'INCOMPATIBLE' || dependencyStatus === 'MISSING') {
    return (
      <AlertCircle
        className={cn(sizeClasses[size], 'text-status-info', className)}
        aria-label="Deployed with dependency issues"
      />
    );
  }

  return (
    <CheckCircle
      className={cn(sizeClasses[size], 'text-status-ok', className)}
      aria-label="Deployed successfully"
    />
  );
}
