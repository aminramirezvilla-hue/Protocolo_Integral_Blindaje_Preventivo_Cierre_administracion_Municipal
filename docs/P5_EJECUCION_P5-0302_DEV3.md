# CATU E-R — Ejecución P5-0302 sobre 0.1.4-dev.3

## Identificación

- Rama: `dev/v0.1.4`
- Runtime objetivo: `0.1.4-dev.3`
- Subcampaña: `P5.3 — Integridad de estados y reglas de negocio`
- Caso: `P5-0302 — No subsanable con Ruta A`
- Severidad si falla: **B1 — Crítica / bloqueante para promoción**
- Control recomendado para la prueba: `R049 — Informe detallado de obras del último ejercicio e inconclusas`

## Objetivo

Comprobar que un control clasificado como `No subsanable / posible responsabilidad` no pueda guardarse con `Ruta A — Subsanación`, porque esa combinación contradice el modelo de tratamiento definido. El estado `No subsanable` debe exigir `Ruta C — No subsanable / canalización`.

## Precondiciones

1. Confirmar en **Más → PWA y seguridad** que la versión visible sea `0.1.4-dev.3`.
2. Exportar **Respaldo JSON** antes de la prueba.
3. Usar el perfil **Administrador municipal**.
4. Abrir `R049` y confirmar que el estado inicial sea, de preferencia:
   - Estatus diagnóstico: `No subsanable / posible responsabilidad`;
   - Ruta: `C — No subsanable / canalización`.
5. No modificar otros campos salvo lo indicado en este caso.

## Procedimiento P5-0302

1. Abrir `R049`.
2. Mantener `Estatus diagnóstico = No subsanable / posible responsabilidad`.
3. Cambiar únicamente `Ruta de tratamiento` de `C — No subsanable / canalización` a `A — Subsanación`.
4. Pulsar **Guardar cambios**.
5. Registrar el mensaje mostrado por la aplicación.
6. Cerrar el modal y volver a abrir `R049`.
7. Recargar Safari y abrir nuevamente `R049`.
8. Verificar la ruta finalmente persistida.

## Resultado esperado

**PASS** si ocurre todo lo siguiente:

- el sistema impide guardar `No subsanable / posible responsabilidad + Ruta A`;
- muestra una advertencia suficientemente clara;
- no persiste `Ruta A`;
- después de cerrar/reabrir y recargar Safari, `R049` conserva `Ruta C — No subsanable / canalización`.

**FAIL / abrir incidencia B1** si cualquiera de estas condiciones ocurre:

- permite guardar la combinación inválida;
- la tarjeta o el plan de acción muestra posteriormente Ruta A;
- tras recargar Safari reaparece Ruta A;
- el bloqueo ocurre sólo visualmente pero el JSON conserva Ruta A.

## Evidencia mínima

- `EV-P5-0302-01_no_subsanable_rutaA_intento_20260913.png`
- `EV-P5-0302-02_mensaje_bloqueo_20260913.png`
- `EV-P5-0302-03_persistencia_rutaC_post_recarga_20260913.png`
- respaldo JSON posterior a la prueba sólo si existe duda de persistencia.

## Resultado observado — 2026-09-13

Con perfil **Administrador municipal** y control `R049`, se seleccionó:

- `Estatus diagnóstico = No subsanable / posible responsabilidad`;
- `Ruta de tratamiento = A — Subsanación`.

La aplicación mostró la advertencia:

> Un control clasificado como no subsanable debe preservar evidencia y canalizarse mediante Ruta C.

Al pulsar **Guardar cambios**, la aplicación **no permitió el guardado** de la combinación inválida.

### Resultado parcial

- Bloqueo de `No subsanable + Ruta A`: **PASS**.
- Advertencia al usuario: **PASS**.
- Persistencia posterior a cerrar/reabrir modal: **PENDIENTE DE CONFIRMACIÓN**.
- Persistencia posterior a recargar Safari: **PENDIENTE DE CONFIRMACIÓN**.

El caso completo `P5-0302` no se cierra todavía hasta confirmar que `R049` conserva `Ruta C — No subsanable / canalización` después de cerrar/reabrir y después de recargar Safari.

## Regla de contención

Si P5-0302 falla:

1. detener P5.3;
2. no ejecutar P5-0303;
3. conservar captura y JSON;
4. restaurar `R049` a `Ruta C` si la interfaz permitió persistir `Ruta A`;
5. abrir incidencia B1 para corrección sobre `dev/v0.1.4`;
6. repetir P5-0302 antes de continuar.

## Decisión posterior

- **PASS completo:** continuar directamente con `P5-0303 — No subsanable con Ruta B`.
- **FAIL:** corrección obligatoria antes de P5-0303.
