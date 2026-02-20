import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, ExternalLink, Info, X, Search } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CommitLink } from '@/components/CommitLink';
import { fetchJiraIssues, fetchServices, fetchPreprodCommitsForJira, fetchPipelinesForService } from '@/lib/api';
import type { PromotionScope, ResolvedCommit, ServicePipeline } from '@/types/deployment';
import { format } from 'date-fns';

interface ScopeSelectorProps {
  onAnalyze: (commits: ResolvedCommit[]) => void;
  isAnalyzing: boolean;
}

export function ScopeSelector({ onAnalyze, isAnalyzing }: ScopeSelectorProps) {
  const [scope, setScope] = useState<PromotionScope | ''>('');
  const [selectedJiras, setSelectedJiras] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedPipelineId, setSelectedPipelineId] = useState('');
  const [jiraSearch, setJiraSearch] = useState('');
  const [jiraPopoverOpen, setJiraPopoverOpen] = useState(false);

  const { data: jiraIssues } = useQuery({
    queryKey: ['jiraIssues'],
    queryFn: fetchJiraIssues,
  });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  // Fetch commits for all selected Jiras
  const jiraQueries = useQuery({
    queryKey: ['preprodCommits', 'jira', selectedJiras],
    queryFn: async () => {
      const results = await Promise.all(selectedJiras.map(k => fetchPreprodCommitsForJira(k)));
      const byService = new Map<string, ResolvedCommit>();
      selectedJiras.forEach((jiraKey, i) => {
        for (const rc of results[i]) {
          byService.set(rc.serviceName, { ...rc, jiraKey });
        }
      });
      return Array.from(byService.values());
    },
    enabled: scope === 'jira' && selectedJiras.length > 0,
  });

  // Fetch pipelines for selected service
  const { data: pipelines } = useQuery({
    queryKey: ['servicePipelines', selectedService],
    queryFn: () => fetchPipelinesForService(selectedService),
    enabled: scope === 'pipeline' && !!selectedService,
  });

  const servicesWithPreprod = services?.filter(s => s.effectiveCommits.PPRD !== null) || [];
  const jiraCommits = jiraQueries.data || [];

  const selectedPipeline = pipelines?.find(p => p.pipelineId === selectedPipelineId) || null;

  const resolvedCommits = scope === 'jira'
    ? jiraCommits
    : (selectedPipeline ? [{ serviceName: selectedPipeline.serviceName, sha: selectedPipeline.sha }] : []);
  const canAnalyze = resolvedCommits.length > 0;

  const availableJiras = useMemo(() => {
    const notSelected = jiraIssues?.filter(i => !selectedJiras.includes(i.key)) || [];
    if (!jiraSearch) return notSelected;
    const q = jiraSearch.toLowerCase();
    return notSelected.filter(i => i.key.toLowerCase().includes(q) || i.title.toLowerCase().includes(q));
  }, [jiraIssues, selectedJiras, jiraSearch]);

  const addJira = (key: string) => {
    if (key && !selectedJiras.includes(key)) {
      setSelectedJiras(prev => [...prev, key]);
      setJiraSearch('');
    }
  };

  const removeJira = (key: string) => {
    setSelectedJiras(prev => prev.filter(k => k !== key));
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Promotion Scope</h3>
        <RadioGroup
          value={scope}
          onValueChange={(v) => {
            setScope(v as PromotionScope);
            setSelectedJiras([]);
            setSelectedService('');
            setSelectedPipelineId('');
          }}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="jira" id="scope-jira" />
            <Label htmlFor="scope-jira" className="cursor-pointer">Jira Issues</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="pipeline" id="scope-pipeline" />
            <Label htmlFor="scope-pipeline" className="cursor-pointer">Pipeline</Label>
          </div>
        </RadioGroup>
      </div>

      {scope === 'jira' && (
        <JiraScopeSection
          selectedJiras={selectedJiras}
          jiraIssues={jiraIssues || []}
          jiraCommits={jiraCommits}
          jiraSearch={jiraSearch}
          setJiraSearch={setJiraSearch}
          jiraPopoverOpen={jiraPopoverOpen}
          setJiraPopoverOpen={setJiraPopoverOpen}
          availableJiras={availableJiras}
          addJira={addJira}
          removeJira={removeJira}
          isLoading={jiraQueries.isLoading}
        />
      )}

      {scope === 'pipeline' && (
        <PipelineScopeSection
          servicesWithPreprod={servicesWithPreprod}
          selectedService={selectedService}
          setSelectedService={(v) => { setSelectedService(v); setSelectedPipelineId(''); }}
          pipelines={pipelines || []}
          selectedPipelineId={selectedPipelineId}
          setSelectedPipelineId={setSelectedPipelineId}
          selectedPipeline={selectedPipeline}
        />
      )}

      <Button onClick={() => canAnalyze && onAnalyze(resolvedCommits)} disabled={!canAnalyze || isAnalyzing}>
        {isAnalyzing ? 'Analyzing…' : 'Analyze Production Impact'}
      </Button>
    </div>
  );
}

// --- Jira scope sub-component ---

interface JiraScopeSectionProps {
  selectedJiras: string[];
  jiraIssues: { key: string; title: string }[];
  jiraCommits: ResolvedCommit[];
  jiraSearch: string;
  setJiraSearch: (v: string) => void;
  jiraPopoverOpen: boolean;
  setJiraPopoverOpen: (v: boolean) => void;
  availableJiras: { key: string; title: string }[];
  addJira: (key: string) => void;
  removeJira: (key: string) => void;
  isLoading: boolean;
}

function JiraScopeSection({
  selectedJiras, jiraIssues, jiraCommits, jiraSearch, setJiraSearch,
  jiraPopoverOpen, setJiraPopoverOpen, availableJiras, addJira, removeJira, isLoading,
}: JiraScopeSectionProps) {
  return (
    <div className="space-y-3">
      {selectedJiras.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedJiras.map(key => {
            const issue = jiraIssues.find(i => i.key === key);
            return (
              <Badge key={key} variant="secondary" className="gap-1 pr-1">
                {key}{issue ? ` — ${issue.title}` : ''}
                <button onClick={() => removeJira(key)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      <Popover open={jiraPopoverOpen} onOpenChange={setJiraPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-80 justify-start font-normal text-muted-foreground">
            <Search className="h-4 w-4 mr-2" />
            Add a Jira issue...
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2" align="start">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by key or title..."
              value={jiraSearch}
              onChange={(e) => setJiraSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {availableJiras.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">No issues found</p>
            )}
            {availableJiras.map(issue => (
              <button
                key={issue.key}
                onClick={() => { addJira(issue.key); setJiraPopoverOpen(false); }}
                className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors"
              >
                <span className="font-mono font-medium">{issue.key}</span>
                <span className="text-muted-foreground ml-2">{issue.title}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {jiraCommits.length > 0 && (
        <Card className="bg-muted/30">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              Resolved commits from PPRD
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  Only commits already deployed in PPRD can be promoted to PROD.
                </TooltipContent>
              </Tooltip>
            </div>
            {jiraCommits.map(rc => (
              <div key={rc.serviceName} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-status-ok" />
                <span className="text-muted-foreground">{rc.serviceName}</span>
                <span className="text-foreground">→</span>
                <CommitLink sha={rc.sha} />
                {rc.jiraKey && (
                  <span className="text-xs text-muted-foreground">({rc.jiraKey})</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {selectedJiras.length > 0 && jiraCommits.length === 0 && !isLoading && (
        <p className="text-sm text-muted-foreground">No commits from the selected issues are deployed in PPRD.</p>
      )}
    </div>
  );
}

// --- Pipeline scope sub-component ---

interface PipelineScopeSectionProps {
  servicesWithPreprod: { serviceName: string }[];
  selectedService: string;
  setSelectedService: (v: string) => void;
  pipelines: ServicePipeline[];
  selectedPipelineId: string;
  setSelectedPipelineId: (v: string) => void;
  selectedPipeline: ServicePipeline | null;
}

function PipelineScopeSection({
  servicesWithPreprod, selectedService, setSelectedService,
  pipelines, selectedPipelineId, setSelectedPipelineId, selectedPipeline,
}: PipelineScopeSectionProps) {
  return (
    <div className="space-y-3">
      <Select value={selectedService} onValueChange={setSelectedService}>
        <SelectTrigger className="w-72">
          <SelectValue placeholder="Select a service..." />
        </SelectTrigger>
        <SelectContent>
          {servicesWithPreprod.map(svc => (
            <SelectItem key={svc.serviceName} value={svc.serviceName}>
              {svc.serviceName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedService && pipelines.length > 0 && (
        <Select value={selectedPipelineId} onValueChange={setSelectedPipelineId}>
          <SelectTrigger className="w-96">
            <SelectValue placeholder="Select a pipeline..." />
          </SelectTrigger>
          <SelectContent>
            {pipelines.map(p => (
              <SelectItem key={p.pipelineId} value={p.pipelineId}>
                #{p.pipelineId} — {p.sha.slice(0, 7)} — {format(new Date(p.deployedAt), 'dd/MM/yyyy HH:mm')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedService && pipelines.length === 0 && (
        <p className="text-sm text-muted-foreground">No pipelines deployed in PPRD for this service.</p>
      )}

      {selectedPipeline && (
        <Card className="bg-muted/30">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-status-ok" />
              <span className="text-muted-foreground">{selectedPipeline.serviceName}</span>
              <span className="text-foreground">→</span>
              <CommitLink sha={selectedPipeline.sha} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <a
                href={selectedPipeline.pipelineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Pipeline #{selectedPipeline.pipelineId}
                <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-xs text-muted-foreground">
                deployed {format(new Date(selectedPipeline.deployedAt), 'dd/MM/yyyy HH:mm')}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
