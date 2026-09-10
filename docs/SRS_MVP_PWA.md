# SRS — MVP PWA CATU E-R (Modo Saliente)

**Versión:** 0.1.0-pilot  
**Repositorio objetivo:** `Protocolo_Integral_Blindaje_Preventivo_Cierre_administracion_Municipal`  
**Plataforma de publicación:** GitHub Pages

## 1. Objetivo

Proveer una PWA ligera, mobile-first e instalable que permita a la administración municipal saliente ejecutar y dar seguimiento al protocolo CATU de preparación para entrega-recepción, sin convertir el producto en un ERP, gestor documental o sistema jurídico complejo.

## 2. Alcance MVP

El MVP debe permitir evaluar los 84 controles activos de C2, registrar metadatos de evidencia, gestionar incidencias y acciones, calcular IPER-CATU, emitir alertas internas, visualizar avance y producir un reporte ejecutivo imprimible y exportaciones CSV/Excel-compatible.

## 3. Actores

| Actor | Código | Alcance MVP |
|---|---|---|
| Administrador municipal | ADM | Configuración del espacio y edición general |
| Coordinador E-R | COOR | Edición y seguimiento transversal |
| Responsable de área | AREA | Actualización de controles/evidencias de su ámbito |
| Revisor/OIC | OIC | Verificación y validación de cierres |
| Consultor CATU | CATU | Supervisión metodológica y apoyo transversal |

### Capacidad de usuarios

Se establece un **límite operativo inicial de 25 perfiles por espacio municipal**. No es una limitación técnica inherente a una PWA; es una decisión de gobierno para conservar un modelo simple y controlable durante el piloto y la consultoría. Para una implantación típica se recomienda 10–20 perfiles municipales y 1–2 consultores CATU.

## 4. Requisitos funcionales

### Núcleo y baseline

- **FR-001:** cargar catálogo de 84 controles activos desde un archivo JSON versionado.
- **FR-002:** preservar ID, fundamento validado, requisito, evidencia mínima, criterio de validación, responsable base, hito y riesgo base.
- **FR-003:** mostrar fecha de baseline normativa.
- **FR-004:** mantener alerta visible mientras R086 no cumpla el criterio de cierre.

### Diagnóstico

- **FR-010:** permitir seleccionar estatus: No evaluado, Conforme, Subsanable, Crítico, No subsanable/posible responsabilidad y No aplica.
- **FR-011:** permitir seleccionar estado de evidencia.
- **FR-012:** permitir seleccionar escenario de incumplimiento.
- **FR-013:** permitir seleccionar ruta A/B/C.
- **FR-014:** registrar responsable, fecha compromiso, avance, riesgo residual, enlace a expediente y observaciones.
- **FR-015:** impedir que el OIC sea sustituido por un rol general para la validación de cierre en la interfaz piloto.

### Evidencia

- **FR-020:** registrar descripción y enlace a expediente Drive/OneDrive.
- **FR-021:** permitir captura opcional de fotografía de campo comprimida y local.
- **FR-022:** no almacenar expedientes Word/PDF/Excel completos dentro del repositorio GitHub.
- **FR-023:** permitir abrir vínculos institucionales en una nueva pestaña/ventana.

### Seguimiento

- **FR-030:** listar automáticamente controles Subsanables, Críticos y No subsanables como plan de acción.
- **FR-031:** mostrar vencimientos y acciones próximas.
- **FR-032:** mostrar alertas por falta de evidencia suficiente.
- **FR-033:** calcular progreso y cierre.
- **FR-034:** considerar un control cerrado sólo cuando sea Conforme + evidencia completa verificada + OIC Validado.

### Dashboard y reporte

- **FR-040:** calcular IPER-CATU.
- **FR-041:** mostrar porcentaje evaluado, cobertura de evidencia, críticos, no subsanables y cerrados.
- **FR-042:** agrupar resultados en 13 macro módulos.
- **FR-043:** producir reporte ejecutivo imprimible/guardable como PDF por el navegador.
- **FR-044:** exportar CSV.
- **FR-045:** exportar un archivo Excel-compatible sin dependencia externa.
- **FR-046:** exportar/importar respaldo JSON local.

### PWA/offline

- **FR-050:** registrar service worker y cachear app shell + baseline.
- **FR-051:** permitir consultar y capturar diagnóstico sin conexión después de la primera carga.
- **FR-052:** mostrar estado de conectividad.
- **FR-053:** permitir instalación/“Añadir a pantalla de inicio”.

## 5. Requisitos no funcionales

- **NFR-001 — Simplicidad:** HTML/CSS/JS estático, sin build step obligatorio.
- **NFR-002 — Compatibilidad:** Safari iOS/iPadOS actual, Chrome/Edge Android y escritorio.
- **NFR-003 — GitHub Pages:** todas las rutas y recursos deben ser relativos al subdirectorio del repositorio.
- **NFR-004 — Rendimiento:** carga inicial objetivo < 2 MB sin fotografías.
- **NFR-005 — Offline parcial:** app shell, baseline y estado local disponibles sin conexión.
- **NFR-006 — Privacidad:** no incluir expedientes ni credenciales del municipio en el repositorio.
- **NFR-007 — Trazabilidad:** cambios relevantes registran actor y fecha en bitácora local.
- **NFR-008 — Integridad:** ningún flujo debe sugerir retrofechar, simular firmas o fabricar documentos.
- **NFR-009 — Accesibilidad mínima:** controles táctiles grandes, contraste suficiente y navegación por teclado en escritorio.
- **NFR-010 — Mantenibilidad:** catálogo normativo desacoplado en `data/runtime/controls-*.json`.

## 6. Exclusiones del MVP

- Firma electrónica avanzada.
- Geolocalización.
- Escáner QR universal en Safari.
- WhatsApp/API de mensajería.
- Almacenamiento documental masivo.
- Integración directa con Drive/OneDrive APIs.
- Flujo Entrante completo.
- Autenticación multiusuario remota.

Estas funciones pueden incorporarse únicamente si el piloto demuestra valor suficiente.

## 7. Criterios de aceptación del MVP

1. La aplicación abre desde GitHub Pages sin errores de rutas.
2. Muestra 84 controles activos y R086.
3. Recalcula IPER al modificar diagnóstico/evidencia.
4. El control cerrado requiere validación OIC.
5. Funciona después de perder conexión tras una primera carga exitosa.
6. Exporta CSV, Excel-compatible y respaldo JSON.
7. El reporte se imprime/guarda como PDF.
8. El usuario puede instalarla en Android y añadirla a inicio en iOS.
9. No existe información municipal hardcodeada en el repositorio.
10. No requiere Node, npm ni servidor propio para el piloto.
