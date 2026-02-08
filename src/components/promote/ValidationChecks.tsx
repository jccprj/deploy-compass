import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { ValidationCheck } from '@/types/deployment';

interface ValidationChecksProps {
  checks: ValidationCheck[];
}

const icons = {
  pass: <CheckCircle className="h-4 w-4 text-status-ok" />,
  warn: <AlertTriangle className="h-4 w-4 text-status-warning" />,
  fail: <XCircle className="h-4 w-4 text-status-error" />,
};

export function ValidationChecks({ checks }: ValidationChecksProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Pre-flight Validation</h3>
      <div className="space-y-2">
        {checks.map((check, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="mt-0.5">{icons[check.status]}</div>
            <div className="space-y-0.5">
              <p className="text-sm text-foreground">{check.label}</p>
              {check.message && (
                <p className="text-xs text-muted-foreground">{check.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
