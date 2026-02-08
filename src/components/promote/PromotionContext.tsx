import { Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function PromotionContext() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm font-medium border-border">
          <Lock className="h-3.5 w-3.5" />
          Source: PREPROD
        </Badge>
        <span className="text-muted-foreground">→</span>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm font-medium border-border">
          <Lock className="h-3.5 w-3.5" />
          Target: PROD
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Production promotions are always sourced from PREPROD. Only commits already deployed in PREPROD can be promoted.
      </p>
    </div>
  );
}
