/*
 * CATU E-R
 * P6 dev.2 — Restore Preflight / Dry-Run
 *
 * Objetivo:
 * - validar un respaldo institucional antes de restaurarlo;
 * - NO escribir en IndexedDB;
 * - NO modificar state;
 * - NO modificar auditLog;
 * - NO ejecutar restauración.
 *
 * Gate: EV-P6-017
 */

(() => {
  'use strict';

  const base = globalThis.CATUER_P6;

  if (!base) {
    throw new Error(
      'CATUER_P6 no está disponible. patch-p6-dev1.js debe cargarse antes de patch-p6-dev2.js.'
    );
  }

  const REQUIRED_ENVELOPE_FIELDS = Object.freeze([
    'format',
    'formatVersion',
    'createdAt',
    'application',
    'normativeBaseline',
    'workspace',
    'integrity',
    'payload'
  ]);

  const REQUIRED_PAYLOAD_FIELDS = Object.freeze([
    'workspace',
    'users',
    'currentUserId',
    'assessments',
    'evidence',
    'config',
    'auditLog',
    'updatedAt',
    'importConflicts'
  ]);

  function isPlainObject(value) {
    return (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    );
  }

  function cloneJSON(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function canonicalEqual(a, b) {
    return base.canonicalJSONString(a) ===
      base.canonicalJSONString(b);
  }

  function validateEnvelopeStructure(envelope) {
    if (!isPlainObject(envelope)) {
      return {
        valid: false,
        reason: 'ENVELOPE_INVALID',
        missing: [...REQUIRED_ENVELOPE_FIELDS]
      };
    }

    const missing = REQUIRED_ENVELOPE_FIELDS.filter(
      key =>
        !Object.prototype.hasOwnProperty.call(envelope, key)
    );

    return {
      valid: missing.length === 0,
      reason:
        missing.length === 0
          ? 'ENVELOPE_STRUCTURE_VALID'
          : 'ENVELOPE_STRUCTURE_INCOMPLETE',
      missing
    };
  }

  function validatePayloadSemantics(payload) {
    if (!isPlainObject(payload)) {
      return {
        valid: false,
        reason: 'PAYLOAD_INVALID',
        missing: [...REQUIRED_PAYLOAD_FIELDS],
        typeErrors: ['payload']
      };
    }

    const missing = REQUIRED_PAYLOAD_FIELDS.filter(
      key =>
        !Object.prototype.hasOwnProperty.call(payload, key)
    );

    const typeErrors = [];

    if (
      Object.prototype.hasOwnProperty.call(payload, 'workspace') &&
      !isPlainObject(payload.workspace)
    ) {
      typeErrors.push('workspace');
    }

    if (
      Object.prototype.hasOwnProperty.call(payload, 'users') &&
      !Array.isArray(payload.users)
    ) {
      typeErrors.push('users');
    }

    if (
      Object.prototype.hasOwnProperty.call(payload, 'currentUserId') &&
      typeof payload.currentUserId !== 'string'
    ) {
      typeErrors.push('currentUserId');
    }

    if (
      Object.prototype.hasOwnProperty.call(payload, 'assessments') &&
      !isPlainObject(payload.assessments)
    ) {
      typeErrors.push('assessments');
    }

    if (
      Object.prototype.hasOwnProperty.call(payload, 'evidence') &&
      !Array.isArray(payload.evidence)
    ) {
      typeErrors.push('evidence');
    }

    if (
      Object.prototype.hasOwnProperty.call(payload, 'config') &&
      !isPlainObject(payload.config)
    ) {
      typeErrors.push('config');
    }

    if (
      Object.prototype.hasOwnProperty.call(payload, 'auditLog') &&
      !Array.isArray(payload.auditLog)
    ) {
      typeErrors.push('auditLog');
    }

    if (
      Object.prototype.hasOwnProperty.call(payload, 'updatedAt') &&
      typeof payload.updatedAt !== 'string'
    ) {
      typeErrors.push('updatedAt');
    }

    if (
      Object.prototype.hasOwnProperty.call(payload, 'importConflicts') &&
      !Array.isArray(payload.importConflicts)
    ) {
      typeErrors.push('importConflicts');
    }

    return {
      valid:
        missing.length === 0 &&
        typeErrors.length === 0,
      reason:
        missing.length === 0 &&
        typeErrors.length === 0
          ? 'PAYLOAD_SEMANTICALLY_VALID'
          : 'PAYLOAD_SEMANTICALLY_INVALID',
      missing,
      typeErrors
    };
  }

  function buildRestorePreview(currentPayload, incomingPayload) {
    const keys = Array.from(
      new Set([
        ...Object.keys(currentPayload || {}),
        ...Object.keys(incomingPayload || {})
      ])
    ).sort();

    const changedTopLevelFields = keys.filter(
      key =>
        !canonicalEqual(
          currentPayload?.[key],
          incomingPayload?.[key]
        )
    );

    return {
      identical:
        changedTopLevelFields.length === 0,

      changedTopLevelFields,

      current: {
        municipality:
          currentPayload?.workspace?.municipality ?? '',
        currentUserId:
          currentPayload?.currentUserId ?? null,
        users:
          Array.isArray(currentPayload?.users)
            ? currentPayload.users.length
            : null,
        assessments:
          isPlainObject(currentPayload?.assessments)
            ? Object.keys(currentPayload.assessments).length
            : null,
        evidence:
          Array.isArray(currentPayload?.evidence)
            ? currentPayload.evidence.length
            : null,
        auditLog:
          Array.isArray(currentPayload?.auditLog)
            ? currentPayload.auditLog.length
            : null,
        updatedAt:
          currentPayload?.updatedAt ?? null
      },

      incoming: {
        municipality:
          incomingPayload?.workspace?.municipality ?? '',
        currentUserId:
          incomingPayload?.currentUserId ?? null,
        users:
          Array.isArray(incomingPayload?.users)
            ? incomingPayload.users.length
            : null,
        assessments:
          isPlainObject(incomingPayload?.assessments)
            ? Object.keys(incomingPayload.assessments).length
            : null,
        evidence:
          Array.isArray(incomingPayload?.evidence)
            ? incomingPayload.evidence.length
            : null,
        auditLog:
          Array.isArray(incomingPayload?.auditLog)
            ? incomingPayload.auditLog.length
            : null,
        updatedAt:
          incomingPayload?.updatedAt ?? null
      }
    };
  }

  async function preflightRestoreEnvelope(envelope) {
    /*
     * Guardar representación original para demostrar que
     * el preflight tampoco modifica el archivo recibido.
     */
    const incomingBefore =
      base.canonicalJSONString(envelope);

    /*
     * Snapshot lógico del estado vigente.
     * buildInstitutionalBackup() es de sólo lectura.
     */
    const localBefore =
      await base.buildInstitutionalBackup();

    const localPayloadHashBefore =
      localBefore.integrity.payloadSha256;

    const structure =
      validateEnvelopeStructure(envelope);

    const format = {
      valid:
        envelope?.format === base.format &&
        envelope?.formatVersion === base.formatVersion,

      expectedFormat: base.format,
      receivedFormat: envelope?.format ?? null,

      expectedVersion: base.formatVersion,
      receivedVersion: envelope?.formatVersion ?? null
    };

    const payload =
      validatePayloadSemantics(envelope?.payload);

    const workspaceConsistency = {
      valid:
        !!envelope?.workspace &&
        !!envelope?.payload?.workspace &&
        canonicalEqual(
          envelope.workspace,
          envelope.payload.workspace
        )
    };

    const crypto =
      structure.valid && format.valid && payload.valid
        ? await base.verifyEnvelope(envelope)
        : {
            valid: false,
            reason: 'PRECONDITION_FAILED'
          };

    const baseline =
      structure.valid && format.valid
        ? base.validateNormativeCompatibility(envelope)
        : {
            valid: false,
            reason: 'PRECONDITION_FAILED',
            mismatches: []
          };

    const preview =
      payload.valid
        ? buildRestorePreview(
            localBefore.payload,
            envelope.payload
          )
        : null;

    /*
     * Segundo snapshot para acreditar que la ejecución
     * del preflight no modificó el estado vigente.
     */
    const localAfter =
      await base.buildInstitutionalBackup();

    const localPayloadHashAfter =
      localAfter.integrity.payloadSha256;

    const sourceStateUnmodified =
      localPayloadHashBefore ===
      localPayloadHashAfter;

    const incomingAfter =
      base.canonicalJSONString(envelope);

    const sourceEnvelopeUnmodified =
      incomingBefore === incomingAfter;

    const overall =
      structure.valid === true &&
      format.valid === true &&
      payload.valid === true &&
      workspaceConsistency.valid === true &&
      crypto.valid === true &&
      baseline.valid === true &&
      sourceStateUnmodified === true &&
      sourceEnvelopeUnmodified === true;

    return {
      gate: 'EV-P6-017',
      mode: 'DRY_RUN',
      overall,

      structure,
      format,
      payload,
      workspaceConsistency,
      crypto,
      baseline,

      preservation: {
        sourceStateUnmodified,
        sourceEnvelopeUnmodified,
        localPayloadHashBefore,
        localPayloadHashAfter
      },

      preview
    };
  }

  async function sha256ArrayBuffer(buffer) {
    const hash =
      await globalThis.crypto.subtle.digest(
        'SHA-256',
        buffer
      );

    return Array.from(new Uint8Array(hash))
      .map(byte =>
        byte.toString(16).padStart(2, '0')
      )
      .join('');
  }

  async function preflightRestoreFile(file) {
    if (!(file instanceof File)) {
      throw new TypeError(
        'Se requiere un objeto File.'
      );
    }

    const physicalFileSha256 =
      await sha256ArrayBuffer(
        await file.arrayBuffer()
      );

    const text =
      await file.text();

    let envelope;

    try {
      envelope = JSON.parse(text);
    } catch (err) {
      return {
        gate: 'EV-P6-017',
        mode: 'DRY_RUN',
        overall: false,

        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          physicalFileSha256
        },

        parse: {
          valid: false,
          reason: 'JSON_PARSE_ERROR',
          message: err.message
        }
      };
    }

    const result =
      await preflightRestoreEnvelope(envelope);

    return {
      ...result,

      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        physicalFileSha256
      },

      parse: {
        valid: true,
        reason: 'JSON_PARSE_OK'
      }
    };
  }

  function selectBackupFile() {
    return new Promise((resolve, reject) => {
      if (
        typeof document === 'undefined' ||
        !document.body
      ) {
        reject(
          new Error(
            'Selector de archivo no disponible fuera del navegador.'
          )
        );
        return;
      }

      const input =
        document.createElement('input');

      input.type = 'file';
      input.accept =
        '.json,application/json';
      input.style.display = 'none';

      document.body.appendChild(input);

      input.addEventListener(
        'change',
        () => {
          const file =
            input.files?.[0] || null;

          input.remove();

          if (!file) {
            reject(
              new Error(
                'No se seleccionó archivo.'
              )
            );
            return;
          }

          resolve(file);
        },
        { once: true }
      );

      input.click();
    });
  }

  async function selectAndPreflight() {
    console.log(
      '===== EV-P6-017 — RESTORE PREFLIGHT ====='
    );

    const file =
      await selectBackupFile();

    const result =
      await preflightRestoreFile(file);

    console.log(
      'Archivo:',
      result.file
    );

    console.log(
      'Estructura:',
      result.structure
    );

    console.log(
      'Formato:',
      result.format
    );

    console.log(
      'Payload:',
      result.payload
    );

    console.log(
      'Crypto:',
      result.crypto
    );

    console.log(
      'Baseline:',
      result.baseline
    );

    console.log(
      'Preservación:',
      result.preservation
    );

    console.log(
      'Preview:',
      result.preview
    );

    console.log('');

    console.log(
      'EV-P6-017 DRY-RUN:',
      result.overall ? 'PASS' : 'FAIL'
    );

    globalThis.__EV_P6_017_LAST__ =
      result;

    return result;
  }

  globalThis.CATUER_P6_RESTORE =
    Object.freeze({
      version: 'dev.2',
      gate: 'EV-P6-017',
      mode: 'DRY_RUN',

      validateEnvelopeStructure,
      validatePayloadSemantics,
      buildRestorePreview,
      preflightRestoreEnvelope,
      preflightRestoreFile,
      selectBackupFile,
      selectAndPreflight
    });

  console.info(
    '[CATU E-R] P6 dev.2 Restore Preflight cargado.'
  );
})();
