import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, ExternalLink, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusIcon } from '@/components/StatusIcon';
import { DependencyPopover } from '@/components/DependencyPopover';
import { fetchServiceDetail } from '@/lib/api';
import { ENVIRONMENTS, type DependencyStatus, type Environment } from '@/types/deployment';
import { cn } from '@/lib/utils';

function EffectiveCommitCard({
  env,
  sha,
  status,
}: {
  env: Environment;
  sha: string | null;
  status: DependencyStatus | null;
}) {
  return (
    <Card
      className={cn(
        'flex-1',
        status === 'INCOMPATIBLE' && 'border-status-warning/50 bg-status-warning/5'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {env}
            </p>
            {sha ? (
              <code className="font-mono text-sm font-medium mt-1 block">
                {sha}
              </code>
            ) : (
              <span className="text-sm text-muted-foreground mt-1 block">
                No deployment
              </span>
            )}
          </div>
          {!sha ? (
            <XCircle className="h-5 w-5 text-muted-foreground" />
          ) : status === 'INCOMPATIBLE' || status === 'MISSING' ? (
            <AlertTriangle className="h-5 w-5 text-status-warning" />
          ) : (
            <CheckCircle className="h-5 w-5 text-status-ok" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ServiceDetailPage() {
  const { serviceName } = useParams<{ serviceName: string }>();

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', serviceName],
    queryFn: () => fetchServiceDetail(serviceName!),
    enabled: !!serviceName,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="space-y-4">
        <Link to="/services">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Button>
        </Link>
        <div className="text-center py-12 text-muted-foreground">
          Service not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link to="/services">
        <Button variant="ghost" size="sm" className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Button>
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {service.serviceName}
        </h2>
        <a
          href={`https://${service.repository}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          {service.repository}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Effective Commits Summary */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Effective Commits
        </h3>
        <div className="flex gap-4">
          {ENVIRONMENTS.map((env) => {
            const commit = service.effectiveCommits[env];
            return (
              <EffectiveCommitCard
                key={env}
                env={env}
                sha={commit?.sha || null}
                status={commit?.dependencyStatus || null}
              />
            );
          })}
        </div>
      </div>

      {/* Commits Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Commit</TableHead>
              <TableHead className="w-32">Jira Issue</TableHead>
              <TableHead className="w-32">Created</TableHead>
              {ENVIRONMENTS.map((env) => (
                <TableHead key={env} className="w-24 text-center">
                  {env}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {service.commits.map((commit) => (
              <TableRow key={commit.sha}>
                <TableCell>
                  <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {commit.sha}
                  </code>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/jira/${commit.jiraKey}`}
                    className="font-mono text-sm text-primary hover:underline"
                  >
                    {commit.jiraKey}
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {commit.createdAt}
                </TableCell>
                {ENVIRONMENTS.map((env) => {
                  const envStatus = commit.environments[env];
                  const isDeployed = envStatus.deploymentStatus === 'DEPLOYED';

                  return (
                    <TableCell key={env} className="text-center">
                      {isDeployed ? (
                        <DependencyPopover sha={commit.sha} environment={env}>
                          <button className="p-1 rounded hover:bg-muted transition-colors mx-auto">
                            <StatusIcon
                              deploymentStatus={envStatus.deploymentStatus}
                              dependencyStatus={envStatus.dependencyStatus}
                            />
                          </button>
                        </DependencyPopover>
                      ) : (
                        <div className="flex justify-center p-1">
                          <StatusIcon
                            deploymentStatus={envStatus.deploymentStatus}
                            dependencyStatus={envStatus.dependencyStatus}
                          />
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
