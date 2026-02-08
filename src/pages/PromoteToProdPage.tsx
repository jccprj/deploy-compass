import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PromotionContext } from '@/components/promote/PromotionContext';
import { ScopeSelector } from '@/components/promote/ScopeSelector';
import { ValidationChecks } from '@/components/promote/ValidationChecks';
import { ExecutionPlan } from '@/components/promote/ExecutionPlan';
import { ExpectedProdState } from '@/components/promote/ExpectedProdState';
import { analyzeProductionImpact } from '@/lib/api';
import type { ResolvedCommit, ImpactAnalysis } from '@/types/deployment';

export default function PromoteToProdPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ImpactAnalysis | null>(null);
  const [scopeKey, setScopeKey] = useState(0);

  const handleAnalyze = useCallback(async (commits: ResolvedCommit[]) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await analyzeProductionImpact(commits);
      setAnalysis(result);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Promote to Production</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Analyze production impact and identify required service promotions.
        </p>
      </div>

      <Card>
        <CardContent className="p-5">
          <PromotionContext />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <ScopeSelector key={scopeKey} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardContent className="p-5 space-y-6">
            <ValidationChecks checks={analysis.validationChecks} />
            <Separator />
            <ExecutionPlan steps={analysis.executionPlan} />
            <Separator />
            <ExpectedProdState state={analysis.expectedProdState} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
