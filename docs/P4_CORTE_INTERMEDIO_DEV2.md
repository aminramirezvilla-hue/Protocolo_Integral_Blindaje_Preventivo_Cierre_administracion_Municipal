# CATU E-R
## P4 — Corte intermedio después de `0.1.3-dev.2`

**Fecha:** 2026-09-12  
**Rama:** `dev/v0.1.3`  
**Baseline:** `v0.1.2-pilot-stable`  
**Estado:** corte intermedio validado; P4.3 autorizada

### Indicadores observados

- Controles evaluados: **11/84 (13 %)**.
- Cobertura ponderada de evidencia: **8 %**.
- IPER-CATU: **9/100**.
- Críticos: **3**.
- No subsanables: **1**.
- Cerrados: **2**.
- Alertas: **20 causas agrupadas en 9 controles**.

### Funciones verificadas en dev.2

- agrupación de alertas por control;
- conservación y expansión de causas;
- navegación desde alerta al control;
- restauración controlada de R001, R015 y R006;
- persistencia del estado previo de R049;
- runtime visible `0.1.3-dev.2`;
- continuidad del almacenamiento aislado `p4-preview::`.

### Decisión

`0.1.3-dev.2` queda **APROBADO** para continuar P4. No se modifica el algoritmo IPER ni sus ponderaciones en este corte.

### Siguiente tanda

P4.3: R052, R080, R034, R069 y R067.
