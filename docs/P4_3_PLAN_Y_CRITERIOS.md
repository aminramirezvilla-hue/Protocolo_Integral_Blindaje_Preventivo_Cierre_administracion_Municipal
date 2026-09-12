# CATU E-R
## P4.3 — Catastro, asuntos en trámite, fiscalización y continuidad digital

**Rama:** `dev/v0.1.3`  
**Runtime de prueba:** `0.1.3-dev.2`  
**Baseline protegida:** `v0.1.2-pilot-stable`  
**Fecha de inicio:** 2026-09-12  
**Punto de partida:** 11/84 controles evaluados; IPER-CATU 9/100; evidencia 8 %; 3 críticos; 1 no subsanable; 2 cerrados.

---

## 1. Objetivo

Ampliar la muestra acumulada del piloto de 11 a 16 controles, cubriendo cinco requisitos adicionales y cuatro macro módulos que todavía necesitan mayor representación funcional:

- Ingresos, catastro y fiscal.
- Archivos y asuntos en trámite.
- Jurídico y fiscalización.
- TI, datos y continuidad digital.

P4.3 busca validar que las reglas ya aprobadas se comportan de forma consistente fuera de Hacienda, Obra Pública, RH y Contratación, sin modificar el algoritmo IPER ni el motor de alertas.

---

## 2. Controles de la tanda

| ID | Requisito | Fundamento cargado en la PWA | Responsable base | Hito | Riesgo base |
|---|---|---|---|---|---:|
| R052 | Padrón de contribuyentes del impuesto predial | LOML art. 42-IX | Catastro/Tesorería | T-3 | 2 |
| R080 | Expedientes de recaudación asignable de predial y derechos de agua remitidos para distribución de participaciones | LOML art. 42-XV | Tesorería/Catastro/Organismo de Agua | T-3 | 2 |
| R034 | Asuntos pendientes de resolver | Ley 213 art. 17 o 18, fracción/inciso correspondiente | Todas las áreas/Jurídico | T-1 | 2 |
| R069 | Auditorías, observaciones y solventaciones pendientes | LOML arts. 106-XIX y XX, 164; art. 140 OIC | OIC/Tesorería | T-1 | 2 |
| R067 | Credenciales institucionales, respaldos y continuidad de sistemas | LOML art. 42-XII y 42-XVI; Ley 794/207/466 | TI/OIC | T-1 | 2 |

---

## 3. Escenarios controlados recomendados

Los escenarios siguientes son exclusivamente datos de prueba para calibración funcional. No representan hechos de un municipio real.

### R052 — Padrón predial

- Estatus diagnóstico: `Subsanable`.
- Estatus evidencia: `Parcial`.
- Escenario: `Información desactualizada`.
- Ruta: `A — Subsanación`.
- Responsable: `Catastro/Tesorería`.
- Fecha compromiso sugerida: 22-09-2026.
- Riesgo residual sugerido: `2 — Medio`.
- Observación sugerida: `Actualizar padrón y conciliarlo con ingresos antes del cierre.`

**Propósito:** comprobar un caso operativo ordinario de actualización de base maestra sin alterar hechos históricos.

### R080 — Recaudación asignable

- Estatus diagnóstico: `Crítico`.
- Estatus evidencia: `Insuficiente`.
- Escenario: `Inconsistencia con contabilidad u otras bases`.
- Ruta: `A — Subsanación`.
- Responsable: `Tesorería/Catastro/Organismo de Agua`.
- Fecha compromiso sugerida: 20-09-2026.
- Riesgo residual sugerido: `3 — Alto`.
- Observación sugerida: `Conciliar expediente remitido, acuses, base de cálculo y registros contables.`

**Propósito:** probar consistencia transversal entre recaudación, expediente remitido, acuse y contabilidad.

### R034 — Asuntos pendientes de resolver

- Estatus diagnóstico: `Subsanable`.
- Estatus evidencia: `Parcial`.
- Escenario: `Documento incompleto`.
- Ruta: `B — Regularización documental`.
- Responsable: `Todas las áreas/Jurídico`.
- Fecha compromiso sugerida: 19-09-2026.
- Riesgo residual sugerido: `2 — Medio`.
- Observación sugerida: `Integrar relación de asuntos, términos, responsable y fecha probable de terminación.`

**Propósito:** comprobar la aplicación lícita de Ruta B en expedientes de seguimiento existentes.

### R069 — Auditorías y solventaciones

- Estatus diagnóstico: `Crítico`.
- Estatus evidencia: `Insuficiente`.
- Escenario: `Documento incompleto`.
- Ruta: `A — Subsanación`.
- Responsable: `OIC/Tesorería`.
- Fecha compromiso sugerida: 18-09-2026.
- Riesgo residual sugerido: `4 — Muy alto`.
- Observación sugerida: `Concentrar observaciones, montos, plazos, estatus y responsables por ente fiscalizador.`

**Propósito:** comprobar priorización de un control con riesgo residual elevado y vencimiento próximo.

### R067 — Continuidad digital

Primera etapa con perfil Administrador/Consultor:

- Estatus diagnóstico: `Conforme`.
- Estatus evidencia: `Completa verificada`.
- Escenario: `Sin incidencia`.
- Ruta: `No aplica`.
- Responsable: `TI/OIC`.
- Fecha compromiso: vacía.
- Avance: 100 %.
- Riesgo residual sugerido: `1 — Bajo`.
- Observación sugerida: `Inventario de cuentas institucionales, MFA, respaldos y custodios verificado; sin compartir contraseñas personales.`

Segunda etapa con perfil Revisor/OIC:

- Validación OIC: `Validado`.

**Propósito:** reproducir un cierre completo en el macro módulo de TI y confirmar que un control conforme no exige Ruta A/B/C ni fecha compromiso.

---

## 4. Pruebas funcionales complementarias

Durante P4.3 verificar también:

1. El dashboard pasa de 11/84 a aproximadamente 16/84 controles evaluados después de completar los cinco controles.
2. La agrupación de alertas continúa mostrando `N causas · M controles`.
3. R080 y R069 aparecen antes que controles meramente subsanables cuando generan mayor prioridad.
4. R067 incrementa el contador de `Cerrados` únicamente después de `Completa verificada + Validación OIC = Validado`.
5. La navegación desde una tarjeta de alerta agrupada abre el control correcto.
6. El runtime continúa mostrando `0.1.3-dev.2`.
7. No se modifica el estado previamente registrado de R049, R024, R019, R082, R081, R070, R012, R086, R001, R015 y R006.

---

## 5. Evidencia mínima de la tanda

Capturar al terminar:

1. Dashboard completo con corte acumulado.
2. Alertas y prioridades con agrupación visible.
3. Plan de acción mostrando al menos R080 y R069.
4. R067 cerrado y validado por OIC.
5. Una captura de R080 o R069 mostrando escenario, ruta, fecha y riesgo residual.

Si aparece un comportamiento incoherente, registrar nueva incidencia antes de continuar a P4.4.

---

## 6. Criterios de aprobación P4.3

P4.3 se considerará aprobada si:

- los cinco controles pueden registrarse conforme a los escenarios definidos;
- las reglas de ruta y fecha no generan falsos positivos;
- R067 puede cerrarse correctamente;
- las alertas permanecen agrupadas sin pérdida visible de causas;
- no se pierde ni altera información de los 11 controles acumulados;
- no aparece una incidencia S1 o S2 nueva;
- el corte IPER puede calcularse sin errores.

---

## 7. Paso posterior

Si P4.3 resulta aprobada, iniciar P4.4 con:

- R068 — continuidad de servicios esenciales;
- R084 — cierre y trazabilidad FAISMUN;
- R085 — cierre y trazabilidad FORTAMUN;
- R072 — paquete de entrega por organismo paramunicipal.

Con P4.4 se completará la muestra prevista de 20 controles y se realizará la primera evaluación formal de calibración del IPER-CATU sobre una muestra transversal.

---

**Este plan no modifica ni sustituye la baseline `v0.1.2-pilot-stable`.**
