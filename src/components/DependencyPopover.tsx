import { useQuery } from '@tanstack/react-query';
import { CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { fetchCommitEnvironmentDetail } from '@/lib/api';
import type { Environment } from '@/types/deployment';
import { format } from 'date-fns';

interface DependencyPopoverProps {
  sha: string;
  environment: Environment;
  children: React.ReactNode;
}

export function DependencyPopover({ sha, environment, children }: DependencyPopoverProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['commit-detail', sha, environment],
    queryFn: () => fetchCommitEnvironmentDetail(sha, environment),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        {isLoading ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : data ? (
          <div className="divide-y divide-border">
            {/* Header */}
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Commit</span>
                <code className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
                  {data.commit}
                </code>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Environment</span>
                <span className="font-medium">{data.environment}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Deployed At</span>
                <span>{format(new Date(data.deployedAt), 'MMM d, yyyy HH:mm')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pipeline</span>
                <span className="flex items-center gap-1">
                  #{data.pipelineId}
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>

            {/* Dependencies */}
            <div className="p-4">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Dependencies
              </h4>
              <div className="space-y-2">
                {data.dependencies.map((dep) => (
                  <div
                    key={dep.service}
                    className="flex items-center justify-between text-sm bg-muted/50 rounded-lg p-3"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{dep.service}</div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>
                          Expected:{' '}
                          <code className="font-mono">{dep.expectedCommit}</code>
                        </span>
                        <span>
                          Actual:{' '}
                          <code className="font-mono">{dep.actualCommit}</code>
                        </span>
                      </div>
                    </div>
                    {dep.status === 'OK' ? (
                      <CheckCircle className="h-5 w-5 text-status-ok flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No deployment details available
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
