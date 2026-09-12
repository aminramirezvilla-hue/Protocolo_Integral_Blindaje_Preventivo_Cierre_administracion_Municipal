# CATU E-R — Matriz ejecutable de casos de prueba P5 para v0.1.4

## 1. Identificación

- Producto: CATU E-R — Blindaje preventivo municipal
- Rama: `dev/v0.1.4`
- Baseline de partida: `v0.1.3-pilot-calibrated`
- Campaña: P5 — Hardening funcional, integridad, permisos, persistencia y preparación arquitectónica
- Candidato de salida: `v0.1.4-pilot-hardened`
- Universo funcional de referencia: 84 controles

## 2. Regla de ejecución

Cada caso debe registrarse con fecha/hora, commit probado, dispositivo/navegador, perfil, workspace, resultado observado, evidencia y PASS/FAIL. No se modifica `main` durante P5. Las pruebas destructivas se ejecutan únicamente sobre almacenamiento aislado o respaldos de prueba.

Escala de incidencias:

- B0 — Bloqueante: pérdida/corrupción de datos, imposibilidad de iniciar, cierre indebido de controles o bypass de permisos críticos.
- B1 — Crítica: cálculo ejecutivo incorrecto, evidencia asociada al control equivocado, reglas A/B/C inconsistentes o importación/restauración defectuosa.
- B2 — Mayor: función importante operativa con defecto o workaround relevante.
- B3 — Menor: presentación, texto, usabilidad o inconsistencia sin afectación material del dato.

Condición mínima de promoción: B0 = 0 y B1 = 0.

## 3. Convención de evidencias

Nombrar capturas y respaldos con el patrón:

`EV-P5-<subcampaña>-<consecutivo>_<descripcion>_<AAAAMMDD>.<ext>`

Ejemplo: `EV-P5-0-001_inicio_limpio_20260912.png`.

---

# P5.0 — Verificación de arranque limpio

## P5-0001 — Carga inicial de la rama dev/v0.1.4

**Objetivo:** confirmar que la versión inicia sin error fatal.

**Precondición:** abrir despliegue asociado a `dev/v0.1.4` en una sesión nueva de Safari.

**Pasos:**
1. Cargar la PWA.
2. Esperar carga completa.
3. Navegar a Inicio.
4. Verificar encabezado, navegación y panel principal.

**Esperado:** la PWA carga sin pantalla en blanco, error bloqueante ni bucle de recarga.

**Evidencia mínima:** captura de Inicio con versión visible.

**Severidad si falla:** B0.

## P5-0002 — Integridad del universo de 84 controles

**Objetivo:** comprobar que el catálogo funcional permanece completo.

**Pasos:**
1. Ir a Controles.
2. Verificar disponibilidad total.
3. Recorrer inicio, zona media y final del listado.

**Esperado:** existen 84 controles y no hay duplicados evidentes ni faltantes respecto de la baseline.

**Evidencia mínima:** captura del total y muestras del listado.

**Severidad si falla:** B1.

## P5-0003 — Navegación principal

**Pasos:** recorrer Inicio → Controles → Acciones → Evidencia → Más y regresar a Inicio.

**Esperado:** todas las vistas cargan y el estado de navegación permanece coherente.

**Evidencia mínima:** capturas de las cinco vistas.

**Severidad si falla:** B2; B0 si impide continuar operación.

## P5-0004 — Apertura y cierre de modal de control

**Pasos:** abrir un control, desplazarse hasta la parte inferior, cerrar con botón Cerrar y repetir con X.

**Esperado:** ambos mecanismos cierran el modal sin alterar datos no guardados de otros controles.

**Evidencia mínima:** captura de modal abierto.

**Severidad si falla:** B2.

## P5-0005 — Dashboard e IPER-CATU en estado inicial

**Pasos:** abrir Inicio en workspace limpio.

**Esperado:** indicadores se calculan sin excepción; no aparecen NaN, Infinity, valores negativos ni porcentajes >100.

**Evidencia mínima:** captura del panel.

**Severidad si falla:** B1.

## P5-0006 — Exportación JSON disponible

**Pasos:** Más → Respaldo JSON.

**Esperado:** se genera archivo JSON descargable sin error.

**Evidencia mínima:** archivo generado o captura de descarga.

**Severidad si falla:** B1.

**Criterio de cierre P5.0:** P5-0001 a P5-0006 PASS y cero B0/B1 abiertos.

---

# P5.1 — Aislamiento de espacios de trabajo

## P5-0101 — Identificador único de workspace

**Objetivo:** validar que dos espacios de trabajo no compartan el mismo identificador interno.

**Pasos:** crear/configurar Workspace A y Workspace B con municipios distintos; exportar JSON de cada uno.

**Esperado:** cada respaldo contiene identificador de workspace inequívoco y distinto.

**Evidencia mínima:** dos JSON y captura de configuración.

**Severidad si falla:** B0.

## P5-0102 — Persistencia independiente A/B

**Pasos:**
1. En A, modificar un control de prueba y guardar.
2. Cambiar a B.
3. Verificar el mismo control.
4. Regresar a A.

**Esperado:** B no hereda los cambios de A; A conserva sus propios datos.

**Evidencia mínima:** capturas comparativas A/B.

**Severidad si falla:** B0.

## P5-0103 — Reinicio de un workspace no afecta otro

**Pasos:** con A y B previamente configurados, reiniciar sólo A y revisar B.

**Esperado:** B conserva íntegramente sus datos.

**Evidencia mínima:** capturas antes/después y JSON de B.

**Severidad si falla:** B0.

## P5-0104 — Importación JSON sobre workspace objetivo

**Pasos:**
1. Seleccionar A.
2. Importar respaldo controlado de A.
3. Confirmar sustitución cuando la interfaz lo solicite.
4. Revisar B.

**Esperado:** la importación sustituye únicamente A; B no cambia.

**Evidencia mínima:** captura de confirmación y estado posterior de ambos workspaces.

**Severidad si falla:** B0.

## P5-0105 — Cambio de municipio sin contaminación

**Pasos:** crear un municipio nuevo o workspace limpio después de haber evaluado varios controles en A.

**Esperado:** el nuevo espacio inicia sin evaluaciones heredadas, salvo datos explícitamente importados.

**Evidencia mínima:** captura del dashboard en 0 o estado inicial definido.

**Severidad si falla:** B0.

## P5-0106 — Namespace de almacenamiento por versión/workspace

**Pasos:** exportar JSON de dos workspaces y verificar metadatos `workspace.id`, versión/runtimeVersion o equivalentes.

**Esperado:** existe una clave de separación suficiente para impedir colisiones de datos locales.

**Evidencia mínima:** extractos de ambos JSON.

**Severidad si falla:** B1.

**Criterio de cierre P5.1:** ningún dato de un workspace aparece en otro sin importación deliberada.

---

# P5.2 — Matriz de permisos por perfil

Perfiles mínimos: Administrador municipal, Coordinador E-R, Responsable de área, Revisor/OIC y Consultor CATU.

## P5-0201 — Cambio de perfil funcional

**Pasos:** alternar entre los cinco perfiles disponibles.

**Esperado:** la interfaz refleja el perfil activo de manera visible y coherente.

**Severidad si falla:** B2.

## P5-0202 — Validación OIC reservada

**Pasos:** intentar modificar `Validación OIC` desde Administrador municipal, Coordinador E-R, Responsable de área y Consultor CATU; repetir como Revisor/OIC.

**Esperado:** sólo Revisor/OIC puede modificar el campo cuando así lo define el piloto.

**Evidencia mínima:** capturas por perfil.

**Severidad si falla:** B0.

## P5-0203 — Edición de control por Responsable de área

**Pasos:** usar perfil Responsable de área, abrir control de su área y otro ajeno.

**Esperado:** el acceso/edición respeta la regla de área configurada; cualquier restricción se aplica consistentemente.

**Severidad si falla:** B1 si permite alterar área no autorizada; B2 si sólo es problema de visibilidad.

## P5-0204 — Acceso a configuración y perfiles

**Pasos:** intentar crear/cambiar perfiles desde cada rol.

**Esperado:** sólo roles autorizados tienen capacidad de administración según la matriz funcional documentada.

**Severidad si falla:** B0 si permite privilegio administrativo indebido.

## P5-0205 — Acceso a respaldo/importación

**Pasos:** probar exportar e importar JSON desde cada perfil.

**Esperado:** las capacidades coinciden con la política definida; ninguna importación destructiva debe estar disponible para perfil no autorizado.

**Severidad si falla:** B0 para importación destructiva no autorizada; B2 para exportación meramente informativa.

## P5-0206 — Cambio de ruta A/B/C según rol

**Pasos:** abrir un control accionable y probar cambio de ruta desde cada perfil.

**Esperado:** sólo perfiles con atribución funcional pueden alterar la ruta; el cambio queda persistido y trazable.

**Severidad si falla:** B1/B0 según posibilidad de cierre indebido.

## P5-0207 — Cierre/reapertura de control

**Pasos:** intentar llevar un control a condición de cierre y reabrirlo desde distintos perfiles.

**Esperado:** las restricciones de rol son consistentes y no existe bypass por navegación ordinaria.

**Severidad si falla:** B0.

**Criterio de cierre P5.2:** ninguna operación reservada puede ejecutarse desde un perfil no autorizado mediante interfaz ordinaria.

---

# P5.3 — Integridad de estados y reglas de negocio

## P5-0301 — Conforme + evidencia insuficiente + OIC pendiente

**Pasos:** intentar guardar la combinación contradictoria.

**Esperado:** la aplicación bloquea, advierte o normaliza explícitamente conforme a la regla de cierre vigente.

**Severidad si falla:** B1.

## P5-0302 — No subsanable con Ruta A

**Pasos:** seleccionar `No subsanable / posible responsabilidad` y Ruta A.

**Esperado:** no permite guardar; exige Ruta C.

**Severidad si falla:** B1.

## P5-0303 — No subsanable con Ruta B

**Esperado:** no permite guardar; exige Ruta C.

**Severidad si falla:** B1.

## P5-0304 — Control accionable sin fecha compromiso

**Pasos:** seleccionar estado accionable, dejar fecha vacía e intentar guardar.

**Esperado:** guardado bloqueado o advertencia impeditiva.

**Severidad si falla:** B1.

## P5-0305 — Avance 100 con estado crítico no cerrado

**Pasos:** fijar avance 100 manteniendo estado crítico/evidencia insuficiente.

**Esperado:** el control no debe contarse como cerrado; si el sistema restringe la combinación, debe explicarlo.

**Severidad si falla:** B1.

## P5-0306 — Sin incidencia + ruta de subsanación

**Pasos:** seleccionar `Sin incidencia` y Ruta A/B/C.

**Esperado:** el sistema normaliza a `No aplica` o bloquea la contradicción.

**Severidad si falla:** B1.

## P5-0307 — Validado OIC sin evidencia completa

**Pasos:** con evidencia insuficiente, intentar `Validado` como Revisor/OIC.

**Esperado:** si la regla de negocio exige evidencia completa para cierre, el sistema no debe contar el control como cerrado.

**Severidad si falla:** B1.

## P5-0308 — Riesgo residual y cierre

**Pasos:** cerrar un control con riesgo residual alto/muy alto.

**Esperado:** se aplica la regla definida de forma explícita; no se genera un estado lógicamente imposible sin advertencia.

**Severidad si falla:** B2 o B1 si afecta IPER/cierre.

**Criterio de cierre P5.3:** todas las combinaciones imposibles quedan bloqueadas o normalizadas explícitamente.

---

# P5.4 — Persistencia y recuperación

## P5-0401 — Recarga simple

**Pasos:** modificar y guardar tres controles; recargar página.

**Esperado:** todos los cambios persisten.

**Severidad si falla:** B0.

## P5-0402 — Cierre y reapertura de Safari

**Pasos:** guardar cambios, cerrar Safari completamente, reabrir PWA.

**Esperado:** estado recuperado sin pérdida.

**Severidad si falla:** B0.

## P5-0403 — Reinicio del dispositivo

**Pasos:** con respaldo previo, reiniciar dispositivo y volver a abrir.

**Esperado:** estado local se conserva conforme al diseño.

**Severidad si falla:** B0/B1 según alcance.

## P5-0404 — Pérdida temporal de conectividad

**Pasos:** cargar PWA, pasar offline, navegar y consultar controles previamente disponibles.

**Esperado:** operación offline parcial funciona dentro del alcance documentado.

**Severidad si falla:** B2, salvo pérdida de datos: B0.

## P5-0405 — Edición offline y reconexión

**Pasos:** offline, modificar control permitido y guardar; reconectar; recargar.

**Esperado:** no hay pérdida silenciosa del cambio local.

**Severidad si falla:** B0.

## P5-0406 — Backup → reinicio local → restore

**Pasos:** exportar JSON; reiniciar piloto/workspace; confirmar estado limpio; importar respaldo.

**Esperado:** se reconstruye el estado funcional registrado en el JSON.

**Severidad si falla:** B1/B0 si corrompe el almacenamiento.

## P5-0407 — Importación de respaldo v0.1.3

**Pasos:** importar un respaldo válido generado por `v0.1.3-pilot-calibrated`.

**Esperado:** restaura o migra de forma controlada, sin pérdida semántica relevante.

**Severidad si falla:** B1.

## P5-0408 — Backup v0.1.4 en almacenamiento limpio

**Pasos:** generar respaldo en v0.1.4 y restaurarlo en workspace limpio.

**Esperado:** equivalencia funcional del estado antes/después.

**Severidad si falla:** B1.

**Criterio de cierre P5.4:** cero pérdida silenciosa de datos; toda incompatibilidad de versión produce tratamiento controlado.

---

# P5.5 — Evidencias y trazabilidad

## P5-0501 — Alta de evidencia/fotografía

**Pasos:** asociar evidencia a un control de prueba.

**Esperado:** queda vinculada al control correcto.

**Severidad si falla:** B1.

## P5-0502 — Persistencia de evidencia tras recarga

**Esperado:** evidencia sigue asociada y visible tras recarga.

**Severidad si falla:** B1.

## P5-0503 — Aislamiento de evidencia entre controles

**Pasos:** agregar evidencia a Control A; abrir Control B.

**Esperado:** B no muestra ni contabiliza evidencia de A.

**Severidad si falla:** B1.

## P5-0504 — Eliminación controlada

**Pasos:** eliminar evidencia de prueba cuando la interfaz lo permita.

**Esperado:** sólo se elimina la evidencia seleccionada y se actualiza el conteo.

**Severidad si falla:** B1.

## P5-0505 — Metadatos mínimos

**Verificar:** control, fecha, usuario/perfil, tipo y referencia o los metadatos equivalentes disponibles.

**Esperado:** trazabilidad suficiente y coherente.

**Severidad si falla:** B2; B1 si impide atribuir evidencia al control.

## P5-0506 — Exportación declara exclusión de binarios locales

**Pasos:** con fotografía local asociada, exportar CSV/Excel/JSON según aplique.

**Esperado:** la interfaz/documentación no induce a pensar que la fotografía binaria está incluida cuando no lo está.

**Severidad si falla:** B2.

## P5-0507 — Enlace Drive/OneDrive

**Pasos:** guardar un enlace válido, abrirlo; repetir con URL claramente inválida si la interfaz lo permite.

**Esperado:** enlace válido abre de forma controlada; una URL inválida no corrompe el control.

**Severidad si falla:** B2.

**Criterio de cierre P5.5:** ninguna evidencia queda huérfana o asociada a control equivocado.

---

# P5.6 — Cálculo ejecutivo e IPER-CATU

## P5-0601 — Escenario cero

**Precondición:** workspace limpio.

**Esperado:** evaluación, evidencia, críticos, cerrados e IPER parten del estado definido y sin valores imposibles.

**Severidad si falla:** B1.

## P5-0602 — Un control conforme cerrado

**Pasos:** completar un control hasta condición válida de cierre.

**Esperado:** aumenta correctamente evaluación/evidencia/cerrados y el macro módulo correspondiente.

**Severidad si falla:** B1.

## P5-0603 — Un control crítico

**Pasos:** configurar un control como crítico con evidencia insuficiente.

**Esperado:** contador de críticos aumenta exactamente en uno y aparece la alerta correspondiente.

**Severidad si falla:** B1.

## P5-0604 — Un control no subsanable

**Pasos:** configurar un control en Ruta C/no subsanable.

**Esperado:** contador de no subsanables aumenta exactamente en uno y prioridad de alerta se eleva.

**Severidad si falla:** B1.

## P5-0605 — Macro módulo

**Pasos:** evaluar varios controles del mismo macro módulo con estados conocidos.

**Esperado:** porcentaje reproducible y coherente con el conjunto evaluado.

**Severidad si falla:** B1.

## P5-0606 — IPER-CATU reproducible

**Pasos:** usar un escenario de referencia documentado y repetir cálculo después de recarga.

**Esperado:** mismo estado produce mismo IPER.

**Severidad si falla:** B1.

## P5-0607 — Alertas agrupadas sin pérdida de causas

**Pasos:** provocar múltiples causas en un mismo control.

**Esperado:** una tarjeta por control con número correcto de causas y detalle expandible.

**Severidad si falla:** B1/B2 según pérdida de causa.

## P5-0608 — Orden de prioridades

**Pasos:** coexistir no subsanable, crítico, vencimiento y evidencia incompleta.

**Esperado:** orden conforme a regla visible: no subsanables → críticos → vencimientos → evidencia incompleta.

**Severidad si falla:** B2; B1 si oculta prioridad material.

**Criterio de cierre P5.6:** todos los resultados coinciden con tabla manual de resultados esperados.

---

# P5.7 — Pruebas negativas y corrupción controlada

Estas pruebas deben ejecutarse únicamente sobre copia aislada y con respaldo previo.

## P5-0701 — JSON incompleto

**Esperado:** rechazo o recuperación controlada sin sustituir estado vigente de forma silenciosa.

**Severidad si falla:** B0/B1.

## P5-0702 — JSON con campos desconocidos

**Esperado:** ignora/aisla campos desconocidos o advierte; no corrompe datos válidos.

**Severidad si falla:** B1.

## P5-0703 — JSON de versión anterior

**Esperado:** tratamiento de compatibilidad/migración explícito.

**Severidad si falla:** B1.

## P5-0704 — Control inexistente en JSON

**Esperado:** no crea estado inválido ni desplaza datos de controles existentes.

**Severidad si falla:** B1.

## P5-0705 — Valor numérico fuera de rango

**Ejemplo:** avance -1 o 150.

**Esperado:** rechazo, normalización segura o advertencia impeditiva.

**Severidad si falla:** B1.

## P5-0706 — Fecha inválida

**Esperado:** no se persiste como fecha operativa válida.

**Severidad si falla:** B2/B1 si altera alertas.

## P5-0707 — Identificador duplicado

**Esperado:** importación no genera colisión silenciosa.

**Severidad si falla:** B0/B1.

## P5-0708 — Estado desconocido

**Esperado:** rechazo o mapeo explícito; nunca cierre automático.

**Severidad si falla:** B0/B1.

**Criterio de cierre P5.7:** entradas corruptas no pueden corromper ni sustituir silenciosamente el estado vigente.

---

# P5.8 — Contrato de datos para backend futuro

## P5-0801 — Inventario de entidades

**Verificar y documentar:** Workspace/Municipio, Usuario, Perfil/Rol/Área, Control, Evaluación, Acción correctiva, Evidencia, Validación OIC, Alerta, Evento de auditoría y Versión/Baseline.

**Esperado:** todas las entidades del estado local tienen correspondencia conceptual.

## P5-0802 — Identificadores y claves

**Esperado:** cada entidad persistente dispone de identificador estable o se documenta la carencia como deuda técnica.

## P5-0803 — Cardinalidades

**Verificar:** Workspace→Evaluaciones; Control→Evaluación; Control→Evidencias; Control→Acciones; Evaluación→Validación OIC; Usuario/Perfil→eventos.

**Esperado:** relaciones sin ambigüedad semántica.

## P5-0804 — Reglas de integridad

**Documentar como mínimo:** unicidad de IDs, referencias válidas, límites de avance, estados permitidos, compatibilidad estado/ruta y política de borrado.

## P5-0805 — Mapeo JSON actual → contrato futuro

**Pasos:** tomar un respaldo real de v0.1.4 y mapear cada bloque al modelo objetivo.

**Esperado:** no existe pérdida semántica relevante; las brechas se documentan.

**Entregable asociado:** `docs/P5_CONTRATO_DATOS_BACKEND.md`.

**Criterio de cierre P5.8:** contrato documentado y compatible conceptualmente con el estado local existente.

---

# P5.9 — Smoke final y candidata a release

## P5-0901 — Inicio limpio

Repetir P5-0001 y P5-0002.

## P5-0902 — Evaluación de control simple

Completar un control ordinario y confirmar persistencia.

## P5-0903 — Control crítico

Configurar un crítico y confirmar dashboard, alerta y plan de acción.

## P5-0904 — Ruta C/no subsanable

Confirmar incompatibilidad con A/B y prioridad máxima.

## P5-0905 — Evidencia

Agregar evidencia, recargar y verificar asociación.

## P5-0906 — Validación OIC

Cambiar a Revisor/OIC y validar; comprobar cierre sólo si demás requisitos están satisfechos.

## P5-0907 — Reporte ejecutivo

Generar/vista previa e imprimir/guardar PDF según función disponible.

## P5-0908 — Backup/restore JSON

Ejecutar ciclo completo sobre workspace de prueba.

## P5-0909 — Offline parcial

Confirmar carga y operaciones dentro del alcance documentado.

## P5-0910 — Cambio de perfil y workspace

Confirmar que no hay fuga de permisos ni contaminación de datos.

**Criterio de cierre P5.9:** cero B0, cero B1, sin regresiones críticas abiertas y evidencia suficiente para promover a PR.

---

# 4. Registro maestro de ejecución

Usar una fila por caso ejecutado:

| ID | Fecha/hora | Commit | Dispositivo / navegador | Perfil | Workspace | Resultado observado | Estado | Evidencia | Incidencia |
|---|---|---|---|---|---|---|---|---|---|
| P5-0001 |  |  |  |  |  |  | PENDIENTE |  |  |
| P5-0002 |  |  |  |  |  |  | PENDIENTE |  |  |
| P5-0003 |  |  |  |  |  |  | PENDIENTE |  |  |
| P5-0004 |  |  |  |  |  |  | PENDIENTE |  |  |
| P5-0005 |  |  |  |  |  |  | PENDIENTE |  |  |
| P5-0006 |  |  |  |  |  |  | PENDIENTE |  |  |
| P5-0101 |  |  |  |  |  |  | PENDIENTE |  |  |
| P5-0102 |  |  |  |  |  |  | PENDIENTE |  |  |
| P5-0103 |  |  |  |  |  |  | PENDIENTE |  |  |
| P5-0104 |  |  |  |  |  |  | PENDIENTE |  |  |
| P5-0105 |  |  |  |  |  |  | PENDIENTE |  |  |
| P5-0106 |  |  |  |  |  |  | PENDIENTE |  |  |

Continuar la misma estructura para el resto de los casos conforme avance la campaña; los resultados consolidados se trasladarán a `docs/P5_RESULTADOS_v0.1.4.md`.

# 5. Regla de detención

Detener la campaña y no continuar al siguiente bloque cuando ocurra cualquiera de los siguientes supuestos:

1. Se detecta B0.
2. Un B1 implica riesgo de corrupción o propagación a otros casos.
3. El número de controles deja de ser 84 sin cambio deliberado aprobado.
4. Un workspace contamina a otro.
5. Un perfil no autorizado consigue modificar `Validación OIC` o realizar una operación administrativa destructiva.
6. Un backup/restore altera silenciosamente datos válidos.

En esos casos: preservar evidencia, registrar la incidencia, evitar nuevas modificaciones sobre el mismo almacenamiento y corregir/reprobar antes de continuar.
