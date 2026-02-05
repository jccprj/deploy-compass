import { cn } from '@/lib/utils';

interface ViewToggleProps {
  value: 'jira' | 'services';
  onChange: (value: 'jira' | 'services') => void;
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
    </div>
  );
}
