// Environment types
export const ENVIRONMENTS = ['QA', 'PREPROD', 'PROD'] as const;
export type Environment = typeof ENVIRONMENTS[number];

// Status enums
export type DeploymentStatus = 'DEPLOYED' | 'NOT_DEPLOYED';
export type DependencyStatus = 'OK' | 'INCOMPATIBLE' | 'MISSING';
export type EnvironmentState = 'OK' | 'INCOMPLETE';

// Jira Issue types
export interface JiraIssue {
  key: string;
  title: string;
  type: 'Bug' | 'Story' | 'Task' | 'Epic';
  status: string;
  environments: Record<Environment, { state: EnvironmentState }>;
}

export interface CommitEnvironmentStatus {
  deploymentStatus: DeploymentStatus;
  dependencyStatus?: DependencyStatus;
}

export interface Commit {
  sha: string;
  createdAt: string;
  environments: Record<Environment, CommitEnvironmentStatus>;
}

export interface ServiceCommits {
  serviceName: string;
  commits: Commit[];
}

export interface JiraIssueDetail {
  key: string;
  title: string;
  status: string;
  type: 'Bug' | 'Story' | 'Task' | 'Epic';
  services: ServiceCommits[];
}

// Service types
export interface EffectiveCommit {
  sha: string;
  dependencyStatus: DependencyStatus;
}

export interface Service {
  serviceName: string;
  effectiveCommits: Record<Environment, EffectiveCommit | null>;
}

export interface ServiceCommit {
  sha: string;
  jiraKey: string;
  createdAt: string;
  environments: Record<Environment, CommitEnvironmentStatus>;
}

export interface ServiceDetail {
  serviceName: string;
  repository: string;
  effectiveCommits: Record<Environment, EffectiveCommit | null>;
  commits: ServiceCommit[];
}

// Dependency Popover types
export interface Dependency {
  service: string;
  expectedCommit: string;
  actualCommit: string;
  status: 'OK' | 'INCOMPATIBLE';
}

export interface CommitEnvironmentDetail {
  commit: string;
  environment: Environment;
  pipelineId: string;
  deployedAt: string;
  dependencies: Dependency[];
}

// Promotion types
export type PromotionScope = 'jira' | 'service';

export interface ResolvedCommit {
  serviceName: string;
  sha: string;
  jiraKey?: string;
}

export interface ValidationCheck {
  label: string;
  status: 'pass' | 'warn' | 'fail';
  message?: string;
}

export interface ExecutionStep {
  order: number;
  serviceName: string;
  sha: string;
  action: 'Promote';
  reason: 'Requested' | 'Dependency';
  deployAction: string; // e.g. "Deploy e7f8g9 to PROD"
  jiraKeys: string[];
}

export interface ExpectedProdState {
  serviceName: string;
  sha: string;
  status: 'compatible' | 'incompatible';
  changed: boolean;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';
export type RollbackStrategy = 'previous' | 'custom';

export interface ChangeMetadata {
  title: string;
  linkedJira: string;
  riskLevel: RiskLevel;
  rollbackStrategy: RollbackStrategy;
}

export interface ImpactAnalysis {
  validationChecks: ValidationCheck[];
  executionPlan: ExecutionStep[];
  expectedProdState: ExpectedProdState[];
  hasBlockers: boolean;
}
