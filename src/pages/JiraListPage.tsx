import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, XCircle, Loader2, ArrowUpDown, Filter, Search, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchJiraIssues } from '@/lib/api';
import { ENVIRONMENTS, type EnvironmentState } from '@/types/deployment';

function StateIcon({ state }: { state: EnvironmentState }) {
  if (state === 'OK') {
    return <CheckCircle className="h-5 w-5 text-status-ok mx-auto" />;
  }
  
  if (state === 'OVERWRITTEN') {
    return <AlertTriangle className="h-5 w-5 text-status-warning mx-auto" />;
  }

  if (state === 'NOT_DEPLOYED') {
    return <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />;
  }

  return <AlertCircle className="h-5 w-5 text-status-info mx-auto" />;
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

type SortField = 'key' | 'title' | 'type' | 'status' | 'QA' | 'PPRD' | 'PRD';
type SortDir = 'asc' | 'desc';

export default function JiraListPage() {
  const { data: issues, isLoading } = useQuery({
    queryKey: ['jira-issues'],
    queryFn: fetchJiraIssues,
  });

  const [sortField, setSortField] = useState<SortField>('key');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const stateOrder: Record<EnvironmentState, number> = { OK: 0, INCOMPLETE: 1, NOT_DEPLOYED: 2, OVERWRITTEN: 3 };

  const filtered = useMemo(() => {
    if (!issues) return [];
    return issues.filter(i => {
      if (filterType !== 'all' && i.type !== filterType) return false;
      if (filterStatus !== 'all' && i.status !== filterStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!i.key.toLowerCase().includes(q) && !i.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [issues, filterType, filterStatus, searchQuery]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortField === 'QA' || sortField === 'PPRD' || sortField === 'PRD') {
        return (stateOrder[a.deployments[sortField]] - stateOrder[b.deployments[sortField]]) * dir;
      }
      const va = a[sortField as keyof typeof a] as string;
      const vb = b[sortField as keyof typeof b] as string;
      return va.localeCompare(vb) * dir;
    });
  }, [filtered, sortField, sortDir]);

  const uniqueTypes = useMemo(() => {
    if (!issues) return [];
    return [...new Set(issues.map(i => i.type))];
  }, [issues]);

  const uniqueStatuses = useMemo(() => {
    if (!issues) return [];
    return [...new Set(issues.map(i => i.status))];
  }, [issues]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const SortableHead = ({ field, children, className }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <TableHead className={className}>
      <button
        onClick={() => toggleSort(field)}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        {children}
        <ArrowUpDown className={`h-3 w-3 ${sortField === field ? 'text-foreground' : 'text-muted-foreground/50'}`} />
      </button>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Jira Issues</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track deployment progress across environments
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by key or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map(t => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {uniqueStatuses.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(filterType !== 'all' || filterStatus !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setFilterType('all'); setFilterStatus('all'); }}>
            Clear
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead field="key" className="w-32">Jira Key</SortableHead>
              <SortableHead field="title">Title</SortableHead>
              <SortableHead field="type" className="w-24">Type</SortableHead>
              <SortableHead field="status" className="w-32">Status</SortableHead>
              {ENVIRONMENTS.map((env) => (
                <SortableHead key={env} field={env as SortField} className="w-24 text-center">
                  {env}
                </SortableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((issue) => (
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
                    <StateIcon state={issue.deployments[env]} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No issues match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
