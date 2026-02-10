import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle, AlertTriangle, XCircle, Server, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchServices } from '@/lib/api';
import { ENVIRONMENTS, type DependencyStatus } from '@/types/deployment';
import { cn } from '@/lib/utils';

function StatusBadge({ status }: { status: DependencyStatus | null }) {
  if (!status) {
    return (
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <XCircle className="h-4 w-4" />
        <span className="text-xs">None</span>
      </div>
    );
  }

  if (status === 'INCOMPATIBLE' || status === 'MISSING') {
    return (
      <div className="flex items-center gap-1.5 text-status-warning">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-xs">Incompatible</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-status-ok">
      <CheckCircle className="h-4 w-4" />
      <span className="text-xs">OK</span>
    </div>
  );
}

export default function ServiceListPage() {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Services</h2>
        <p className="text-sm text-muted-foreground mt-1">
          View effective commits and dependency health per environment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {services?.map((service) => (
          <Link key={service.serviceName} to={`/services/${service.serviceName}`}>
            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  {service.serviceName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ENVIRONMENTS.map((env) => {
                  const effectiveCommit = service.effectiveCommits[env];
                  return (
                    <div
                      key={env}
                      className={cn(
                        'flex items-center justify-between py-2 px-3 rounded-lg',
                        'bg-muted/50'
                      )}
                    >
                      <span className="text-sm font-medium text-muted-foreground">
                        {env}
                      </span>
                      <div className="flex items-center gap-3">
                        {effectiveCommit ? (
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-xs bg-background px-2 py-1 rounded">
                              {effectiveCommit.sha}
                            </code>
                            {effectiveCommit.pipelineId && (
                              <a
                                href={effectiveCommit.pipelineUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-xs text-primary hover:underline"
                                title={`Pipeline #${effectiveCommit.pipelineId}`}
                              >
                                #{effectiveCommit.pipelineId}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                        <StatusBadge
                          status={effectiveCommit?.dependencyStatus || null}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
