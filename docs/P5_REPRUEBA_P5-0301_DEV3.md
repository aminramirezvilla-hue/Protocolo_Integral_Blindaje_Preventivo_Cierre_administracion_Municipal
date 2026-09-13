# CATU E-R — Re-prueba P5-0301 sobre 0.1.4-dev.3

## Identificación

- Rama: `dev/v0.1.4`
- Runtime objetivo: `0.1.4-dev.3`
- Incidencia: `P5-INC-002`
- Caso matriz: `P5-0301 — Coherencia entre Estatus diagnóstico, Estatus evidencia y Validación OIC`
- Estado de la incidencia: **CERRADA**
- Resultado de re-prueba: **PASS integral**

## Evidencia recibida — cierre 2026-09-13

La re-prueba se ejecutó sobre `R074` y demostró que `0.1.4-dev.3` impide nuevos guardados contradictorios sin normalizar silenciosamente los datos. La baseline válida final quedó en `Conforme + Completa verificada + Validado`.

Se acreditó lo siguiente:

- `Conforme + Insuficiente + Pendiente` → guardado bloqueado;
- `Conforme + Parcial + Pendiente` → guardado bloqueado;
- `Conforme + No evaluada + Pendiente` → guardado bloqueado;
- `Conforme + Completa verificada + Pendiente` → permitido como estado previo a OIC;
- `Conforme + Completa verificada + Validado` → permitido y contabilizado como cerrado;
- después de cerrar/reabrir y **recargar Safari**, el último estado válido permaneció y no reaparecieron combinaciones inválidas;
- el dashboard posterior mostró `5/84` controles evaluados, `4%` de cobertura de evidencia y `2` controles cerrados.

## Casos ejecutados y resultado final

| Caso | Perfil | Combinación / acción | Resultado esperado | Resultado final |
|---|---|---|---|---|
| P5-0301-A | Administrador municipal | `Conforme + Insuficiente + Pendiente` | Bloqueo; no persistir | **PASS** |
| P5-0301-B | Administrador municipal | `Conforme + Parcial + Pendiente` | Bloqueo; no persistir | **PASS** |
| P5-0301-C | Administrador municipal | `Conforme + No evaluada + Pendiente` | Bloqueo; no persistir | **PASS** |
| P5-0301-D | Administrador municipal | `Conforme + Completa verificada + Pendiente` | Permitido; no cerrado | **PASS** |
| P5-0301-E | Revisor/OIC | `Conforme + Completa verificada + Validado` | Permitido y cerrado | **PASS** |
| P5-0301-F | Administrador municipal / Revisor OIC | Cerrar/reabrir y recargar Safari | Persiste sólo el último estado válido | **PASS** |

## Regla de aceptación

La incidencia `P5-INC-002` se considera cerrada porque `P5-0301-A` a `P5-0301-F` resultaron `PASS`, no se detectó persistencia de combinaciones inválidas y el conteo ejecutivo posterior a recarga fue coherente con la regla de cierre vigente.

## Decisión

**GO para continuar P5.3.** El siguiente caso obligatorio es:

`P5-0302 — No subsanable con Ruta A`.

No se requiere modificar código antes de ejecutar P5-0302; primero debe comprobarse el comportamiento real de la regla existente. Si la combinación `No subsanable / posible responsabilidad + Ruta A` pudiera guardarse y persistir, se abrirá una nueva incidencia B1 y se corregirá antes de continuar con P5-0303.
