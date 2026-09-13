# CATU E-R — Ejecución P5-0302 sobre 0.1.4-dev.3

## Identificación

- Rama: `dev/v0.1.4`
- Runtime objetivo: `0.1.4-dev.3`
- Subcampaña: `P5.3 — Integridad de estados y reglas de negocio`
- Caso: `P5-0302 — No subsanable con Ruta A`
- Severidad si falla: **B1 — Crítica / bloqueante para promoción**
- Control de prueba: `R049 — Informe detallado de obras del último ejercicio e inconclusas`

## Objetivo

Comprobar que un control clasificado como `No subsanable / posible responsabilidad` no pueda guardarse con `Ruta A — Subsanación` y que el intento inválido no altere el estado persistido.

## Procedimiento ejecutado

1. Con perfil **Administrador municipal**, abrir `R049`.
2. Mantener `Estatus diagnóstico = No subsanable / posible responsabilidad`.
3. Cambiar `Ruta de tratamiento` de `C — No subsanable / canalización` a `A — Subsanación`.
4. Pulsar **Guardar cambios**.
5. Verificar advertencia y bloqueo.
6. Cerrar/reabrir el modal.
7. Recargar Safari y abrir nuevamente `R049`.
8. Verificar la ruta finalmente persistida.

## Resultado observado — 2026-09-13

La aplicación mostró la advertencia:

> Un control clasificado como no subsanable debe preservar evidencia y canalizarse mediante Ruta C.

El guardado de la combinación inválida fue bloqueado.

Después de cerrar/reabrir y posteriormente **recargar Safari**, `R049` conservó:

- `Estatus diagnóstico = No subsanable / posible responsabilidad`;
- `Ruta de tratamiento = C — No subsanable / canalización`.

## Resultado final

- Bloqueo de `No subsanable + Ruta A`: **PASS**.
- Mensaje de advertencia: **PASS**.
- No persistencia de Ruta A: **PASS**.
- Persistencia de Ruta C tras cerrar/reabrir: **PASS**.
- Persistencia de Ruta C tras recargar Safari: **PASS**.

**P5-0302 = PASS COMPLETO.**

No se abre incidencia B1.

## Evidencia

- captura del intento `No subsanable + Ruta A` con mensaje de bloqueo;
- captura posterior a recarga de Safari mostrando `Ruta C — No subsanable / canalización`.

## Decisión posterior

Se libera la continuación de la subcampaña `P5.3` con:

`P5-0303 — No subsanable con Ruta B — Regularización documental`.
