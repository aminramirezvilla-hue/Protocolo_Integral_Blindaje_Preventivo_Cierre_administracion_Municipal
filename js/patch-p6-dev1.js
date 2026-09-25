'use strict';

/*
 * CATU E-R
 * P6 dev.1 — Institutional Backup Builder
 *
 * Objetivo:
 * - construir un respaldo institucional determinista;
 * - no sustituir todavía exportJSON();
 * - no modificar IndexedDB;
 * - no modificar state;
 * - no modificar baseline P5-BL-003.
 */

(() => {

  const P6_FORMAT = 'CATU-ER-BACKUP';
  const P6_FORMAT_VERSION = 1;

  const P6_NORMATIVE_BASELINE = Object.freeze({
    technicalBaseline: 'P5-BL-003',
    normativeBaseline: 'C2/Fase IV',
    verifiedAt: '2026-09-10',
    activeControls: 84,
    sha256:
      '64f3a3149ecfb571323b17a37492a33a2d97d7f2d0757742da9bab971e164b6a'
  });

  function cloneJSON(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function canonicalize(value) {
    if (Array.isArray(value)) {
      return value.map(canonicalize);
    }

    if (value !== null && typeof value === 'object') {
      const out = {};

      Object.keys(value)
        .sort()
        .forEach(key => {
          const v = value[key];

          if (
            typeof v !== 'undefined' &&
            typeof v !== 'function' &&
            typeof v !== 'symbol'
          ) {
            out[key] = canonicalize(v);
          }
        });

      return out;
    }

    return value;
  }

  function canonicalJSONString(value) {
    return JSON.stringify(canonicalize(value));
  }

  async function sha256Hex(text) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Web Crypto API no disponible.');
    }

    const bytes = new TextEncoder().encode(text);
    const digest = await window.crypto.subtle.digest('SHA-256', bytes);

    return [...new Uint8Array(digest)]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function validateSourceState(source) {
    if (!source || typeof source !== 'object') {
      throw new Error('Estado fuente inexistente o inválido.');
    }

    const required = [
      'workspace',
      'users',
      'currentUserId',
      'assessments',
      'evidence',
      'config',
      'auditLog',
      'updatedAt'
    ];

    const missing = required.filter(
      key => !Object.prototype.hasOwnProperty.call(source, key)
    );

    if (missing.length) {
      throw new Error(
        `Estado incompleto. Faltan: ${missing.join(', ')}`
      );
    }

    return true;
  }

  async function buildInstitutionalBackup() {
    validateSourceState(state);

    /*
     * Snapshot lógico.
     * No se modifica state.
     */
    const payload = cloneJSON(state);

    /*
     * La integridad se calcula EXCLUSIVAMENTE sobre
     * la representación canónica del payload.
     */
    const canonicalPayload = canonicalJSONString(payload);
    const payloadSha256 = await sha256Hex(canonicalPayload);

    const envelope = {
      format: P6_FORMAT,
      formatVersion: P6_FORMAT_VERSION,
      createdAt: new Date().toISOString(),

      application: {
        name: 'CATU E-R',
        version:
          typeof APP_VERSION !== 'undefined'
            ? APP_VERSION
            : 'unknown'
      },

      normativeBaseline: {
        ...P6_NORMATIVE_BASELINE
      },

      workspace: cloneJSON(state.workspace),

      integrity: {
        algorithm: 'SHA-256',
        canonicalization: 'CATU-ER-C14N-v1',
        scope: 'payload',
        payloadSha256
      },

      payload
    };

    return envelope;
  }

  async function verifyEnvelope(envelope) {
    if (!envelope || envelope.format !== P6_FORMAT) {
      return {
        valid: false,
        reason: 'FORMAT_INVALID'
      };
    }

    if (envelope.formatVersion !== P6_FORMAT_VERSION) {
      return {
        valid: false,
        reason: 'FORMAT_VERSION_UNSUPPORTED'
      };
    }

    if (!envelope.payload || !envelope.integrity) {
      return {
        valid: false,
        reason: 'STRUCTURE_INVALID'
      };
    }

    const canonicalPayload =
      canonicalJSONString(envelope.payload);

    const calculated =
      await sha256Hex(canonicalPayload);

    const declared =
      String(
        envelope.integrity.payloadSha256 || ''
      ).toLowerCase();

    return {
      valid: calculated === declared,
      declared,
      calculated
    };
  }

  /*
   * API temporal P6.
   * No modifica funciones existentes.
   */

/*
 * P6 — Compatibilidad de baseline normativa.
 *
 * Control independiente de la integridad criptográfica del payload.
 * Política fail-closed: cualquier ausencia o diferencia invalida
 * la compatibilidad normativa.
 */
function validateNormativeCompatibility(envelope) {

  if (!envelope || typeof envelope !== 'object') {
    return {
      valid: false,
      reason: 'ENVELOPE_INVALID',
      mismatches: ['envelope']
    };
  }

  const received = envelope.normativeBaseline;

  if (!received || typeof received !== 'object') {
    return {
      valid: false,
      reason: 'NORMATIVE_BASELINE_MISSING',
      mismatches: ['normativeBaseline']
    };
  }

  const expected = P6_NORMATIVE_BASELINE;

  const fields = [
    'technicalBaseline',
    'normativeBaseline',
    'verifiedAt',
    'activeControls',
    'sha256'
  ];

  const mismatches = fields.filter(field => {

    if (field === 'activeControls') {
      return Number(received[field]) !== Number(expected[field]);
    }

    if (field === 'sha256') {
      return String(received[field] ?? '').toLowerCase()
        !== String(expected[field] ?? '').toLowerCase();
    }

    return String(received[field] ?? '')
      !== String(expected[field] ?? '');
  });

  return {
    valid: mismatches.length === 0,
    reason:
      mismatches.length === 0
        ? 'BASELINE_COMPATIBLE'
        : 'BASELINE_MISMATCH',
    mismatches,
    expected: cloneJSON(expected),
    received: cloneJSON(received)
  };
}


window.CATUER_P6 = Object.freeze({
    version: 'dev.1',
    format: P6_FORMAT,
    formatVersion: P6_FORMAT_VERSION,
    normativeBaseline: P6_NORMATIVE_BASELINE,
    canonicalize,
    canonicalJSONString,
    sha256Hex,
    validateSourceState,
  validateNormativeCompatibility,
    buildInstitutionalBackup,
    verifyEnvelope
  });

  console.info(
    '[CATU E-R] P6 dev.1 Institutional Backup Builder cargado.'
  );

})();
