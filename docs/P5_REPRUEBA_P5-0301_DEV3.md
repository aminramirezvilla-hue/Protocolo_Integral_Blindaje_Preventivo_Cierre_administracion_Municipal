# CATU E-R — Re-prueba P5-0301 sobre 0.1.4-dev.3

## Identificación

- Rama: `dev/v0.1.4`
- Runtime objetivo: `0.1.4-dev.3`
- Incidencia: `P5-INC-002`
- Caso matriz: `P5-0301 — Coherencia entre Estatus diagnóstico, Estatus evidencia y Validación OIC`
- Build de referencia previo a esta hoja: `be8b3b955c029e50ec4f268f913ec7289525d4a1`
- Estado de la incidencia antes de la re-prueba: **Corregida en código; pendiente de re-prueba funcional**

## Precondiciones

1. Abrir el **P5 preview** correspondiente a `dev/v0.1.4`, no la raíz estable de `main`.
2. En **Más → PWA y seguridad**, confirmar que la versión visible sea `0.1.4-dev.3`.
3. Trabajar con un respaldo JSON previo a cualquier prueba destructiva.
4. Usar inicialmente el perfil **Administrador municipal** sobre un control de prueba, preferentemente `R074`.
5. No continuar con `P5-0302` hasta concluir esta re-prueba.

## Casos ejecutables

| Caso | Perfil | Combinación / acción | Resultado esperado | Evidencia mínima | Resultado |
|---|---|---|---|---|---|
| P5-0301-A | Administrador municipal | `Conforme + Insuficiente + Pendiente` | El guardado se bloquea; aparece mensaje; al cerrar/reabrir no persiste la combinación inválida | Captura del mensaje + modal reabierto | PENDIENTE |
| P5-0301-B | Administrador municipal | `Conforme + Parcial + Pendiente` | El guardado se bloquea; no persiste | Captura del mensaje + modal reabierto | PENDIENTE |
| P5-0301-C | Administrador municipal | `Conforme + No evaluada + Pendiente` | El guardado se bloquea; no persiste | Captura del mensaje + modal reabierto | PENDIENTE |
| P5-0301-D | Administrador municipal | `Conforme + Completa verificada + Pendiente` | Guardado permitido; el control no se contabiliza como cerrado | Captura del modal + dashboard | PENDIENTE |
| P5-0301-E | Revisor/OIC | Partiendo de `Conforme + Completa verificada`, cambiar OIC a `Validado` y guardar | Guardado permitido; control contabilizado como cerrado | Captura del modal + dashboard | PENDIENTE |
| P5-0301-F | Administrador municipal / Revisor OIC | Cerrar modal, reabrir y recargar Safari después del último estado válido | Persiste sólo el último estado válido; no reaparece combinación contradictoria | Captura posterior a recarga | PENDIENTE |

## Regla de aceptación

La incidencia `P5-INC-002` se cierra únicamente si `P5-0301-A` a `P5-0301-F` resultan `PASS`, no se detecta persistencia de combinaciones inválidas y no aparecen regresiones en la segregación de permisos validada en `P5-0203`.

## Regla de contención

Si cualquiera de los casos A–F falla:

- mantener `P5-INC-002` abierta como B1;
- no iniciar `P5-0302`;
- conservar el JSON de respaldo y la evidencia del fallo;
- registrar versión visible, perfil, control, combinación usada y resultado observado;
- corregir sobre `dev/v0.1.4` antes de continuar la campaña P5.3.

## Convención de evidencia

Usar los nombres:

- `EV-P5-0301-A_conforme_insuficiente_bloqueo_20260913.png`
- `EV-P5-0301-B_conforme_parcial_bloqueo_20260913.png`
- `EV-P5-0301-C_conforme_noevaluada_bloqueo_20260913.png`
- `EV-P5-0301-D_conforme_completa_pendiente_20260913.png`
- `EV-P5-0301-E_conforme_completa_validado_20260913.png`
- `EV-P5-0301-F_persistencia_estado_valido_20260913.png`

## Decisión posterior

- **Todos PASS:** cerrar `P5-INC-002` y continuar con `P5-0302 — No subsanable con Ruta A`.
- **Algún FAIL:** detener P5.3, abrir subincidencia de re-prueba y aplicar corrección antes de avanzar.
