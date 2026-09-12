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

## 4. Plantilla de incidencia

Copiar el siguiente bloque por cada defecto:

```markdown
### P4-INC-### — Título breve

**Fecha:** AAAA-MM-DD  
**Control/módulo afectado:** R### / módulo  
**Severidad:** S1 / S2 / S3 / S4  
**Estado:** ABIERTA  
**Versión/rama:** dev/v0.1.3  
**Dispositivo/navegador:**  

**Descripción**  
Qué comportamiento se observó.

**Precondiciones**  
Estado previo necesario para reproducir.

**Pasos para reproducir**
1. ...
2. ...
3. ...

**Resultado esperado**  
...

**Resultado real**  
...

**Evidencia**  
Captura, video, nombre del archivo exportado o referencia de prueba.

**Impacto**  
Qué decisión, dato, control o flujo puede verse afectado.

**Causa identificada**  
Pendiente / descripción técnica.

**Corrección aplicada**  
Pendiente / commit / archivo modificado.

**Re-prueba**  
Pendiente / APROBADA / FALLIDA.

**Decisión de cierre**  
...
```

---

## 5. Plantilla de mejora

```markdown
### P4-MEJ-### — Título breve

**Fecha:** AAAA-MM-DD  
**Control/módulo:**  
**Prioridad:** Alta / Media / Baja  
**Estado:** PROPUESTA  

**Necesidad observada**  
...

**Propuesta**  
...

**Beneficio esperado**  
...

**Complejidad estimada**  
Baja / Media / Alta.

**Decisión**  
Incorporar v0.1.3 / Diferir / Descartar.
```

---

## 6. Registro maestro de incidencias

| ID | Fecha | Control/módulo | Severidad | Resumen | Estado | Commit corrección | Re-prueba |
|---|---|---|---|---|---|---|---|
| — | — | — | — | Sin incidencias P4 registradas al inicio de la campaña. | — | — | — |

---

## 7. Registro maestro de mejoras

| ID | Fecha | Control/módulo | Prioridad | Resumen | Decisión | Versión objetivo |
|---|---|---|---|---|---|---|
| — | — | — | — | Sin mejoras P4 registradas al inicio de la campaña. | — | — |

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

**Estado inicial:** LISTO PARA CAPTURA DE INCIDENCIAS P4.