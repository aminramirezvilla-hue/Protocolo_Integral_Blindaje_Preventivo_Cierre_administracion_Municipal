# CATU E-R
## P4 — Plan de Piloto Funcional Ampliado y Calibración

**Rama de trabajo:** `dev/v0.1.3`  
**Baseline de origen:** `v0.1.2-pilot-stable`  
**Commit de origen verificado:** `0d08246dba448f7b333e2099178affedb3216a30`  
**Modo:** Administración saliente  
**Baseline normativa:** C2 / Fase IV — verificada al 10-09-2026  
**Controles activos del producto:** 84  
**Muestra P4:** 20 controles  
**Estado inicial:** P0–P3 aprobados; P1-INC-001 y P3-INC-002 cerradas y reprobadas satisfactoriamente.

---

## 1. Objetivo

P4 tiene por objeto validar la **calidad operativa, comprensibilidad, suficiencia de evidencia, utilidad de los escenarios de incumplimiento, coherencia de las rutas A/B/C y razonabilidad de la lectura ejecutiva del IPER-CATU** sobre una muestra ampliada y representativa del protocolo.

P4 **no** busca volver a demostrar únicamente que los botones funcionan. Su propósito es comprobar si la PWA constituye un instrumento práctico para una consultoría municipal real y si la estructura de los 84 controles puede ejecutarse sin ambigüedades materiales.

---

## 2. Principios de la campaña

1. La baseline `v0.1.2-pilot-stable` no se modifica.
2. Todo cambio P4 se realiza únicamente en `dev/v0.1.3`.
3. Durante la calibración **no se modifican inicialmente** los pesos del IPER-CATU: cumplimiento 65 %, evidencia 35 %, ponderación por criticidad.
4. `No aplica` requiere justificación objetiva y no se usa para excluir controles difíciles.
5. Una incidencia no subsanable no se transforma en Conforme por documentarla.
6. No se retrofechan documentos, firmas o regularizaciones.
7. Los expedientes oficiales permanecen en Drive/OneDrive; la PWA registra metadatos, vínculos y fotografía puntual.
8. R086 permanece como compuerta normativa visible.
9. Toda incidencia del software o del modelo se registra antes de corregirse.
10. P4 debe generar evidencia suficiente para decidir si procede `v0.1.3` estable o si se requiere otra iteración de desarrollo.

---

## 3. Muestra P4

La muestra se amplía a **20 controles** para cubrir los **13 macro módulos** del sistema. La inclusión no implica que los restantes controles sean menos importantes; la selección busca diversidad de pruebas y riesgos.

| ID | Macro módulo | Requisito | Hito | Riesgo base | Razón de inclusión P4 |
|---|---|---|---|---:|---|
| R001 | Gobierno, planeación y transición | Estructura orgánica | T-12 | 2 | Control institucional básico y trazabilidad de adscripciones. |
| R086 | Gobierno, planeación y transición | Revalidación normativa y fijación formal del calendario aplicable a la transición 2027 | T-12/T-6/T-3 | 4 | Compuerta normativa y prueba de alerta persistente. |
| R015 | Hacienda municipal | Cuentas bancarias e inversiones | T-1 | 2 | Conciliación banco–contabilidad–presupuesto; ya usado en P1/P2. |
| R019 | Hacienda municipal | Pasivos corto, mediano y largo plazo | T-1 | 2 | Prueba de obligación financiera y conciliación documental. |
| R081 | Hacienda municipal | Acreditación de estar al corriente en energía eléctrica, agua potable y adquisiciones con proveedores | T-1 | 4 | Control municipal reforzado de alta criticidad. |
| R006 | Recursos humanos y laboral | Expedientes, tabulador, perfiles, capacitación y sistema de nómina | T-6 | 2 | Integridad documental y continuidad de nómina. |
| R082 | Recursos humanos y laboral | Indemnizaciones por terminación de relación laboral y previsión presupuestal de liquidaciones/finiquitos | T-1 | 4 | Riesgo laboral/presupuestal y prevención de simulación documental. |
| R012 | Patrimonio y bienes | Bienes inmuebles | T-6 | 2 | Verificación registral, jurídica y física. |
| R024 | Obra pública y programas | Anticipos pendientes de amortizar | T-3 | 2 | Conciliación contrato–estimaciones–pólizas. |
| R049 | Obra pública y programas | Informe detallado de obras del último ejercicio e inconclusas | T-1 | 2 | Cruce documental y visita física. |
| R070 | Contratación y convenios | Contratos/pedidos de adquisiciones y servicios vigentes | T-1 | 2 | Expediente contractual, saldos, garantías y entregables. |
| R052 | Ingresos, catastro y fiscal | Padrón de contribuyentes del impuesto predial | T-3 | 2 | Integridad de base maestra y conciliación con ingresos. |
| R080 | Ingresos, catastro y fiscal | Expedientes de recaudación asignable de predial y derechos de agua remitidos para distribución de participaciones | T-3 | 2 | Trazabilidad recaudación–acuse–contabilidad; control incorporado en Fase II. |
| R034 | Archivos y asuntos en trámite | Asuntos pendientes de resolver | T-1 | 2 | Continuidad administrativa y control de términos. |
| R069 | Jurídico y fiscalización | Auditorías, observaciones y solventaciones pendientes | T-1 | 2 | Riesgo de fiscalización y seguimiento de plazos/montos. |
| R067 | TI, datos y continuidad digital | Credenciales institucionales, respaldos y continuidad de sistemas | T-1 | 2 | Continuidad digital sin compartir contraseñas personales. |
| R068 | Servicios públicos | Plan de continuidad de servicios esenciales | T-1 | 2 | Operación municipal durante la transición. |
| R084 | Fondos federales | Cierre y trazabilidad del FAISMUN | T-1 | 2 | Conciliación SIFAIS/SRFT/banco/contabilidad/expediente. |
| R085 | Fondos federales | Cierre y trazabilidad del FORTAMUN | T-1 | 2 | Validar separación conceptual respecto de FAISMUN. |
| R072 | Entidades paramunicipales | Paquete de entrega por cada organismo paramunicipal | T-3 | 2 | Prueba de alcance multientidad y conciliación interinstitucional. |

---

## 4. Cobertura que debe producir la muestra

Al finalizar P4 deben existir, dentro de la muestra, ejemplos controlados de al menos:

- 5 controles `Conforme`;
- 5 controles `Subsanable`;
- 4 controles `Crítico`;
- 2 controles `No subsanable / posible responsabilidad` simulados exclusivamente para probar flujo, sin atribuir hechos reales;
- 2 controles `No aplica` con justificación explícita, sólo si el caso piloto realmente permite esa condición;
- controles restantes distribuidos según el caso evaluado.

No se forzará una clasificación si la evidencia no la sustenta. La distribución anterior es una meta de cobertura funcional, no un resultado jurídico predeterminado.

---

## 5. Dimensiones a evaluar por cada control

Cada control de la muestra debe revisarse en las siguientes dimensiones:

| Dimensión | Pregunta de prueba |
|---|---|
| Claridad | ¿El requisito se entiende sin explicación adicional? |
| Fundamento | ¿El fundamento mostrado es suficiente para orientar al usuario? |
| Evidencia mínima | ¿La evidencia solicitada es concreta, recuperable y proporcional? |
| Criterio de validación | ¿Permite decidir objetivamente entre Conforme/Subsanable/Crítico? |
| Responsable | ¿El responsable base corresponde a una estructura municipal razonable? |
| Hito | ¿El momento T-12/T-6/T-3/T-1/T0 resulta operacionalmente útil? |
| Escenario | ¿Existe un escenario que describa la deficiencia real sin forzar su encuadre? |
| Ruta A/B/C | ¿La ruta propuesta evita regularizaciones simuladas y orienta una solución viable? |
| Evidencia digital | ¿El vínculo/fotografía/metadatos son suficientes sin convertir la PWA en repositorio? |
| Riesgo | ¿La criticidad aparente guarda relación con el impacto observado? |
| Dashboard | ¿El efecto del control sobre alertas, módulo e IPER resulta razonable? |
| Usabilidad móvil | ¿Puede ejecutarse desde móvil/tableta sin fricción material? |

---

## 6. Secuencia de ejecución P4

### P4.0 — Preparación

- Confirmar que se trabaja en `dev/v0.1.3`.
- Mantener `main` y `v0.1.2-pilot-stable` sin cambios funcionales.
- Generar respaldo JSON del estado piloto previo.
- Definir si se utilizará un municipio ficticio controlado o información institucional autorizada.
- No cargar información sensible innecesaria.

**Salida:** entorno y caso de prueba identificados.

### P4.1 — Primera tanda: gobierno, hacienda y RH

Evaluar: R001, R086, R015, R019, R081, R006 y R082.

**Objetivo:** probar controles básicos, conciliaciones financieras, riesgo 4 y gobernanza normativa.

### P4.2 — Segunda tanda: patrimonio, obra y contratación

Evaluar: R012, R024, R049 y R070.

**Objetivo:** comprobar evidencia física/documental, contratos, anticipos, expedientes y continuidad de obligaciones.

### P4.3 — Tercera tanda: ingresos, archivos, jurídico y TI

Evaluar: R052, R080, R034, R069 y R067.

**Objetivo:** validar datos maestros, términos, expedientes, fiscalización y continuidad digital.

### P4.4 — Cuarta tanda: servicios, fondos y paramunicipales

Evaluar: R068, R084, R085 y R072.

**Objetivo:** comprobar continuidad operativa, separación FAISMUN/FORTAMUN y alcance a organismos paramunicipales.

### P4.5 — Calibración ejecutiva

- Revisar IPER global y por macro módulo.
- Contrastar resultados con juicio profesional independiente.
- Revisar si controles de riesgo 4 influyen suficientemente.
- Identificar falsos positivos/falsos negativos de alertas.
- Revisar utilidad del reporte ejecutivo.
- No cambiar ponderaciones hasta documentar primero el resultado observado.

### P4.6 — Cierre

- Cerrar o clasificar todas las `P4-INC-*` y `P4-MEJ-*`.
- Reprobar correcciones.
- Completar `P4_RESULTADOS_CALIBRACION.md`.
- Decidir: `GO v0.1.3`, `GO condicionado` o `NO-GO / nueva iteración`.

---

## 7. Registro de defectos y mejoras

### Incidencias

Usar la nomenclatura:

`P4-INC-001`, `P4-INC-002`, ...

Severidad recomendada:

- **S1 Crítica:** pérdida/corrupción de datos, cálculo materialmente incorrecto, bypass de control, imposibilidad de usar la PWA.
- **S2 Alta:** resultado funcional incorrecto o riesgo de decisión equivocada sin pérdida de datos.
- **S3 Media:** defecto funcional con alternativa operativa viable.
- **S4 Baja:** presentación, texto o fricción menor.

### Mejoras

Usar:

`P4-MEJ-001`, `P4-MEJ-002`, ...

Una mejora no se clasifica como defecto si el comportamiento actual cumple el diseño y sólo se propone optimización.

---

## 8. Criterios de aceptación P4

P4 podrá declararse aprobado cuando:

1. Los 20 controles sean ejecutados o exista justificación documentada para cualquier exclusión.
2. No permanezca abierta ninguna incidencia S1 o S2.
3. Toda corrección funcional sea reprobada en la rama `dev/v0.1.3`.
4. No se detecte pérdida de persistencia IndexedDB.
5. No se rompa PWA/offline, exportación o restauración JSON.
6. El reporte ejecutivo mantenga coherencia con el diagnóstico.
7. Las rutas A/B/C sean comprensibles y no induzcan simulación documental.
8. R084 y R085 conserven lógica diferenciada.
9. R086 continúe visible y no permita interpretar el calendario como cerrado sin evidencia.
10. El IPER sea evaluado cualitativamente por el equipo y cualquier ajuste de pesos tenga justificación documentada.
11. Se complete `P4_RESULTADOS_CALIBRACION.md`.
12. Se tome una decisión formal `GO / GO condicionado / NO-GO`.

---

## 9. Evidencia mínima de campaña

Por cada tanda conservar:

- captura del dashboard antes y después;
- captura de al menos un control evaluado por estatus;
- captura del plan de acción cuando corresponda;
- captura de alertas generadas;
- exportación CSV o Excel al cierre de la tanda;
- respaldo JSON antes de cambios de versión;
- registro de incidencias/mejoras detectadas.

No se requiere subir expedientes municipales reales al repositorio.

---

## 10. Resultado esperado

Al cierre de P4 se deberá poder responder con evidencia:

1. ¿La PWA es comprensible para usuarios municipales no técnicos?
2. ¿La muestra permite ejecutar el protocolo sin recurrir constantemente al documento matriz?
3. ¿Los escenarios y rutas A/B/C son suficientes?
4. ¿Los controles de evidencia son proporcionales?
5. ¿El IPER refleja razonablemente el juicio profesional sobre preparación?
6. ¿El dashboard ayuda a priorizar la acción directiva?
7. ¿La arquitectura local-first sigue siendo suficiente para el servicio de consultoría?
8. ¿Qué requisitos justifican pasar a una fase multiusuario con backend ligero?

---

**Estado del documento:** PLAN APROBABLE PARA EJECUCIÓN EN `dev/v0.1.3`.  
**No modifica la baseline `v0.1.2-pilot-stable`.**