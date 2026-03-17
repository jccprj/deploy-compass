import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, ExternalLink, CheckCircle, AlertTriangle, XCircle, GitBranch } from 'lucide-react';
import { CommitLink } from '@/components/CommitLink';
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
import { Badge } from '@/components/ui/badge';
import { fetchServiceDetail, fetchPipelinesForService } from '@/lib/api';
import { ENVIRONMENTS, type DependencyStatus, type Environment } from '@/types/deployment';
import { cn } from '@/lib/utils';

function EffectiveCommitCard({
  env,
  sha,
  status,
  runNumber,
  runUrl
}: {
  env: Environment;
  sha: string | null;
  status: DependencyStatus | null;
  runNumber?: number;
  runUrl?: string;
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
              
              <><CommitLink sha={sha} />
              <br/>
              <br/>
               <div className="flex items-center justify-between text-sm">
                {runUrl ? (
                  <a
                    href={runUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    Pipeline #{runNumber}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span>No deploy</span>
                )}
              </div>
              </>
              
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

  const { data: pipelines } = useQuery({
    queryKey: ['pipelines', serviceName],
    queryFn: () => fetchPipelinesForService(serviceName!),
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
                runNumber={commit?.runNumber || null}
                runUrl={commit?.runUrl || null}
              />
            );
          })}
        </div>
      </div>

      {/* Pipelines */}
      {pipelines && pipelines.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            PPRD Pipelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pipelines.map((p) => {
              const deployedDate = new Date(p.deployedAt).toLocaleString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              });
              return (
                <Link key={p.pipelineId} to={`/services/${serviceName}/pipelines/${p.pipelineId}`}>
                  <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">#{p.pipelineId}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <CommitLink sha={p.sha} />
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {deployedDate}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

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
                  <CommitLink sha={commit.sha} />
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
