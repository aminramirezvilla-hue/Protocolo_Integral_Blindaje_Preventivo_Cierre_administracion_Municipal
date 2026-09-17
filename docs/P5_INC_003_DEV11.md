# P5-INC-003 — Regresión RBAC por ámbito y gestión del ciclo de vida de perfiles

**Fecha de detección:** 2026-09-17  
**Rama de corrección:** `dev/v0.1.4-dev11-fix`  
**Runtime objetivo:** `0.1.4-dev.11`  
**Severidad:** Alta / bloqueante para cierre de P5  
**Estado:** CORREGIDA EN CÓDIGO — pendiente re-prueba funcional

## 1. Hallazgo A — autorización horizontal

En `0.1.4-dev.10`, el perfil **Responsable de área** volvió a disponer de edición sustantiva sobre controles pertenecientes a macro módulos distintos del asignado. La causa fue la redefinición amplia de `canEditGeneral()` por rol, sin conservar la verificación `rol + macroModule` introducida previamente.

### Corrección dev.11

- Administrador municipal y Coordinador E-R conservan facultad transversal.
- Responsable de área sólo puede modificar controles de su macro módulo específico.
- Para Responsable de área, `Área = Todas` no concede privilegios transversales.
- Fuera de ámbito se bloquean cambios sustantivos, nota de seguimiento y evidencia.
- Se mantiene una segunda barrera en persistencia para impedir guardado fuera de ámbito aunque se manipule la interfaz.
- Consultor CATU conserva modo no decisorio: lectura, nota de seguimiento y evidencia.
- `Validación OIC` permanece exclusiva del perfil Revisor/OIC.

## 2. Hallazgo B — perfiles piloto sin opción de eliminación

La PWA permitía agregar perfiles locales personalizados pero no retirarlos. Esto impedía corregir perfiles creados para prueba o capturados por error, por ejemplo `Antonio Garcia`.

### Corrección dev.11

- Administrador municipal y Coordinador E-R pueden administrar perfiles piloto.
- Los cinco perfiles base (`u-admin`, `u-coord`, `u-area`, `u-oic`, `u-catu`) quedan protegidos contra eliminación.
- Los perfiles personalizados muestran la acción **Eliminar**.
- La eliminación requiere confirmación explícita.
- No se permite eliminar el perfil actualmente activo.
- La eliminación retira únicamente la identidad de la lista local; no borra bitácora, evaluaciones ni evidencias históricas.
- La operación genera evento `delete-profile` en la bitácora de auditoría.
- Para crear un perfil `Responsable de área` se exige seleccionar un macro módulo específico; `Todas` queda rechazado para ese rol.

## 3. Casos mínimos de re-prueba

| ID | Perfil | Acción | Resultado esperado |
|---|---|---|---|
| P5-RBAC-011-A | Responsable de área · Hacienda | Abrir R081 de Hacienda | Edición sustantiva habilitada |
| P5-RBAC-011-B | Responsable de área · Hacienda | Abrir R049 de Obra pública | Sólo lectura; nota y evidencia bloqueadas |
| P5-RBAC-011-C | Responsable de área · Hacienda | Intentar persistencia fuera de ámbito | Operación rechazada |
| P5-RBAC-011-D | Consultor CATU | Abrir R081/R049 | Sustantivos bloqueados; nota y evidencia habilitadas |
| P5-RBAC-011-E | Revisor/OIC | Abrir cualquier control | Sólo `Validación OIC` editable |
| P5-PROF-011-A | Administrador/Coordinador | Eliminar `Antonio Garcia` | Perfil desaparece tras confirmar; históricos permanecen |
| P5-PROF-011-B | Administrador/Coordinador | Intentar eliminar perfil base | Operación bloqueada |
| P5-PROF-011-C | Consultor/Responsable/OIC | Administrar perfiles | Alta/eliminación no disponible |
| P5-PROF-011-D | Administrador/Coordinador | Crear Responsable de área con `Todas` | Alta bloqueada; exige macro módulo específico |
| P5-PROF-011-E | Administrador/Coordinador | Crear y eliminar perfil personalizado; recargar Safari | Eliminación persiste |

## 4. Criterio de cierre

`P5-INC-003` podrá cerrarse cuando todos los casos anteriores resulten PASS en Safari/macOS y, al menos, los casos de lectura/edición por ámbito y eliminación de perfil personalizado se repitan en iPhone/Safari sin divergencia del estado local esperado.
