# P5-XD-008 — Resolución gobernada de conflictos · 0.1.4-dev.12

## Objetivo
Validar que una divergencia detectada por el merge granular pueda resolverse de forma expresa, autorizada y auditable, sin borrar ninguno de los dos valores originales ni degradar la decisión al transferirla entre dispositivos.

## Precondición
Partir de un estado que ya contenga al menos un elemento en `state.importConflicts` con resolución `local-preserved`. La evidencia de cierre de P5-XD-007 es una base válida porque conserva conflictos históricos y confirma roundtrip sin conflictos nuevos.

## Matriz de prueba

| Caso | Perfil | Acción | Resultado esperado |
|---|---|---|---|
| P5-XD-008-A | Administrador | Más → Conflictos de importación → Revisar | Se muestran control, campo, valor local, valor importado, origen y estado pendiente |
| P5-XD-008-B | Administrador/Coordinador | Conservar valor local + justificación | Conflicto pasa a resuelto; estado sustantivo no cambia; se registra bitácora |
| P5-XD-008-C | Administrador/Coordinador | Aceptar valor importado + justificación | Se aplica el valor importado sólo si el estado resultante es válido; se conserva la pareja original |
| P5-XD-008-D1 | Consultor CATU | Abrir conflicto sustantivo | Sólo lectura; no puede registrar resolución |
| P5-XD-008-D2 | Responsable de área | Abrir conflicto sustantivo | Sólo lectura; no puede registrar resolución |
| P5-XD-008-D3 | Revisor/OIC | Conflicto distinto de Validación OIC | Sólo lectura |
| P5-XD-008-D4 | Revisor/OIC | Conflicto de `oicValidation` | Puede resolverlo |
| P5-XD-008-E | Administrador | Respaldo JSON | Debe contener `status: resolved`, decisión, justificación, resuelto por/rol/fecha y ambos valores originales |
| P5-XD-008-F | Segundo dispositivo | Importar respaldo resuelto | La resolución se conserva y no vuelve a `local-preserved` |
| P5-XD-008-G | Mismo dispositivo | Reimportar el mismo archivo que originó el conflicto ya resuelto | No debe abrirse un conflicto duplicado idéntico |

## Datos recomendados
Para no alterar el control R081 más de lo necesario, primero resolver uno de sus conflictos históricos mediante **Conservar valor local**. Para probar **Aceptar valor importado**, utilice después un conflicto cuyo valor importado mantenga la coherencia del control. La PWA debe bloquear una aceptación que genere una combinación inválida de diagnóstico/evidencia/ruta.

## Evidencia mínima a conservar
Captura de la bandeja antes de resolver; captura del modal con ambos valores; captura posterior con estado Resuelto; respaldo JSON posterior; respaldo JSON del segundo dispositivo tras roundtrip.

## Criterio de cierre
P5-XD-008 queda PASS únicamente si se cumplen simultáneamente: autorización correcta, justificación obligatoria, valores originales preservados, bitácora de resolución, propagación cross-device de la resolución y ausencia de reapertura/duplicación del mismo conflicto al reimportar.
