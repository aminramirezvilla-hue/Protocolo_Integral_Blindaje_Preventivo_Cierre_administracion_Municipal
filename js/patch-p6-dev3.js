/*
 * CATU E-R
 * P6 dev.3 — Restore Commit Engine
 *
 * Objetivo:
 * - ejecutar restauración institucional después de un preflight válido;
 * - preservar exactamente el payload recibido;
 * - verificar persistencia efectiva en IndexedDB;
 * - verificar SHA-256 post-commit;
 * - aplicar rollback automático ante cualquier fallo;
 * - NO usar saveState(), porque altera updatedAt/auditLog;
 * - NO integrarse todavía al App Shell.
 *
 * Gate: EV-P6-018
 */

(() => {
  'use strict';

  const base = globalThis.CATUER_P6;
  const preflightApi = globalThis.CATUER_P6_RESTORE;

  if (!base) {
    throw new Error(
      'CATUER_P6 no está disponible. patch-p6-dev1.js debe cargarse antes.'
    );
  }

  if (!preflightApi) {
    throw new Error(
      'CATUER_P6_RESTORE no está disponible. patch-p6-dev2.js debe cargarse antes.'
    );
  }

  function cloneJSON(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function canonicalEqual(a, b) {
    return (
      base.canonicalJSONString(a) ===
      base.canonicalJSONString(b)
    );
  }

  async function readPersistedState() {
    return await idbGet(STATE_KEY);
  }

  async function persistExactState(nextState) {
    await idbSet(
      STATE_KEY,
      cloneJSON(nextState)
    );
  }

  async function verifyCommittedState(
    expectedPayload,
    expectedPayloadSha256
  ) {
    const persisted =
      await readPersistedState();

    const persistedCanonical =
      base.canonicalJSONString(persisted);

    const persistedSha256 =
      await base.sha256Hex(
        persistedCanonical
      );

    const memoryCanonical =
      base.canonicalJSONString(state);

    const memorySha256 =
      await base.sha256Hex(
        memoryCanonical
      );

    const persistedEquivalent =
      canonicalEqual(
        persisted,
        expectedPayload
      );

    const memoryEquivalent =
      canonicalEqual(
        state,
        expectedPayload
      );

    const persistedHashMatches =
      persistedSha256 ===
      expectedPayloadSha256;

    const memoryHashMatches =
      memorySha256 ===
      expectedPayloadSha256;

    return {
      valid:
        persistedEquivalent === true &&
        memoryEquivalent === true &&
        persistedHashMatches === true &&
        memoryHashMatches === true,

      persistedEquivalent,
      memoryEquivalent,
      persistedHashMatches,
      memoryHashMatches,

      expectedPayloadSha256,
      persistedSha256,
      memorySha256
    };
  }

  async function rollbackState(
    previousState,
    previousPayloadSha256
  ) {
    state =
      cloneJSON(previousState);

    await persistExactState(state);

    const persisted =
      await readPersistedState();

    const persistedSha256 =
      await base.sha256Hex(
        base.canonicalJSONString(
          persisted
        )
      );

    const memorySha256 =
      await base.sha256Hex(
        base.canonicalJSONString(
          state
        )
      );

    const valid =
      canonicalEqual(
        persisted,
        previousState
      ) &&
      canonicalEqual(
        state,
        previousState
      ) &&
      persistedSha256 ===
        previousPayloadSha256 &&
      memorySha256 ===
        previousPayloadSha256;

    try {
      render();
    } catch (renderError) {
      console.error(
        '[CATU E-R] Error de render durante rollback:',
        renderError
      );
    }

    return {
      valid,
      expectedPayloadSha256:
        previousPayloadSha256,
      persistedSha256,
      memorySha256
    };
  }

  async function commitRestoreEnvelope(envelope) {

    /*
     * Gate obligatorio.
     * Ninguna escritura ocurre antes de obtener PASS.
     */
    const preflight =
      await preflightApi
        .preflightRestoreEnvelope(
          envelope
        );

    if (!preflight.overall) {
      return {
        gate: 'EV-P6-018',
        mode: 'COMMIT',
        overall: false,
        committed: false,
        rolledBack: false,
        reason: 'PREFLIGHT_REJECTED',
        preflight
      };
    }

    /*
     * Snapshot contractual del estado previo.
     */
    const previousEnvelope =
      await base
        .buildInstitutionalBackup();

    const previousState =
      cloneJSON(
        previousEnvelope.payload
      );

    const previousPayloadSha256 =
      previousEnvelope
        .integrity
        .payloadSha256;

    const targetPayload =
      cloneJSON(
        envelope.payload
      );

    const targetPayloadSha256 =
      String(
        envelope
          .integrity
          .payloadSha256 || ''
      ).toLowerCase();

    try {

      /*
       * COMMIT exacto.
       *
       * No utilizar saveState():
       * saveState() modifica updatedAt
       * y puede modificar auditLog.
       */
      state =
        cloneJSON(targetPayload);

      await persistExactState(
        state
      );

      const verification =
        await verifyCommittedState(
          targetPayload,
          targetPayloadSha256
        );

      if (!verification.valid) {
        throw Object.assign(
          new Error(
            'La verificación post-commit no coincide con el payload objetivo.'
          ),
          {
            code:
              'POST_COMMIT_VERIFICATION_FAILED',
            verification
          }
        );
      }

      /*
       * Render solamente después de
       * acreditar memoria + IndexedDB.
       */
      render();

      const result = {
        gate: 'EV-P6-018',
        mode: 'COMMIT',
        overall: true,
        committed: true,
        rolledBack: false,
        reason: 'RESTORE_COMMITTED',

        preflight,

        before: {
          payloadSha256:
            previousPayloadSha256
        },

        target: {
          payloadSha256:
            targetPayloadSha256
        },

        verification
      };

      globalThis.__EV_P6_018_LAST__ =
        result;

      return result;

    } catch (error) {

      let rollback = null;

      try {
        rollback =
          await rollbackState(
            previousState,
            previousPayloadSha256
          );
      } catch (rollbackError) {
        rollback = {
          valid: false,
          error:
            rollbackError?.message ||
            String(rollbackError)
        };
      }

      const result = {
        gate: 'EV-P6-018',
        mode: 'COMMIT',
        overall: false,
        committed: false,
        rolledBack:
          rollback?.valid === true,
        reason:
          rollback?.valid === true
            ? 'COMMIT_FAILED_ROLLBACK_OK'
            : 'COMMIT_FAILED_ROLLBACK_FAILED',

        error: {
          name:
            error?.name ||
            'Error',
          code:
            error?.code ||
            null,
          message:
            error?.message ||
            String(error)
        },

        preflight,

        before: {
          payloadSha256:
            previousPayloadSha256
        },

        target: {
          payloadSha256:
            targetPayloadSha256
        },

        verification:
          error?.verification ||
          null,

        rollback
      };

      globalThis.__EV_P6_018_LAST__ =
        result;

      return result;
    }
  }

  async function commitRestoreFile(file) {

    if (!(file instanceof File)) {
      throw new TypeError(
        'Se requiere un objeto File.'
      );
    }

    const text =
      await file.text();

    let envelope;

    try {
      envelope =
        JSON.parse(text);
    } catch (error) {
      return {
        gate: 'EV-P6-018',
        mode: 'COMMIT',
        overall: false,
        committed: false,
        rolledBack: false,
        reason: 'JSON_PARSE_ERROR',
        error: {
          message:
            error.message
        }
      };
    }

    const result =
      await commitRestoreEnvelope(
        envelope
      );

    return {
      ...result,
      file: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    };
  }

  globalThis.CATUER_P6_RESTORE_COMMIT =
    Object.freeze({
      version: 'dev.3',
      gate: 'EV-P6-018',
      mode: 'COMMIT',

      readPersistedState,
      verifyCommittedState,
      rollbackState,
      commitRestoreEnvelope,
      commitRestoreFile
    });

  console.info(
    '[CATU E-R] P6 dev.3 Restore Commit Engine cargado.'
  );

})();
