import { CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ExpectedProdState as ProdState } from '@/types/deployment';

interface ExpectedProdStateProps {
  state: ProdState[];
}

export function ExpectedProdState({ state }: ExpectedProdStateProps) {
  const hasIncompatible = state.some(s => s.status === 'incompatible');

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Expected PROD State</h3>

      {hasIncompatible && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Incompatibilities remain after execution. Change creation is blocked.
          </AlertDescription>
        </Alert>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Commit</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.map(s => (
            <TableRow key={s.serviceName}>
              <TableCell>{s.serviceName}</TableCell>
              <TableCell>
                {s.changed ? (
                  <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{s.sha}</code>
                ) : (
                  <span className="text-xs text-muted-foreground italic">unchanged</span>
                )}
              </TableCell>
              <TableCell>
                {s.status === 'compatible' ? (
                  <CheckCircle className="h-4 w-4 text-status-ok" />
                ) : (
                  <XCircle className="h-4 w-4 text-status-error" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
