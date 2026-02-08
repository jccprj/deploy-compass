import { cn } from '@/lib/utils';
import { Rocket } from 'lucide-react';

interface ViewToggleProps {
  value: 'jira' | 'services' | 'promote';
  onChange: (value: 'jira' | 'services' | 'promote') => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-border p-1 bg-muted/50">
      <button
        onClick={() => onChange('jira')}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-md transition-all',
          value === 'jira'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Jira View
      </button>
      <button
        onClick={() => onChange('services')}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-md transition-all',
          value === 'services'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Service View
      </button>
      <button
        onClick={() => onChange('promote')}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-md transition-all gap-1.5 inline-flex items-center',
          value === 'promote'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-primary hover:bg-primary/10'
        )}
      >
        <Rocket className="h-3.5 w-3.5" />
        Promote to PROD
      </button>
    </div>
  );
}
