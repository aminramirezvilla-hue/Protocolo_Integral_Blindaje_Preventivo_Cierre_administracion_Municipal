# CATU E-R — Ejecución P5-0303 sobre 0.1.4-dev.3

## Identificación

- Rama: `dev/v0.1.4`
- Runtime objetivo: `0.1.4-dev.3`
- Subcampaña: `P5.3 — Integridad de estados y reglas de negocio`
- Caso: `P5-0303 — No subsanable con Ruta B`
- Severidad si falla: **B1 — Crítica / bloqueante para promoción**
- Control recomendado: `R049 — Informe detallado de obras del último ejercicio e inconclusas`

## Objetivo

Comprobar que un control clasificado como `No subsanable / posible responsabilidad` no pueda guardarse con `B — Regularización documental` y que el intento inválido no modifique el estado persistido. En este estatus debe mantenerse `C — No subsanable / canalización`.

## Precondiciones

1. Confirmar runtime `0.1.4-dev.3` en **Más → PWA y seguridad**.
2. Conservar respaldo JSON previo de la campaña.
3. Usar perfil **Administrador municipal**.
4. Abrir `R049` y confirmar:
   - `Estatus diagnóstico = No subsanable / posible responsabilidad`;
   - `Ruta de tratamiento = C — No subsanable / canalización`.
5. No modificar otros campos.

## Procedimiento P5-0303

1. Abrir `R049`.
2. Mantener `Estatus diagnóstico = No subsanable / posible responsabilidad`.
3. Cambiar únicamente `Ruta de tratamiento` de `C — No subsanable / canalización` a `B — Regularización documental`.
4. Pulsar **Guardar cambios**.
5. Registrar el mensaje mostrado.
6. Cerrar y volver a abrir `R049`.
7. Verificar que la ruta siga siendo `C`.
8. Recargar Safari.
9. Abrir de nuevo `R049` y verificar nuevamente `Ruta C`.

## Resultado esperado

**PASS** si se cumplen todas las condiciones:

- el sistema impide guardar `No subsanable / posible responsabilidad + Ruta B`;
- muestra una advertencia clara indicando que el estado no subsanable debe canalizarse por Ruta C;
- no persiste `Ruta B`;
- tras cerrar/reabrir y recargar Safari permanece `Ruta C — No subsanable / canalización`.

**FAIL / incidencia B1** si ocurre cualquiera de las siguientes:

- permite guardar Ruta B;
- la tarjeta o el plan de acción refleja posteriormente Ruta B;
- al recargar Safari reaparece Ruta B;
- el bloqueo es sólo visual pero la persistencia conserva Ruta B.

## Evidencia mínima

- `EV-P5-0303-01_no_subsanable_rutaB_intento_20260913.png`
- `EV-P5-0303-02_mensaje_bloqueo_20260913.png`
- `EV-P5-0303-03_persistencia_rutaC_post_recarga_20260913.png`

## Regla de contención

Si P5-0303 falla:

1. detener `P5.3`;
2. no continuar con el siguiente caso;
3. conservar capturas y respaldo JSON;
4. restaurar `R049` a Ruta C si hubiese persistido Ruta B;
5. abrir incidencia B1 sobre `dev/v0.1.4`;
6. corregir y repetir `P5-0303` antes de continuar.

## Decisión posterior

- **PASS:** continuar con el siguiente caso de integridad definido para P5.3.
- **FAIL:** corrección obligatoria antes de continuar.
