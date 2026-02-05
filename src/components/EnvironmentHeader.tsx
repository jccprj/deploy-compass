import { ENVIRONMENTS } from '@/types/deployment';

interface EnvironmentHeaderProps {
  className?: string;
}

export function EnvironmentHeader({ className }: EnvironmentHeaderProps) {
  return (
    <>
      {ENVIRONMENTS.map((env) => (
        <th
          key={env}
          className={`h-12 px-4 text-center align-middle font-medium text-muted-foreground ${className}`}
        >
          {env}
        </th>
      ))}
    </>
  );
}
