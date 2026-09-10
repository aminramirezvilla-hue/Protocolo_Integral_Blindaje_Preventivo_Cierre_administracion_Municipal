# Informe consolidado del avance — Fases I a IV

## 1. Propósito general

El proyecto evolucionó desde una revisión crítica del **Protocolo Integral de Blindaje Preventivo y Transición Municipal** hacia un sistema normativo-operativo para preparar, verificar y dar seguimiento a la entrega-recepción de administraciones municipales del Estado de Guerrero.

El diseño separa dos productos comerciales complementarios:

- **Administración saliente:** preparación, saneamiento, evidencia, control de riesgos y entrega jurídicamente defendible.
- **Administración entrante:** recepción, verificación, conciliación, reservas, aclaraciones y continuidad administrativa.

La primera PWA libera sólo el modo **Saliente**, pero la arquitectura de datos mantiene un núcleo común para habilitar posteriormente el modo Entrante.

## 2. Fase I — Diagnóstico crítico y expansión del protocolo

### Resultado

Se contrastó el protocolo original con la **Ley Número 213 de Entrega Recepción de las Administraciones Públicas del Estado y Municipios de Guerrero**, particularmente con los artículos 17 y 18, así como con el archivo operativo de formatos de Ayuntamientos 2024.

### Cambios metodológicos

El checklist binario fue sustituido por una matriz con:

`fundamento → requisito → responsable → evidencia mínima → criterio de validación → estatus → riesgo → incumplimiento → acción → plazo → responsable de solventación → evidencia de cierre → riesgo residual`.

Se adoptó un horizonte preventivo:

`T-12 → T-9 → T-6 → T-3 → T-1 → T0 → T+30 días hábiles`.

Se incorporaron escenarios de incumplimiento y tres rutas:

- **A — Subsanación previa.**
- **B — Regularización documental sin alterar hechos históricos.**
- **C — No subsanable / preservación, cuantificación y canalización.**

## 3. Fase II — Validación normativa requisito por requisito

La matriz fue sometida a depuración jurídica individual. Se distinguió entre:

1. mandato expreso de Ley 213;
2. mandato municipal complementario de la Ley Orgánica del Municipio Libre;
3. normativa sectorial;
4. formatos operativos del ciclo 2024;
5. buena práctica de control.

### Resultado estructural

- 86 registros de control.
- 84 controles activos.
- 2 registros retirados/sustituidos.
- 11 controles nuevos.
- 840 escenarios de incumplimiento para controles activos.

### Correcciones críticas

- Se retiró el uso del **Decreto 171** como si fuese reforma vigente de la Ley 213.
- Se limitó el uso del artículo 24 de la Ley 213, redactado expresamente para el Poder Ejecutivo, evitando trasladarlo mecánicamente al municipio.
- Se documentó la **antinomia temporal 2027** y se creó `R086` como control permanente de gobernanza normativa.
- Se separaron `FAISMUN` y `FORTAMUN` en controles diferenciados.
- Se agregaron contenidos municipales expresos de catastro, cartografía, valores unitarios, convenios fiscales y recaudación asignable.
- Se sustituyó la regla genérica de “liquidar 100% de pasivos” por control de naturaleza, exigibilidad, registro, fuente de pago y obligaciones expresas.

## 4. Fase III — Consolidación documental

Se reconstruyeron los productos principales con la Fase II como baseline:

- **A2:** Informe crítico consolidado.
- **B2:** Protocolo de blindaje preventivo — Administración saliente v2.0.
- **C2:** Matriz maestra validada — fuente maestra de control.
- **D2:** Guía independiente — Administración entrante v2.0.
- **E:** Memoria de validación normativa.
- **F3:** Índice maestro y control de versiones.

### Regla de configuración

`C2` quedó definida como **fuente maestra de verdad normativa-operativa**: IDs, fundamentos, evidencias mínimas, criterios, responsables, hitos y dictámenes no deben alterarse en productos derivados sin control de versión.

## 5. Fase IV — Instrumentación operativa

Se construyó `F4`, sistema Excel para aplicar la matriz a un municipio real, y su manual `G4`.

### Componentes F4

- ficha institucional;
- diagnóstico de 84 controles;
- evidencia;
- plan de acción;
- 13 macro módulos;
- dashboard;
- reporte ejecutivo;
- control R086;
- exportación y seguimiento.

### IPER-CATU

Se diseñó el **Índice de Preparación para la Entrega–Recepción** como indicador interno de gestión:

`Puntaje control = 65% cumplimiento + 35% evidencia`

ponderado por criticidad de riesgo.

El índice no tiene naturaleza normativa ni certificadora; facilita priorización y gobierno del saneamiento.

## 6. Punto de madurez actual

El proyecto dispone ya de cuatro capas diferenciadas:

| Capa | Producto | Estado |
|---|---|---|
| Jurídica | Ley 213 + LOML + sectoriales + R086 | Validada a 10-09-2026 con reservas temporales 2027 |
| Metodológica | C2 + escenarios A/B/C | Consolidada |
| Operativa | F4 + G4 | Funcional en Excel |
| Digital móvil | PWA CATU E-R v0.1 | Piloto funcional, local-first |

## 7. Decisión de digitalización

No se recomienda replicar F4 como un sistema empresarial pesado. La PWA debe ser una **capa ligera de ejecución móvil**, mientras C2 conserva la semántica normativa.

La PWA v0.1 usa GitHub Pages + HTML/CSS/JS + IndexedDB, sin compilador ni backend. Esto permite validar rápidamente usabilidad y flujo en teléfonos.

Para multiusuario real, la evolución recomendada es mantener GitHub Pages y agregar Supabase sólo como servicio de autenticación/sincronización de metadatos. Los expedientes permanecen en Drive/OneDrive.

## 8. Principios que no deben perderse en la PWA

- `R001–R086` conservan IDs estables.
- `R086` debe permanecer visible y actuar como alerta de calendario.
- “No aplica” exige justificación y no sirve para ocultar falta de evidencia.
- No retrofechar, simular firmas ni fabricar evidencia.
- La regularización documental no borra hechos históricos.
- “Blindaje” significa prevención, trazabilidad y reducción lícita de exposición, no inmunidad.
- La evidencia oficial permanece en repositorios institucionales.
- Una incidencia no subsanable debe preservarse y canalizarse; no “normalizarse” por interfaz.
