import { ExternalLink, Package, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CommitLink } from '@/components/CommitLink';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ExecutionStep } from '@/types/deployment';

interface ExecutionPlanProps {
  steps: ExecutionStep[];
}

export function ExecutionPlan({ steps }: ExecutionPlanProps) {
  const totalEmbedded = steps.reduce((sum, s) => sum + s.embeddedCommits.length, 0);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Production Execution Plan</h3>
          {totalEmbedded > 0 && (
            <Badge variant="outline" className="gap-1 text-xs border-amber-500/30 text-amber-600">
              <Package className="h-3 w-3" />
              {totalEmbedded} embedded commit{totalEmbedded > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Services that need to be promoted to PROD, in order. Embedded commits ride along in the same pipeline.
        </p>
      </div>

      <div className="space-y-3">
        {steps.map(step => (
          <StepCard key={step.order} step={step} />
        ))}
      </div>
    </div>
  );
}

function StepCard({ step }: { step: ExecutionStep }) {
  const hasEmbedded = step.embeddedCommits.length > 0;

  return (
    <Card className={hasEmbedded ? 'border-amber-500/20' : ''}>
      <CardContent className="p-4 space-y-3">
        {/* Main step header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
              {step.order}
            </span>
            <span className="font-medium text-sm">{step.serviceName}</span>
            <Badge
              variant={step.reason === 'Dependency' ? 'secondary' : 'default'}
              className="text-xs"
            >
              {step.reason === 'Dependency' ? 'Auto-added' : 'Requested'}
            </Badge>
          </div>
          {step.pipelineId && (
            <a
              href={step.pipelineUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Pipeline #{step.pipelineId}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* Deploy action row */}
        <div className="flex items-center gap-3 text-sm">
          <CommitLink sha={step.sha} />
          <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {step.deployAction}
          </code>
          {step.jiraKeys.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {step.jiraKeys.join(', ')}
            </span>
          )}
        </div>

        {/* Embedded commits */}
        {hasEmbedded && (
          <div className="border-t border-amber-500/20 pt-3 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-medium text-amber-600">
                {step.embeddedCommits.length} commit{step.embeddedCommits.length > 1 ? 's' : ''} embarcado{step.embeddedCommits.length > 1 ? 's' : ''} neste pipeline
              </span>
            </div>
            <div className="space-y-1.5 pl-5">
              {step.embeddedCommits.map(ec => (
                <div key={ec.sha} className="flex items-center gap-2 text-xs">
                  <Package className="h-3 w-3 text-muted-foreground" />
                  <CommitLink sha={ec.sha} />
                  {ec.jiraKey && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {ec.jiraKey}
                    </Badge>
                  )}
                  {ec.message && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-muted-foreground truncate max-w-[250px] cursor-help">
                          {ec.message}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{ec.message}</p>
                        {ec.author && <p className="text-muted-foreground mt-1">by {ec.author}</p>}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
