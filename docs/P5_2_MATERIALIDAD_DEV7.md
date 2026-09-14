# P5.2 — Clasificación de materialidad y bitácora no invalidante

**Rama:** `dev/v0.1.4`  
**Runtime objetivo:** `0.1.4-dev.7`  
**Fecha:** 2026-09-13  
**Objeto:** distinguir cambios sustantivos que deben invalidar una decisión OIC de cambios operativos que sólo deben quedar auditados.

## Regla de diseño

### Cambios materiales
Invalidan una decisión OIC previa (`Validado`, `Rechazado` o `No aplica`), reinician `Validación OIC` a `Pendiente` y eliminan el cierre operativo (`closedAt`):

- Estatus diagnóstico.
- Estatus evidencia.
- Escenario detectado.
- Ruta de tratamiento.
- Responsable de solventación.
- Riesgo residual.
- Enlace principal al expediente/evidencia.
- Observaciones sustantivas.
- Alta de nueva evidencia asociada.

### Cambios no materiales
No invalidan por sí solos la decisión OIC. Deben quedar registrados en la bitácora:

- Fecha compromiso.
- Avance de acción.
- Nota de seguimiento / bitácora.

> La “Nota de seguimiento / bitácora” es distinta de “Observaciones”. La primera documenta hechos cronológicos u operativos sin modificar el juicio técnico. “Observaciones” continúa siendo un campo sustantivo y sí puede alterar la decisión OIC.

## Preparación de prueba

Usar un control que pueda quedar válidamente cerrado, preferentemente `R076` u otro control de riesgo medio. Dejarlo en:

- Estatus diagnóstico: `Conforme`.
- Estatus evidencia: `Completa verificada`.
- Validación OIC: `Validado`.

Confirmar en Inicio que el contador `Cerrados` aumente y registrar su valor inicial.

## P5-0313A — Nota de seguimiento no material

1. Con perfil general editable, abrir el control previamente validado.
2. En **Nueva nota de seguimiento / bitácora**, escribir: `P5-0313A — nota operativa posterior a Validado; no modifica diagnóstico ni evidencia.`
3. No modificar ningún otro campo.
4. Guardar.
5. Cerrar y volver a abrir el control.
6. Recargar Safari y volver a abrirlo.

**Resultado esperado:**
- `Validación OIC` permanece `Validado`.
- El control permanece cerrado.
- El contador `Cerrados` no disminuye.
- La nota aparece en el historial de seguimiento.
- Debe mostrarse confirmación de nota registrada, sin mensaje de invalidación OIC.

## P5-0313B — Observación sustantiva material

1. Restaurar el control a `Validado` si fuera necesario.
2. En **Observaciones**, agregar: `P5-0313B — se detectó una discrepancia sustantiva que requiere nueva revisión OIC.`
3. Guardar.

**Resultado esperado:**
- `Validación OIC` cambia automáticamente a `Pendiente`.
- Se elimina el cierre operativo.
- El contador `Cerrados` disminuye en uno.
- Debe mostrarse mensaje de cambio material e invalidación OIC.
- La bitácora debe registrar la transición de decisión.

## P5-0313C — Cambio operativo de fecha o avance

1. Restaurar el control a `Validado`.
2. Modificar únicamente **Fecha compromiso** o **Avance de acción**.
3. Guardar.
4. Cerrar, volver a abrir y recargar Safari.

**Resultado esperado:**
- `Validación OIC` permanece `Validado`.
- El cierre operativo se conserva siempre que continúe cumpliéndose `Conforme + Completa verificada + Validado`.
- Se registra evento `nonmaterial-change-after-oic` en bitácora.
- Debe mostrarse confirmación de que la decisión OIC se conserva.

## P5-0313D — Alta de evidencia posterior a Validado

1. Restaurar el control a `Validado`.
2. Agregar una nueva evidencia mediante **+ Evidencia / foto**.
3. Guardar la evidencia.

**Resultado esperado:**
- La nueva evidencia queda registrada.
- `Validación OIC` cambia a `Pendiente`.
- El cierre operativo se elimina.
- El contador `Cerrados` disminuye en uno.
- La bitácora registra que la decisión se invalidó por alta de evidencia.

## Criterio de aceptación de P5.2

P5.2 se considera aprobado únicamente si los cuatro casos anteriores cumplen el resultado esperado después de cerrar modal y recargar Safari. Una persistencia incorrecta de la decisión OIC o del contador `Cerrados` debe registrarse como incidencia antes de promover dev.7.
