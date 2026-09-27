(() => {
  'use strict';

  const VERSION = 'dev.4';
  const GATE = 'EV-P6-019';

  const MODE_DRY_RUN = 'DRY_RUN';
  const MODE_COMMIT = 'COMMIT';

  function resultError(mode, reason, error) {
    return {
      gate: GATE,
      version: VERSION,
      mode,
      overall: false,
      status: 'ERROR',
      reason,
      error: {
        name: error?.name || 'Error',
        message: error?.message || String(error)
      }
    };
  }

  function normalizeMode(options) {
    const raw =
      typeof options === 'string'
        ? options
        : options?.mode ?? MODE_DRY_RUN;

    const mode =
      String(raw)
        .trim()
        .toUpperCase();

    if (
      mode !== MODE_DRY_RUN &&
      mode !== MODE_COMMIT
    ) {
      throw new TypeError(
        `Modo restore no soportado: ${raw}`
      );
    }

    return mode;
  }

  function resolveDependencies() {
    const preflightApi =
      globalThis.CATUER_P6_RESTORE;

    const commitApi =
      globalThis.CATUER_P6_RESTORE_COMMIT;

    if (
      !preflightApi ||
      typeof preflightApi.preflightRestoreEnvelope !== 'function' ||
      typeof preflightApi.preflightRestoreFile !== 'function'
    ) {
      throw new Error(
        'DEV2 Restore Preflight API no disponible.'
      );
    }

    if (
      !commitApi ||
      typeof commitApi.commitRestoreEnvelope !== 'function' ||
      typeof commitApi.commitRestoreFile !== 'function'
    ) {
      throw new Error(
        'DEV3 Restore Commit API no disponible.'
      );
    }

    return {
      preflightApi,
      commitApi
    };
  }

  function classifyCommit(commit) {
    if (
      commit?.overall === true &&
      commit?.committed === true &&
      commit?.reason === 'RESTORE_COMMITTED'
    ) {
      return 'COMMIT_VERIFIED';
    }

    if (
      commit?.reason === 'PREFLIGHT_REJECTED'
    ) {
      return 'PREFLIGHT_REJECTED';
    }

    if (
      commit?.rolledBack === true
    ) {
      return 'COMMIT_FAILED_ROLLED_BACK';
    }

    return 'COMMIT_FAILED_ROLLBACK_FAILED';
  }

  async function orchestrateRestoreEnvelope(
    envelope,
    options = {}
  ) {
    let mode = MODE_DRY_RUN;

    try {
      mode = normalizeMode(options);

      const {
        preflightApi,
        commitApi
      } = resolveDependencies();

      /*
       * Gate obligatorio DEV2.
       * Esta fase es exclusivamente de lectura.
       */
      const preflight =
        await preflightApi
          .preflightRestoreEnvelope(
            envelope
          );

      if (preflight?.overall !== true) {
        return {
          gate: GATE,
          version: VERSION,
          mode,
          overall: false,
          status: 'PREFLIGHT_REJECTED',
          preflight,
          commit: null
        };
      }

      if (mode === MODE_DRY_RUN) {
        return {
          gate: GATE,
          version: VERSION,
          mode,
          overall: true,
          status: 'DRY_RUN_PASS',
          preflight,
          commit: null
        };
      }

      /*
       * DEV3 posee la transacción acreditada:
       * persistencia, verificación post-commit
       * y rollback ante fallo.
       */
      const commit =
        await commitApi
          .commitRestoreEnvelope(
            envelope
          );

      const status =
        classifyCommit(commit);

      return {
        gate: GATE,
        version: VERSION,
        mode,
        overall:
          status === 'COMMIT_VERIFIED',
        status,
        preflight,
        commit
      };
    } catch (error) {
      return resultError(
        mode,
        'ORCHESTRATION_ERROR',
        error
      );
    }
  }

  async function orchestrateRestoreFile(
    file,
    options = {}
  ) {
    let mode = MODE_DRY_RUN;

    try {
      mode = normalizeMode(options);

      const {
        preflightApi,
        commitApi
      } = resolveDependencies();

      /*
       * Para archivo físico se conserva
       * el contrato DEV2, incluido SHA-256
       * físico y resultado de parseo.
       */
      const preflight =
        await preflightApi
          .preflightRestoreFile(
            file
          );

      if (preflight?.overall !== true) {
        return {
          gate: GATE,
          version: VERSION,
          mode,
          overall: false,
          status: 'PREFLIGHT_REJECTED',
          preflight,
          commit: null
        };
      }

      if (mode === MODE_DRY_RUN) {
        return {
          gate: GATE,
          version: VERSION,
          mode,
          overall: true,
          status: 'DRY_RUN_PASS',
          preflight,
          commit: null
        };
      }

      const commit =
        await commitApi
          .commitRestoreFile(
            file
          );

      const status =
        classifyCommit(commit);

      return {
        gate: GATE,
        version: VERSION,
        mode,
        overall:
          status === 'COMMIT_VERIFIED',
        status,
        preflight,
        commit
      };
    } catch (error) {
      return resultError(
        mode,
        'ORCHESTRATION_ERROR',
        error
      );
    }
  }

  globalThis.CATUER_P6_RESTORE_ORCHESTRATOR =
    Object.freeze({
      version: VERSION,
      gate: GATE,
      orchestrateRestoreEnvelope,
      orchestrateRestoreFile
    });

  console.info(
    '[CATU E-R] P6 dev.4 Restore Orchestrator cargado.'
  );
})();
