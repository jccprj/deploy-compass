

# Deploy Visibility - Implementation Plan

A commit-centric deployment visualization tool for microservices architecture, enabling developers to track Jira features through environments and detect dependency drift.

---

## 🎯 Overview

**Purpose**: Internal developer tool to visualize deployment status across QA, PREPROD, and PROD environments, with seamless navigation between Jira Issues and Services.

**Key Capabilities**:
- Track which Jira features are fully deployed to production
- See exactly what commit is running in each service/environment
- Instantly detect dependency incompatibilities
- Navigate between Jira-centric and Service-centric views

---

## 🏗️ Application Structure

### Global Shell
- **Header** with app title "Deploy Visibility"
- **Segmented control** to switch between Jira View and Service View
- **Global search** supporting Jira keys, service names, and commit SHAs
- Clean, developer-focused design with monospace fonts for commits

---

## 📱 Screen 1: Jira Issue List

**Route**: `/jira`

A table showing all Jira Issues and their deployment progress across environments.

| Column | Description |
|--------|-------------|
| Jira Key | Clickable link to issue detail |
| Title | Issue title |
| Type | Bug, Story, Task, etc. |
| Status | Jira workflow status |
| QA / PREPROD / PROD | Status icons per environment |

**Status Icons**:
- 🟢 Green: All commits deployed, dependencies OK
- 🟡 Yellow/Warning: Incomplete (missing deploy or dependency issue)

**Interaction**: Click Jira Key → navigates to Issue Detail

---

## 📱 Screen 2: Jira Issue Detail

**Route**: `/jira/:key`

Shows how a single Jira Issue is deployed across all affected services.

**Header Section**:
- Jira Key + Title
- Issue type badge
- Workflow status

**Service-Commits Table**:
| Column | Description |
|--------|-------------|
| Service | Clickable service name |
| Commits | Vertical list (oldest → newest) with SHA + date |
| QA / PREPROD / PROD | Status icons aligned with each commit |

**Status Icons per Commit**:
- 🟢 Deployed, dependencies OK
- ⚠️ Deployed, dependency incompatibility
- ❌ Not deployed

**Interactions**:
- Click service name → navigates to Service Detail
- Click commit SHA or status icon → opens dependency popover

---

## 📱 Screen 3: Service Selection

**Route**: `/services`

Card grid showing all services with their effective commit per environment.

**Service Card Contents**:
- Service name (prominently displayed)
- Three environment rows (QA, PREPROD, PROD), each showing:
  - Environment label
  - Effective commit SHA (monospace)
  - Status badge (✅ OK, ⚠️ Incompatible, or ❌ None)

**Interaction**: Click card → navigates to Service Detail

---

## 📱 Screen 4: Service Detail

**Route**: `/services/:serviceName`

Commit-first operational view for a single service.

**Header Section**:
- Service name
- Repository URL (as clickable link)

**Effective Commits Summary**:
Three cards/badges showing current running commit per environment with dependency status.

**Commits Table**:
| Column | Description |
|--------|-------------|
| Commit SHA | Monospace, clickable |
| Jira Issue | Clickable link to issue |
| Created | Timestamp |
| QA / PREPROD / PROD | Status icons |

**Status Icons**:
- 🟢 Deployed, dependencies OK
- ⚠️ Deployed, dependency incompatible
- ❌ Not deployed

Commits sorted newest first.

**Interaction**: Click status icon or commit → opens dependency popover

---

## 🔍 Dependency Popover

Appears when clicking any status icon or commit SHA.

**Contents**:
- Commit SHA
- Environment name
- Deployment timestamp
- Pipeline reference/ID
- **Dependency table**:
  - Service name
  - Expected commit
  - Actual commit
  - Status indicator (✅ OK or ❌ Incompatible)

---

## 🎨 Design Specifications

**Typography**:
- Monospace font for all commit SHAs
- Clean sans-serif for UI elements

**Colors** (subtle, not heavy dashboard):
- Green (#22c55e): Deployed, healthy
- Yellow/Amber (#f59e0b): Deployed with dependency issues
- Red (#ef4444): Not deployed
- Neutral grays for structure

**Icons** preferred over text for statuses:
- CheckCircle, AlertTriangle, XCircle from Lucide

**Layout**:
- Clear visual alignment between commits and their environment statuses
- Consistent table structures across all views
- Responsive design for various screen sizes

---

## 🧩 Key Components to Build

1. **AppShell** - Header with navigation and global search
2. **ViewToggle** - Segmented control for Jira/Service views
3. **StatusIcon** - Reusable status indicator component
4. **EnvironmentColumns** - Consistent environment header layout
5. **CommitCell** - Monospace commit display with popover trigger
6. **DependencyPopover** - Detailed dependency information
7. **ServiceCard** - Card for service selection grid
8. **JiraIssueTable** - Main table for Jira view
9. **ServiceCommitsTable** - Table for issue detail view
10. **GlobalSearch** - Search with Jira/Service/Commit filtering

---

## 📊 Data Handling

- **Mock API layer** with realistic sample data matching your API specs
- **React Query** for data fetching and caching
- **React Router** for navigation between views
- Easy to swap mock data for real API endpoints later

---

## ✅ What Users Can Answer

After implementation, users will be able to:
- "Which Jira features are fully in PROD?" → Jira List with green PROD column
- "What is actually running in this service?" → Service Detail effective commits
- "Why does this commit have a warning?" → Dependency popover with drift details
- "Which commits need deployment?" → Red icons in environment columns

