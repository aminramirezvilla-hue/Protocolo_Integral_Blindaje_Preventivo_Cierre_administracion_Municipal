# CATU E-R — Plan P5 de validación para v0.1.4

## 1. Propósito

P5 tiene por objeto transformar la baseline funcional calibrada `v0.1.3-pilot-calibrated` en una versión candidata a piloto real con mayor aislamiento de datos, control de permisos, trazabilidad y consistencia operativa.

P5 no sustituye la validación jurídica del contenido de cada control. Su alcance principal es funcional, de integridad de datos, permisos, persistencia, evidencia y preparación arquitectónica.

## 2. Baseline de partida

- Baseline anterior: `v0.1.3-pilot-calibrated`
- Rama de desarrollo: `dev/v0.1.4`
- Controles disponibles: 84
- Estado P4: PASS
- Verificación post-merge P4.7: PASS
- Persistencia local: validada
- Reglas A/B/C: validadas
- Alertas agrupadas: validadas
- Plan de acción: validado
- IPER-CATU: calibrado funcionalmente
- Evidencia/fotografías locales: validadas
- Exportación/restauración JSON: validada
- Operación offline parcial: validada

## 3. Objetivos P5

1. Separar de manera inequívoca datos de prueba, datos de demostración y datos de un piloto real.
2. Evitar que un perfil funcional pueda modificar campos reservados a otro perfil.
3. Reforzar persistencia, respaldo, restauración y recuperación ante corrupción o pérdida de estado local.
4. Endurecer el manejo de evidencias y metadatos de trazabilidad.
5. Probar comportamiento ante sesiones, recargas, cambios de perfil y operación offline/online.
6. Verificar que los indicadores ejecutivos no puedan quedar en estados lógicamente imposibles.
7. Preparar el contrato de datos necesario para una futura capa backend/multiusuario sin alterar todavía el frontend estable.
8. Mantener compatibilidad con los 84 controles y con los respaldos válidos de `v0.1.3`.

## 4. Principios de control

- No modificar `main` directamente durante P5.
- No degradar funciones ya validadas en P4.
- No alterar el significado jurídico de controles durante pruebas puramente técnicas.
- Toda prueba destructiva debe ejecutarse en almacenamiento aislado o sobre copia de respaldo.
- Toda incidencia debe quedar identificada, reproducible y clasificada antes de su corrección.
- No se promoverá a `main` con defectos bloqueantes abiertos.

## 5. Campañas P5

### P5.0 — Verificación de arranque limpio

Objetivo: confirmar que `dev/v0.1.4` nace sin regresión respecto de la baseline.

Casos mínimos:

- Carga inicial sin error.
- 84 controles presentes.
- Navegación completa.
- Apertura/cierre de modal.
- Dashboard e IPER-CATU calculan sin excepción.
- Exportación JSON disponible.
- GitHub Pages/dev deployment operativo si aplica.

Criterio PASS: cero regresiones bloqueantes respecto de `v0.1.3-pilot-calibrated`.

### P5.1 — Aislamiento de espacios de trabajo

Objetivo: impedir contaminación entre municipio demo, municipio piloto y futuras instancias reales.

Validar:

- Identificador único de workspace.
- Namespace de almacenamiento por workspace/versión.
- Reinicio de un workspace no borra otro.
- Importación JSON sólo sustituye el workspace objetivo después de confirmación.
- Cambio de municipio no reutiliza inadvertidamente evaluaciones previas.

Criterio PASS: ningún dato de un workspace aparece en otro sin importación deliberada.

### P5.2 — Matriz de permisos por perfil

Perfiles de referencia:

- Administrador municipal.
- Coordinador E-R.
- Responsable de área.
- Revisor/OIC.
- Consultor CATU.

Validar como mínimo:

- Visibilidad de controles por rol/área.
- Edición de diagnóstico.
- Edición de evidencia.
- Cambio de ruta A/B/C.
- Edición de responsable y fecha compromiso.
- Edición de validación OIC exclusivamente por perfil autorizado.
- Cierre/reapertura de control según rol.
- Acceso a configuración, perfiles y respaldo.

Criterio PASS: ninguna operación reservada puede ejecutarse desde un perfil no autorizado mediante interfaz ordinaria.

### P5.3 — Integridad de estados y reglas de negocio

Probar combinaciones imposibles o contradictorias, entre ellas:

- `Conforme` + evidencia insuficiente + OIC pendiente.
- `No subsanable` con ruta A o B.
- Control accionable sin fecha compromiso.
- Avance 100 con estado crítico no cerrado.
- `Sin incidencia` con ruta de subsanación.
- `Validado OIC` sin evidencia mínima completa cuando el modelo exija evidencia.
- Riesgo residual incompatible con estado cerrado, cuando aplique.

Criterio PASS: la interfaz bloquea el guardado o normaliza explícitamente la combinación conforme a reglas documentadas.

### P5.4 — Persistencia y recuperación

Ejecutar:

- Recarga simple.
- Cierre/reapertura de Safari.
- Reinicio del dispositivo si procede.
- Pérdida temporal de conectividad.
- Edición offline y posterior reconexión.
- Exportación JSON, reinicio local e importación.
- Importación de respaldo de `v0.1.3`.
- Respaldo generado en `v0.1.4` y restaurado en almacenamiento limpio.

Criterio PASS: no hay pérdida silenciosa de datos y cualquier incompatibilidad de versión produce advertencia controlada.

### P5.5 — Evidencias y trazabilidad

Validar:

- Alta de fotografía/evidencia local.
- Asociación inequívoca con control.
- Persistencia tras recarga.
- Eliminación controlada.
- Conteo de evidencias coherente.
- Exportaciones que indiquen correctamente si una evidencia binaria local no está incluida.
- Metadatos mínimos: control, fecha, usuario/perfil, tipo y referencia.
- Enlaces Drive/OneDrive válidos y apertura segura.

Criterio PASS: ninguna evidencia queda huérfana o asociada a un control incorrecto.

### P5.6 — Cálculo ejecutivo e IPER-CATU

Usar escenarios controlados con estados conocidos para validar:

- Evaluación %.
- Cobertura de evidencia %.
- Número de críticos.
- Número de no subsanables.
- Número de cerrados.
- Preparación por macro módulo.
- IPER-CATU.
- Alertas agrupadas por control y número de causas.
- Orden de prioridades.

Criterio PASS: resultados reproducibles frente a una tabla de resultados esperados.

### P5.7 — Pruebas negativas y corrupción controlada

Simular en copia aislada:

- JSON incompleto.
- JSON con campos desconocidos.
- JSON con versión anterior.
- JSON con control inexistente.
- Valores fuera de rango.
- Fecha inválida.
- Identificador duplicado.
- Estado desconocido.

Criterio PASS: la aplicación rechaza, migra o aísla la entrada sin corromper el estado vigente.

### P5.8 — Contrato de datos para backend futuro

Sin implementar todavía autenticación multiusuario real, documentar y verificar el modelo mínimo de entidades:

- Workspace/Municipio.
- Usuario/Perfil/Rol/Área.
- Control.
- Evaluación.
- Acción correctiva.
- Evidencia.
- Validación OIC.
- Alerta.
- Evento de auditoría.
- Versión/baseline.

Entregable: especificación de campos, claves, cardinalidades y reglas de integridad.

Criterio PASS: el estado local existente puede mapearse al contrato sin pérdida semántica relevante.

### P5.9 — Smoke final y candidata a release

Repetir un subconjunto de máxima cobertura:

- Inicio limpio.
- Evaluación de control simple.
- Control crítico.
- Ruta C/no subsanable.
- Evidencia.
- Validación OIC.
- Alerta.
- Plan de acción.
- Reporte ejecutivo.
- JSON backup/restore.
- Offline parcial.
- Cambio de perfil.
- Cambio de workspace.

Criterio PASS: cero defectos bloqueantes y cero regresiones críticas abiertas.

## 6. Clasificación de incidencias

- **B0 — Bloqueante:** pérdida/corrupción de datos, imposibilidad de iniciar, cierre indebido de controles, bypass de permisos críticos.
- **B1 — Crítica:** cálculo ejecutivo incorrecto, evidencia asociada al control equivocado, reglas A/B/C inconsistentes, importación/restauración defectuosa.
- **B2 — Mayor:** función importante operativa con defecto o workaround relevante.
- **B3 — Menor:** presentación, texto, usabilidad o inconsistencia sin afectación material del dato.

Condición de promoción: B0 = 0 y B1 = 0. Los B2/B3 abiertos deberán estar documentados y aceptados expresamente.

## 7. Evidencia mínima de campaña

Para cada subcampaña registrar:

- ID de prueba.
- Fecha/hora.
- Versión/commit.
- Dispositivo/navegador.
- Perfil utilizado.
- Workspace.
- Precondiciones.
- Datos de prueba.
- Pasos ejecutados.
- Resultado esperado.
- Resultado observado.
- PASS/FAIL.
- Captura o archivo de respaldo cuando aplique.
- Incidencia asociada.

## 8. Artefactos P5

Se generarán como mínimo:

- `docs/P5_PLAN_VALIDACION_v0.1.4.md` — este documento.
- `docs/P5_MATRIZ_CASOS_PRUEBA_v0.1.4.md`.
- `docs/P5_RESULTADOS_v0.1.4.md`.
- `docs/P5_INCIDENCIAS_v0.1.4.md`.
- `docs/P5_CONTRATO_DATOS_BACKEND.md`.
- Respaldo JSON de cierre de campaña.

## 9. Criterios de salida de P5

P5 se considerará cerrado cuando:

1. P5.0–P5.9 tengan resultado documentado.
2. No existan B0 ni B1 abiertos.
3. Los 84 controles permanezcan disponibles y funcionales.
4. La persistencia y restauración estén verificadas.
5. Los permisos de interfaz estén validados por perfil.
6. Las reglas de integridad de estados estén cubiertas.
7. El contrato de datos futuro quede documentado.
8. Se ejecute verificación post-merge en `main`.
9. Se publique una release nueva únicamente después de la verificación post-merge.

## 10. Candidato de versión de salida

Si la campaña concluye satisfactoriamente, la versión candidata recomendada será:

`v0.1.4-pilot-hardened`

La etiqueta definitiva deberá crearse desde `main`, después del merge y de la verificación post-merge correspondiente.
