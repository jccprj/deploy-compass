import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { PromotionContext } from '@/components/promote/PromotionContext';
import { ScopeSelector } from '@/components/promote/ScopeSelector';
import { ValidationChecks } from '@/components/promote/ValidationChecks';
import { ExecutionPlan } from '@/components/promote/ExecutionPlan';
import { ExpectedProdState } from '@/components/promote/ExpectedProdState';
import { ChangeMetadataForm } from '@/components/promote/ChangeMetadataForm';
import { analyzeProductionImpact, createProductionChange } from '@/lib/api';
import type { ResolvedCommit, ImpactAnalysis, ChangeMetadata } from '@/types/deployment';

export default function PromoteToProdPage() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<ImpactAnalysis | null>(null);
  const [metadata, setMetadata] = useState<ChangeMetadata>({
    title: '',
    linkedJira: '',
    riskLevel: 'Low',
    rollbackStrategy: 'previous',
  });
  const [scopeKey, setScopeKey] = useState(0);

  const handleAnalyze = useCallback(async (commits: ResolvedCommit[]) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await analyzeProductionImpact(commits);
      setAnalysis(result);
      // Pre-fill metadata title
      const services = commits.map(c => c.serviceName).join(', ');
      setMetadata(prev => ({
        ...prev,
        title: `Promote ${services} to PROD`,
      }));
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleCreateChange = useCallback(async () => {
    if (!analysis) return;
    setIsSubmitting(true);
    try {
      await createProductionChange(analysis.executionPlan, metadata);
      toast({
        title: 'Production change created',
        description: metadata.title,
      });
      // Reset
      setAnalysis(null);
      setMetadata({ title: '', linkedJira: '', riskLevel: 'Low', rollbackStrategy: 'previous' });
      setScopeKey(k => k + 1);
    } finally {
      setIsSubmitting(false);
    }
  }, [analysis, metadata, toast]);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Promote to Production</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create a safe, deterministic production deployment change.
        </p>
      </div>

      {/* Section 1 — Fixed Context */}
      <Card>
        <CardContent className="p-5">
          <PromotionContext />
        </CardContent>
      </Card>

      {/* Section 2 — Scope Selection */}
      <Card>
        <CardContent className="p-5">
          <ScopeSelector key={scopeKey} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </CardContent>
      </Card>

      {/* Sections 3-6 — Analysis Results */}
      {analysis && (
        <Card>
          <CardContent className="p-5 space-y-6">
            <ValidationChecks checks={analysis.validationChecks} />
            <Separator />
            <ExecutionPlan steps={analysis.executionPlan} />
            <Separator />
            <ExpectedProdState state={analysis.expectedProdState} />

            {!analysis.hasBlockers && (
              <>
                <Separator />
                <ChangeMetadataForm
                  metadata={metadata}
                  onChange={setMetadata}
                  onSubmit={handleCreateChange}
                  disabled={analysis.hasBlockers}
                  isSubmitting={isSubmitting}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
