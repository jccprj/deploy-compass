import {
  mockJiraIssues,
  mockJiraIssueDetails,
  mockServices,
  mockServiceDetails,
  getCommitEnvironmentDetail,
  getPreprodCommitsForJira,
  getPreprodCommitForService,
  computeImpactAnalysis,
  getMockCommitInfo,
  getPipelinesForService,
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
  CommitDetail,
  ServicePipeline,
} from '@/types/deployment';

// Toggle between mock data and real API
const useMockData = true;
const alertMockMethods = true; // Set to true to show alert for each mock API call

// Base URL for the API
const API_BASE_URL = 'http://localhost:5042';

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API 1 — Jira Issues List
export async function fetchJiraIssues(): Promise<JiraIssue[]> {
  if (useMockData) {
    await delay(300);
    if (alertMockMethods)
      alert('API 1 — Jira Issues List');
    return mockJiraIssues;
  }

  const response = await fetch(`${API_BASE_URL}/api/jira/issues`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Jira issues: ${response.statusText}`);
  }
  return response.json();
}

// API 2 — Jira Issue Detail
export async function fetchJiraIssueDetail(key: string): Promise<JiraIssueDetail | null> {
  if (useMockData) {
    await delay(200);
    if (alertMockMethods)
      alert(`API 2 — Jira Issue Detail for ${key}`);
    return mockJiraIssueDetails[key] || null;
  }

  const response = await fetch(`${API_BASE_URL}/api/jira/issues/${key}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch Jira issue detail: ${response.statusText}`);
  }
  return response.json();
}

// API 3 — Service Selection
export async function fetchServices(): Promise<Service[]> {
  if (useMockData) {
    await delay(300);
    if (alertMockMethods)
      alert('API 3 — Service Selection');
    return mockServices;
  }

  const response = await fetch(`${API_BASE_URL}/api/services`);
  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.statusText}`);
  }
  return response.json();
}

// API 4 — Service Detail
export async function fetchServiceDetail(serviceName: string): Promise<ServiceDetail | null> {
  if (useMockData) {
    await delay(200);
    if (alertMockMethods)
      alert(`API 4 — Service Detail for ${serviceName}`);
    return mockServiceDetails[serviceName] || null;
  }

  const response = await fetch(`${API_BASE_URL}/api/services/${serviceName}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch service detail: ${response.statusText}`);
  }
  return response.json();
}


// API 4.5 - Commit details
export async function getCommitInfo(
  sha: string
): Promise<CommitDetail | null> {
  if (useMockData) {
    await delay(200);
    return getMockCommitInfo(sha);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/commits/${sha}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch commit info: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching commit info:', error);
    throw error;
  }
}

// API 5 — Commit Dependency Detail
export async function fetchCommitEnvironmentDetail(
  sha: string,
  env: Environment
): Promise<CommitEnvironmentDetail | null> {
  if (useMockData) {
    await delay(150);
    if (alertMockMethods)
      alert(`API 5 — Commit Dependency Detail for ${sha} in ${env}`);
    return getCommitEnvironmentDetail(sha, env);
  }

  const response = await fetch(`${API_BASE_URL}/api/commits/${sha}/environments/${env}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch commit environment detail: ${response.statusText}`);
  }
  return response.json();
}

// API 6 — Promotion: PREPROD commits for a Jira issue
export async function fetchPreprodCommitsForJira(jiraKey: string): Promise<ResolvedCommit[]> {
  if (useMockData) {
    await delay(200);
    if (alertMockMethods)
      alert(`API 6 — Promotion: PREPROD commits for Jira issue ${jiraKey}`);
    return getPreprodCommitsForJira(jiraKey);
  }

  const response = await fetch(`${API_BASE_URL}/api/commits/environment/PPRD/jira/${jiraKey}`);
   if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch fetchPreprodCommitsForJira. detail: ${response.statusText}`);
  }
  return response.json();
}

// API 7 — Promotion: PREPROD commit for a service
export async function fetchPreprodCommitForService(serviceName: string): Promise<ResolvedCommit | null> {
  if (useMockData) {
    await delay(150);
    if (alertMockMethods)
      alert(`API 7 — Promotion: PREPROD commit for service ${serviceName}`);
    return getPreprodCommitForService(serviceName);
  }

  const response = await fetch(`${API_BASE_URL}/api/commits/environment/PPRD/service/${serviceName}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch fetchPreprodCommitForService. detail: ${response.statusText}`);
  }
  return response.json();
}

// API 7b — Promotion: Pipelines deployed to PPRD for a service
export async function fetchPipelinesForService(serviceName: string): Promise<ServicePipeline[]> {
  await delay(200);
  return getPipelinesForService(serviceName);
}

// API 8 — Promotion: Analyze production impact
export async function analyzeProductionImpact(commits: ResolvedCommit[]): Promise<ImpactAnalysis> {
  await delay(400);
  if (alertMockMethods)
    alert('API 8 — Promotion: Analyze production impact');
  return computeImpactAnalysis(commits);
}

// API 9 — Promotion: Create production change
export async function createProductionChange(
  _plan: ExecutionStep[],
  _metadata: ChangeMetadata
): Promise<{ success: boolean }> {
  await delay(300);
  if (alertMockMethods)
    alert('API 9 — Promotion: Create production change');
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
