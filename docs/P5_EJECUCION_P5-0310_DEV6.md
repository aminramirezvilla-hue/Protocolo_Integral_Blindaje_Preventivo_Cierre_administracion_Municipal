# CATU E-R — Ejecución P5-0310 sobre 0.1.4-dev.6

## Identificación

- Rama: `dev/v0.1.4`
- Versión objetivo: `0.1.4-dev.6`
- Caso: `P5-0310`
- Severidad: B0/B1 por posible reutilización indebida de una validación OIC sobre un estado materialmente modificado
- Estado inicial del caso: PENDIENTE DE REPRUEBA

## Objetivo

Confirmar que una decisión OIC previamente emitida no permanezca vigente cuando un perfil con permiso general modifica materialmente el control o agrega nueva evidencia.

## Regla de negocio

Toda modificación material posterior a una decisión OIC (`Validado`, `Rechazado` o `No aplica`) debe:

1. reiniciar `Validación OIC` a `Pendiente`;
2. limpiar `closedAt` y retirar el control del contador de cerrados cuando corresponda;
3. conservar el cambio material realizado;
4. registrar un evento `invalidate-oic-validation` en la bitácora;
5. persistir después de cerrar/reabrir el modal y después de recargar Safari.

Campos materiales considerados en dev.6:

- estatus diagnóstico;
- estatus de evidencia;
- escenario;
- ruta;
- responsable;
- fecha compromiso;
- avance;
- riesgo residual;
- enlace de evidencia;
- observaciones;
- alta de nueva evidencia asociada.

## Reprueba principal — R050

### Precondición

R050 debe estar en condición cerrada válida:

- `Conforme`;
- `Completa verificada`;
- `Validado` por Revisor/OIC.

Registrar el número de `Cerrados` mostrado en Inicio antes de iniciar la prueba.

### Pasos

1. Recargar Safari y verificar en `Más` que la versión visible sea `0.1.4-dev.6`.
2. Activar perfil `Administrador municipal`.
3. Abrir R050.
4. Confirmar que `Validación OIC` no es editable desde este perfil.
5. Cambiar el control a:
   - Estatus diagnóstico: `Subsanable`;
   - Escenario detectado: `Documento incompleto`;
   - Ruta de tratamiento: `A — Subsanación`;
   - Fecha compromiso: una fecha válida futura o de prueba;
   - conservar evidencia en `Completa verificada` para aislar la regla P5-0310.
6. Guardar cambios.
7. Reabrir R050 inmediatamente.
8. Verificar que `Validación OIC = Pendiente`.
9. Cerrar el modal y recargar Safari.
10. Reabrir R050 y verificar nuevamente `Pendiente`.
11. Ir a Inicio y confirmar que el contador `Cerrados` disminuyó en uno respecto de la precondición.
12. Exportar `Respaldo JSON` y comprobar en `auditLog` un evento con:
    - `action = invalidate-oic-validation`;
    - `controlId = R050`;
    - resumen que indique la decisión previa y el cambio a `Pendiente`.

### Resultado esperado

PASS sólo si se cumplen simultáneamente los pasos 8, 10, 11 y 12.

## Reprueba secundaria — alta de evidencia

1. Llevar un control de prueba a `Conforme + Completa verificada + Validado`.
2. Como perfil con capacidad general, agregar una nueva evidencia o fotografía.
3. Confirmar que la evidencia se guarda.
4. Reabrir el control.
5. Verificar que `Validación OIC = Pendiente`.
6. Recargar Safari y comprobar persistencia.
7. Exportar JSON y verificar evento `invalidate-oic-validation` por alta de evidencia.

## Criterio de aceptación

- No existe reutilización silenciosa de una decisión OIC sobre una versión materialmente distinta del control.
- El historial de auditoría conserva la decisión anterior y registra su invalidación; no se elimina ni reescribe el evento histórico.
- Sólo Revisor/OIC puede volver a establecer una nueva decisión OIC.

## Evidencias sugeridas

- `EV-P5-0310-001_version_dev6.png`
- `EV-P5-0310-002_r050_precondicion_validado.png`
- `EV-P5-0310-003_r050_cambio_material.png`
- `EV-P5-0310-004_r050_oic_pendiente.png`
- `EV-P5-0310-005_dashboard_cerrados.png`
- `EV-P5-0310-006_auditlog.json`
- `EV-P5-0310-007_evidencia_invalida_oic.png`

## Resultado

- Fecha/hora: pendiente
- Commit probado: pendiente
- Dispositivo/navegador: Safari macOS
- Resultado observado: pendiente
- Estado: PENDIENTE
