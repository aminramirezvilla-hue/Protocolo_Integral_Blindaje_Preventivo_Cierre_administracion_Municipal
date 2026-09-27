# P6 DEV4 - Institutional Restore Orchestrator Contract v1

## Purpose
DEV4 coordinates the institutional restore transaction using the accredited P6 engines:
- DEV1: Institutional Backup Builder
- DEV2: Restore Preflight / DRY_RUN
- DEV3: Restore Commit / Verify / Rollback

DEV4 SHALL NOT reimplement those engines.

## Public API
The implementation SHALL expose:
```javascript
globalThis.CATUER_P6_RESTORE_ORCHESTRATOR = {
  version,
  gate,
  orchestrateRestoreEnvelope,
  orchestrateRestoreFile
};
```

## Dependencies
DEV4 requires `globalThis.CATUER_P6_RESTORE` and `globalThis.CATUER_P6_RESTORE_COMMIT`.
DEV4 MUST fail closed if either dependency is unavailable.

## Canonical transaction sequence
1. Receive restore file or restore envelope.
2. Execute DEV2 preflight.
3. Reject if `preflight.overall !== true`.
4. Preserve previous-state verification data.
5. Execute DEV3 commit.
6. Execute independent post-commit verification.
7. If verification succeeds, return `COMMIT_VERIFIED`.
8. If commit or verification fails, execute DEV3 rollback.
9. Verify restoration of the previous state.
10. Return an explicit terminal status.

## Modes
DEV4 SHALL support `DRY_RUN` and `COMMIT`.
DRY_RUN SHALL NOT mutate persistent or in-memory application state.
COMMIT SHALL require successful preflight.

## Terminal states
- DRY_RUN_PASS
- PREFLIGHT_REJECTED
- COMMIT_VERIFIED
- COMMIT_FAILED_ROLLED_BACK
- COMMIT_FAILED_ROLLBACK_FAILED
- ERROR

## Mandatory invariants
1. Preflight is mandatory before commit.
2. DEV4 SHALL NOT write directly to IndexedDB.
3. DEV4 SHALL NOT call saveState().
4. DEV4 SHALL NOT implement its own cryptographic validation.
5. DEV4 SHALL NOT implement its own rollback persistence engine.
6. Commit SHALL NOT execute unless DEV2 preflight returns `overall=true`.
7. Every commit SHALL be followed by independent DEV3 verification.
8. Commit or verification failure SHALL trigger rollback attempt.
9. Rollback SHALL be independently verified.
10. DEV1, DEV2 and DEV3 SHALL remain unmodified.
11. DEV4 SHALL remain outside index.html and sw.js until isolated campaigns pass.
12. DEV4 results SHALL be explicit, serializable and auditable.

## Persistence prohibition
DEV4 is an orchestration layer. Forbidden direct calls include:
```javascript
saveState(...)
idbSet(...)
indexedDB.open(...)
```
Persistence SHALL occur only through the accredited DEV3 contract.

## Minimum result contract
```javascript
{
  gate: "EV-P6-019",
  mode: "DRY_RUN" | "COMMIT",
  overall: Boolean,
  status: String,
  preflight: Object | null,
  commit: Object | null,
  verification: Object | null,
  rollback: Object | null,
  error: Object | null
}
```

## Failure policy
DEV4 SHALL fail closed.
A failed commit followed by successful rollback SHALL NOT be reported as `COMMIT_VERIFIED`.

## Isolation rule
During isolated DEV4 development:
- patch-p6-dev1.js SHALL NOT change.
- patch-p6-dev2.js SHALL NOT change.
- patch-p6-dev3.js SHALL NOT change.
- index.html SHALL NOT change.
- sw.js SHALL NOT change.

Only DEV4-specific implementation and DEV4-specific harness artifacts may be introduced.

## Integration rule
Physical integration of DEV4 into index.html and sw.js is deferred until static contract, isolated runtime, DRY_RUN, COMMIT, rollback, state-preservation and persistence-verification campaigns pass.

## Baseline dependency
Tag: `p6-dev3-baseline-2026-09-27`
Commit: `4b56fa75a7f942c27c794935771e386b41d844de`

## Contract status
P6 DEV4 CONTRACT STATUS: FROZEN CANDIDATE v1
