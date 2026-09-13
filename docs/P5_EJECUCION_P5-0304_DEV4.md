# CATU E-R — Ejecución P5-0304 sobre 0.1.4-dev.4 / re-prueba dev.5

## Identificación

- Rama: `dev/v0.1.4`
- Runtime inicial probado: `0.1.4-dev.4`
- Runtime de re-prueba: `0.1.4-dev.5`
- Subcampaña: `P5.3 — Integridad de estados y reglas de negocio`
- Caso: `P5-0304 — Control accionable sin fecha compromiso`
- Severidad si falla la regla de negocio: **B1 — Crítica / bloqueante para promoción**
- Perfil: **Administrador municipal**
- Control utilizado: `R076 — Expedientes catastrales de los contribuyentes`

## Objetivo

Comprobar que un control que requiera acción correctiva no pueda guardarse sin `Fecha compromiso`. La fecha es necesaria para seguimiento, alertamiento de vencimientos y trazabilidad del plan de acción.

## Ejecución observada en 0.1.4-dev.4

Se configuró R076 como control accionable con Ruta A y responsable capturado, dejando vacía la `Fecha compromiso`.

Resultado funcional observado:

- el guardado fue bloqueado correctamente;
- el aviso contextual junto al campo de fecha indicó que los controles accionables requieren fecha compromiso antes de guardar;
- por lo tanto, la regla de negocio principal de P5-0304 funcionó.

Resultado de interfaz observado:

- la validación heredada todavía generó una notificación tipo `toast` detrás del modal nativo en Safari;
- el defecto no permitió el guardado indebido, pero reprodujo el patrón de visibilidad que dev.4 había corregido sólo para la inconsistencia diagnóstico/evidencia.

## Clasificación

- Regla P5-0304 — bloqueo funcional: **PASS provisional**.
- Usabilidad/visibilidad del mensaje: **FAIL B3**, registrada como `P5-UI-0305`.
- No se clasifica como B1 porque no se observó persistencia del estado inválido ni bypass de la regla.

## Corrección aplicada — 0.1.4-dev.5

`js/patch-p5-dev5.js` intercepta antes de los wrappers heredados:

- control accionable sin ruta;
- control accionable sin fecha compromiso;
- control no subsanable con ruta distinta de C;
- inconsistencia diagnóstico/evidencia.

Las condiciones bloqueantes se muestran mediante `dialogValidation` dentro del modal y se impide que el flujo alcance el `toast` heredado de P4.

## Re-prueba obligatoria sobre 0.1.4-dev.5

1. Recargar Safari y confirmar `0.1.4-dev.5` en **Más → PWA y seguridad**.
2. Abrir R076.
3. Mantener `Estatus diagnóstico = Subsanable`.
4. Mantener evidencia `Parcial` o `Insuficiente`.
5. Mantener `Ruta A — Subsanación`.
6. Mantener responsable no vacío.
7. Vaciar completamente `Fecha compromiso`.
8. Pulsar **Guardar cambios**.
9. Confirmar que el guardado se bloquea.
10. Confirmar que el mensaje `P5-0304` aparece dentro del modal y que no existe notificación de validación oculta detrás del diálogo.
11. Cerrar/reabrir R076.
12. Recargar Safari y verificar que el estado inválido no fue persistido.

## Criterio de cierre

**PASS definitivo** si:

- el sistema bloquea el guardado sin fecha compromiso;
- el motivo se muestra dentro del modal;
- no aparece toast oculto detrás del diálogo;
- tras cerrar/reabrir y recargar Safari no persiste el estado inválido.

Tras PASS definitivo se libera `P5-0305 — Avance 100 con estado crítico no cerrado`.
