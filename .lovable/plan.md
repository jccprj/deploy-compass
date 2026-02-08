

# Promote to Production -- Implementation Plan

## Overview

Add a new "Promote to PROD" screen that lets developers create a safe, deterministic production deployment change. The screen walks through a guided flow: select scope (Jira or Service), analyze impact, review an ordered execution plan, simulate the resulting PROD state, and finalize with metadata.

---

## What Changes

### 1. New Types

Add promotion-specific types to `src/types/deployment.ts`:

- `PromotionScope`: `'jira' | 'service'`
- `ResolvedCommit`: service + commit SHA resolved from PREPROD
- `ValidationCheck`: label + status (pass/warn/fail) + optional message
- `ExecutionStep`: order, service, commit, action type (Promote), reason (Requested / Dependency)
- `ExpectedProdState`: service, commit, compatibility status, changed flag
- `ChangeMetadata`: title, linked Jira, risk level, rollback strategy

### 2. Mock Data and API Functions

Extend `src/lib/mock-data.ts` and `src/lib/api.ts`:

- `fetchPreprodCommitsForJira(jiraKey)` -- returns commits deployed in PREPROD for a Jira issue
- `fetchPreprodCommitForService(serviceName)` -- returns the effective PREPROD commit for a service
- `analyzeProductionImpact(commits)` -- returns validation checks, execution plan, and expected PROD state
- `createProductionChange(plan, metadata)` -- simulates change creation (returns success)

The impact analysis mock will:
- Validate all commits exist in PREPROD
- Check dependency graph and detect PROD incompatibilities (e.g., orders-api needs auth-api@a1b2c3 but PROD has 9f8e7d)
- Auto-add dependency promotions as earlier steps in the execution plan
- Compute expected PROD state after execution

### 3. Navigation Update

**ViewToggle** (`src/components/ViewToggle.tsx`): Add a third option -- "Promote to PROD" -- styled with a highlighted/accent appearance to distinguish it from the read-only views.

**AppShell** (`src/components/AppShell.tsx`): Update the view change handler to support routing to `/promote`. Update the `currentView` logic to detect the `/promote` path.

**App.tsx**: Add route `/promote` pointing to the new `PromoteToProdPage`.

### 4. New Page: `src/pages/PromoteToProdPage.tsx`

A single-page guided flow with six visual sections. The page uses local React state to manage the progression (scope selection, analysis triggered, change created).

#### Section 1 -- Fixed Context (always visible)
- Two locked badges: "Source: PREPROD" and "Target: PROD"
- Short explanatory text: "Production promotions are always sourced from PREPROD."

#### Section 2 -- Promotion Scope
- Radio group: "Jira Issue" or "Service"
- **Jira path**: Autocomplete selector filtering `mockJiraIssues`. After selection, display a read-only card listing commits deployed in PREPROD for that issue (service + SHA with checkmark icons). Tooltip explaining only PREPROD commits are eligible.
- **Service path**: Service selector (dropdown of services with PREPROD commits). Shows the single effective PREPROD commit in a read-only card.
- Primary button: "Analyze Production Impact" -- disabled until a valid selection is made.

#### Section 3 -- Pre-flight Validation (appears after analysis)
- List of validation checks with status icons:
  - CheckCircle (green) for passed checks
  - AlertTriangle (amber) for warnings
  - XCircle (red) for blockers
- Example checks: "Commit exists in PREPROD", "Dependency graph resolved", "PROD dependency incompatibility detected" (with detail message)

#### Section 4 -- Execution Plan (appears after analysis)
- Ordered table with columns: #, Service, Commit (monospace), Action, Reason
- Dependency-driven rows labeled "Dependency" in the Reason column
- User-requested rows labeled "Requested"
- Order is read-only and not editable
- Visual note: "Execution order is mandatory and cannot be changed."

#### Section 5 -- Expected PROD State (appears after analysis)
- Table showing each affected service with: Service, Commit (monospace), Status icon
- Unchanged services shown as "unchanged" in muted text
- If any incompatibility remains, show a red alert banner and disable the final CTA

#### Section 6 -- Change Metadata (appears after analysis, if no blockers)
- Title input (pre-filled: "Promote {JIRA-KEY} to PROD" or "Promote {service} to PROD")
- Linked Jira input (pre-filled if Jira scope)
- Risk level select: Low / Medium / High
- Rollback strategy select (required): "Promote previous PROD commit" / "Custom"
- Final CTA: "Create Production Change" -- disabled if rollback strategy is empty or blockers exist
- On click: shows success toast and resets the form

### 5. Component Breakdown

The page will be split into focused sub-components inside `src/components/promote/`:

| Component | Responsibility |
|-----------|---------------|
| `PromotionContext.tsx` | Locked source/target badges |
| `ScopeSelector.tsx` | Radio group + Jira/Service selectors + resolved commits display |
| `ValidationChecks.tsx` | Pre-flight check list with icons |
| `ExecutionPlan.tsx` | Ordered execution table |
| `ExpectedProdState.tsx` | Simulated PROD state table |
| `ChangeMetadataForm.tsx` | Title, Jira link, risk, rollback, and final CTA |

---

## Technical Details

- All data fetching uses the existing mock API pattern (async functions with simulated delay)
- React Query is used for the Jira/Service autocomplete data fetching
- The "Analyze Production Impact" action triggers a local state transition (not a route change) to reveal sections 3-6
- Form state managed with React `useState` (no need for react-hook-form for this guided flow)
- Reuses existing UI components: `Card`, `Badge`, `Button`, `Table`, `Select`, `Input`, `RadioGroup`, `Tooltip`, and `StatusIcon`
- Monospace styling applied to all commit SHAs via the existing `font-mono` class

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/types/deployment.ts` | Add promotion types |
| `src/lib/mock-data.ts` | Add promotion mock data |
| `src/lib/api.ts` | Add promotion API functions |
| `src/components/ViewToggle.tsx` | Add "Promote to PROD" option |
| `src/components/AppShell.tsx` | Handle `/promote` route in nav logic |
| `src/App.tsx` | Add `/promote` route |
| `src/components/promote/PromotionContext.tsx` | New |
| `src/components/promote/ScopeSelector.tsx` | New |
| `src/components/promote/ValidationChecks.tsx` | New |
| `src/components/promote/ExecutionPlan.tsx` | New |
| `src/components/promote/ExpectedProdState.tsx` | New |
| `src/components/promote/ChangeMetadataForm.tsx` | New |
| `src/pages/PromoteToProdPage.tsx` | New |

