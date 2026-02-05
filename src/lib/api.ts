import {
  mockJiraIssues,
  mockJiraIssueDetails,
  mockServices,
  mockServiceDetails,
  getCommitEnvironmentDetail,
} from './mock-data';
import type {
  JiraIssue,
  JiraIssueDetail,
  Service,
  ServiceDetail,
  CommitEnvironmentDetail,
  Environment,
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
