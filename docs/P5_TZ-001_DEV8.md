# CATU E-R — P5-TZ-001
## Trazabilidad temporal y zona horaria

**Rama:** `dev/v0.1.4`  
**Runtime esperado:** `0.1.4-dev.8`  
**Zona inicial del piloto Guerrero:** `America/Mexico_City`  
**Fecha de implementación:** 2026-09-14

## Objetivo
Eliminar el desfase de fecha producido cuando una marca UTC se recorta a `YYYY-MM-DD` antes de convertirla a la fecha civil local. La aplicación conserva UTC como sello canónico y deriva la fecha/hora visible usando la zona horaria del espacio de trabajo.

## Modelo temporal
Los registros auditables pueden conservar simultáneamente:

- `timestampUTC`: instante canónico en UTC.
- `timeZone`: zona IANA utilizada para la interpretación civil.
- `localDateTime`: representación civil derivada del mismo instante.

Para compatibilidad se conservan los campos históricos (`at`, `createdAt`, `evaluatedAt`, `updatedAt`). No se reescriben ni se retrofechan hechos.

## P5-TZ-001-A — Nota de seguimiento nocturna

1. Confirmar en **Más → PWA y seguridad** que el runtime sea `0.1.4-dev.8`.
2. Abrir un control que ya disponga de `Nueva nota de seguimiento / bitácora`.
3. Registrar una nota durante la tarde/noche local, preferentemente después de las 18:00.
4. Guardar cambios.
5. Reabrir el control.
6. Verificar que la nota muestre el día local correcto y la hora local.

**Criterio PASS:** si UTC ya corresponde al día siguiente, la interfaz debe seguir mostrando el día civil correcto en `America/Mexico_City`.

### Resultado ejecutado en Safari/macOS — 2026-09-14

**Estado temporal: PASS.**

Evidencia funcional observada:

- Runtime visible en **Más → PWA y seguridad**: `0.1.4-dev.8`.
- El registro histórico que previamente aparecía con desfase de día se muestra como `14 sep 2026, 20:27`.
- El registro histórico de seguimiento se muestra como `14 sep 2026, 14:50`.
- Se registró la nueva nota `P5-TZ-001-A — prueba de fecha y hora local; la decisión OIC no debe modificarse.` y, después de guardar, se mostró como `14 sep 2026, 22:01`, consistente con la hora civil observada en el equipo.
- No se observó salto al día UTC siguiente.

**Observación de integridad OIC:** durante esta ejecución `Validación OIC` ya se encontraba en `Pendiente` antes de registrar la nota y permaneció `Pendiente` después del guardado. Esto confirma ausencia de una nueva alteración visible de la decisión durante la prueba, pero **no sustituye** una prueba específica de conservación de `Validado`, porque la precondición `Validado` no estaba presente al inicio de P5-TZ-001-A.

## P5-TZ-001-B — Evidencia nocturna

1. Desde un control, agregar una evidencia con descripción de prueba.
2. Guardar evidencia.
3. Abrir la pestaña **Evidencia**.
4. Verificar la fecha y hora mostradas.

**Criterio PASS:** la evidencia muestra fecha/hora local correcta; no utiliza la fecha UTC recortada.

## P5-TZ-001-C — Persistencia

1. Cerrar el modal.
2. Recargar Safari.
3. Reabrir el control y la vista Evidencia.
4. Confirmar que las marcas temporales mantienen exactamente el mismo día y hora civil.

**Criterio PASS:** no existe cambio de fecha después de recarga ni reapertura.

## P5-TZ-001-D — Integridad de estado

Verificar que una simple corrección de representación temporal no altere:

- Estatus diagnóstico.
- Estatus de evidencia.
- Validación OIC.
- Conteo de cerrados.
- IPER-CATU.

**Criterio PASS:** todos los estados funcionales permanecen invariables.

### Estado actual

- Representación temporal de notas: **PASS**.
- Persistencia visual de la nueva nota después de guardar/reabrir: **PASS preliminar**.
- Conservación específica de una decisión `Validado` ante una nota no material: **pendiente de prueba con precondición válida**, separada de la corrección temporal.
- Evidencia nocturna: **pendiente**.
- Persistencia tras recarga completa de Safari para nota + evidencia: **pendiente de cierre**.

## Evidencia recomendada
Conservar cuatro capturas:

1. Runtime `0.1.4-dev.8`.
2. Nota recién registrada mostrando fecha/hora local.
3. Evidencia mostrando fecha/hora local.
4. Mismos registros después de recargar Safari.

## Regla de auditoría
UTC identifica el instante; la zona horaria determina su fecha civil. La interfaz no debe inferir la fecha local recortando directamente los primeros diez caracteres de una marca UTC.
