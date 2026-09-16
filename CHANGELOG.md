# Changelog

## [0.1.4-dev.9] - 2026-09-16

### P5-XD-FIX-001 — Merge granular y no destructivo de respaldos JSON
- Se corrige el hallazgo `P5-XD-004`: la importación JSON ya no sustituye silenciosamente el estado completo del dispositivo receptor.
- Las notas de seguimiento (`followUpLog`) se fusionan como colección append-only, conservando entradas concurrentes de Mac y iPhone.
- Las evidencias se fusionan por identificador y la reimportación del mismo respaldo es idempotente: no debe duplicar evidencias ni notas ya existentes.
- El `auditLog` se fusiona de forma no destructiva.
- Para campos escalares sustantivos de un control, una divergencia concurrente ya no se resuelve por sobrescritura silenciosa: se conserva el valor local y se registra un conflicto de importación.
- La decisión `Validación OIC` queda incluida entre los campos protegidos frente a sobrescritura silenciosa.
- Los campos vacíos o en valor por defecto del receptor pueden completarse con valores no predeterminados del respaldo importado.
- Se incorpora `state.importConflicts` para conservar la trazabilidad de divergencias detectadas durante importaciones cruzadas.
- El cuadro de confirmación de importación informa ahora que la operación es una fusión y no una sustitución.

### Infraestructura PWA
- Se incorpora `js/patch-p5-dev9.js` al app shell.
- Service worker actualizado a `catu-er-v0.1.4-dev.9` para forzar renovación controlada de caché.

### Campaña de regresión requerida
- `P5-XD-005-A`: Mac→iPhone, mismo control con notas concurrentes; ambas notas deben coexistir.
- `P5-XD-005-B`: iPhone→Mac, mismo control con notas concurrentes; ambas notas deben coexistir.
- `P5-XD-005-C`: reimportar exactamente el mismo JSON; no deben duplicarse notas ni evidencias.
- `P5-XD-005-D`: provocar divergencia en un campo escalar sustantivo; el valor local debe preservarse y el conflicto debe quedar registrado.
- `P5-XD-005-E`: confirmar que la versión visible en Más → PWA y seguridad sea `0.1.4-dev.9`.

## [0.1.4-dev.8] - 2026-09-14

### P5-TZ-001 — Trazabilidad temporal y zona horaria
- Se conserva UTC como sello temporal canónico para eventos auditables.
- Se incorpora la zona horaria del espacio de trabajo, con valor inicial `America/Mexico_City` para el piloto Guerrero.
- Se agrega fecha/hora civil local derivada del sello UTC para bitácora, evidencias y metadatos temporales.
- Se corrige el desfase de día causado por recortar `YYYY-MM-DD` desde una marca UTC antes de formatearla para pantalla.
- Las notas de seguimiento ahora muestran fecha y hora local del espacio de trabajo.
- La vista de evidencia ahora muestra fecha y hora local del espacio de trabajo.
- Los registros existentes se enriquecen de forma no destructiva con `timestampUTC`, `timeZone` y `localDateTime` cuando es posible.
- Los controles conservan metadatos locales complementarios para `evaluatedAt`, `updatedAt` y, cuando exista, `oicInvalidatedAt`.

### Infraestructura PWA
- Se incorpora `js/patch-p5-dev8.js` al app shell.
- Service worker actualizado a `catu-er-v0.1.4-dev.8` para forzar renovación controlada de caché.

### Validación requerida
- `P5-TZ-001-A`: registrar una nota de seguimiento después de las 18:00 hora local y comprobar que la fecha visible corresponde al día local, aunque UTC ya sea el día siguiente.
- `P5-TZ-001-B`: registrar evidencia en el mismo intervalo y comprobar fecha/hora local correcta en la vista Evidencia.
- `P5-TZ-001-C`: cerrar y reabrir Safari; la fecha/hora debe persistir sin cambiar.
- `P5-TZ-001-D`: confirmar en Más → PWA y seguridad la versión `0.1.4-dev.8`.

## [0.1.4-dev.7] - 2026-09-13

### P5.2 — Clasificación de materialidad
- Se refina la regla de invalidación automática de decisiones OIC introducida en dev.6.
- Se consideran **cambios materiales**: estatus diagnóstico, estatus evidencia, escenario, ruta, responsable, riesgo residual, enlace principal de evidencia y observaciones sustantivas.
- Se consideran **cambios operativos no materiales**: fecha compromiso y avance de acción; éstos se registran en bitácora pero no reinician por sí mismos una decisión OIC previa.
- Se incorpora el campo **Nueva nota de seguimiento / bitácora**, separado de las observaciones sustantivas. Una nota de seguimiento no invalida por sí misma `Validado`, `Rechazado` o `No aplica`.
- La incorporación de nueva evidencia continúa siendo material y mantiene la regla de dev.6: reinicia la Validación OIC a `Pendiente` y elimina el cierre operativo del control.
- Los cambios materiales posteriores a una decisión OIC continúan registrando la invalidación en bitácora y eliminando `closedAt`.
- Los cambios no materiales posteriores a una decisión OIC generan un evento de auditoría específico conservando la decisión vigente.

### Infraestructura PWA
- Service worker actualizado a `catu-er-v0.1.4-dev.7`.
- Se incorpora `js/patch-p5-dev7.js` al app shell.

### Validación pendiente
- P5-0313A: agregar nota de seguimiento a control validado; debe conservar decisión OIC y cierre.
- P5-0313B: modificar observación sustantiva; debe reiniciar decisión OIC a `Pendiente` y eliminar cierre.
- P5-0313C: modificar sólo fecha compromiso o avance; debe conservar decisión OIC y registrar cambio no material.
- P5-0313D: agregar evidencia a control validado; debe reiniciar decisión OIC a `Pendiente`.

## [0.1.4-dev.5] - 2026-09-13

### Corregido
- P5-UI-0305: las validaciones heredadas de ruta y fecha compromiso aún podían emitir un `toast` detrás del `<dialog>` nativo en Safari.
- Las reglas bloqueantes de plan de acción ahora se interceptan antes de los validadores heredados y se muestran dentro del modal mediante la región de validación introducida en dev.4.
- `P5-0304` — control accionable sin fecha compromiso — continúa bloqueando el guardado, pero el motivo del rechazo debe quedar visible dentro del modal.
- Se unifica la presentación modal de: coherencia diagnóstico/evidencia, ruta obligatoria para controles accionables, fecha compromiso obligatoria y Ruta C para no subsanables.

### Infraestructura PWA
- Service worker actualizado a `catu-er-v0.1.4-dev.5`.
- Se incorpora `js/patch-p5-dev5.js` al app shell.

### Estado
- Corrección implementada en `dev/v0.1.4`.
- Pendiente re-prueba funcional de P5-0304 en Safari para confirmar ausencia de notificación oculta detrás del modal.

## [0.1.4-dev.4] - 2026-09-13

### Corregido
- P5-UI-0304: el mensaje de validación bloqueante podía quedar oculto detrás del modal nativo `<dialog>` en Safari.
- Las inconsistencias de negocio que impiden guardar ahora se muestran **dentro del propio modal**, inmediatamente sobre los botones de acción.
- La combinación `Conforme` + evidencia no evaluada/inexistente/insuficiente/parcial continúa bloqueada y ahora expone el motivo del rechazo de forma visible.
- Los registros heredados de versiones previas con combinaciones inconsistentes no se alteran automáticamente; al abrirse muestran la advertencia para corrección controlada.

### Infraestructura PWA
- Service worker actualizado a `catu-er-v0.1.4-dev.4`.
- Se incorpora `js/patch-p5-dev4.js` al app shell.

### Validación funcional
- Re-prueba P5-UI-0304 ejecutada en Safari/macOS: **PASS**.
- El mensaje `P5-0301` se muestra completamente visible dentro del modal para la combinación `Conforme + Insuficiente`.
- Runtime `0.1.4-dev.4` confirmado en **Más → PWA y seguridad**.
- Evidencia documentada en `docs/P5_REPRUEBA_UI-0304_DEV4.md`.

### Estado
- P5-UI-0304: **CERRADA**.
- Se libera la continuación de `P5.3` con `P5-0304 — Control accionable sin fecha compromiso`.
- Procedimiento preparado en `docs/P5_EJECUCION_P5-0304_DEV4.md`.

## [0.1.4-dev.2] - 2026-09-13

### Corregido
- P5-INC-001: brecha de autorización horizontal del perfil `Responsable de área`.
- La edición de controles ahora valida **rol + macro módulo**.
- Un Responsable de área ya no debe modificar controles fuera de su ámbito asignado.
- La incorporación de evidencia también queda restringida por ámbito para dicho perfil.
- Se conserva `Validación OIC` como facultad exclusiva del perfil Revisor/OIC dentro del piloto.

### Infraestructura PWA
- Service worker actualizado a `catu-er-v0.1.4-dev.2`.
- Se incorpora `js/patch-p5-dev2.js` al app shell para evitar regresiones por caché.

### Estado
- Corrección implementada en `dev/v0.1.4`.
- Pendiente re-prueba funcional P5-0203-A a P5-0203-F antes de promoción.
- Documento de control: `docs/P5_REGISTRO_INCIDENCIAS.md`.

## [v0.1.2-pilot-stable] - 2026-09-11

### Estado
Primera baseline estable del piloto local-first CATU E-R.

### Validado
- Campaña funcional P0–P3 aprobada.
- 84 controles activos.
- IPER-CATU.
- Evidencias y vínculos.
- Fotografías locales.
- Plan de acción.
- Alertas.
- Offline parcial.
- CSV / Excel.
- Respaldo/restauración JSON.
- Reporte ejecutivo PDF.

### Corregido
- P1-INC-001: duplicación de fotografías — v0.1.1.
- P3-INC-002: primera página vacía en PDF Safari — v0.1.2.

### Limitaciones
- Piloto local-first.
- Sin autenticación multiusuario real.
- Sin backend ni sincronización entre dispositivos.
