# CATU E-R — Re-prueba P5-0301 sobre 0.1.4-dev.3

## Identificación

- Rama: `dev/v0.1.4`
- Runtime objetivo: `0.1.4-dev.3`
- Incidencia: `P5-INC-002`
- Caso matriz: `P5-0301 — Coherencia entre Estatus diagnóstico, Estatus evidencia y Validación OIC`
- Build de referencia previo a esta hoja: `be8b3b955c029e50ec4f268f913ec7289525d4a1`
- Estado de la incidencia: **Corrección funcional confirmada parcialmente; pendiente concluir re-prueba de persistencia y cierre**

## Precondiciones

1. Abrir el **P5 preview** correspondiente a `dev/v0.1.4`, no la raíz estable de `main`.
2. En **Más → PWA y seguridad**, confirmar que la versión visible sea `0.1.4-dev.3`.
3. Trabajar con un respaldo JSON previo a cualquier prueba destructiva.
4. Usar inicialmente el perfil **Administrador municipal** sobre el control `R074`.
5. No continuar con `P5-0302` hasta concluir esta re-prueba.

## Evidencia recibida — corte 2026-09-13 10:36

La re-prueba se inició sobre `R074`, el cual conservaba un estado inválido heredado de `0.1.4-dev.2` (`Conforme + Insuficiente`). Por ello, la primera ronda sirve para confirmar que `dev.3` bloquea **nuevos guardados contradictorios**, pero no permite afirmar por sí sola que el estado inválido heredado haya sido eliminado automáticamente. El diseño de `dev.3` no normaliza silenciosamente datos legacy.

Se observa:

- intento `Conforme + Insuficiente`: aparece el mensaje de validación de `P5-0301` y el guardado queda bloqueado;
- intento `Conforme + Parcial`: aparece nuevamente el mensaje de validación y el guardado queda bloqueado;
- posteriormente se guarda un estado válido `Conforme + Completa verificada`, visible en la tarjeta del control con notificación `R074 actualizado`;
- el perfil `Revisor/OIC` muestra `Validado` para `R074` en la evidencia posterior;
- falta todavía una ejecución documentada de `Conforme + No evaluada`, así como una comprobación final de persistencia después de recarga sobre la nueva baseline válida y una captura del dashboard que acredite el efecto de cierre.

## Casos ejecutables y estado de re-prueba

| Caso | Perfil | Combinación / acción | Resultado esperado | Estado 13-09-2026 | Observación |
|---|---|---|---|---|---|
| P5-0301-A | Administrador municipal | `Conforme + Insuficiente + Pendiente` | Bloqueo; no persistir | **PASS funcional / persistencia pendiente** | Se acredita el bloqueo mediante mensaje. La primera ejecución partió de un estado inválido legacy ya persistido en dev.2, por lo que debe repetirse sobre baseline válida para comprobar no persistencia. |
| P5-0301-B | Administrador municipal | `Conforme + Parcial + Pendiente` | Bloqueo; no persistir | **PASS funcional / persistencia pendiente** | Se acredita el bloqueo mediante mensaje. Falta confirmar no persistencia tras recarga sobre baseline válida. |
| P5-0301-C | Administrador municipal | `Conforme + No evaluada + Pendiente` | Bloqueo; no persistir | **PENDIENTE** | No existe aún evidencia inequívoca del intento `No evaluada`. |
| P5-0301-D | Administrador municipal | `Conforme + Completa verificada + Pendiente` | Permitido; no cerrado | **PASS de guardado válido / cierre previo a OIC pendiente de acreditar** | La tarjeta de R074 muestra `Conforme` + `Completa verificada` y toast `R074 actualizado`. |
| P5-0301-E | Revisor/OIC | `Conforme + Completa verificada + Validado` | Permitido y cerrado | **PASS de selección/persistencia OIC parcial** | `Validado` aparece en evidencia posterior. Falta captura del dashboard o respaldo que confirme el estado de cierre (`closedAt`/conteo). |
| P5-0301-F | Administrador municipal / Revisor OIC | Cerrar/reabrir y recargar Safari | Persiste sólo el último estado válido | **PENDIENTE** | Debe ejecutarse después de la nueva baseline válida para demostrar que no reaparece ninguna combinación inválida. |

## Secuencia mínima restante

1. Partir de `R074 = Conforme + Completa verificada + Validado`.
2. Como **Administrador municipal**, intentar y guardar sucesivamente:
   - `Conforme + Insuficiente` → debe bloquear;
   - `Conforme + Parcial` → debe bloquear;
   - `Conforme + No evaluada` → debe bloquear.
3. Cerrar el modal sin guardar ningún estado inválido.
4. Recargar Safari y volver a abrir `R074`.
5. Confirmar que `Estatus evidencia` continúa en `Completa verificada`.
6. Como **Revisor/OIC**, confirmar que `Validación OIC` continúa en `Validado`.
7. Abrir **Inicio** y capturar el dashboard para comprobar que `R074` se contabiliza según la regla de cierre vigente.

Con esta secuencia se cierran simultáneamente los pendientes de persistencia de A/B, el caso C y los casos E/F, sin volver a contaminar el registro con un estado legacy.

## Regla de aceptación

La incidencia `P5-INC-002` se cierra únicamente si `P5-0301-A` a `P5-0301-F` resultan `PASS`, no se detecta persistencia de combinaciones inválidas y no aparecen regresiones en la segregación de permisos validada en `P5-0203`.

## Regla de contención

Si cualquiera de los casos restantes falla:

- mantener `P5-INC-002` abierta como B1;
- no iniciar `P5-0302`;
- conservar el JSON de respaldo y la evidencia del fallo;
- registrar versión visible, perfil, control, combinación usada y resultado observado;
- corregir sobre `dev/v0.1.4` antes de continuar la campaña P5.3.

## Convención de evidencia restante

- `EV-P5-0301-A2_conforme_insuficiente_bloqueo_baseline_valida_20260913.png`
- `EV-P5-0301-B2_conforme_parcial_bloqueo_baseline_valida_20260913.png`
- `EV-P5-0301-C_conforme_noevaluada_bloqueo_20260913.png`
- `EV-P5-0301-F1_persistencia_completa_verificada_20260913.png`
- `EV-P5-0301-F2_persistencia_oic_validado_20260913.png`
- `EV-P5-0301-E_dashboard_cierre_20260913.png`

## Decisión posterior

- **Todos PASS:** cerrar `P5-INC-002` y continuar con `P5-0302 — No subsanable con Ruta A`.
- **Algún FAIL:** detener P5.3, documentar el fallo y aplicar corrección antes de avanzar.
