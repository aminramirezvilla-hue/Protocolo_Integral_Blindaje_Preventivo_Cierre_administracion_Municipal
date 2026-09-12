# CATU E-R
## P4 — Registro de Incidencias y Mejoras

**Rama:** `dev/v0.1.3`  
**Baseline protegida:** `v0.1.2-pilot-stable`  
**Objeto:** registrar de forma trazable defectos, desviaciones, observaciones de usabilidad y mejoras detectadas durante P4.

---

## 1. Reglas de registro

- Cada defecto funcional se registra como `P4-INC-###`.
- Cada mejora no defectiva se registra como `P4-MEJ-###`.
- No se corrige una incidencia antes de registrar su evidencia mínima.
- Toda incidencia cerrada debe incluir re-prueba.
- Una mejora puede diferirse sin bloquear la salida si no afecta seguridad, integridad, cálculo o decisión.
- Las incidencias históricas P1-INC-001 y P3-INC-002 permanecen cerradas en la baseline y no se renumeran como P4.

---

## 2. Severidad

| Nivel | Definición | Criterio de salida |
|---|---|---|
| S1 — Crítica | Pérdida/corrupción de datos; cálculo materialmente erróneo; bypass de control; PWA inutilizable. | Debe quedar corregida y reprobada antes de GO. |
| S2 — Alta | Resultado funcional incorrecto con posibilidad razonable de inducir decisión equivocada. | Debe quedar corregida y reprobada antes de GO. |
| S3 — Media | Defecto funcional con alternativa operativa viable. | Puede quedar diferida sólo con aceptación explícita y plan. |
| S4 — Baja | Presentación, texto o fricción menor. | Puede pasar a backlog. |

---

## 3. Estados permitidos

- `ABIERTA`
- `EN ANÁLISIS`
- `CORRECCIÓN EN CURSO`
- `LISTA PARA RE-PRUEBA`
- `CERRADA`
- `DIFERIDA`
- `NO REPRODUCIBLE`
- `NO ES DEFECTO / CONVERTIDA A MEJORA`

---

## 4. Incidencias P4 registradas

### P4-INC-001 — Control accionable permite Ruta de tratamiento “No aplica”

**Fecha:** 2026-09-11  
**Control/módulo afectado:** R019 / Hacienda municipal  
**Severidad:** S2 — Alta  
**Estado:** ABIERTA  
**Versión/rama:** `dev/v0.1.3`  
**Dispositivo/navegador:** macOS / Safari

**Descripción**  
Durante P4.1, R019 fue clasificado como `Crítico` con escenario `Saldo no conciliado`, pero el Plan de acción mostró `No aplica` como ruta de tratamiento.

**Precondiciones**  
Control con estatus `Subsanable`, `Crítico` o `No subsanable / posible responsabilidad`.

**Pasos para reproducir**
1. Abrir un control accionable.
2. Seleccionar estatus `Crítico`.
3. Seleccionar un escenario de incumplimiento.
4. Mantener `Ruta de tratamiento = No aplica`.
5. Guardar y abrir `Acciones`.

**Resultado esperado**  
Un control accionable no debe poder guardarse con `Ruta de tratamiento = No aplica`. Debe exigirse una ruta A, B o C compatible con el estatus y los hechos.

**Resultado real**  
El control se guarda y aparece en el Plan de acción sin ruta operativa válida.

**Evidencia**  
Captura de P4.1 donde R019 aparece `Crítico · Saldo no conciliado · No aplica`.

**Impacto**  
Puede inducir seguimiento incompleto de un control crítico y debilitar la trazabilidad de la decisión correctiva.

**Causa identificada**  
La interfaz no aplica validación cruzada obligatoria entre `status` y `route` antes de guardar.

**Corrección aplicada**  
Pendiente.

**Re-prueba**  
Pendiente.

**Decisión de cierre**  
Debe quedar corregida y reprobada antes de GO de v0.1.3.

---

### P4-INC-002 — Control accionable permite fecha compromiso vacía

**Fecha:** 2026-09-11  
**Control/módulo afectado:** R081 y R086 / Hacienda municipal y Gobernanza normativa  
**Severidad:** S3 — Media  
**Estado:** ABIERTA  
**Versión/rama:** `dev/v0.1.3`  
**Dispositivo/navegador:** macOS / Safari

**Descripción**  
En P4.1, R081 (`Subsanable`) y R086 (`Subsanable`, riesgo residual muy alto) aparecen en el Plan de acción con `Compromiso: —`.

**Resultado esperado**  
Todo control que requiera intervención debe contar con fecha compromiso, salvo excepción expresamente documentada.

**Resultado real**  
La PWA permite guardar y gestionar acciones sin fecha objetivo, por lo que no genera alerta de vencimiento.

**Evidencia**  
Capturas de P4.1 del Plan de acción de R081 y R086.

**Impacto**  
Reduce la utilidad del seguimiento temporal y puede ocultar retrasos, especialmente en R086.

**Causa identificada**  
`dueDate` es opcional en la validación actual del formulario.

**Corrección aplicada**  
Pendiente.

**Re-prueba**  
Pendiente.

**Decisión de cierre**  
Corregir en v0.1.3 o documentar una regla explícita de excepción.

---

### P4-INC-003 — Metadato interno de versión no coincide con la baseline vigente

**Fecha:** 2026-09-11  
**Control/módulo afectado:** Configuración / respaldos / trazabilidad  
**Severidad:** S3 — Media  
**Estado:** ABIERTA  
**Versión/rama:** `dev/v0.1.3`

**Descripción**  
El archivo `js/core.js` conserva `APP_VERSION = '0.1.0-pilot'`, aunque la baseline congelada es `v0.1.2-pilot-stable` y la rama de trabajo corresponde a `dev/v0.1.3`.

**Resultado esperado**  
Los respaldos y metadatos internos deben identificar inequívocamente la versión de la aplicación que los generó.

**Resultado real**  
El estado nuevo puede conservar una etiqueta de versión histórica que no corresponde a la versión desplegada.

**Impacto**  
No altera el cálculo funcional, pero debilita trazabilidad, soporte y análisis de respaldos durante pilotos posteriores.

**Corrección aplicada**  
Pendiente. Recomendada: centralizar versión visible/interna en un único valor de configuración y actualizarla a `0.1.3-dev` en la rama de desarrollo.

**Re-prueba**  
Pendiente.

**Decisión de cierre**  
Corregir antes de cerrar P4.

---

## 5. Mejoras P4 registradas

### P4-MEJ-001 — Ayuda contextual escenario ↔ ruta de tratamiento

**Fecha:** 2026-09-11  
**Control/módulo:** Transversal; observado en R082  
**Prioridad:** Alta  
**Estado:** PROPUESTA

**Necesidad observada**  
R082 fue probado con escenario `Documento inexistente` y Ruta B — Regularización documental. Esa combinación puede ser jurídicamente correcta sólo si el hecho/acto existió y lo faltante es su soporte recuperable; no debe interpretarse como autorización para fabricar o retrofechar documentos.

**Propuesta**  
Mostrar ayuda contextual al seleccionar escenarios, recordando las condiciones de uso de las rutas A/B/C. Para `Documento inexistente`, advertir que la reconstrucción sólo procede con fuentes verificables y fecha real; si el acto constitutivo nunca existió o no es subsanable, debe considerarse Ruta C.

**Beneficio esperado**  
Reduce riesgo de interpretación incorrecta sin imponer una regla automática que pueda ser jurídicamente falsa en casos particulares.

**Complejidad estimada**  
Baja.

**Decisión**  
Recomendada para v0.1.3.

---

### P4-MEJ-002 — Agrupar alertas por control con expansión de causas

**Fecha:** 2026-09-11  
**Control/módulo:** Dashboard / Alertas  
**Prioridad:** Media  
**Estado:** PROPUESTA

**Necesidad observada**  
Con sólo 7 controles evaluados, el dashboard ya presenta 11 alertas porque un mismo control puede generar criticidad, vencimiento y evidencia incompleta.

**Propuesta**  
Mantener todas las causas, pero agrupar visualmente por control: una tarjeta por R### con contador de alertas y detalle expandible.

**Beneficio esperado**  
Conserva la información sin saturar la pantalla móvil cuando avance la evaluación de los 84 controles.

**Complejidad estimada**  
Media.

**Decisión**  
Recomendada para v0.1.3 si no interfiere con P4.2.

---

## 6. Registro maestro de incidencias

| ID | Fecha | Control/módulo | Severidad | Resumen | Estado | Commit corrección | Re-prueba |
|---|---|---|---|---|---|---|---|
| P4-INC-001 | 2026-09-11 | R019 / Tratamiento | S2 | Control crítico puede guardarse con Ruta `No aplica`. | ABIERTA | — | Pendiente |
| P4-INC-002 | 2026-09-11 | R081/R086 / Seguimiento | S3 | Acciones pueden quedar sin fecha compromiso. | ABIERTA | — | Pendiente |
| P4-INC-003 | 2026-09-11 | Configuración / versión | S3 | `APP_VERSION` no corresponde a baseline/rama vigente. | ABIERTA | — | Pendiente |

---

## 7. Registro maestro de mejoras

| ID | Fecha | Control/módulo | Prioridad | Resumen | Decisión | Versión objetivo |
|---|---|---|---|---|---|---|
| P4-MEJ-001 | 2026-09-11 | Transversal / R082 | Alta | Ayuda contextual escenario ↔ rutas A/B/C. | Recomendada | v0.1.3 |
| P4-MEJ-002 | 2026-09-11 | Dashboard / Alertas | Media | Agrupar alertas por control sin perder causas. | Recomendada | v0.1.3 |

---

## 8. Incidencias históricas cerradas de la baseline

| ID histórico | Versión de corrección | Descripción | Resultado |
|---|---|---|---|
| P1-INC-001 | v0.1.1 | Duplicación accidental de evidencia fotográfica por reentrada durante procesamiento asíncrono. | CERRADA / re-prueba aprobada. |
| P3-INC-002 | v0.1.2 | Primera página prácticamente vacía al imprimir reporte en Safari. | CERRADA / re-prueba aprobada. |

Estas incidencias no deben reabrirse salvo que el comportamiento reaparezca. Si reaparece, registrar una nueva `P4-INC-###` y vincularla al antecedente.

---

## 9. Regla de GO/NO-GO

P4 no puede cerrarse como `GO` si existe:

- cualquier S1 abierta;
- cualquier S2 abierta;
- pérdida de datos no explicada;
- inconsistencia material entre diagnóstico y reporte ejecutivo;
- restauración JSON fallida;
- ruptura del modo offline previamente aprobado;
- cálculo del IPER materialmente incoherente sin decisión documentada.

---

**Estado P4.1:** EJECUTADA CON HALLAZGOS. La lógica general de dashboard, acciones y alertas se comporta de forma consistente con los 7 controles evaluados, pero P4-INC-001 requiere corrección antes del GO de v0.1.3.