import {
  mockJiraIssues,
  mockJiraIssueDetails,
  mockServices,
  mockServiceDetails,
  getCommitEnvironmentDetail,
  getPreprodCommitsForJira,
  getPreprodCommitForService,
  computeImpactAnalysis,
} from './mock-data';
import type {
  JiraIssue,
  JiraIssueDetail,
  Service,
  ServiceDetail,
  CommitEnvironmentDetail,
  Environment,
  ResolvedCommit,
  ImpactAnalysis,
  ExecutionStep,
  ChangeMetadata,
} from '@/types/deployment';

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API 1 — Jira Issues List
export async function fetchJiraIssues(): Promise<JiraIssue[]> {
  await delay(300);
  return mockJiraIssues;
}

// API 2 — Jira Issue Detail
export async function fetchJiraIssueDetail(key: string): Promise<JiraIssueDetail | null> {
  await delay(200);
  return mockJiraIssueDetails[key] || null;
}

// API 3 — Service Selection
export async function fetchServices(): Promise<Service[]> {
  await delay(300);
  return mockServices;
}

// API 4 — Service Detail
export async function fetchServiceDetail(serviceName: string): Promise<ServiceDetail | null> {
  await delay(200);
  return mockServiceDetails[serviceName] || null;
}

// API 5 — Commit Dependency Detail
export async function fetchCommitEnvironmentDetail(
  sha: string,
  env: Environment
): Promise<CommitEnvironmentDetail | null> {
  await delay(150);
  return getCommitEnvironmentDetail(sha, env);
}

// API 6 — Promotion: PREPROD commits for a Jira issue
export async function fetchPreprodCommitsForJira(jiraKey: string): Promise<ResolvedCommit[]> {
  await delay(200);
  return getPreprodCommitsForJira(jiraKey);
}

// API 7 — Promotion: PREPROD commit for a service
export async function fetchPreprodCommitForService(serviceName: string): Promise<ResolvedCommit | null> {
  await delay(150);
  return getPreprodCommitForService(serviceName);
}

// API 8 — Promotion: Analyze production impact
export async function analyzeProductionImpact(commits: ResolvedCommit[]): Promise<ImpactAnalysis> {
  await delay(400);
  return computeImpactAnalysis(commits);
}

// API 9 — Promotion: Create production change
export async function createProductionChange(
  _plan: ExecutionStep[],
  _metadata: ChangeMetadata
): Promise<{ success: boolean }> {
  await delay(300);
  return { success: true };
}

// Search helper
export async function searchAll(query: string): Promise<{
  jiraIssues: JiraIssue[];
  services: Service[];
  commits: Array<{ sha: string; serviceName: string; jiraKey?: string }>;
}> {
  await delay(100);
  const lowerQuery = query.toLowerCase();

  const jiraIssues = mockJiraIssues.filter(
    (issue) =>
      issue.key.toLowerCase().includes(lowerQuery) ||
      issue.title.toLowerCase().includes(lowerQuery)
  );

  const services = mockServices.filter((service) =>
    service.serviceName.toLowerCase().includes(lowerQuery)
  );

  const commits: Array<{ sha: string; serviceName: string; jiraKey?: string }> = [];
  for (const [serviceName, detail] of Object.entries(mockServiceDetails)) {
    for (const commit of detail.commits) {
      if (commit.sha.toLowerCase().includes(lowerQuery)) {
        commits.push({
          sha: commit.sha,
          serviceName,
          jiraKey: commit.jiraKey,
        });
      }
    }
  }

  return { jiraIssues, services, commits };
}
