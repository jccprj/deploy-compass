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
        <p className="text-xs text-muted-foreground">Execution order is mandatory and cannot be changed.</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Commit</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {steps.map(step => (
            <TableRow key={step.order}>
              <TableCell className="font-medium">{step.order}</TableCell>
              <TableCell>{step.serviceName}</TableCell>
              <TableCell>
                <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{step.sha}</code>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">{step.action}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={step.reason === 'Dependency' ? 'secondary' : 'default'}
                  className="text-xs"
                >
                  {step.reason === 'Dependency' ? 'Auto-added' : 'Requested'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
