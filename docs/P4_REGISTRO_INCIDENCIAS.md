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
- `RE-PRUEBA PARCIAL`
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
**Estado:** CERRADA  
**Versión/rama:** `dev/v0.1.3` — incremento `0.1.3-dev.1`  
**Dispositivo/navegador:** macOS / Safari

**Descripción**  
Durante P4.1, R019 fue clasificado como `Crítico` con escenario `Saldo no conciliado`, pero el Plan de acción mostró `No aplica` como ruta de tratamiento.

**Resultado esperado**  
Un control accionable no debe poder guardarse con `Ruta de tratamiento = No aplica`. Debe exigirse una ruta A, B o C compatible con el estatus y los hechos.

**Resultado real previo**  
El control se guardaba y aparecía en el Plan de acción sin ruta operativa válida.

**Corrección aplicada**  
Se incorporó `js/patch-p4-dev1.js`, que bloquea el guardado de controles `Subsanable`, `Crítico` o `No subsanable / posible responsabilidad` cuando la ruta permanece en `No aplica`. Para controles no subsanables exige además Ruta C.

**Commit principal de corrección**  
`02f7c0cb239b4c28ae0a650ae360b0fe17c660fd`

**Re-prueba 2026-09-12**  
APROBADA. R019, configurado como `Crítico`, mostró advertencia explícita al mantener `Ruta = No aplica` y no permitió consolidar el cambio. Después de seleccionar una ruta válida y capturar fecha compromiso, el control se guardó correctamente y la interfaz confirmó `R019 actualizado`.

**Decisión de cierre**  
CERRADA. Cumple el criterio funcional definido.

---

### P4-INC-002 — Control accionable permite fecha compromiso vacía

**Fecha:** 2026-09-11  
**Control/módulo afectado:** R081 y R086 / Hacienda municipal y Gobernanza normativa  
**Severidad:** S3 — Media  
**Estado:** RE-PRUEBA PARCIAL  
**Versión/rama:** `dev/v0.1.3` — incremento `0.1.3-dev.1`  
**Dispositivo/navegador:** macOS / Safari

**Descripción**  
En P4.1, R081 (`Subsanable`) y R086 (`Subsanable`, riesgo residual muy alto) aparecieron en el Plan de acción con `Compromiso: —`.

**Resultado esperado**  
Todo control que requiera intervención debe contar con fecha compromiso, salvo excepción formal futura que se diseñe y documente expresamente.

**Corrección aplicada**  
El parche `patch-p4-dev1.js` impide guardar controles accionables sin fecha compromiso y muestra ayuda contextual junto al campo.

**Commit principal de corrección**  
`02f7c0cb239b4c28ae0a650ae360b0fe17c660fd`

**Re-prueba 2026-09-12**  
- **R081:** APROBADA. La interfaz mostró la advertencia `Los controles accionables requieren fecha compromiso antes de guardar`; al capturar una fecha válida, el control se guardó y la tarjeta mostró `Compromiso 25 sep 2026`.
- **R086:** evidencia funcional parcial. Se comprobó la presentación del campo de fecha y, posteriormente, que R086 puede quedar `Conforme` sin quedar cerrado cuando la evidencia continúa `No evaluada`, lo que es consistente con la compuerta especial. No se documentó todavía una captura de R086 en estado accionable intentando guardar con fecha vacía.

**Decisión de cierre**  
Mantener en `RE-PRUEBA PARCIAL` hasta ejecutar una prueba mínima de R086 como `Subsanable` o `Crítico`, sin fecha compromiso, y verificar que el guardado sea bloqueado.

---

### P4-INC-003 — Metadato interno de versión no coincide con la baseline vigente

**Fecha:** 2026-09-11  
**Control/módulo afectado:** Configuración / respaldos / trazabilidad  
**Severidad:** S3 — Media  
**Estado:** LISTA PARA RE-PRUEBA  
**Versión/rama:** `dev/v0.1.3`

**Descripción**  
El archivo `js/core.js` conserva el valor histórico `APP_VERSION = '0.1.0-pilot'`, aunque la baseline congelada es `v0.1.2-pilot-stable` y la rama de trabajo corresponde a `dev/v0.1.3`.

**Corrección aplicada en el incremento dev.1**  
Sin alterar la baseline ni reescribir el núcleo estable, el parche P4 fija en tiempo de ejecución `state.version` y `workspace.runtimeVersion` como `0.1.3-dev.1`, y lo conserva en guardados/importaciones. La versión también se muestra en `Más → PWA y seguridad`.

**Nota técnica**  
La constante histórica de `core.js` queda como deuda de consolidación para el merge final. Antes de liberar `v0.1.3` se deberá centralizar la versión y eliminar el parche transitorio o actualizar el núcleo directamente.

**Commit principal de corrección**  
`02f7c0cb239b4c28ae0a650ae360b0fe17c660fd`

**Re-prueba**  
Pendiente: verificar insignia `0.1.3-dev.1` y confirmar que un respaldo JSON generado en preview incluya `"version": "0.1.3-dev.1"`.

---

## 5. Mejoras P4 registradas

### P4-MEJ-001 — Ayuda contextual escenario ↔ ruta de tratamiento

**Fecha:** 2026-09-11  
**Control/módulo:** Transversal; observado en R082  
**Prioridad:** Alta  
**Estado:** INCORPORADA / RE-PRUEBA APROBADA

**Necesidad observada**  
R082 fue probado con escenario `Documento inexistente` y Ruta B — Regularización documental. Esa combinación puede ser jurídicamente correcta sólo si el hecho/acto existió y lo faltante es su soporte recuperable; no debe interpretarse como autorización para fabricar o retrofechar documentos.

**Corrección incorporada**  
La interfaz muestra una guía dinámica según la ruta seleccionada. Para `Documento inexistente + Ruta B` advierte expresamente que sólo procede si el hecho existió y puede reconstruirse con fuentes verificables; si el acto nunca existió debe considerarse Ruta C.

**Commit**  
`02f7c0cb239b4c28ae0a650ae360b0fe17c660fd`

**Re-prueba 2026-09-12**  
APROBADA. En R082, con `Documento inexistente + Ruta B`, se mostró la advertencia prevista: sólo procede regularización documental si el hecho o acto realmente existió y puede reconstruirse con fuentes verificables; de lo contrario debe considerarse Ruta C. La interfaz evita inducir fabricación o retrofecha de evidencia.

---

### P4-MEJ-002 — Agrupar alertas por control con expansión de causas

**Fecha:** 2026-09-11  
**Control/módulo:** Dashboard / Alertas  
**Prioridad:** Media  
**Estado:** DIFERIDA A P4.2

**Necesidad observada**  
Con sólo 7 controles evaluados, el dashboard presentó 11 alertas porque un mismo control puede generar criticidad, vencimiento y evidencia incompleta.

**Propuesta**  
Mantener todas las causas, pero agrupar visualmente por control: una tarjeta por R### con contador de alertas y detalle expandible.

**Decisión**  
No se incorpora al incremento correctivo dev.1 para mantener el alcance mínimo de la re-prueba. Se evaluará después de cerrar las incidencias S2/S3 actuales.

---

## 6. Registro maestro de incidencias

| ID | Fecha | Control/módulo | Severidad | Resumen | Estado | Commit corrección | Re-prueba |
|---|---|---|---|---|---|---|---|
| P4-INC-001 | 2026-09-11 | R019 / Tratamiento | S2 | Control crítico podía guardarse con Ruta `No aplica`. | CERRADA | `02f7c0c` | APROBADA 2026-09-12 |
| P4-INC-002 | 2026-09-11 | R081/R086 / Seguimiento | S3 | Acciones podían quedar sin fecha compromiso. | RE-PRUEBA PARCIAL | `02f7c0c` | R081 aprobada; R086 pendiente |
| P4-INC-003 | 2026-09-11 | Configuración / versión | S3 | Metadato runtime no correspondía a la rama vigente. | LISTA PARA RE-PRUEBA | `02f7c0c` | Pendiente |

---

## 7. Registro maestro de mejoras

| ID | Fecha | Control/módulo | Prioridad | Resumen | Decisión | Versión objetivo |
|---|---|---|---|---|---|---|
| P4-MEJ-001 | 2026-09-11 | Transversal / R082 | Alta | Ayuda contextual escenario ↔ rutas A/B/C. | INCORPORADA / re-prueba aprobada | 0.1.3-dev.1 |
| P4-MEJ-002 | 2026-09-11 | Dashboard / Alertas | Media | Agrupar alertas por control sin perder causas. | DIFERIDA A P4.2 | v0.1.3 |

---

## 8. Incidencias históricas cerradas de la baseline

| ID histórico | Versión de corrección | Descripción | Resultado |
|---|---|---|---|
| P1-INC-001 | v0.1.1 | Duplicación accidental de evidencia fotográfica por reentrada durante procesamiento asíncrono. | CERRADA / re-prueba aprobada. |
| P3-INC-002 | v0.1.2 | Primera página prácticamente vacía al imprimir reporte en Safari. | CERRADA / re-prueba aprobada. |

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

## 10. Incremento correctivo P4 — `0.1.3-dev.1`

Incluye:

- validación obligatoria de ruta A/B/C para controles accionables;
- obligación de fecha compromiso para controles accionables;
- exigencia de Ruta C para `No subsanable / posible responsabilidad`;
- ayuda contextual sobre rutas A/B/C y prohibición de fabricar/retrofechar evidencia;
- sello runtime `0.1.3-dev.1` en estado y respaldos;
- caché Service Worker separada `catu-er-v0.1.3-dev.1`;
- entorno de preview P4 separado del root estable de GitHub Pages.

**Estado posterior a re-prueba 2026-09-12:**

- P4-INC-001: CERRADA.
- P4-INC-002: RE-PRUEBA PARCIAL; falta R086 sin fecha en estado accionable.
- P4-INC-003: pendiente de comprobación de versión runtime + JSON.
- P4-MEJ-001: re-prueba APROBADA.

---

## 11. Observaciones de la re-prueba 2026-09-12

1. R019 confirmó el bloqueo de una combinación incoherente `Crítico + Ruta No aplica` y el guardado posterior con ruta/fecha válidas.
2. R081 confirmó la obligatoriedad de fecha compromiso y el guardado correcto con fecha válida.
3. R086 se observó en estado `Conforme` con evidencia `No evaluada`; no quedó cerrado, comportamiento consistente con la compuerta especial R086, pero esto no sustituye la prueba específica de fecha obligatoria cuando R086 sea accionable.
4. R082 mostró correctamente la advertencia jurídica de Ruta B frente a `Documento inexistente`.
5. No se aportó aún evidencia visual de `Más → PWA y seguridad` ni del campo `version` en respaldo JSON, por lo que P4-INC-003 permanece abierta para re-prueba.
