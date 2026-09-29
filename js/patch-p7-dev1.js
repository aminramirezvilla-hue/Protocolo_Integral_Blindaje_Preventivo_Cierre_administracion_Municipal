(() => {
  'use strict';

  // CATU E-R · P7 dev.1
  // Contrato acreditado por EV-P7-021E.5L:
  //   ADD_MISSING_RESPONSABLE_FROM_RESPONSIBLEBASE_ONLY
  //
  // Alcance:
  // 1) Mantener intacto el esquema heredado `responsible`.
  // 2) Materializar `responsable` únicamente cuando la propiedad NO exista.
  // 3) Tomar el valor exclusivamente de `control.responsibleBase`.
  // 4) Preservar cualquier propiedad `responsable` ya existente, incluso "", null o valores personalizados.
  // 5) Backfill idempotente de assessments ya persistidos.
  // 6) Persistir solamente cuando exista al menos un cambio real.

  const P7_DEV1_VERSION = '0.1.7-dev.1';
  const P7_SCHEMA_CONTRACT = 'ADD_MISSING_RESPONSABLE_FROM_RESPONSIBLEBASE_ONLY';
  const P7_SOURCE_FIELD = 'responsibleBase';
  const P7_TARGET_FIELD = 'responsable';

  const p7Own = (obj, key) =>
    !!obj && Object.prototype.hasOwnProperty.call(obj, key);

  function p7UsableSource(control) {
    if (!control || typeof control !== 'object') {
      return { ok: false, reason: 'CONTROL_MISSING' };
    }

    if (!p7Own(control, P7_SOURCE_FIELD)) {
      return { ok: false, reason: 'SOURCE_PROPERTY_MISSING' };
    }

    const value = control[P7_SOURCE_FIELD];

    if (value === undefined || value === null || String(value).trim() === '') {
      return { ok: false, reason: 'SOURCE_VALUE_EMPTY' };
    }

    return { ok: true, value };
  }

  /**
   * Proyección pura de un assessment.
   * No modifica el objeto recibido.
   */
  function p7ProjectAssessment(assessment, control) {
    if (!assessment || typeof assessment !== 'object') {
      return {
        changed: false,
        reason: 'ASSESSMENT_MISSING',
        assessment
      };
    }

    const projected = { ...assessment };

    // Política acreditada: cualquier own-property existente se preserva,
    // incluso si vale "", null o un valor personalizado.
    if (p7Own(projected, P7_TARGET_FIELD)) {
      return {
        changed: false,
        reason: 'TARGET_ALREADY_OWN',
        assessment: projected,
        value: projected[P7_TARGET_FIELD]
      };
    }

    const source = p7UsableSource(control);

    if (!source.ok) {
      return {
        changed: false,
        reason: source.reason,
        assessment: projected
      };
    }

    projected[P7_TARGET_FIELD] = source.value;

    return {
      changed: true,
      reason: 'TARGET_MATERIALIZED',
      assessment: projected,
      sourceValue: source.value,
      value: source.value
    };
  }

  function p7ControlMap(controlList = controls) {
    return new Map(
      (Array.isArray(controlList) ? controlList : [])
        .filter(c => c && c.id)
        .map(c => [c.id, c])
    );
  }

  /**
   * Planeación pura de migración.
   * No modifica state ni IndexedDB.
   */
  function p7PlanState(targetState = state, controlList = controls) {
    const assessments =
      targetState?.assessments && typeof targetState.assessments === 'object'
        ? targetState.assessments
        : {};

    const controlMap = p7ControlMap(controlList);
    const changes = [];
    const skipped = [];

    for (const [id, assessment] of Object.entries(assessments)) {
      const control = controlMap.get(id);
      const projected = p7ProjectAssessment(assessment, control);

      if (projected.changed) {
        changes.push({
          id,
          field: P7_TARGET_FIELD,
          sourceField: P7_SOURCE_FIELD,
          beforeOwn: p7Own(assessment, P7_TARGET_FIELD),
          beforeValue: assessment?.[P7_TARGET_FIELD],
          sourceValue: projected.sourceValue,
          afterValue: projected.value
        });
      } else {
        skipped.push({
          id,
          reason: projected.reason,
          targetOwn: p7Own(assessment, P7_TARGET_FIELD),
          targetValue: assessment?.[P7_TARGET_FIELD]
        });
      }
    }

    return {
      version: P7_DEV1_VERSION,
      contract: P7_SCHEMA_CONTRACT,
      assessmentCount: Object.keys(assessments).length,
      changeCount: changes.length,
      changedIds: changes.map(x => x.id),
      changes,
      skipped
    };
  }

  function p7ApplyPlan(targetState, plan) {
    if (!targetState?.assessments || !plan?.changes?.length) {
      return targetState;
    }

    for (const change of plan.changes) {
      const current = targetState.assessments[change.id];

      if (!current || p7Own(current, P7_TARGET_FIELD)) {
        continue;
      }

      targetState.assessments[change.id] = {
        ...current,
        [P7_TARGET_FIELD]: change.afterValue
      };
    }

    return targetState;
  }

  let p7LastLoadResult = Object.freeze({
    version: P7_DEV1_VERSION,
    contract: P7_SCHEMA_CONTRACT,
    executed: false,
    persisted: false,
    changeCount: 0,
    changedIds: []
  });

  /**
   * Corrección prospectiva.
   * Todos los assessments construidos a partir de defaultAssessment
   * reciben `responsable` desde `responsibleBase`, sin sustituir
   * el campo heredado `responsible`.
   */
  const p7Dev1BaseDefaultAssessment = defaultAssessment;

  defaultAssessment = function(control) {
    const base = p7Dev1BaseDefaultAssessment(control);
    return p7ProjectAssessment(base, control).assessment;
  };

  /**
   * Corrección retrospectiva.
   * Se ejecuta después de toda la cadena heredada de loadData().
   */
  const p7Dev1BaseLoadData = loadData;

  loadData = async function() {
    await p7Dev1BaseLoadData();

    const plan = p7PlanState(state, controls);

    if (!plan.changeCount) {
      p7LastLoadResult = Object.freeze({
        version: P7_DEV1_VERSION,
        contract: P7_SCHEMA_CONTRACT,
        executed: true,
        persisted: false,
        changeCount: 0,
        changedIds: []
      });
      return;
    }

    const before = structuredClone(state);
    const next = structuredClone(state);

    p7ApplyPlan(next, plan);
    state = next;

    try {
      await saveState({
        action: 'p7-schema-backfill',
        summary:
          `P7 dev.1: materialización de ${P7_TARGET_FIELD} desde ${P7_SOURCE_FIELD} ` +
          `en ${plan.changeCount} assessment(s): ${plan.changedIds.join(', ')}`,
        schemaPatch: P7_SCHEMA_CONTRACT,
        schemaPatchVersion: P7_DEV1_VERSION,
        sourceField: P7_SOURCE_FIELD,
        targetField: P7_TARGET_FIELD,
        controlIds: [...plan.changedIds]
      });

      p7LastLoadResult = Object.freeze({
        version: P7_DEV1_VERSION,
        contract: P7_SCHEMA_CONTRACT,
        executed: true,
        persisted: true,
        changeCount: plan.changeCount,
        changedIds: [...plan.changedIds]
      });
    } catch (error) {
      // Restituye memoria al snapshot previo si la persistencia falla.
      state = before;

      p7LastLoadResult = Object.freeze({
        version: P7_DEV1_VERSION,
        contract: P7_SCHEMA_CONTRACT,
        executed: true,
        persisted: false,
        changeCount: plan.changeCount,
        changedIds: [...plan.changedIds],
        error: error?.message || String(error)
      });

      throw error;
    }
  };

  function p7InspectCurrent() {
    return {
      version: P7_DEV1_VERSION,
      contract: P7_SCHEMA_CONTRACT,
      sourceField: P7_SOURCE_FIELD,
      targetField: P7_TARGET_FIELD,
      currentPlan: p7PlanState(state, controls),
      lastLoadResult: p7LastLoadResult
    };
  }

  globalThis.CATUER_P7_SCHEMA = Object.freeze({
    version: P7_DEV1_VERSION,
    contract: P7_SCHEMA_CONTRACT,
    sourceField: P7_SOURCE_FIELD,
    targetField: P7_TARGET_FIELD,
    projectAssessment: p7ProjectAssessment,
    planState: p7PlanState,
    inspectCurrent: p7InspectCurrent,
    getLastLoadResult: () => p7LastLoadResult
  });

  console.info(
    `[CATU E-R] P7 dev.1 Schema Remediation cargado · ${P7_SCHEMA_CONTRACT}`
  );
})();
