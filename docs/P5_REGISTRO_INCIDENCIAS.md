# CATU E-R — Registro de incidencias P5

## P5-INC-001 — autorización horizontal insuficiente por área

**Fecha de detección:** 2026-09-13  
**Rama:** `dev/v0.1.4`  
**Incremento afectado:** `0.1.4-dev.1`  
**Severidad:** B1 — Crítica / bloqueante para promoción  
**Estado:** Corregida en código; pendiente de re-prueba funcional

### Caso de prueba asociado

`P5-0203 — Segregación por ámbito del perfil Responsable de área`.

### Evidencia de reproducción

Con el perfil **Responsable de área — Hacienda municipal** fue posible modificar y persistir cambios sobre el control **R074 — Obligaciones de transparencia, datos personales y archivos**, cuyo macro módulo es **TI, datos y continuidad digital**.

El resultado demuestra una brecha de autorización horizontal: el rol `area` recibía permiso general de edición sin comprobar que el área asignada al usuario coincidiera con el `macroModule` del control.

### Causa técnica

La función original `canEditGeneral()` validaba únicamente el rol y autorizaba a `admin`, `coordinator`, `area` y `catu`. Las funciones `openControl()` y `saveActiveControl()` utilizaban esa validación sin recibir ni comprobar el ámbito del control.

Adicionalmente, el flujo de evidencia permitía abrir y guardar evidencia sin control específico por macro módulo.

### Corrección aplicada — 0.1.4-dev.2

Se incorpora `js/patch-p5-dev2.js` con las siguientes medidas:

1. Nueva política `p5CanEditControl(controlOrId)` basada en **rol + macro módulo**.
2. `Responsable de área` sólo puede editar controles cuando `user.area === control.macroModule` o cuando el área sea explícitamente `Todas`.
3. `canEditGeneral()` queda re-vinculada al control activo para que la validación se aplique tanto al habilitar la interfaz como al persistir cambios.
4. Se bloquea la incorporación de evidencia por un Responsable de área cuando el control pertenece a otro macro módulo.
5. Se actualiza la identidad de runtime a `0.1.4-dev.2`.
6. Se actualiza el service worker a `catu-er-v0.1.4-dev.2` para evitar servir el parche anterior desde caché.

### Re-prueba obligatoria

La incidencia no se considera cerrada hasta ejecutar y documentar los siguientes casos:

| Caso | Perfil | Control | Resultado esperado |
|---|---|---|---|
| P5-0203-A | Responsable de área · Hacienda municipal | Control de Hacienda municipal | Edición general permitida |
| P5-0203-B | Responsable de área · Hacienda municipal | R074 · TI, datos y continuidad digital | Campos generales deshabilitados; no debe persistir modificación |
| P5-0203-C | Responsable de área · Hacienda municipal | R074 | Registro de evidencia bloqueado |
| P5-0203-D | Responsable de área · Hacienda municipal | Control de su propia área | Registro de evidencia permitido |
| P5-0203-E | Responsable de área | Cualquier control | `Validación OIC` permanece no editable |
| P5-0203-F | Revisor/OIC | R072 u otro control | `Validación OIC` editable; campos generales no editables conforme al modelo actual |

### Criterio de cierre

`P5-INC-001` podrá cambiar a **CERRADA** cuando todos los casos P5-0203-A a P5-0203-F resulten `PASS`, los cambios persistan correctamente después de cerrar/reabrir modal y recargar Safari, y no se detecten regresiones en perfiles Administrador municipal, Coordinador E-R, Revisor/OIC y Consultor CATU.

### Nota de alcance

El piloto conserva perfiles locales para probar permisos de interfaz. Esto **no equivale a autenticación multiusuario real**; la autorización de producción deberá reproducirse también en backend/RLS antes de considerar el sistema apto para operación institucional multiusuario.

---

## P5-INC-002 — inconsistencia entre diagnóstico y evidencia

**Fecha de detección:** 2026-09-13  
**Rama:** `dev/v0.1.4`  
**Incremento afectado:** `0.1.4-dev.2`  
**Corrección aplicada:** `0.1.4-dev.3`  
**Severidad:** B1 — Crítica / bloqueante para promoción  
**Estado:** Corregida en código; pendiente de re-prueba funcional

### Caso de prueba asociado

`P5-0301 — Coherencia entre Estatus diagnóstico, Estatus evidencia y Validación OIC`.

### Evidencia de reproducción

Con el perfil **Administrador municipal**, el control **R074 — Obligaciones de transparencia, datos personales y archivos** permitió guardar y persistir la combinación `Conforme + Insuficiente + Pendiente`.

La combinación se mantuvo después de cerrar y volver a abrir el modal, por lo que la inconsistencia no era únicamente visual sino persistida en el estado local.

### Causa técnica

`saveActiveControl()` persistía directamente los valores capturados y sólo usaba la combinación `Conforme + Completa verificada + Validado` para determinar `closedAt`. No existía una regla previa que rechazara combinaciones incompatibles antes de asignar y guardar `state.assessments[id]`.

### Corrección aplicada — 0.1.4-dev.3

Se incorpora `js/patch-p5-dev3.js` con las siguientes medidas:

1. Regla central `p5ValidateAssessmentConsistency()`.
2. `Conforme` queda bloqueado cuando la evidencia sea `No evaluada`, `Sin evidencia`, `Insuficiente` o `Parcial`.
3. El guardado se interrumpe antes de la persistencia y se informa al usuario; no se modifica silenciosamente la selección.
4. `Conforme + Completa verificada + Pendiente` sigue siendo válido como estado previo a revisión OIC.
5. El cierre definitivo conserva la regla existente `Conforme + Completa verificada + Validado`.
6. El OIC mantiene capacidad de validar o rechazar registros heredados de versiones previas.
7. Runtime y caché PWA se elevan a `0.1.4-dev.3` y `catu-er-v0.1.4-dev.3`.

### Re-prueba obligatoria

| Caso | Combinación / acción | Resultado esperado |
|---|---|---|
| P5-0301-A | Conforme + Insuficiente + Pendiente | Bloqueo; no persistir |
| P5-0301-B | Conforme + Parcial + Pendiente | Bloqueo; no persistir |
| P5-0301-C | Conforme + No evaluada + Pendiente | Bloqueo; no persistir |
| P5-0301-D | Conforme + Completa verificada + Pendiente | Permitido; no cerrado |
| P5-0301-E | Conforme + Completa verificada + Validado | Permitido; cerrado |
| P5-0301-F | Cerrar/reabrir y recargar Safari | Persiste sólo el último estado válido |

### Criterio de cierre

`P5-INC-002` podrá cambiar a **CERRADA** cuando P5-0301-A a P5-0301-F resulten `PASS` y no se detecten regresiones sobre la segregación de funciones validada en P5-0203.
