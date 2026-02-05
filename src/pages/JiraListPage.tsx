import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { fetchJiraIssues } from '@/lib/api';
import { ENVIRONMENTS, type EnvironmentState } from '@/types/deployment';

function StateIcon({ state }: { state: EnvironmentState }) {
  if (state === 'OK') {
    return <CheckCircle className="h-5 w-5 text-status-ok mx-auto" />;
  }
  return <AlertTriangle className="h-5 w-5 text-status-warning mx-auto" />;
}

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

export default function JiraListPage() {
  const { data: issues, isLoading } = useQuery({
    queryKey: ['jira-issues'],
    queryFn: fetchJiraIssues,
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
        <h2 className="text-2xl font-semibold tracking-tight">Jira Issues</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track deployment progress across environments
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Jira Key</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-24">Type</TableHead>
              <TableHead className="w-32">Status</TableHead>
              {ENVIRONMENTS.map((env) => (
                <TableHead key={env} className="w-24 text-center">
                  {env}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues?.map((issue) => (
              <TableRow key={issue.key}>
                <TableCell>
                  <Link
                    to={`/jira/${issue.key}`}
                    className="font-mono text-sm font-medium text-primary hover:underline"
                  >
                    {issue.key}
                  </Link>
                </TableCell>
                <TableCell className="max-w-md truncate">{issue.title}</TableCell>
                <TableCell>
                  <TypeBadge type={issue.type} />
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{issue.status}</span>
                </TableCell>
                {ENVIRONMENTS.map((env) => (
                  <TableCell key={env} className="text-center">
                    <StateIcon state={issue.environments[env].state} />
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
