# CATU E-R
## Cierre P4.2 e incremento `0.1.3-dev.2`

**Rama:** `dev/v0.1.3`  
**Baseline protegida:** `v0.1.2-pilot-stable`  
**Fecha:** 2026-09-12  
**Estado:** P4.2 APROBADA / `0.1.3-dev.2` APROBADO

---

## 1. Resultado P4.2

La segunda tanda del piloto ampliado se ejecutó sobre R012, R024, R049 y R070.

### Evidencia funcional observada

- R049 fue clasificado `No subsanable / posible responsabilidad`.
- La interfaz bloqueó correctamente el intento de guardar R049 con Ruta A y mostró la regla de canalización obligatoria mediante Ruta C.
- R049 pudo guardarse después con Ruta C, fecha compromiso y riesgo residual `4 — Muy alto`.
- R024 quedó clasificado como control crítico.
- R012 generó seguimiento por vencimiento.
- R070 fue probado como `Conforme`, con evidencia completa y validación OIC, reproduciendo correctamente el flujo de cierre.

### Corte observado al cierre de P4.2

- Evaluación: 8/84 controles aplicables, aproximadamente 10 %.
- Evidencia: aproximadamente 6 %.
- Críticos: 3.
- No subsanables: 1.
- Cerrados: 2.
- IPER-CATU: 7/100.
- Alertas generadas: 15 causas.

**Decisión:** P4.2 APROBADA. No se identificó una nueva incidencia S1/S2 asociada a los cuatro controles evaluados.

---

## 2. Hallazgo de usabilidad confirmado

La presencia de 15 alertas con sólo 8 controles evaluados confirmó la conveniencia de implementar `P4-MEJ-002 — Agrupar alertas por control con expansión de causas`.

El problema no correspondía al motor de reglas: las alertas conservaban validez individual. La mejora se limitó a presentación y priorización ejecutiva.

---

## 3. Incremento `0.1.3-dev.2`

Se implementó un incremento mínimo con los siguientes objetivos:

1. Mantener intacta la generación de alertas del motor `metrics()`.
2. Mostrar una sola tarjeta por control en el dashboard.
3. Conservar el número total de causas.
4. Mostrar simultáneamente el número de controles afectados.
5. Permitir expandir las causas de un mismo control sin perder detalle.
6. Mantener IPER, criticidad, vencimientos y evidencia sin cambios de cálculo.
7. Actualizar el sello runtime y respaldo JSON a `0.1.3-dev.2`.
8. Actualizar la caché del Service Worker a `catu-er-v0.1.3-dev.2`.

---

## 4. Continuidad de la muestra acumulada

El almacenamiento aislado P4 contenía 8 controles del corte P4.2 y no conservaba tres controles previamente evaluados durante P4.1: R001, R015 y R006.

Para mantener una muestra acumulada antes de iniciar P4.3, `0.1.3-dev.2` incorporó en `Más → PWA y seguridad` la herramienta piloto **Restaurar 3 controles P4.1**.

La restauración:

- sólo actúa sobre R001, R015 y R006 cuando continúan `No evaluado`;
- no sobrescribe controles ya evaluados;
- registra un evento en el audit log;
- identifica la operación como migración controlada de continuidad P4;
- usa datos de prueba, no hechos institucionales reales.

### Perfil de continuidad utilizado

- R001: Conforme, evidencia completa no verificada, OIC pendiente.
- R015: Subsanable, evidencia parcial, Documento incompleto, Ruta A, fecha 18-09-2026.
- R006: Subsanable, evidencia parcial, Documento incompleto, Ruta B, fecha 18-09-2026.

Estos perfiles se usan exclusivamente para continuidad de calibración del piloto y no deben interpretarse como diagnóstico de un municipio real.

---

## 5. Re-prueba `0.1.3-dev.2`

### Evidencias observadas el 12-09-2026

1. `Más → PWA y seguridad` mostró correctamente `0.1.3-dev.2`.
2. El bloque de continuidad identificó inicialmente R001, R015 y R006 como faltantes.
3. La acción **Restaurar 3 controles P4.1** solicitó confirmación explícita antes de incorporar datos de prueba.
4. Tras la restauración, el bloque confirmó que R001, R015 y R006 estaban incorporados a la muestra acumulada.
5. El dashboard pasó a **11/84 controles evaluados (13 %)**.
6. Cobertura ponderada de evidencia observada: **8 %**.
7. Controles críticos: **3**, de los cuales **1 no subsanable**.
8. Controles cerrados: **2**.
9. IPER-CATU observado: **9/100**.
10. El panel de alertas mostró **20 causas · 9 controles**, agrupando correctamente las causas por control.
11. R019 y R024 mostraron tres causas cada uno: criticidad, vencimiento y evidencia por completar.
12. La expansión `Ver causas (3)` funcionó correctamente.
13. Abrir R049 desde la tarjeta agrupada funcionó y conservó sin alteración:
    - `No subsanable / posible responsabilidad`;
    - `Ruta C — No subsanable / canalización`;
    - fecha compromiso 18-09-2026;
    - riesgo residual `4 — Muy alto`.

### Resultado

**`0.1.3-dev.2`: APROBADO.**

No se observó pérdida de información de las causas de alerta ni regresión funcional en R049. La mejora P4-MEJ-002 queda incorporada y validada para continuar la campaña.

---

## 6. Criterios de salida dev.2

| Criterio | Resultado |
|---|---|
| Sello runtime `0.1.3-dev.2` visible | APROBADO |
| Alertas `N causas · M controles` | APROBADO |
| Una tarjeta por control | APROBADO |
| Expansión de causas | APROBADO |
| Apertura desde tarjeta agrupada | APROBADO |
| Restauración R001/R015/R006 | APROBADO |
| Corte acumulado 11/84 | APROBADO |
| Persistencia de estado R049 | APROBADO |

---

## 7. Siguiente paso

Se autoriza iniciar **P4.3 — Catastro, asuntos en trámite, fiscalización y continuidad digital**, con los controles:

- R052 — Padrón de contribuyentes del impuesto predial.
- R080 — Expedientes de recaudación asignable de predial y derechos de agua.
- R034 — Asuntos pendientes de resolver.
- R069 — Auditorías, observaciones y solventaciones pendientes.
- R067 — Credenciales institucionales, respaldos y continuidad de sistemas.

Se mantienen sin modificación los pesos IPER 65/35 y la ponderación por criticidad hasta contar con el corte acumulado de P4.3 y P4.4.

---

**No modifica ni sustituye la baseline `v0.1.2-pilot-stable`.**
