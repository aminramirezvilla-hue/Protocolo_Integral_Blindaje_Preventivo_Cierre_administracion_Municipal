# P5-RC-001-C — Device Cold Smoke + RC Promotion

**Objetivo:** verificar en Safari/macOS y Safari/iPhone que el runtime congelado `0.1.4-dev.13` mantiene cold start, carga del app shell, persistencia/restauración, RBAC esencial, evidencia y ausencia de conflictos pendientes antes de promover el mismo SHA a `0.1.4-rc.1`.

**Commit fuente congelado:** `ee0b94a66c079122c1f07132466ea911b54ef1e3`  
**Rama freeze:** `freeze/p5-rc-001-b-dev13`  
**URL de preview a probar:** `https://aminramirezvilla-hue.github.io/Protocolo_Integral_Blindaje_Preventivo_Cierre_administracion_Municipal/p5-preview/`

## Regla de oro

No modificar código, JSON de controles, Service Worker ni datos de prueba durante esta campaña. Si aparece una divergencia, registrar incidencia y detener la promoción a RC.

## Preparación obligatoria

1. Exportar un **Respaldo JSON** desde la PWA y conservarlo fuera del navegador.
2. Confirmar que el archivo exportado abre como JSON válido y tiene tamaño razonable.
3. Capturar pantalla del dashboard antes del cold start.
4. Confirmar que `dev/v0.1.4` y `freeze/p5-rc-001-b-dev13` siguen apuntando al SHA congelado.
5. No usar “Reiniciar piloto” salvo que la prueba lo indique expresamente.

## Bloque A — Safari/macOS

### A1. Cold load
- Cerrar todas las pestañas de la PWA.
- Cerrar Safari completamente.
- Reabrir Safari.
- Abrir la URL del preview.
- Confirmar sello visible `0.1.4-dev.13`.
- Confirmar que el dashboard carga sin pantalla en blanco.
- Confirmar que no aparecen errores visibles de carga.

**PASS:** app abre y muestra el runtime correcto.

### A2. Persistencia local
- Abrir R081.
- Verificar que conservan valor los campos previamente usados para prueba, si el estado local existente los contiene.
- Cerrar modal.
- Recargar Safari.
- Volver a R081.
- Confirmar que los valores persisten.

**PASS:** no hay pérdida de estado tras recarga.

### A3. Backup/restore no destructivo
- Generar un nuevo respaldo JSON.
- Importar el respaldo canónico previamente exportado.
- Confirmar el mensaje de fusión no destructiva.
- Verificar que notas, evidencia, bitácora y conflictos no se eliminan silenciosamente.
- Confirmar que “Conflictos de importación” muestra 0 pendientes, o documentar cualquier pendiente real.

**PASS:** restore preserva históricos y no introduce conflicto pendiente.

### A4. RBAC mínimo
Probar al menos:
- Administrador municipal: edición sustantiva habilitada.
- Responsable de área: edición sólo dentro de su macro módulo; fuera de ámbito, sólo lectura.
- Consultor CATU: sin decisión sustantiva; nota/evidencia según reglas P5.
- Revisor/OIC: Validación OIC editable; campos sustantivos bloqueados.

**PASS:** no se observa escalamiento horizontal de privilegios.

### A5. Evidencia
- Abrir un control con evidencia.
- Confirmar que el metadato/evidencia visible sigue asociado al control correcto.
- Agregar una evidencia de prueba únicamente si no afecta el expediente canónico.
- Recargar y confirmar persistencia.

**PASS:** evidencia no se pierde ni se reasocia.

## Bloque B — Safari/iPhone

### B1. Cold load
- Cerrar Safari/iPhone y reabrirlo.
- Abrir el mismo preview.
- Confirmar `0.1.4-dev.13`.
- Confirmar navegación Inicio → Controles → Evidencia → Más.
- Confirmar ausencia de versión anterior en pantalla.

### B2. Persistencia
- Abrir R081 o control equivalente ya usado en la campaña.
- Confirmar que el estado esperado persiste tras cerrar Safari y volver a abrir.

### B3. RBAC esencial
- Responsable de área: verificar un control dentro de ámbito y otro fuera de ámbito.
- Revisor/OIC: verificar que sólo Validación OIC sea editable.
- Consultor CATU: confirmar que no puede modificar decisión sustantiva.

### B4. Evidencia
- Confirmar que al menos una evidencia/metadato existente se visualiza correctamente.
- No borrar la evidencia histórica usada en P5.

## Bloque C — Criterio de promoción

Promover a `0.1.4-rc.1` sólo si:

- macOS A1–A5 = PASS.
- iPhone B1–B4 = PASS.
- 0 conflictos de importación pendientes.
- 0 regresiones S1/S2.
- Runtime visible = `0.1.4-dev.13`.
- El commit probado sigue siendo exactamente `ee0b94a66c079122c1f07132466ea911b54ef1e3`.

## Evidencia mínima a conservar

- Captura de runtime en macOS.
- Captura de runtime en iPhone.
- Captura RBAC dentro/fuera de ámbito.
- Captura Revisor/OIC.
- Captura de Conflictos de importación = 0 pendientes.
- Captura de evidencia vinculada.
- Nombre del JSON de respaldo previo.
- Fecha/hora de ejecución.
- Resultado final PASS/FAIL por bloque.

## Resultado a registrar

| Caso | Mac | iPhone | Resultado |
|---|---|---|---|
| Cold load |  |  |  |
| Persistencia |  |  |  |
| Backup/restore |  | N/A |  |
| RBAC |  |  |  |
| Evidencia |  |  |  |
| Conflictos pendientes |  |  |  |

**Gate final P5-RC-001-C:** PENDIENTE
