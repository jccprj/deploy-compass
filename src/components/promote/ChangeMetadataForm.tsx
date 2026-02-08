import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ChangeMetadata, RiskLevel, RollbackStrategy } from '@/types/deployment';

interface ChangeMetadataFormProps {
  metadata: ChangeMetadata;
  onChange: (metadata: ChangeMetadata) => void;
  onSubmit: () => void;
  disabled: boolean;
  isSubmitting: boolean;
}

export function ChangeMetadataForm({ metadata, onChange, onSubmit, disabled, isSubmitting }: ChangeMetadataFormProps) {
  const canSubmit = !disabled && metadata.title.trim() !== '' && metadata.rollbackStrategy !== '' as RollbackStrategy;

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-medium text-foreground">Production Change Details</h3>

      <div className="grid gap-4 max-w-lg">
        <div className="space-y-1.5">
          <Label htmlFor="change-title">Title</Label>
          <Input
            id="change-title"
            value={metadata.title}
            onChange={e => onChange({ ...metadata, title: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="linked-jira">Linked Jira</Label>
          <Input
            id="linked-jira"
            value={metadata.linkedJira}
            onChange={e => onChange({ ...metadata, linkedJira: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Risk Level</Label>
          <Select
            value={metadata.riskLevel}
            onValueChange={v => onChange({ ...metadata, riskLevel: v as RiskLevel })}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Rollback Strategy</Label>
          <Select
            value={metadata.rollbackStrategy}
            onValueChange={v => onChange({ ...metadata, rollbackStrategy: v as RollbackStrategy })}
          >
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Select a rollback strategy..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">Promote previous PROD commit</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={onSubmit} disabled={!canSubmit || isSubmitting} size="lg">
        {isSubmitting ? 'Creating…' : 'Create Production Change'}
      </Button>
    </div>
  );
}
