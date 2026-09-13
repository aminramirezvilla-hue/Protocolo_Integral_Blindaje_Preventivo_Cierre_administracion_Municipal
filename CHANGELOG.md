# Changelog

## [0.1.4-dev.4] - 2026-09-13

### Corregido
- P5-UI-0304: el mensaje de validación bloqueante podía quedar oculto detrás del modal nativo `<dialog>` en Safari.
- Las inconsistencias de negocio que impiden guardar ahora se muestran **dentro del propio modal**, inmediatamente sobre los botones de acción.
- La combinación `Conforme` + evidencia no evaluada/inexistente/insuficiente/parcial continúa bloqueada y ahora expone el motivo del rechazo de forma visible.
- Los registros heredados de versiones previas con combinaciones inconsistentes no se alteran automáticamente; al abrirse muestran la advertencia para corrección controlada.

### Infraestructura PWA
- Service worker actualizado a `catu-er-v0.1.4-dev.4`.
- Se incorpora `js/patch-p5-dev4.js` al app shell.

### Estado
- Corrección implementada en `dev/v0.1.4`.
- Pendiente re-prueba funcional de P5-UI-0304 en Safari antes de continuar la campaña negativa.

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
