import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ExecutionStep } from '@/types/deployment';

interface ExecutionPlanProps {
  steps: ExecutionStep[];
}

export function ExecutionPlan({ steps }: ExecutionPlanProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground">Production Execution Plan</h3>
        <p className="text-xs text-muted-foreground">Services that need to be promoted to PROD, in order.</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Commit</TableHead>
            <TableHead>Pipeline</TableHead>
            <TableHead>Deploy Action</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Jira</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {steps.map(step => (
            <TableRow key={step.order}>
              <TableCell className="font-medium">{step.order}</TableCell>
              <TableCell className="font-medium">{step.serviceName}</TableCell>
              <TableCell>
                <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{step.sha}</code>
              </TableCell>
              <TableCell>
                {step.pipelineId ? (
                  <a
                    href={step.pipelineUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    #{step.pipelineId}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <code className="text-xs text-muted-foreground">{step.deployAction}</code>
              </TableCell>
              <TableCell>
                <Badge
                  variant={step.reason === 'Dependency' ? 'secondary' : 'default'}
                  className="text-xs"
                >
                  {step.reason === 'Dependency' ? 'Auto-added' : 'Requested'}
                </Badge>
              </TableCell>
              <TableCell>
                {step.jiraKeys.length > 0 ? (
                  <span className="text-xs text-muted-foreground">{step.jiraKeys.join(', ')}</span>
                ) : (
                  <span className="text-xs text-muted-foreground italic">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
