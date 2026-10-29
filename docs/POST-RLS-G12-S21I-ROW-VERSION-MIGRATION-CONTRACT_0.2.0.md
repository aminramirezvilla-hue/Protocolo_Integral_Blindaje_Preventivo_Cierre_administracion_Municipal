# POST-RLS G12 — S21I Row Version Migration Contract

Version: 0.2.0
Status: Designed / Documentary Contract
Change ID: S21I-ROW-VERSION-001
Change class: Schema evolution for optimistic concurrency control

## 1. Purpose

This document defines the migration contract required to introduce a dedicated
monotonic `row_version` concurrency-control field into the initial mutable
relations governed by the S21I guarded-update architecture.

Affected relations:

- `public.workspaces`
- `public.assessments`

This contract is documentary only. It does not execute SQL, alter the schema,
create functions, create policies, grant privileges, revoke privileges, create
logical targets, or materialize target-to-relation bindings.

## 2. Architectural context

The canonical guarded-update architecture requires optimistic concurrency
through an explicit `expected_row_version` supplied as a validated request
argument.

No existing physical version column has been evidenced in either
`public.workspaces` or `public.assessments`.

Timestamps such as `updated_at` MUST NOT be interpreted as row versions.

The selected model is:

`DEDICATED_MONOTONIC_BIGINT_ROW_VERSION`

The authorization model remains independently defined through verified
transaction-local request identity and workspace membership.

## 3. Physical row-version contract

For both affected relations the planned column is:

- name: `row_version`
- type: `BIGINT`
- nullability: `NOT NULL`
- initial value: `1`
- default value: `1`

The default exists only to initialize newly created rows.

It MUST NOT be used as the runtime increment mechanism.

After insertion, the value of `row_version` is server-controlled.

Clients MUST NOT directly set, reset, decrement, skip, or otherwise manipulate
`row_version`.

## 4. Existing-row baseline

Pre-existing rows are assigned:

`row_version = 1`

This value means:

`INITIAL_CONCURRENCY_BASELINE`

It does not reconstruct or claim knowledge of the historical number of updates
performed before this migration.

The migration MUST NOT infer prior update counts.

The backfill MUST NOT modify any business column.

## 5. Migration preconditions

Before any future executable migration is authorized, all of the following
conditions must be verified:

1. `public.workspaces` exists.
2. `public.assessments` exists.
3. `public.workspaces.row_version` is absent.
4. `public.assessments.row_version` is absent.
5. the baseline schema state has been certified;
6. existing RLS semantics have been captured;
7. the existing direct-DML privilege boundary has been captured;
8. no conflicting partial migration state exists.

Any unexpected state requires fail-closed behavior.

Blind migration re-execution is prohibited.

## 6. Logical migration sequence

The future executable migration shall follow this logical sequence:

1. establish a transactional or equivalent atomic migration boundary;
2. add `public.workspaces.row_version BIGINT DEFAULT 1`;
3. add `public.assessments.row_version BIGINT DEFAULT 1`;
4. baseline required pre-existing `public.workspaces` rows to `1`;
5. baseline required pre-existing `public.assessments` rows to `1`;
6. verify that no `NULL` row version remains in `public.workspaces`;
7. verify that no `NULL` row version remains in `public.assessments`;
8. enforce `NOT NULL` on `public.workspaces.row_version`;
9. enforce `NOT NULL` on `public.assessments.row_version`;
10. verify `DEFAULT 1` on both relations;
11. verify preservation of RLS semantics;
12. verify preservation of privilege boundaries;
13. commit only if all postconditions pass.

The exact SQL syntax remains deferred to a separately authorized implementation
artifact.

## 7. Optimistic concurrency contract

Every guarded mutable target update shall require an
`expected_row_version`.

The final mutation predicate must combine:

- exact target identity;
- successful authorization;
- allowlisted operation;
- `row_version = expected_row_version`.

A successful guarded mutation must:

1. mutate only allowlisted columns;
2. preserve immutable columns;
3. preserve authorization scope;
4. increment `row_version` exactly by one.

The server-side increment rule is:

`row_version = row_version + 1`

The client MUST NOT supply the new version value.

## 8. Result semantics

The concurrency contract distinguishes at least the following outcomes.

### UPDATED

Returned only when:

- the target is visible and authorized;
- the requested operation is allowed;
- the expected version matches;
- the mutation succeeds.

### VERSION_CONFLICT

Returned only when:

- an authorized and visible target exists;
- `row_version` differs from `expected_row_version`.

A version conflict MUST NOT be disclosed before target visibility and
authorization have been established.

### NOT_FOUND_OR_NOT_VISIBLE

Used when no authorized visible target is established.

This preserves anti-enumeration behavior.

### VALIDATION_ERROR

Used when the request contract is malformed or invalid.

### SPECIALIZED_CONTRACT_REJECTED

Used when a target or operation is not explicitly allowlisted.

## 9. Authorization model preserved

This migration does not redefine authorization.

The existing design remains:

`VERIFIED_TRANSACTION_LOCAL_REQUEST_IDENTITY`
→ `workspace_members.user_id`
→ `workspace_members.workspace_id`
→ `workspace_members.role`
→ specialized contract role allowlist
→ target workspace.

For `public.workspaces`:

`workspace_members.workspace_id = workspaces.id`

For `public.assessments`:

`workspace_members.workspace_id = assessments.workspace_id`

The exact role allowlist remains deferred to each specialized mutator contract.

## 10. RLS preservation

Existing RLS semantics MUST be preserved.

The guarded-update authorization layer is an additional server-side constraint.

It MUST NOT replace RLS.

This migration does not authorize:

- creation of RLS policies;
- deletion of RLS policies;
- rewriting of RLS policies;
- disabling RLS;
- changing FORCE RLS semantics.

RLS behavior before and after the migration must remain semantically equivalent.

## 11. Privilege-boundary preservation

This migration MUST NOT modify the established privilege boundary.

In particular, it does not authorize:

- public execution;
- authenticated direct table DML;
- orchestrator direct table DML;
- role creation;
- role membership changes;
- grants;
- revokes;
- creation of privileged mutation functions;
- exposure of PostgreSQL credentials;
- client-selected SQL.

## 12. Compatibility contract

Existing read paths must remain unchanged.

Existing insert paths require compatibility review only to confirm that
`row_version` initializes correctly to `1`.

Existing update paths must not bypass the new concurrency contract once guarded
targets are released.

Old rows are baselined to version `1`.

New rows begin at version `1`.

## 13. Postconditions

A future executable migration is acceptable only if all of the following are
verified:

1. `public.workspaces.row_version` exists;
2. `public.assessments.row_version` exists;
3. both columns are `BIGINT`;
4. both columns are `NOT NULL`;
5. both columns have initial/default value `1`;
6. no null versions remain;
7. pre-existing rows are baselined to `1`;
8. no unrelated business column changed;
9. RLS semantics are preserved;
10. privilege boundaries are preserved;
11. no client direct-write path to `row_version` has been created;
12. no logical target has been created by the migration;
13. no target-to-relation binding has been created by the migration.

## 14. Idempotency and re-execution

Blind re-execution is prohibited.

Every future executable migration must begin with explicit state inspection.

If `row_version` already exists unexpectedly, execution must stop and the state
must be reconciled.

If a partial migration state is detected, automatic destructive repair is
prohibited.

The system must enter HOLD pending explicit recertification.

## 15. Rollback contract

Rollback is dependency-aware and fail-closed.

A rollback is permitted only if:

- no released mutator depends on `row_version`; or
- all dependent mutators and contracts are reverted first.

If safe, rollback proceeds in reverse dependency order.

Planned logical rollback:

1. remove `public.assessments.row_version`;
2. remove `public.workspaces.row_version`.

Rollback MUST NOT:

- disable or weaken RLS;
- grant direct DML;
- change ownership;
- broaden privileges;
- alter unrelated business data.

## 16. Acceptance criteria

The migration contract is satisfied only when:

- migration behavior is atomic or fail-closed;
- both target relations are versioned;
- no unrelated business data is modified;
- no RLS regression occurs;
- no privilege regression occurs;
- no direct client version write becomes possible;
- no routing binding is created;
- no logical target is created;
- no specialized mutator is implemented as part of this schema change.

## 17. Separation of concerns

This contract intentionally does not define:

1. logical target names;
2. exact target-to-relation bindings;
3. specialized mutator function names;
4. specialized role allowlist values;
5. migration SQL syntax;
6. policy DDL;
7. GRANT statements;
8. REVOKE statements;
9. deployment procedure.

Those items require subsequent independently certified gates.

## 18. Planned implementation artifacts

Documentary contract:

`docs/POST-RLS-G12-S21I-ROW-VERSION-MIGRATION-CONTRACT_0.2.0.md`

Executable SQL migration:

`DEFERRED — NOT YET AUTHORIZED`

Specialized mutator implementation:

`DEFERRED — NOT YET AUTHORIZED`

## 19. Security invariants

The following invariants remain mandatory:

- default-deny;
- verified request identity;
- no client-selected relation;
- no client-selected column;
- no client-selected SQL;
- no direct authenticated DML;
- no direct orchestrator table DML;
- RLS preserved;
- security context preserved;
- expected row version enforced at the final mutation point;
- no version-conflict disclosure before authorization.

## 20. Current architectural state

`ROW_VERSION_SCHEMA_CHANGE = DOCUMENTARILY_SPECIFIED`

`EXECUTABLE_MIGRATION = DEFERRED`

`WORKSPACES_ROW_VERSION = PLANNED_NOT_MATERIALIZED`

`ASSESSMENTS_ROW_VERSION = PLANNED_NOT_MATERIALIZED`

`LOGICAL_TARGETS = NOT_YET_MATERIALIZED`

`TARGET_TO_RELATION_BINDINGS = DEFERRED`

`ROLE_ALLOWLIST_VALUES = DEFERRED_TO_SPECIALIZED_CONTRACT`

`RLS = PRESERVED_NOT_REPLACED`

`DEPLOYMENT = NOT_AUTHORIZED`

## 21. Authorization boundary

This document authorizes only documentary specification.

It does not itself authorize execution of schema changes.

No SQL migration may be executed solely on the basis of this document.

A separately certified migration implementation and execution gate is required.
