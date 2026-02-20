import { ExternalLink } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { getCommitInfo } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface CommitLinkProps {
  sha: string;
  className?: string;
}

export function CommitLink({ sha, className }: CommitLinkProps) {
  const info = getCommitInfo(sha);
  const githubUrl = info
    ? `https://github.com/org/${info.repo}/commit/${sha}`
    : `https://github.com/search?q=${sha}&type=commits`;

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'font-mono text-xs bg-muted px-1.5 py-0.5 rounded inline-flex items-center gap-1 hover:bg-accent transition-colors cursor-pointer',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {sha}
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </a>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-80 p-3">
        {info ? (
          <div className="space-y-1.5">
            <p className="text-sm font-medium">{info.message}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{info.author}</span>
              <span>·</span>
              <span>{info.date}</span>
            </div>
            <p className="text-xs text-muted-foreground">{info.repo}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No commit info available</p>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
