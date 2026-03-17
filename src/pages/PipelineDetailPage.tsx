import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommitLink } from '@/components/CommitLink';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchPipelineDetail } from '@/lib/api';

export default function PipelineDetailPage() {
  const { serviceName, pipelineId } = useParams<{
    serviceName: string;
    pipelineId: string;
  }>();

  const { data: pipeline, isLoading } = useQuery({
    queryKey: ['pipeline', serviceName, pipelineId],
    queryFn: () => fetchPipelineDetail(serviceName!, pipelineId!),
    enabled: !!serviceName && !!pipelineId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!pipeline) {
    return (
      <div className="space-y-4">
        <Link to={`/services/${serviceName}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {serviceName}
          </Button>
        </Link>
        <div className="text-center py-12 text-muted-foreground">
          Pipeline not found
        </div>
      </div>
    );
  }

  const pendingCommits = pipeline.commits.filter((c) => !c.inProduction);
  const deployedDate = new Date(pipeline.deployedAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      <Link to={`/services/${serviceName}`}>
        <Button variant="ghost" size="sm" className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {serviceName}
        </Button>
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            Pipeline #{pipeline.pipelineId}
          </h2>
          <a
            href={pipeline.pipelineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1 text-sm"
          >
            Open in GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{pipeline.serviceName}</span>
          <span>·</span>
          <span>Deployed to PPRD: {deployedDate}</span>
          <span>·</span>
          <span>Target commit: </span>
          <CommitLink sha={pipeline.sha} />
        </div>
      </div>

      {/* Pending commits summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Commits pending promotion to PRD
            <Badge variant="secondary" className="ml-1">
              {pendingCommits.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingCommits.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <CheckCircle className="h-4 w-4 text-status-ok" />
              All commits in this pipeline are already in production.
            </div>
          ) : (
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Commit</TableHead>
                    <TableHead className="w-32">Jira</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="w-36">Author</TableHead>
                    <TableHead className="w-28">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCommits.map((commit) => (
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
                      <TableCell className="text-sm max-w-xs truncate">
                        {commit.message}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {commit.author}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {commit.createdAt}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
