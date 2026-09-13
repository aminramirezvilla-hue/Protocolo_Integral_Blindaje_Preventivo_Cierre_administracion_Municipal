# CATU E-R — Ejecución P5-0304 sobre 0.1.4-dev.4

## Identificación

- Rama: `dev/v0.1.4`
- Runtime objetivo: `0.1.4-dev.4`
- Subcampaña: `P5.3 — Integridad de estados y reglas de negocio`
- Caso: `P5-0304 — Control accionable sin fecha compromiso`
- Severidad si falla: **B1 — Crítica / bloqueante para promoción**
- Perfil recomendado: **Administrador municipal**
- Control recomendado: un control actualmente `No evaluado` distinto de R049/R074, para no contaminar evidencia previa.

## Objetivo

Comprobar que un control que requiera acción correctiva no pueda guardarse sin `Fecha compromiso`. La fecha es necesaria para seguimiento, alertamiento de vencimientos y trazabilidad del plan de acción.

## Precondiciones

1. Confirmar `0.1.4-dev.4` en **Más → PWA y seguridad**.
2. Conservar respaldo JSON previo a la prueba.
3. Seleccionar un control de prueba no usado en incidencias anteriores.
4. Usar perfil **Administrador municipal**.

## Procedimiento P5-0304

1. Abrir el control seleccionado.
2. Establecer `Estatus diagnóstico = Subsanable`.
3. Establecer un `Estatus evidencia` compatible, por ejemplo `Parcial` o `Insuficiente`.
4. Seleccionar un escenario que requiera tratamiento, por ejemplo `Documento incompleto`.
5. Seleccionar `Ruta de tratamiento = A — Subsanación`.
6. Dejar **vacía** la `Fecha compromiso`.
7. Mantener un `Responsable de solventación` no vacío.
8. Pulsar **Guardar cambios**.
9. Registrar mensaje mostrado y comportamiento del modal.
10. Cerrar/reabrir el control y recargar Safari para verificar que no se haya persistido silenciosamente la combinación inválida.

## Resultado esperado

**PASS** si se cumplen todas las condiciones:

- el sistema bloquea el guardado cuando el control es accionable y `Fecha compromiso` está vacía;
- muestra una advertencia clara dentro del modal indicando que debe capturarse una fecha compromiso;
- la combinación inválida no se persiste;
- tras cerrar/reabrir y recargar Safari, el control conserva el último estado válido previo a la prueba.

**FAIL / incidencia B1** si ocurre cualquiera de las siguientes:

- permite guardar un control `Subsanable` con Ruta A/B/C sin fecha compromiso;
- el control aparece en el plan de acción sin fecha;
- al recargar Safari persiste el registro accionable sin fecha;
- la validación existe sólo visualmente pero el estado inválido queda almacenado.

## Evidencia mínima

- `EV-P5-0304-01_accionable_sin_fecha_intento_20260913.png`
- `EV-P5-0304-02_mensaje_bloqueo_20260913.png`
- `EV-P5-0304-03_estado_post_recarga_20260913.png`

## Regla de contención

Si P5-0304 falla:

1. detener P5.3;
2. no continuar con P5-0305;
3. conservar capturas y respaldo JSON;
4. registrar incidencia B1;
5. corregir la regla de negocio antes de continuar;
6. repetir P5-0304 completo después del parche.

## Decisión posterior

- **PASS:** continuar con `P5-0305 — Avance 100 con estado crítico no cerrado`.
- **FAIL:** corrección obligatoria antes de continuar.
