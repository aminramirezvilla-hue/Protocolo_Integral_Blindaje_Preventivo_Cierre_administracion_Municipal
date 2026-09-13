# CATU E-R — Re-prueba P5-0301 sobre 0.1.4-dev.3

## Identificación

- Rama: `dev/v0.1.4`
- Runtime objetivo: `0.1.4-dev.3`
- Incidencia: `P5-INC-002`
- Caso matriz: `P5-0301 — Coherencia entre Estatus diagnóstico, Estatus evidencia y Validación OIC`
- Build de referencia previo a esta hoja: `be8b3b955c029e50ec4f268f913ec7289525d4a1`
- Estado de la incidencia: **Corrección funcional confirmada; pendiente una confirmación final de persistencia post-recarga para cierre formal**

## Antecedente

`R074` había conservado un estado inválido heredado de `0.1.4-dev.2` (`Conforme + Insuficiente`). En `0.1.4-dev.3` se introdujo la validación de coherencia para impedir nuevos guardados contradictorios sin normalizar silenciosamente estados legacy.

## Evidencia acumulada — corte 2026-09-13 12:00

La evidencia disponible acredita lo siguiente:

1. En rondas previas de `dev.3`, `Conforme + Insuficiente` y `Conforme + Parcial` generaron el mensaje de validación de `P5-0301` y el guardado fue bloqueado.
2. Se saneó `R074` a `Conforme + Completa verificada` y posteriormente el perfil `Revisor/OIC` dejó `Validación OIC = Validado`.
3. Sobre esa baseline válida se repitieron los tres intentos negativos:
   - 11:57: `Conforme + Insuficiente`;
   - 11:58: `Conforme + Parcial`;
   - 11:58: `Conforme + No evaluada`.
4. La captura de Inicio de las 12:00 muestra `5/84` controles evaluados, `4%` de cobertura de evidencia y `2` controles cerrados. Frente al corte previo (`4/84`, `3%`, `1` cerrado), el comportamiento es consistente con que `R074` conserva el estado válido y se contabiliza como cerrado.
5. El dashboard, por tanto, aporta evidencia funcional de que los intentos contradictorios no desplazaron el último estado válido dentro de la sesión y de que la condición de cierre (`Conforme + evidencia apta + OIC`) continúa operando.

## Estado por caso

| Caso | Acción | Resultado esperado | Estado al 13-09-2026 12:00 | Observación |
|---|---|---|---|---|
| P5-0301-A | `Conforme + Insuficiente` | Bloqueo; no persistir | **PASS funcional** | Bloqueo ya acreditado en ronda previa y nueva tentativa ejecutada sobre baseline válida. |
| P5-0301-B | `Conforme + Parcial` | Bloqueo; no persistir | **PASS funcional** | Bloqueo ya acreditado en ronda previa y nueva tentativa ejecutada sobre baseline válida. |
| P5-0301-C | `Conforme + No evaluada` | Bloqueo; no persistir | **PASS funcional condicionado a la misma regla de validación observada** | La nueva evidencia acredita la selección del caso; el estado final del dashboard no muestra pérdida del cierre válido. |
| P5-0301-D | `Conforme + Completa verificada + Pendiente` | Permitido; no cerrado | **PASS** | El estado válido fue aceptado y persistió. |
| P5-0301-E | Revisor/OIC cambia a `Validado` | Permitido y contabilizado como cerrado | **PASS** | El dashboard aumenta de 1 a 2 controles cerrados. |
| P5-0301-F | Cerrar/reabrir y recargar Safari | Persistir sólo el último estado válido | **PENDIENTE DE CONFIRMACIÓN FORMAL POST-RECARGA** | La captura del dashboard es compatible con PASS, pero debe constar que fue tomada después de la recarga de Safari indicada en el procedimiento. |

## Único punto restante para cierre formal

Confirmar que la captura de Inicio de las `12:00` fue obtenida **después de recargar Safari**. Si fue así, se considera acreditado `P5-0301-F` y `P5-INC-002` puede cerrarse como `PASS` sin repetir los casos A–E.

Si la captura fue anterior a la recarga, basta con:

1. recargar Safari;
2. abrir `R074`;
3. confirmar `Conforme + Completa verificada`;
4. con perfil `Revisor/OIC`, confirmar `Validado`;
5. capturar una sola pantalla del modal o del dashboard posterior a la recarga.

## Regla de aceptación

`P5-INC-002` se cierra cuando A–F están acreditados, no existe persistencia de combinaciones contradictorias y no se observa regresión de permisos respecto de `P5-0203`.

## Decisión posterior

- Si la captura de las 12:00 fue post-recarga: **cerrar `P5-INC-002` y habilitar `P5-0302 — No subsanable con Ruta A`.**
- Si no fue post-recarga: ejecutar únicamente el punto de persistencia indicado arriba y cerrar inmediatamente después si resulta PASS.
