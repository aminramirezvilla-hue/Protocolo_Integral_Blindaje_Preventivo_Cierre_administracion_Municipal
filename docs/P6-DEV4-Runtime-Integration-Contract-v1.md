# P6 DEV4 — Runtime Integration Contract v1

## 1. Purpose

This contract governs the runtime integration of the already-accredited
P6 DEV4 Institutional Restore Orchestrator into the CATU E-R application shell.

DEV4 coordinates the accredited P6 restore engines:

- DEV1 — Institutional Backup Builder
- DEV2 — Restore Preflight / DRY_RUN
- DEV3 — Restore Commit / Verify / Rollback
- DEV4 — Institutional Restore Orchestrator

This contract authorizes runtime integration only.
It SHALL NOT redefine or modify the behavior of DEV1, DEV2, DEV3, or DEV4.

## 2. Accredited source baseline

The integration SHALL originate from:

- Branch: `dev/v0.1.5`
- DEV4 baseline tag: `p6-dev4-baseline-2026-09-27`
- DEV4 baseline commit: `142d9f685428cc9951bd31b226de646b57812b5a`
- DEV4 SHA-256:
  `7ed4dad4a737e3453f70e50ce106e251f2ac5936689fa71081392ce14dff432a`

The DEV4 implementation SHALL remain byte-identical during runtime integration.

## 3. Authorized implementation scope

The future runtime integration commit MAY modify only:

1. `index.html`
2. `sw.js`

No other tracked implementation file is authorized for modification.

## 4. Immutable engines

The following files SHALL remain unchanged:

- `js/patch-p6-dev1.js`
- `js/patch-p6-dev2.js`
- `js/patch-p6-dev3.js`
- `js/patch-p6-dev4.js`

Runtime integration SHALL NOT rewrite, patch, refactor, normalize, format,
or otherwise alter those engines.

## 5. Canonical runtime load order

The application shell SHALL load P6 restore engines in this exact order:

1. `./js/patch-p6-dev1.js`
2. `./js/patch-p6-dev2.js`
3. `./js/patch-p6-dev3.js`
4. `./js/patch-p6-dev4.js`

DEV4 SHALL load only after DEV1, DEV2, and DEV3.

## 6. Service Worker APP_SHELL contract

`sw.js` SHALL include DEV4 after DEV3 in the APP_SHELL manifest:

`./js/patch-p6-dev1.js`
→ `./js/patch-p6-dev2.js`
→ `./js/patch-p6-dev3.js`
→ `./js/patch-p6-dev4.js`

No accredited P6 engine may be removed or reordered.

## 7. Cache version transition

The currently accredited cache identifier is:

`catu-er-v0.1.5-dev.3`

Runtime integration of DEV4 SHALL advance the cache identifier exactly once to:

`catu-er-v0.1.5-dev.4`

The cache increment exists solely to prevent a stale service-worker shell from
serving the DEV1–DEV3 runtime without DEV4.

## 8. Runtime API invariant

After successful load, the browser runtime SHALL expose:

`globalThis.CATUER_P6_RESTORE_ORCHESTRATOR`

The public object SHALL retain the accredited DEV4 contract, including:

- `version`
- `gate`
- `orchestrateRestoreEnvelope`
- `orchestrateRestoreFile`

No alternate orchestration API SHALL be introduced by the integration layer.

## 9. No-write-on-load invariant

Loading DEV4 SHALL NOT:

- persist application state;
- mutate IndexedDB;
- invoke COMMIT;
- invoke rollback;
- alter the current workspace;
- import a restore file automatically;
- execute restoration automatically.

Script loading SHALL only make the accredited DEV4 API available.

## 10. DRY_RUN invariant

A DEV4 `DRY_RUN` operation SHALL:

1. invoke the accredited DEV2 preflight path;
2. return a structured result;
3. preserve current persisted state;
4. preserve current in-memory state;
5. return no commit operation.

A successful DRY_RUN SHALL NOT constitute a restoration.

## 11. COMMIT invariant

A DEV4 COMMIT operation SHALL be permitted only after successful DEV2 preflight.

The canonical transaction remains:

1. preflight;
2. capture previous state;
3. persist exact target state;
4. verify persisted target state;
5. return `COMMIT_VERIFIED` on success;
6. invoke DEV3 rollback on commit or verification failure;
7. verify restoration of the previous state.

DEV4 SHALL orchestrate these operations but SHALL NOT reimplement them.

## 12. Rollback invariant

Rollback authority remains exclusively in the accredited DEV3 engine.

The integration layer SHALL NOT introduce:

- an alternate rollback mechanism;
- direct IndexedDB rollback writes;
- independent cryptographic verification;
- `saveState()` as a substitute for exact restoration.

## 13. Failure policy

Integration SHALL fail closed if any required P6 dependency is unavailable.

No successful runtime status may be emitted when:

- DEV1 is unavailable;
- DEV2 is unavailable;
- DEV3 is unavailable;
- DEV4 is unavailable;
- preflight fails;
- commit verification fails;
- required rollback fails.

## 14. Integration evidence required

Before freezing the runtime-integrated baseline, evidence SHALL demonstrate:

1. source and tag identity;
2. immutable DEV1–DEV4 hashes;
3. syntax validity;
4. canonical index load order;
5. canonical service-worker order;
6. cache transition to `catu-er-v0.1.5-dev.4`;
7. DEV4 global API availability;
8. DRY_RUN without persistence mutation;
9. controlled COMMIT with post-commit verification;
10. rollback to the accredited previous state;
11. persistence correctness after reload;
12. clean Git worktree;
13. local/remote synchronization.

## 15. Implementation commit boundary

The runtime implementation commit SHALL contain exactly:

- `index.html`
- `sw.js`

The contract document itself SHALL be frozen separately before runtime
implementation begins.

## 16. Baseline rule

The existing DEV4 implementation baseline SHALL remain immutable.

A new runtime-integration baseline SHALL NOT be created until every required
integration and runtime gate returns PASS.

## 17. Terminal states

The runtime integration campaign may terminate only as:

- `RUNTIME_INTEGRATION_ACCREDITED`
- `RUNTIME_INTEGRATION_REJECTED`
- `ROLLBACK_REQUIRED`
- `DO_NOT_ADVANCE`

No partial integration state SHALL be treated as an accredited baseline.
