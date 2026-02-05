import { cn } from '@/lib/utils';

interface CommitCellProps {
  sha: string;
  className?: string;
  onClick?: () => void;
}

export function CommitCell({ sha, className, onClick }: CommitCellProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'font-mono text-sm px-2 py-1 rounded bg-muted hover:bg-accent transition-colors cursor-pointer',
        className
      )}
    >
      {sha}
    </button>
  );
}
