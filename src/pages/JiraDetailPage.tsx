import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusIcon } from '@/components/StatusIcon';
import { DependencyPopover } from '@/components/DependencyPopover';
import { fetchJiraIssueDetail } from '@/lib/api';
import { ENVIRONMENTS } from '@/types/deployment';

function TypeBadge({ type }: { type: string }) {
  const variants: Record<string, string> = {
    Bug: 'bg-destructive/10 text-destructive border-destructive/20',
    Story: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    Task: 'bg-green-500/10 text-green-600 border-green-500/20',
    Epic: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  };

  return (
    <Badge variant="outline" className={variants[type] || ''}>
      {type}
    </Badge>
  );
}

export default function JiraDetailPage() {
  const { key } = useParams<{ key: string }>();

  const { data: issue, isLoading } = useQuery({
    queryKey: ['jira-issue', key],
    queryFn: () => fetchJiraIssueDetail(key!),
    enabled: !!key,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="space-y-4">
        <Link to="/jira">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Issues
          </Button>
        </Link>
        <div className="text-center py-12 text-muted-foreground">
          Issue not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link to="/jira">
        <Button variant="ghost" size="sm" className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Issues
        </Button>
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-tight font-mono">

            <a href={issue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                  {issue.key}
                <ExternalLink className="h-3 w-3" />
              </a>
          </h2>
          <TypeBadge type={issue.type} />
          <Badge variant="secondary">{issue.status}</Badge>
        </div>
        <p className="text-lg text-muted-foreground">{issue.title}</p>
      </div>

      {/* Service-Commits Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Service</TableHead>
              <TableHead className="w-64">Commits</TableHead>
              {ENVIRONMENTS.map((env) => (
                <TableHead key={env} className="w-24 text-center">
                  {env}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {issue.services.map((service) => (
              <TableRow key={service.serviceName}>
                <TableCell className="align-top pt-4">
                  <Link
                    to={`/services/${service.serviceName}`}
                    className="font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    {service.serviceName}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </TableCell>
                <TableCell className="align-top">
                  <div className="space-y-2">
                    {service.commits.map((commit) => (
                      <div
                        key={commit.sha}
                        className="flex items-center gap-2 text-sm"
                      >
                        <code className="font-mono bg-muted px-2 py-1 rounded">
                          {commit.sha?.substring(0, 7)}
                        </code>
                        <span className="text-muted-foreground text-xs">
                          {commit.createdAt}
                        </span>

                        <span className="text-muted-foreground text-xs">
                          {commit.author}
                        </span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                {ENVIRONMENTS.map((env) => (
                  <TableCell key={env} className="align-top">
                    <div className="space-y-2 flex flex-col items-center">
                      {service.commits.map((commit) => {
                        const envStatus = commit.environments[env];
                        const isDeployed = envStatus.deploymentStatus === 'DEPLOYED';

                        return isDeployed ? (
                          <DependencyPopover
                            key={commit.sha}
                            sha={commit.sha}
                            environment={env}
                          >
                            <button className="p-1 rounded hover:bg-muted transition-colors">
                              <StatusIcon
                                deploymentStatus={envStatus.deploymentStatus}
                                dependencyStatus={envStatus.dependencyStatus}
                              />
                            </button>
                          </DependencyPopover>
                        ) : (
                          <div key={commit.sha} className="p-1">
                            <StatusIcon
                              deploymentStatus={envStatus.deploymentStatus}
                              dependencyStatus={envStatus.dependencyStatus}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
