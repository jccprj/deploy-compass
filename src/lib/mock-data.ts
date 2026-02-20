import type {
  JiraIssue,
  JiraIssueDetail,
  Service,
  ServiceDetail,
  CommitEnvironmentDetail,
} from '@/types/deployment';

// Mock Jira Issues List
export const mockJiraIssues: JiraIssue[] = [
  {
    key: 'PROJ-123',
    title: 'Fix freight calculation',
    type: 'Bug',
    status: 'In Progress',
    services: ['orders-api', 'shipping-api'],
    deployments: {
      QA: 'OK',
      PPRD: 'OK',
      PRD: 'INCOMPLETE',
    },
  },
  {
    key: 'PROJ-124',
    title: 'Add payment retry logic',
    type: 'Story',
    status: 'Done',
    services: ['payments-api'],
    deployments: {
      QA: 'OK',
      PPRD: 'OK',
      PRD: 'OK',
    },
  },
  {
    key: 'PROJ-125',
    title: 'Improve checkout performance',
    type: 'Task',
    status: 'In Progress',
    services: ['checkout-api'],
    deployments: {
      QA: 'OK',
      PPRD: 'NOT_DEPLOYED',
      PRD: 'NOT_DEPLOYED',
    },
  },
  {
    key: 'PROJ-126',
    title: 'User authentication refactor',
    type: 'Epic',
    status: 'In Review',
    services: ['auth-api', 'users-api'],
    deployments: {
      QA: 'INCOMPLETE',
      PPRD: 'NOT_DEPLOYED',
      PRD: 'NOT_DEPLOYED',
    },
  },
  {
    key: 'PROJ-127',
    title: 'Fix inventory sync issue',
    type: 'Bug',
    status: 'Done',
    services: ['inventory-api'],
    deployments: {
      QA: 'OK',
      PPRD: 'OK',
      PRD: 'OK',
    },
  },
];

// Mock Jira Issue Details
export const mockJiraIssueDetails: Record<string, JiraIssueDetail> = {
  'PROJ-123': {
    key: 'PROJ-123',
    title: 'Fix freight calculation',
    status: 'In Progress',
    type: 'Bug',
    url: 'https://jira.company.com/browse/PROJ-123',
    services: [
      {
        serviceName: 'orders-api',
        commits: [
          {
            sha: 'd4e5f6',
            author: 'Alice Johnson',
            message: 'Fix freight calculation for international orders',
            createdAt: '2026-01-29',
            environments: {
              QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
              PPRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
              PRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
            },
          },
          {
            sha: 'e7f8g9',
            author: 'Alice Johnson',
            message: 'Update freight calculation with new tax rules',
            createdAt: '2026-01-30',
            environments: {
              QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
              PPRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'INCOMPATIBLE' },
              PRD: { deploymentStatus: 'NOT_DEPLOYED' },
            },
          },
        ],
      },
      {
        serviceName: 'shipping-api',
        commits: [
          {
            sha: 'a1b2c3',
            author: 'Bob Smith',
            message: 'Update shipping provider integration',
            createdAt: '2026-01-28',
            environments: {
              QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
              PPRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
              PRD: { deploymentStatus: 'NOT_DEPLOYED' },
            },
          },
        ],
      },
    ],
  },
  'PROJ-124': {
    key: 'PROJ-124',
    title: 'Add payment retry logic',
    status: 'Done',
    type: 'Story',
    url: 'https://jira.company.com/browse/PROJ-124',
    services: [
      {
        serviceName: 'payments-api',
        commits: [
          {
            sha: 'f1g2h3',
            author: 'Carol Williams',
            message: 'Implement retry logic for failed payments',
            createdAt: '2026-01-25',
            environments: {
              QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
              PPRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
              PRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
            },
          },
        ],
      },
    ],
  },
  'PROJ-125': {
    key: 'PROJ-125',
    title: 'Improve checkout performance',
    status: 'In Progress',
    type: 'Task',
    url: 'https://jira.company.com/browse/PROJ-125',
    services: [
      {
        serviceName: 'checkout-api',
        commits: [
          {
            sha: 'x9y8z7',
            author: 'David Brown',
            message: 'Optimize checkout database queries',
            createdAt: '2026-01-31',
            environments: {
              QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
              PPRD: { deploymentStatus: 'NOT_DEPLOYED' },
              PRD: { deploymentStatus: 'NOT_DEPLOYED' },
            },
          },
        ],
      },
    ],
  },
  'PROJ-126': {
    key: 'PROJ-126',
    title: 'User authentication refactor',
    status: 'In Review',
    type: 'Epic',
    url: 'https://jira.company.com/browse/PROJ-126',
    services: [
      {
        serviceName: 'auth-api',
        commits: [
          {
            sha: 'm4n5o6',
            author: 'Emma Davis',
            message: 'Refactor JWT token generation',
            createdAt: '2026-02-01',
            environments: {
              QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'INCOMPATIBLE' },
              PPRD: { deploymentStatus: 'NOT_DEPLOYED' },
              PRD: { deploymentStatus: 'NOT_DEPLOYED' },
            },
          },
        ],
      },
      {
        serviceName: 'users-api',
        commits: [
          {
            sha: 'p7q8r9',
            author: 'Frank Miller',
            message: 'Update user model for new auth system',
            createdAt: '2026-02-01',
            environments: {
              QA: { deploymentStatus: 'NOT_DEPLOYED' },
              PPRD: { deploymentStatus: 'NOT_DEPLOYED' },
              PRD: { deploymentStatus: 'NOT_DEPLOYED' },
            },
          },
        ],
      },
    ],
  },
  'PROJ-127': {
    key: 'PROJ-127',
    title: 'Fix inventory sync issue',
    status: 'Done',
    type: 'Bug',
    url: 'https://jira.company.com/browse/PROJ-127',
    services: [
      {
        serviceName: 'inventory-api',
        commits: [
          {
            sha: 's1t2u3',
            author: 'Grace Lee',
            message: 'Fix race condition in inventory sync',
            createdAt: '2026-01-20',
            environments: {
              QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
              PPRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
              PRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
            },
          },
        ],
      },
    ],
  },
};

// Mock Services List
export const mockServices: Service[] = [
  {
    serviceName: 'orders-api',
    effectiveCommits: {
      QA: { sha: 'e7f8g9', dependencyStatus: 'OK', pipelineId: '4431', pipelineUrl: 'https://github.com/org/orders-api/actions/runs/4431' },
      PPRD: { sha: 'e7f8g9', dependencyStatus: 'INCOMPATIBLE', pipelineId: '4432', pipelineUrl: 'https://github.com/org/orders-api/actions/runs/4432' },
      PRD: { sha: 'd4e5f6', dependencyStatus: 'OK', pipelineId: '4420', pipelineUrl: 'https://github.com/org/orders-api/actions/runs/4420' },
    },
  },
  {
    serviceName: 'shipping-api',
    effectiveCommits: {
      QA: { sha: 'a1b2c3', dependencyStatus: 'OK', pipelineId: '3301', pipelineUrl: 'https://github.com/org/shipping-api/actions/runs/3301' },
      PPRD: { sha: 'a1b2c3', dependencyStatus: 'OK', pipelineId: '3302', pipelineUrl: 'https://github.com/org/shipping-api/actions/runs/3302' },
      PRD: null,
    },
  },
  {
    serviceName: 'payments-api',
    effectiveCommits: {
      QA: { sha: 'f1g2h3', dependencyStatus: 'OK', pipelineId: '2201', pipelineUrl: 'https://github.com/org/payments-api/actions/runs/2201' },
      PPRD: { sha: 'f1g2h3', dependencyStatus: 'OK', pipelineId: '2202', pipelineUrl: 'https://github.com/org/payments-api/actions/runs/2202' },
      PRD: { sha: 'f1g2h3', dependencyStatus: 'OK', pipelineId: '2203', pipelineUrl: 'https://github.com/org/payments-api/actions/runs/2203' },
    },
  },
  {
    serviceName: 'checkout-api',
    effectiveCommits: {
      QA: { sha: 'x9y8z7', dependencyStatus: 'OK', pipelineId: '5501', pipelineUrl: 'https://github.com/org/checkout-api/actions/runs/5501' },
      PPRD: null,
      PRD: null,
    },
  },
  {
    serviceName: 'auth-api',
    effectiveCommits: {
      QA: { sha: 'm4n5o6', dependencyStatus: 'INCOMPATIBLE', pipelineId: '4500', pipelineUrl: 'https://github.com/org/auth-api/actions/runs/4500' },
      PPRD: null,
      PRD: null,
    },
  },
  {
    serviceName: 'users-api',
    effectiveCommits: {
      QA: null,
      PPRD: null,
      PRD: null,
    },
  },
  {
    serviceName: 'inventory-api',
    effectiveCommits: {
      QA: { sha: 's1t2u3', dependencyStatus: 'OK', pipelineId: '1101', pipelineUrl: 'https://github.com/org/inventory-api/actions/runs/1101' },
      PPRD: { sha: 's1t2u3', dependencyStatus: 'OK', pipelineId: '1102', pipelineUrl: 'https://github.com/org/inventory-api/actions/runs/1102' },
      PRD: { sha: 's1t2u3', dependencyStatus: 'OK', pipelineId: '1103', pipelineUrl: 'https://github.com/org/inventory-api/actions/runs/1103' },
    },
  },
  {
    serviceName: 'catalog-api',
    effectiveCommits: {
      QA: { sha: 'v4w5x6', dependencyStatus: 'OK', pipelineId: '6601', pipelineUrl: 'https://github.com/org/catalog-api/actions/runs/6601' },
      PPRD: { sha: 'v4w5x6', dependencyStatus: 'OK', pipelineId: '6602', pipelineUrl: 'https://github.com/org/catalog-api/actions/runs/6602' },
      PRD: { sha: 'v4w5x6', dependencyStatus: 'OK', pipelineId: '6603', pipelineUrl: 'https://github.com/org/catalog-api/actions/runs/6603' },
    },
  },
];

// Mock Service Details
export const mockServiceDetails: Record<string, ServiceDetail> = {
  'orders-api': {
    serviceName: 'orders-api',
    repository: 'github.com/org/orders-api',
    effectiveCommits: {
      QA: { sha: 'e7f8g9', dependencyStatus: 'OK', pipelineId: '4431', pipelineUrl: 'https://github.com/org/orders-api/actions/runs/4431' },
      PPRD: { sha: 'e7f8g9', dependencyStatus: 'INCOMPATIBLE', pipelineId: '4432', pipelineUrl: 'https://github.com/org/orders-api/actions/runs/4432' },
      PRD: { sha: 'd4e5f6', dependencyStatus: 'OK', pipelineId: '4420', pipelineUrl: 'https://github.com/org/orders-api/actions/runs/4420' },
    },
    commits: [
      {
        sha: 'e7f8g9',
        jiraKey: 'PROJ-123',
        author: 'Alice Johnson',
        message: 'Update freight calculation with new tax rules',
        createdAt: '2026-01-30',
        environments: {
          QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
          PPRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'INCOMPATIBLE' },
          PRD: { deploymentStatus: 'NOT_DEPLOYED' },
        },
      },
      {
        sha: 'd4e5f6',
        jiraKey: 'PROJ-123',
        author: 'Alice Johnson',
        message: 'Fix freight calculation for international orders',
        createdAt: '2026-01-29',
        environments: {
          QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
          PPRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
          PRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
        },
      },
    ],
  },
  'shipping-api': {
    serviceName: 'shipping-api',
    repository: 'github.com/org/shipping-api',
    effectiveCommits: {
      QA: { sha: 'a1b2c3', dependencyStatus: 'OK', pipelineId: '3301', pipelineUrl: 'https://github.com/org/shipping-api/actions/runs/3301' },
      PPRD: { sha: 'a1b2c3', dependencyStatus: 'OK', pipelineId: '3302', pipelineUrl: 'https://github.com/org/shipping-api/actions/runs/3302' },
      PRD: null,
    },
    commits: [
      {
        sha: 'a1b2c3',
        jiraKey: 'PROJ-123',
        author: 'Bob Smith',
        message: 'Update shipping provider integration',
        createdAt: '2026-01-28',
        environments: {
          QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
          PPRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
          PRD: { deploymentStatus: 'NOT_DEPLOYED' },
        },
      },
    ],
  },
  'payments-api': {
    serviceName: 'payments-api',
    repository: 'github.com/org/payments-api',
    effectiveCommits: {
      QA: { sha: 'f1g2h3', dependencyStatus: 'OK', pipelineId: '2201', pipelineUrl: 'https://github.com/org/payments-api/actions/runs/2201' },
      PPRD: { sha: 'f1g2h3', dependencyStatus: 'OK', pipelineId: '2202', pipelineUrl: 'https://github.com/org/payments-api/actions/runs/2202' },
      PRD: { sha: 'f1g2h3', dependencyStatus: 'OK', pipelineId: '2203', pipelineUrl: 'https://github.com/org/payments-api/actions/runs/2203' },
    },
    commits: [
      {
        sha: 'f1g2h3',
        jiraKey: 'PROJ-124',
        author: 'Carol Williams',
        message: 'Implement retry logic for failed payments',
        createdAt: '2026-01-25',
        environments: {
          QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
          PPRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
          PRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
        },
      },
    ],
  },
  'checkout-api': {
    serviceName: 'checkout-api',
    repository: 'github.com/org/checkout-api',
    effectiveCommits: {
      QA: { sha: 'x9y8z7', dependencyStatus: 'OK', pipelineId: '5501', pipelineUrl: 'https://github.com/org/checkout-api/actions/runs/5501' },
      PPRD: null,
      PRD: null,
    },
    commits: [
      {
        sha: 'x9y8z7',
        jiraKey: 'PROJ-125',
        author: 'David Brown',
        message: 'Optimize checkout database queries',
        createdAt: '2026-01-31',
        environments: {
          QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
          PPRD: { deploymentStatus: 'NOT_DEPLOYED' },
          PRD: { deploymentStatus: 'NOT_DEPLOYED' },
        },
      },
    ],
  },
  'auth-api': {
    serviceName: 'auth-api',
    repository: 'github.com/org/auth-api',
    effectiveCommits: {
      QA: { sha: 'm4n5o6', dependencyStatus: 'INCOMPATIBLE', pipelineId: '4500', pipelineUrl: 'https://github.com/org/auth-api/actions/runs/4500' },
      PPRD: null,
      PRD: null,
    },
    commits: [
      {
        sha: 'm4n5o6',
        jiraKey: 'PROJ-126',
        author: 'Emma Davis',
        message: 'Refactor JWT token generation',
        createdAt: '2026-02-01',
        environments: {
          QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'INCOMPATIBLE' },
          PPRD: { deploymentStatus: 'NOT_DEPLOYED' },
          PRD: { deploymentStatus: 'NOT_DEPLOYED' },
        },
      },
    ],
  },
  'users-api': {
    serviceName: 'users-api',
    repository: 'github.com/org/users-api',
    effectiveCommits: {
      QA: null,
      PPRD: null,
      PRD: null,
    },
    commits: [
      {
        sha: 'p7q8r9',
        jiraKey: 'PROJ-126',
        author: 'Frank Miller',
        message: 'Update user model for new auth system',
        createdAt: '2026-02-01',
        environments: {
          QA: { deploymentStatus: 'NOT_DEPLOYED' },
          PPRD: { deploymentStatus: 'NOT_DEPLOYED' },
          PRD: { deploymentStatus: 'NOT_DEPLOYED' },
        },
      },
    ],
  },
  'inventory-api': {
    serviceName: 'inventory-api',
    repository: 'github.com/org/inventory-api',
    effectiveCommits: {
      QA: { sha: 's1t2u3', dependencyStatus: 'OK', pipelineId: '1101', pipelineUrl: 'https://github.com/org/inventory-api/actions/runs/1101' },
      PPRD: { sha: 's1t2u3', dependencyStatus: 'OK', pipelineId: '1102', pipelineUrl: 'https://github.com/org/inventory-api/actions/runs/1102' },
      PRD: { sha: 's1t2u3', dependencyStatus: 'OK', pipelineId: '1103', pipelineUrl: 'https://github.com/org/inventory-api/actions/runs/1103' },
    },
    commits: [
      {
        sha: 's1t2u3',
        jiraKey: 'PROJ-127',
        author: 'Grace Lee',
        message: 'Fix race condition in inventory sync',
        createdAt: '2026-01-20',
        environments: {
          QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
          PPRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
          PRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
        },
      },
    ],
  },
  'catalog-api': {
    serviceName: 'catalog-api',
    repository: 'github.com/org/catalog-api',
    effectiveCommits: {
      QA: { sha: 'v4w5x6', dependencyStatus: 'OK', pipelineId: '6601', pipelineUrl: 'https://github.com/org/catalog-api/actions/runs/6601' },
      PPRD: { sha: 'v4w5x6', dependencyStatus: 'OK', pipelineId: '6602', pipelineUrl: 'https://github.com/org/catalog-api/actions/runs/6602' },
      PRD: { sha: 'v4w5x6', dependencyStatus: 'OK', pipelineId: '6603', pipelineUrl: 'https://github.com/org/catalog-api/actions/runs/6603' },
    },
    commits: [
      {
        sha: 'v4w5x6',
        jiraKey: 'PROJ-128',
        author: 'Henry Wilson',
        message: 'Add support for new product categories',
        createdAt: '2026-01-18',
        environments: {
          QA: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
          PPRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
          PRD: { deploymentStatus: 'DEPLOYED', dependencyStatus: 'OK' },
        },
      },
    ],
  },
};

// Mock Commit Environment Details (for popover)
export const mockCommitDetails: Record<string, CommitEnvironmentDetail> = {
  'e7f8g9-PPRD': {
    commit: 'e7f8g9',
    environment: 'PPRD',
    pipelineId: '4432',
    deployedAt: '2026-01-30T10:21:00Z',
    dependencies: [
      {
        service: 'auth-api',
        expectedCommit: 'a1b2c3',
        actualCommit: '9f8e7d',
        status: 'INCOMPATIBLE',
      },
      {
        service: 'catalog-api',
        expectedCommit: '778899',
        actualCommit: '778899',
        status: 'OK',
      },
    ],
  },
  'e7f8g9-QA': {
    commit: 'e7f8g9',
    environment: 'QA',
    pipelineId: '4431',
    deployedAt: '2026-01-30T08:15:00Z',
    dependencies: [
      {
        service: 'auth-api',
        expectedCommit: 'a1b2c3',
        actualCommit: 'a1b2c3',
        status: 'OK',
      },
      {
        service: 'catalog-api',
        expectedCommit: '778899',
        actualCommit: '778899',
        status: 'OK',
      },
    ],
  },
  'd4e5f6-PRD': {
    commit: 'd4e5f6',
    environment: 'PRD',
    pipelineId: '4420',
    deployedAt: '2026-01-29T14:30:00Z',
    dependencies: [
      {
        service: 'auth-api',
        expectedCommit: '9f8e7d',
        actualCommit: '9f8e7d',
        status: 'OK',
      },
      {
        service: 'catalog-api',
        expectedCommit: '778899',
        actualCommit: '778899',
        status: 'OK',
      },
    ],
  },
  'm4n5o6-QA': {
    commit: 'm4n5o6',
    environment: 'QA',
    pipelineId: '4500',
    deployedAt: '2026-02-01T09:00:00Z',
    dependencies: [
      {
        service: 'users-api',
        expectedCommit: 'p7q8r9',
        actualCommit: 'old123',
        status: 'INCOMPATIBLE',
      },
    ],
  },
};

// Helper function to get commit details
export function getCommitEnvironmentDetail(sha: string, env: string): CommitEnvironmentDetail | null {
  return mockCommitDetails[`${sha}-${env}`] || null;
}

// Helper: lookup commit info (message, author, date, repo) by SHA
export function getCommitInfo(sha: string): { message: string; author: string; date: string; repo: string } | null {
  for (const [serviceName, detail] of Object.entries(mockServiceDetails)) {
    for (const commit of detail.commits) {
      if (commit.sha === sha) {
        return {
          message: commit.message,
          author: commit.author,
          date: commit.createdAt,
          repo: serviceName,
        };
      }
    }
  }
  // Also check jira issue detail commits
  for (const detail of Object.values(mockJiraIssueDetails)) {
    for (const svc of detail.services) {
      for (const commit of svc.commits) {
        if (commit.sha === sha) {
          return {
            message: commit.message,
            author: commit.author,
            date: commit.createdAt,
            repo: svc.serviceName,
          };
        }
      }
    }
  }
  return null;
}

// ==========================================
// Promotion Mock Data & Logic
// ==========================================

// Dependency graph: service -> list of services it depends on
export const mockDependencyGraph: Record<string, string[]> = {
  'orders-api': ['auth-api', 'catalog-api'],
  'shipping-api': ['orders-api'],
  'payments-api': ['orders-api'],
  'checkout-api': ['orders-api', 'payments-api'],
  'auth-api': [],
  'users-api': ['auth-api'],
  'inventory-api': ['catalog-api'],
  'catalog-api': [],
};

// Expected dependency commits: what commit a service expects from its deps in PPRD
export const mockExpectedDependencies: Record<string, Record<string, string>> = {
  'orders-api': { 'auth-api': 'a1b2c3', 'catalog-api': 'v4w5x6' },
  'shipping-api': { 'orders-api': 'e7f8g9' },
  'payments-api': { 'orders-api': 'd4e5f6' },
  'checkout-api': { 'orders-api': 'e7f8g9', 'payments-api': 'f1g2h3' },
  'auth-api': {},
  'users-api': { 'auth-api': 'm4n5o6' },
  'inventory-api': { 'catalog-api': 'v4w5x6' },
  'catalog-api': {},
};

import type {
  ResolvedCommit,
  ValidationCheck,
  ExecutionStep,
  ExpectedProdState,
  ImpactAnalysis,
} from '@/types/deployment';

export function getPreprodCommitsForJira(jiraKey: string): ResolvedCommit[] {
  const detail = mockJiraIssueDetails[jiraKey];
  if (!detail) return [];
  const resolved: ResolvedCommit[] = [];
  for (const svc of detail.services) {
    for (const commit of svc.commits) {
      if (commit.environments.PPRD?.deploymentStatus === 'DEPLOYED') {
        resolved.push({ serviceName: svc.serviceName, sha: commit.sha });
      }
    }
  }
  // Deduplicate: keep latest commit per service
  const byService = new Map<string, ResolvedCommit>();
  for (const r of resolved) {
    byService.set(r.serviceName, r);
  }
  return Array.from(byService.values());
}

export function getPreprodCommitForService(serviceName: string): ResolvedCommit | null {
  const svc = mockServices.find(s => s.serviceName === serviceName);
  if (!svc || !svc.effectiveCommits.PPRD) return null;
  return { serviceName, sha: svc.effectiveCommits.PPRD.sha };
}

export function computeImpactAnalysis(requestedCommits: ResolvedCommit[]): ImpactAnalysis {
  const checks: ValidationCheck[] = [];
  const steps: ExecutionStep[] = [];
  const autoAdded = new Map<string, ResolvedCommit>();

  // Check 1: all commits exist in PPRD
  let allInPprd = true;
  for (const rc of requestedCommits) {
    const svc = mockServices.find(s => s.serviceName === rc.serviceName);
    if (!svc?.effectiveCommits.PPRD || svc.effectiveCommits.PPRD.sha !== rc.sha) {
      allInPprd = false;
    }
  }
  checks.push({
    label: 'All commits exist in PPRD',
    status: allInPprd ? 'pass' : 'fail',
    message: allInPprd ? undefined : 'One or more commits are not deployed in PPRD.',
  });

  // Check 2: resolve dependency graph
  let hasIncompatibility = false;
  for (const rc of requestedCommits) {
    const deps = mockExpectedDependencies[rc.serviceName] || {};
    for (const [depService, expectedSha] of Object.entries(deps)) {
      const depPrd = mockServices.find(s => s.serviceName === depService)?.effectiveCommits.PRD;
      const isAlreadyRequested = requestedCommits.some(r => r.serviceName === depService);
      if (!isAlreadyRequested && (!depPrd || depPrd.sha !== expectedSha)) {
        // Check if dep is in PPRD with the needed commit
        const depPprd = mockServices.find(s => s.serviceName === depService)?.effectiveCommits.PPRD;
        if (depPprd && depPprd.sha === expectedSha) {
          autoAdded.set(depService, { serviceName: depService, sha: expectedSha });
          hasIncompatibility = true;
        } else if (depPprd) {
          autoAdded.set(depService, { serviceName: depService, sha: depPprd.sha });
          hasIncompatibility = true;
        }
      }
    }
  }

  checks.push({
    label: 'Dependency graph resolved',
    status: 'pass',
  });

  if (hasIncompatibility) {
    const depDetails = Array.from(autoAdded.entries())
      .map(([svc, rc]) => {
        const prdSha = mockServices.find(s => s.serviceName === svc)?.effectiveCommits.PRD?.sha || 'none';
        return `${svc} expected @${rc.sha}, PRD has @${prdSha}`;
      })
      .join('; ');
    checks.push({
      label: 'PRD dependency incompatibility detected',
      status: 'warn',
      message: depDetails,
    });
  }

  // Build execution plan: dependencies first, then requested
  let order = 1;
  for (const [, dep] of autoAdded) {
    const svcData = mockServices.find(s => s.serviceName === dep.serviceName);
    const pprdData = svcData?.effectiveCommits.PPRD;
    steps.push({
      order: order++,
      serviceName: dep.serviceName,
      sha: dep.sha,
      action: 'Promote',
      reason: 'Dependency',
      deployAction: `deploy ${dep.sha} → ${dep.serviceName} (PRD)`,
      jiraKeys: dep.jiraKey ? [dep.jiraKey] : [],
      pipelineId: pprdData?.pipelineId,
      pipelineUrl: pprdData?.pipelineUrl,
    });
  }
  for (const rc of requestedCommits) {
    if (!autoAdded.has(rc.serviceName)) {
      const svcData = mockServices.find(s => s.serviceName === rc.serviceName);
      const pprdData = svcData?.effectiveCommits.PPRD;
      steps.push({
        order: order++,
        serviceName: rc.serviceName,
        sha: rc.sha,
        action: 'Promote',
        reason: 'Requested',
        deployAction: `deploy ${rc.sha} → ${rc.serviceName} (PRD)`,
        jiraKeys: rc.jiraKey ? [rc.jiraKey] : [],
        pipelineId: pprdData?.pipelineId,
        pipelineUrl: pprdData?.pipelineUrl,
      });
    }
  }

  // Expected PRD state
  const prodState: ExpectedProdState[] = [];
  const changedServices = new Set([...autoAdded.keys(), ...requestedCommits.map(r => r.serviceName)]);
  
  for (const svc of mockServices) {
    if (changedServices.has(svc.serviceName)) {
      const newSha = autoAdded.get(svc.serviceName)?.sha 
        || requestedCommits.find(r => r.serviceName === svc.serviceName)?.sha 
        || '';
      prodState.push({ serviceName: svc.serviceName, sha: newSha, status: 'compatible', changed: true });
    } else {
      const prdCommit = svc.effectiveCommits.PRD;
      prodState.push({
        serviceName: svc.serviceName,
        sha: prdCommit?.sha || 'none',
        status: 'compatible',
        changed: false,
      });
    }
  }

  const hasBlockers = checks.some(c => c.status === 'fail');

  return { validationChecks: checks, executionPlan: steps, expectedProdState: prodState, hasBlockers };
}
