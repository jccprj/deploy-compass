import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Info } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { fetchJiraIssues, fetchServices, fetchPreprodCommitsForJira, fetchPreprodCommitForService } from '@/lib/api';
import type { PromotionScope, ResolvedCommit } from '@/types/deployment';

interface ScopeSelectorProps {
  onAnalyze: (commits: ResolvedCommit[]) => void;
  isAnalyzing: boolean;
}

export function ScopeSelector({ onAnalyze, isAnalyzing }: ScopeSelectorProps) {
  const [scope, setScope] = useState<PromotionScope | ''>('');
  const [selectedJira, setSelectedJira] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const { data: jiraIssues } = useQuery({
    queryKey: ['jiraIssues'],
    queryFn: fetchJiraIssues,
  });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  const { data: jiraCommits } = useQuery({
    queryKey: ['preprodCommits', 'jira', selectedJira],
    queryFn: () => fetchPreprodCommitsForJira(selectedJira),
    enabled: scope === 'jira' && !!selectedJira,
  });

  const { data: serviceCommit } = useQuery({
    queryKey: ['preprodCommits', 'service', selectedService],
    queryFn: () => fetchPreprodCommitForService(selectedService),
    enabled: scope === 'service' && !!selectedService,
  });

  const servicesWithPreprod = services?.filter(s => s.effectiveCommits.PREPROD !== null) || [];

  const resolvedCommits = scope === 'jira' ? (jiraCommits || []) : (serviceCommit ? [serviceCommit] : []);
  const canAnalyze = resolvedCommits.length > 0;

  const handleAnalyze = () => {
    if (canAnalyze) onAnalyze(resolvedCommits);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Promotion Scope</h3>
        <RadioGroup
          value={scope}
          onValueChange={(v) => {
            setScope(v as PromotionScope);
            setSelectedJira('');
            setSelectedService('');
          }}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="jira" id="scope-jira" />
            <Label htmlFor="scope-jira" className="cursor-pointer">Jira Issue</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="service" id="scope-service" />
            <Label htmlFor="scope-service" className="cursor-pointer">Service</Label>
          </div>
        </RadioGroup>
      </div>

      {scope === 'jira' && (
        <div className="space-y-3">
          <Select value={selectedJira} onValueChange={setSelectedJira}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Select a Jira issue..." />
            </SelectTrigger>
            <SelectContent>
              {jiraIssues?.map(issue => (
                <SelectItem key={issue.key} value={issue.key}>
                  {issue.key} — {issue.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {jiraCommits && jiraCommits.length > 0 && (
            <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  Resolved commits from PREPROD
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Only commits already deployed in PREPROD can be promoted to PROD.
                    </TooltipContent>
                  </Tooltip>
                </div>
                {jiraCommits.map(rc => (
                  <div key={rc.serviceName} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-status-ok" />
                    <span className="text-muted-foreground">{rc.serviceName}</span>
                    <span className="text-foreground">→</span>
                    <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{rc.sha}</code>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {selectedJira && jiraCommits && jiraCommits.length === 0 && (
            <p className="text-sm text-muted-foreground">No commits from this issue are deployed in PREPROD.</p>
          )}
        </div>
      )}

      {scope === 'service' && (
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

          {serviceCommit && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-status-ok" />
                  <span className="text-muted-foreground">{serviceCommit.serviceName}</span>
                  <span className="text-foreground">→</span>
                  <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{serviceCommit.sha}</code>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Button onClick={handleAnalyze} disabled={!canAnalyze || isAnalyzing}>
        {isAnalyzing ? 'Analyzing…' : 'Analyze Production Impact'}
      </Button>
    </div>
  );
}
