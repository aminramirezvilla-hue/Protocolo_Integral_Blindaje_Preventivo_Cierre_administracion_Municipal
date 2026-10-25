# CATU E-R — Especificación SQL Ejecutable y Plan de Migración Inicial 0.2.0

## 1. Identificación

- Producto: CATU E-R — Blindaje Preventivo Municipal
- Serie: 0.2.x
- Baseline funcional precedente: POST-RLS-G10
- Baseline de origen: `dev/v0.2.0`
- Rama: `docs/post-rls-g11-sql-migration-v0.2.0`
- Gate: `POST-RLS-G11`
- Naturaleza: especificación de implementación / PostgreSQL / migraciones / integridad física
- Estado inicial: propuesta para revisión

## 2. Propósito

POST-RLS-G11 transformará de manera controlada la especificación física aprobada en POST-RLS-G10 en una especificación SQL ejecutable y en un plan verificable de migración inicial.

El objetivo no es reinterpretar el dominio funcional, sino determinar cómo materializar técnicamente en PostgreSQL las decisiones ya aprobadas en POST-RLS-G05 a POST-RLS-G10.

G11 deberá producir una especificación suficientemente precisa para que una migración posterior pueda generarse, revisarse, probarse y ejecutarse sin introducir decisiones funcionales implícitas.

## 3. Cadena de autoridad

La autoridad documental aplicable será:

1. POST-RLS-G05 — Modelo Funcional Canónico;
2. POST-RLS-G06 — Máquinas de Estados y Transiciones;
3. POST-RLS-G07 — RBAC y Segregación de Funciones;
4. POST-RLS-G08 — Discrepancias, Aclaraciones y Resoluciones;
5. POST-RLS-G09 — Persistencia Física y Modelo de Datos;
6. POST-RLS-G10 — DDL Canónico y Reglas de Integridad Física;
7. POST-RLS-G11 — Especificación SQL Ejecutable y Plan de Migración Inicial.

G11 podrá resolver decisiones físicas deliberadamente diferidas en G10, pero no podrá modificar silenciosamente:

- entidades;
- cardinalidades;
- estados;
- transiciones;
- roles;
- capacidades;
- segregación de funciones;
- invariantes;
- reglas de cierre;
- semántica histórica;
- trazabilidad;
- evidencia;
- política de integridad aprobada.

## 4. Plataforma objetivo

### G11-P01 — Motor relacional

La plataforma objetivo será PostgreSQL.

La implementación deberá conservar compatibilidad con una arquitectura desplegable sobre Supabase.

La versión exacta de PostgreSQL disponible en el entorno objetivo deberá verificarse antes de aprobar SQL productivo.

### G11-P02 — Supabase

Supabase se considera plataforma candidata de ejecución y operación.

La presente especificación no presume todavía:

- versión exacta de PostgreSQL;
- extensiones instaladas;
- configuración de Auth;
- configuración de Storage;
- políticas RLS existentes;
- funciones instaladas;
- triggers existentes;
- esquema productivo previo;
- permisos efectivos;
- secretos;
- variables de entorno.

Estos elementos deberán inventariarse antes de la primera ejecución real.

### G11-P03 — SQL portable dentro de PostgreSQL

Cuando sea razonable, el SQL estructural deberá apoyarse en capacidades estándar de PostgreSQL y evitar dependencias innecesarias de proveedor.

Las capacidades específicas de Supabase deberán aislarse y documentarse.

### G11-P04 — Separación estructural y de seguridad

La existencia de una tabla o FK no otorgará por sí misma autorización funcional.

La seguridad deberá mantener separación entre:

- integridad estructural;
- autorización;
- RBAC;
- SoD;
- RLS;
- autenticación;
- lógica transaccional.

## 5. Baseline estructural heredada

G11 hereda de G10, como mínimo:

- 23 entidades canónicas;
- 23 claves primarias;
- 43 claves foráneas;
- 12 restricciones UQ;
- 10 restricciones CHECK;
- política base `ON DELETE RESTRICT`;
- política base `ON UPDATE RESTRICT`;
- 18 índices candidatos;
- 8 niveles candidatos de materialización;
- 6 fases de materialización;
- separación entre integridad declarativa e integridad procedural;
- protección de historia;
- denegación estructural;
- prohibición de cascadas destructivas implícitas.

Estas cantidades constituyen controles de regresión y no deberán alterarse sin una decisión arquitectónica explícita posterior.

## 6. Decisiones físicas que G11 deberá cerrar

G11 deberá resolver expresamente:

### G11-D01 — Convención de nombres

Definir nomenclatura física para:

- tablas;
- columnas;
- PK;
- FK;
- UQ;
- CHECK;
- índices;
- funciones;
- triggers;
- políticas RLS;
- migraciones.

### G11-D02 — Tipo de identificador

Determinar la representación física de las PK y FK técnicas.

Deberá decidirse explícitamente entre alternativas compatibles con PostgreSQL, evitando mezclar estrategias sin fundamento.

### G11-D03 — Generación de identificadores

Si se adopta UUID, deberá determinarse:

- mecanismo de generación;
- disponibilidad de la función requerida;
- dependencia de extensión, si existiera;
- comportamiento en migraciones y pruebas.

### G11-D04 — Temporalidad

Definir uso de:

- `date`;
- `timestamp`;
- `timestamptz`;

según significado funcional.

No deberá utilizarse un tipo temporal únicamente por conveniencia.

### G11-D05 — JSON

El uso de `jsonb` deberá restringirse a información cuya estructura variable lo justifique.

No deberá utilizarse `jsonb` para evitar modelado relacional de datos estructurados y estables.

### G11-D06 — Booleanos y estados

Los estados de negocio no deberán modelarse mediante booleanos cuando exista una máquina de estados canónica.

Los booleanos se reservarán para propiedades genuinamente binarias.

### G11-D07 — Defaults

Los valores por defecto deberán ser exclusivamente técnicos o semánticamente seguros.

Un `DEFAULT` no deberá crear implícitamente:

- autorización;
- estado válido;
- actor;
- relación;
- resultado;
- resolución.

### G11-D08 — RESTRICT y NO ACTION

Deberá determinarse la representación física exacta de la política referencial aprobada en G10, distinguiendo la semántica de PostgreSQL para `RESTRICT` y `NO ACTION`.

La elección deberá quedar documentada antes de generar la migración.

### G11-D09 — FK circulares

Las dependencias potencialmente circulares deberán resolverse mediante un orden verificable de creación y, cuando proceda, incorporación posterior de constraints.

No deberá eliminarse integridad funcional para simplificar una migración.

### G11-D10 — Referencia polimórfica

La semántica de `vinculo_evidencia` deberá recibir una estrategia física explícita.

No deberá considerarse una pareja `entity_type + entity_id` equivalente a una FK relacional ordinaria sin un mecanismo adicional de integridad.

### G11-D11 — Append-only

Deberá definirse cómo materializar posteriormente la inmutabilidad de:

- `evento_trazabilidad`;
- vínculos probatorios cuando aplique;
- otros registros históricos expresamente identificados.

### G11-D12 — ER-T07

La protección ejecutable del cierre agregado deberá diseñarse sin contradecir SM-ER ni SM-DIS.

### G11-D13 — Transacciones

Deberá definirse qué operaciones requieren atomicidad multi-entidad.

### G11-D14 — Concurrencia

Deberán identificarse los puntos donde la concurrencia pueda producir:

- doble resolución;
- doble secuencia;
- transición inválida;
- asignación simultánea incompatible;
- cierre inconsistente.

### G11-D15 — Rollback

Toda migración deberá disponer de estrategia explícita de reversión o declarar formalmente por qué una operación no es reversiblemente segura.

## 7. Separación de artefactos

G11 distinguirá al menos cuatro capas:

### Capa A — Especificación

Documento normativo-técnico que define qué SQL debe existir y por qué.

### Capa B — Migración estructural

DDL destinado a crear:

- esquemas;
- tablas;
- PK;
- FK;
- UQ;
- CHECK;
- índices estructurales.

### Capa C — Integridad procedural

Funciones, triggers o mecanismos transaccionales necesarios para invariantes no expresables mediante constraints simples.

### Capa D — Seguridad

RLS, integración con identidad, claims y políticas de acceso.

Estas capas no deberán mezclarse sin justificación explícita.

## 8. Estrategia de migración

La migración inicial deberá diseñarse conceptualmente en este orden:

1. prerrequisitos verificados;
2. esquema o namespace;
3. tipos y dominios necesarios;
4. tablas raíz;
5. tablas dependientes;
6. PK;
7. UQ y CHECK;
8. FK no circulares;
9. FK diferidas por dependencia;
10. índices;
11. seeds estructurales;
12. validaciones post-migración.

La secuencia definitiva deberá derivarse del grafo real de dependencias.

## 9. Política de seeds

Los seeds se clasificarán antes de implementarse.

Podrán existir:

- catálogos técnicos;
- estados de SM-ER;
- estados de SM-DIS;
- transiciones;
- roles canónicos;
- capacidades canónicas;
- asociaciones Rol→Capacidad;
- configuración mínima.

Los seeds no deberán incluir datos operativos municipales ni información de producción.

## 10. Política de pruebas

La futura migración deberá probar, como mínimo:

- instalación desde base vacía;
- idempotencia cuando corresponda;
- constraints;
- FK;
- UQ;
- CHECK;
- política de borrado;
- política de actualización;
- seeds;
- rechazo de estados inválidos;
- rechazo de relaciones inválidas;
- consistencia de rollback;
- repetibilidad del entorno de prueba.

## 11. Frontera de G11-B00

G11-B00 no implementa todavía:

- archivos `.sql`;
- migraciones ejecutables;
- cambios en Supabase;
- tablas reales;
- Auth;
- Storage;
- RLS;
- funciones;
- triggers;
- RPC;
- seeds ejecutables;
- cambios de `app.js`;
- frontend;
- Service Worker;
- caché;
- despliegues.

Su alcance es establecer autoridad, plataforma, decisiones pendientes y frontera de implementación.

## 12. Criterios de aceptación de G11-B00

G11-B00 se considerará completo cuando:

- la plataforma objetivo esté identificada;
- PostgreSQL y Supabase estén correctamente diferenciados;
- la cadena de autoridad G05→G11 sea explícita;
- se preserve la baseline G10;
- estén identificadas las decisiones físicas pendientes;
- exista separación entre DDL, integridad procedural y seguridad;
- exista estrategia conceptual de migración;
- exista política inicial de seeds;
- exista política mínima de pruebas;
- no se haya generado SQL ejecutable.

## 13. Resultado esperado

Al cierre de G11-B00 deberá existir una frontera suficientemente precisa para iniciar la especificación física ejecutable sin introducir decisiones de implementación no gobernadas.

---

**Estado:** Propuesta para revisión.
**Serie:** CATU E-R 0.2.x.
**Gate:** POST-RLS-G11.
**Naturaleza:** especificación de implementación / PostgreSQL / migraciones / integridad física.

## 14. Convenciones físicas PostgreSQL

### 14.1 Propósito

G11-B01 establece las convenciones físicas obligatorias que deberán gobernar la futura traducción de las 23 entidades canónicas de CATU E-R a PostgreSQL.

Estas convenciones resuelven las decisiones G11-D01 a G11-D07 y establecen criterios complementarios para nulabilidad, texto, números, temporalidad y metadatos técnicos.

G11-B01 no genera SQL ejecutable.

### G11-CNV01 — Identificadores SQL

Los identificadores físicos deberán utilizar:

- minúsculas;
- caracteres ASCII;
- `snake_case`;
- nombres semánticos;
- ausencia de espacios;
- ausencia de caracteres acentuados;
- ausencia de comillas dobles como mecanismo ordinario de identificación.

No deberán utilizarse nombres dependientes de mayúsculas/minúsculas mediante quoted identifiers.

### G11-CNV02 — Tablas

Los nombres de tablas conservarán el nombre lógico singular aprobado en G09/G10.

Ejemplos canónicos:

- `municipio`;
- `periodo_entrega_recepcion`;
- `unidad_administrativa`;
- `actor_funcional`;
- `discrepancia`;
- `evento_trazabilidad`.

No se pluralizarán físicamente las tablas.

### G11-CNV03 — Columnas

Las columnas utilizarán `snake_case`.

Las claves primarias técnicas seguirán la forma:

`<entidad>_id`

Las claves foráneas deberán conservar un nombre que identifique inequívocamente la entidad referenciada o el significado contextual aprobado.

No se utilizará el nombre genérico `id` como PK canónica de CATU E-R.

### G11-CNV04 — Nombres de constraints

Se adopta la siguiente convención:

- PK: `pk_<tabla>`;
- FK: `fk_<tabla>__<columna_fk>`;
- UQ: `uq_<tabla>__<columnas>`;
- CHECK: `ck_<tabla>__<regla>`;
- índice: `ix_<tabla>__<columnas>`.

Cuando una restricción utilice varias columnas, el nombre físico deberá incorporar únicamente las necesarias para mantener trazabilidad y legibilidad.

Los nombres deberán ser deterministas y reproducibles.

### G11-CNV05 — Longitud de identificadores

Los nombres físicos deberán diseñarse para permanecer dentro del límite soportado por PostgreSQL.

No deberá dependerse de truncamiento silencioso para distinguir constraints, índices u objetos.

Si un nombre canónico completo resulta excesivo, deberá emplearse una abreviatura gobernada y documentada.

### G11-CNV06 — Tipo técnico de PK y FK

Las claves técnicas de las entidades canónicas utilizarán el tipo nativo PostgreSQL:

`uuid`

Las FK que referencien dichas claves utilizarán igualmente `uuid`.

No deberán almacenarse UUID como `text`, `varchar` ni `char`.

Los códigos funcionales o de negocio no sustituirán a la PK técnica salvo decisión arquitectónica explícita.

### G11-CNV07 — Generación de UUID

La generación preferida será responsabilidad de la base de datos mediante una función UUID disponible y verificada en el entorno PostgreSQL objetivo.

Antes de generar SQL productivo deberá verificarse expresamente la disponibilidad efectiva del mecanismo seleccionado.

No se declarará todavía dependencia obligatoria de una extensión específica mientras el entorno Supabase/PostgreSQL no haya sido inventariado.

La futura migración deberá fallar de manera explícita si requiere una capacidad no disponible.

### G11-CNV08 — Separación PK / código de negocio

Cuando una entidad posea código funcional, éste deberá conservarse separadamente de la PK técnica.

La estructura conceptual será:

- `<entidad>_id` → identidad técnica;
- `codigo` o código funcional específico → identidad legible de negocio.

Las reglas UQ correspondientes deberán preservar los ámbitos de unicidad definidos en G10.

### G11-CNV09 — Texto

El tipo general para contenido textual será:

`text`

`varchar(n)` se utilizará únicamente cuando exista una longitud máxima que forme parte real de una regla del dominio.

No se utilizarán límites arbitrarios de longitud como sustituto de validación funcional.

### G11-CNV10 — Códigos

Los códigos funcionales podrán representarse mediante `text` acompañado de:

- `NOT NULL`, cuando proceda;
- UQ correspondiente;
- CHECK de formato cuando exista regla formal.

La semántica del código no deberá depender exclusivamente de la aplicación cliente.

### G11-CNV11 — Booleanos

`boolean` se reservará para propiedades genuinamente binarias.

No deberán representarse mediante booleanos:

- estados de SM-ER;
- estados de SM-DIS;
- resultados terminales;
- roles;
- capacidades;
- transiciones;
- autorizaciones complejas.

La ausencia de autorización nunca deberá interpretarse como `true` por default.

### G11-CNV12 — Enteros

Los valores enteros ordinarios utilizarán `integer` cuando su rango sea suficiente.

Se utilizará `bigint` para contadores técnicos cuya vida útil o crecimiento justifique un rango superior.

Los identificadores técnicos no utilizarán secuencias enteras mientras permanezca vigente la decisión UUID.

### G11-CNV13 — Numeric

Las cantidades que requieran precisión decimal exacta deberán utilizar `numeric(p,s)` cuando la precisión y escala constituyan parte conocida del dominio.

No deberá utilizarse `real` o `double precision` para importes monetarios o valores que requieran igualdad decimal exacta.

La precisión concreta deberá derivarse del atributo funcional correspondiente.

### G11-CNV14 — Fecha civil

Se utilizará `date` exclusivamente cuando el concepto represente una fecha civil sin hora ni zona temporal.

Ejemplos potenciales:

- fecha normativa;
- fecha documental;
- fecha de inicio o término cuando la hora no forme parte del significado.

La decisión deberá realizarse atributo por atributo.

### G11-CNV15 — Instantes temporales

Los instantes de operación, auditoría y trazabilidad utilizarán:

`timestamptz`

Esto comprende, cuando sean aplicables:

- `created_at`;
- `updated_at`;
- `occurred_at`;
- `evaluada_at`;
- `observada_at`;
- `validada_at`;
- `vigente_desde`;
- `vigente_hasta`;
- eventos de revocación.

No se utilizará `timestamp without time zone` para instantes auditables salvo justificación expresa.

### G11-CNV16 — Convención UTC

Los instantes deberán tratarse como valores absolutos.

La presentación en zona horaria local será responsabilidad de la capa de presentación o de consultas explícitamente contextualizadas.

La persistencia no deberá depender de la zona horaria del dispositivo cliente.

### G11-CNV17 — JSONB

`jsonb` podrá utilizarse sólo cuando exista información:

- semiestructurada;
- extensible;
- técnica;
- cuya variabilidad justifique no normalizarla.

No deberá utilizarse `jsonb` para:

- sustituir las 23 entidades canónicas;
- ocultar relaciones;
- sustituir FK;
- almacenar estados sin control;
- evadir UQ o CHECK;
- encapsular datos relacionales estables.

### G11-CNV18 — NOT NULL

La obligatoriedad física deberá derivarse de la cardinalidad y reglas aprobadas en G09/G10.

Toda columna obligatoria conceptualmente deberá tender a `NOT NULL`, salvo que exista una razón documentada para diferir su obligatoriedad.

`NULL` significará ausencia de valor, no valor desconocido de manera genérica ni estado funcional implícito.

### G11-CNV19 — Defaults permitidos

Podrán utilizarse defaults exclusivamente cuando sean técnicamente seguros y no alteren semántica de negocio.

Candidatos admisibles, sujetos a validación del atributo:

- generación de UUID;
- `created_at` con tiempo de base de datos;
- valor inicial técnico de `row_version`;
- valores técnicos inequívocos.

### G11-CNV20 — Defaults prohibidos

No deberá asignarse automáticamente por `DEFAULT`:

- municipio;
- periodo;
- unidad administrativa;
- actor;
- rol;
- capacidad;
- autorización;
- estado funcional;
- transición;
- discrepancia;
- resolución;
- resultado terminal;
- decisión de solventación;
- identidad de usuario.

Todo valor de negocio deberá surgir de una actuación explícita o regla previamente aprobada.

### G11-CNV21 — created_at

Cuando una entidad requiera momento de creación, `created_at` utilizará `timestamptz`.

Su valor podrá originarse en el reloj de la base de datos.

No deberá confiarse en la hora enviada por el cliente para constituir evidencia primaria de creación.

### G11-CNV22 — updated_at

`updated_at`, cuando exista, representará la última modificación permitida del registro.

Su actualización automática requerirá posteriormente un mecanismo explícito y probado.

G11-B01 no autoriza todavía triggers para mantener `updated_at`.

### G11-CNV23 — row_version

`row_version` será un contador técnico destinado a control optimista de concurrencia cuando la entidad sea mutable.

Su incremento efectivo deberá definirse en una fase posterior de integridad procedural o capa transaccional.

No deberá confundirse con versión funcional del documento o expediente.

### G11-CNV24 — Registros append-only

Una entidad declarada append-only no deberá incorporar semántica ordinaria de actualización destructiva.

Para estas entidades:

- `created_at` o `occurred_at` será relevante;
- `updated_at` podrá no ser aplicable;
- la corrección deberá realizarse mediante nuevo evento o actuación cuando así lo determine el modelo.

### G11-CNV25 — Soft delete

No se adopta `soft delete` de forma global.

Campos como `deleted_at` no deberán agregarse automáticamente a todas las tablas.

La conservación histórica se resolverá conforme a la semántica específica de cada entidad y a las reglas de inmutabilidad aprobadas.

### G11-CNV26 — Estado funcional

Los estados de SM-ER y SM-DIS deberán persistirse mediante relaciones explícitas al catálogo de estados aprobado.

No deberá almacenarse simultáneamente un segundo estado textual libre que pueda divergir de la FK canónica.

### G11-CNV27 — Enumeraciones

No se adoptarán PostgreSQL ENUM como mecanismo general para estados, roles o capacidades mientras éstos formen parte de catálogos gobernados y relaciones persistentes.

La decisión evita duplicar la fuente de verdad entre tipos físicos y catálogos funcionales.

### G11-CNV28 — Restricciones de dominio

Una regla susceptible de expresarse declarativamente mediante:

- tipo;
- `NOT NULL`;
- PK;
- FK;
- UQ;
- CHECK;

deberá preferir esa vía antes que una validación exclusivamente procedural.

Esto no autoriza a reinterpretar reglas funcionales complejas como CHECK artificiales.

### G11-CNV29 — Schema PostgreSQL

El namespace físico definitivo deberá declararse explícitamente antes de generar SQL ejecutable.

G11-B01 no presume que todas las entidades deban residir permanentemente en `public`.

La decisión deberá considerar:

- integración Supabase;
- seguridad;
- exposición de API;
- mantenibilidad;
- migraciones;
- RLS.

### G11-CNV30 — Palabras reservadas

No se utilizarán nombres físicos que requieran quoting por conflicto con palabras reservadas de PostgreSQL cuando exista una alternativa semánticamente adecuada.

### 14.2 Matriz de decisiones G11-D01→G11-D07

| Decisión | Resolución G11-B01 |
|---|---|
| G11-D01 Convención de nombres | `snake_case`, minúsculas, singular para tablas y nomenclatura determinista de constraints |
| G11-D02 Tipo de identificador | `uuid` nativo PostgreSQL para PK/FK técnicas |
| G11-D03 Generación de identificadores | generación en base de datos; función concreta sujeta a verificación del entorno |
| G11-D04 Temporalidad | `date` para fecha civil; `timestamptz` para instantes |
| G11-D05 JSON | `jsonb` restringido a información genuinamente semiestructurada |
| G11-D06 Booleanos y estados | `boolean` sólo para propiedades binarias; estados mediante catálogo/FK |
| G11-D07 Defaults | sólo defaults técnicos seguros; prohibidos defaults que creen semántica de negocio |

### 14.3 Decisiones deliberadamente pendientes

G11-B01 no cierra todavía:

- versión exacta de PostgreSQL;
- función UUID concreta disponible;
- schema físico definitivo;
- nombres físicos completos de las 23 tablas y todos sus atributos;
- tipos atributo por atributo;
- estrategia ejecutable `RESTRICT` versus `NO ACTION`;
- resolución física de referencias polimórficas;
- triggers;
- funciones;
- concurrencia ejecutable;
- RLS;
- migraciones;
- rollback ejecutable.

Estas decisiones deberán resolverse en gates posteriores antes de generar SQL productivo.

### 14.4 Criterios de aceptación G11-B01

G11-B01 se considerará completo cuando:

- existan 30 convenciones físicas G11-CNV;
- se cierre formalmente G11-D01 a G11-D07;
- se adopte `uuid` nativo para PK/FK técnicas;
- se diferencie `date` de `timestamptz`;
- se restrinja el uso de `jsonb`;
- se prohíba modelar estados complejos mediante booleanos;
- se definan defaults permitidos y prohibidos;
- exista política explícita de `NOT NULL`;
- se preserve la semántica append-only;
- no se adopte soft delete global;
- no se genere SQL ejecutable;
- las decisiones dependientes del entorno permanezcan identificadas como pendientes.

### 14.5 Resultado esperado

El cierre de G11-B01 deberá proporcionar un lenguaje físico uniforme para traducir posteriormente las 23 entidades canónicas a PostgreSQL sin introducir convenciones ad hoc durante la generación de DDL.

## 15. Matriz física canónica reconciliada con G10

### 15.1 Autoridad

Esta sección constituye la materialización documental directa de `POST-RLS-G10_DDL_0.2.0.md`.

G11 no podrá modificar nombres, clasificación, mutabilidad, temporalidad, criticidad ni identidad primaria aprobados en G10 sin una decisión arquitectónica explícita posterior.

### 15.2 Matriz canónica

| ID | Entidad lógica G10 | Tabla física | Clave primaria | Clase | Mutabilidad | Temporalidad | Criticidad |
|---|---|---|---|---|---|---|---|
| G10-M01 | MUNICIPIO | `municipio` | `municipio_id` | CAT | CM | V | A |
| G10-M02 | PERIODO_ENTREGA_RECEPCION | `periodo_entrega_recepcion` | `periodo_er_id` | CORE | CM | VH | A |
| G10-M03 | UNIDAD_ADMINISTRATIVA | `unidad_administrativa` | `unidad_id` | CAT | CM | VH | A |
| G10-M04 | ACTOR_FUNCIONAL | `actor_funcional` | `actor_id` | SEC | CM | VH | A |
| G10-M05 | ACTO_ENTREGA_RECEPCION | `acto_entrega_recepcion` | `acto_er_id` | CORE | CM | VH | A |
| G10-M06 | OBJETO_REVISION | `objeto_revision` | `objeto_revision_id` | CORE | CM | VH | A |
| G10-M07 | ROL_FUNCIONAL | `rol_funcional` | `rol_id` | SEC | CM | VH | A |
| G10-M08 | CAPACIDAD_FUNCIONAL | `capacidad_funcional` | `capacidad_id` | SEC | CM | VH | A |
| G10-M09 | ROL_CAPACIDAD | `rol_capacidad` | `rol_capacidad_id` | SEC | CM | VH | A |
| G10-M10 | ASIGNACION_FUNCIONAL | `asignacion_funcional` | `asignacion_id` | SEC | CM | VH | A |
| G10-M11 | ESTADO_FUNCIONAL | `estado_funcional` | `estado_id` | CAT | IM | H | A |
| G10-M12 | TRANSICION_FUNCIONAL | `transicion_funcional` | `transicion_id` | CAT | IM | H | A |
| G10-M13 | CONTROL | `control` | `control_id` | CTL | CM | VH | M |
| G10-M14 | EVALUACION | `evaluacion` | `evaluacion_id` | CTL | CM | VH | M |
| G10-M15 | OBSERVACION | `observacion` | `observacion_id` | CTL | CM | VH | M |
| G10-M16 | VALIDACION | `validacion` | `validacion_id` | CTL | CM | VH | A |
| G10-M17 | EVIDENCIA | `evidencia` | `evidencia_id` | EVI | CM | VH | A |
| G10-M18 | DISCREPANCIA | `discrepancia` | `discrepancia_id` | DIS | CM | VH | A |
| G10-M19 | SOLICITUD_ACLARACION | `solicitud_aclaracion` | `solicitud_aclaracion_id` | DIS | AO | EV | A |
| G10-M20 | ACLARACION | `aclaracion` | `aclaracion_id` | DIS | AO | EV | A |
| G10-M21 | RESOLUCION | `resolucion` | `resolucion_id` | DIS | IM | H | A |
| G10-M22 | VINCULO_EVIDENCIA | `vinculo_evidencia` | `vinculo_evidencia_id` | EVI | AO | EV | A |
| G10-M23 | EVENTO_TRAZABILIDAD | `evento_trazabilidad` | `evento_id` | AUD | AO | EV | A |

### G11-B02R-R01 — Correspondencia exacta

Las 23 filas anteriores deberán corresponder exactamente a G10-M01..G10-M23.

### G11-B02R-R02 — No reinterpretación

G11 no añadirá entidades, clases, relaciones o identidades funcionales mediante inferencia.

### G11-B02R-R03 — Fuente normativa

Ante cualquier discrepancia entre una propuesta G11 anterior y POST-RLS-G10, prevalecerá G10 hasta que exista una modificación formalmente aprobada.

## 16. Diccionario físico canónico reconciliado

### 16.1 Propósito

Este diccionario traduce sin expansión semántica las estructuras físicas documentadas en POST-RLS-G10.

Para cada columna se conserva el dominio G10, se expone su tipo PostgreSQL candidato, la nulabilidad y la restricción conceptual aprobada.

Este bloque continúa siendo documental y no constituye DDL ejecutable.

### 16.2 G10-M01 — MUNICIPIO

#### Tabla `municipio`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `municipio_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `codigo` | `D_CODE` | `text` | NOT NULL | código administrativo único |
| `nombre` | `D_TEXT_REQ` | `text` | NOT NULL | denominación oficial |
| `activo` | `D_BOOL_REQ` | `boolean` | NOT NULL | vigencia funcional |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | última modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `municipio_id`.

### 16.3 G10-M02 — PERIODO_ENTREGA_RECEPCION

#### Tabla `periodo_entrega_recepcion`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `periodo_er_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `municipio_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `municipio.municipio_id` |
| `codigo` | `D_CODE` | `text` | NOT NULL | identificador funcional |
| `fecha_inicio` | `D_DATE_REQ` | `date` | NOT NULL | inicio del periodo |
| `fecha_fin` | `D_DATE_OPT` | `date` | NULL permitido | término previsto o efectivo |
| `estado_er_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | referencia a estado funcional |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `periodo_er_id`.

### 16.4 G10-M03 — UNIDAD_ADMINISTRATIVA

#### Tabla `unidad_administrativa`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `unidad_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `municipio_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `municipio.municipio_id` |
| `codigo` | `D_CODE` | `text` | NOT NULL | código institucional |
| `nombre` | `D_TEXT_REQ` | `text` | NOT NULL | denominación |
| `activo` | `D_BOOL_REQ` | `boolean` | NOT NULL | vigencia |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `unidad_id`.

### 16.5 G10-M04 — ACTOR_FUNCIONAL

#### Tabla `actor_funcional`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `actor_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `municipio_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | contexto institucional |
| `unidad_id` | `D_UUID_FK_OPT` | `uuid` | NULL permitido | adscripción opcional |
| `codigo` | `D_CODE` | `text` | NOT NULL | identificador funcional |
| `nombre` | `D_TEXT_REQ` | `text` | NOT NULL | denominación funcional |
| `activo` | `D_BOOL_REQ` | `boolean` | NOT NULL | vigencia |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `actor_id`.

### 16.6 G10-M05 — ACTO_ENTREGA_RECEPCION

#### Tabla `acto_entrega_recepcion`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `acto_er_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `periodo_er_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `periodo_entrega_recepcion.periodo_er_id` |
| `codigo` | `D_CODE` | `text` | NOT NULL | identificador funcional |
| `fecha_acto` | `D_DATE_REQ` | `date` | NOT NULL | fecha formal |
| `estado_er_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | estado vigente de SM-ER |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `acto_er_id`.

### 16.7 G10-M06 — OBJETO_REVISION

#### Tabla `objeto_revision`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `objeto_revision_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `acto_er_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `acto_entrega_recepcion.acto_er_id` |
| `unidad_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `unidad_administrativa.unidad_id` |
| `codigo` | `D_CODE` | `text` | NOT NULL | identificador del objeto |
| `tipo_objeto` | `D_CODE` | `text` | NOT NULL | clasificación funcional |
| `descripcion` | `D_TEXT_REQ` | `text` | NOT NULL | objeto sujeto a revisión |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `objeto_revision_id`.

### 16.8 G10-M07 — ROL_FUNCIONAL

#### Tabla `rol_funcional`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `rol_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `codigo` | `D_CODE` | `text` | NOT NULL | código canónico |
| `nombre` | `D_TEXT_REQ` | `text` | NOT NULL | denominación |
| `descripcion` | `D_TEXT_OPT` | `text` | NULL permitido | descripción funcional |
| `activo` | `D_BOOL_REQ` | `boolean` | NOT NULL | vigencia |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `rol_id`.

### 16.9 G10-M08 — CAPACIDAD_FUNCIONAL

#### Tabla `capacidad_funcional`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `capacidad_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `codigo` | `D_CODE` | `text` | NOT NULL | código canónico |
| `nombre` | `D_TEXT_REQ` | `text` | NOT NULL | denominación |
| `descripcion` | `D_TEXT_OPT` | `text` | NULL permitido | semántica funcional |
| `condicionada` | `D_BOOL_REQ` | `boolean` | NOT NULL | identifica capacidad E* |
| `activo` | `D_BOOL_REQ` | `boolean` | NOT NULL | vigencia |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `capacidad_id`.

### 16.10 G10-M09 — ROL_CAPACIDAD

#### Tabla `rol_capacidad`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `rol_capacidad_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `rol_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `rol_funcional.rol_id` |
| `capacidad_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `capacidad_funcional.capacidad_id` |
| `tipo_asignacion` | `D_CODE` | `text` | NOT NULL | E, E*, P, C o equivalente aprobado |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |

PK canónica: `rol_capacidad_id`.

### 16.11 G10-M10 — ASIGNACION_FUNCIONAL

#### Tabla `asignacion_funcional`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `asignacion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `actor_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `actor_funcional.actor_id` |
| `rol_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `rol_funcional.rol_id` |
| `periodo_er_id` | `D_UUID_FK_OPT` | `uuid` | NULL permitido | alcance temporal/contextual |
| `unidad_id` | `D_UUID_FK_OPT` | `uuid` | NULL permitido | alcance organizacional |
| `vigente_desde` | `D_TS_REQ` | `timestamptz` | NOT NULL | inicio |
| `vigente_hasta` | `D_TS_OPT` | `timestamptz` | NULL permitido | término |
| `revocada_at` | `D_TS_OPT` | `timestamptz` | NULL permitido | revocación |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `asignacion_id`.

### 16.12 G10-M11 — ESTADO_FUNCIONAL

#### Tabla `estado_funcional`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `estado_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `maquina_codigo` | `D_CODE` | `text` | NOT NULL | SM-ER o SM-DIS |
| `codigo` | `D_CODE` | `text` | NOT NULL | código canónico |
| `nombre` | `D_TEXT_REQ` | `text` | NOT NULL | denominación |
| `descripcion` | `D_TEXT_OPT` | `text` | NULL permitido | semántica |
| `es_inicial` | `D_BOOL_REQ` | `boolean` | NOT NULL | estado inicial |
| `es_terminal` | `D_BOOL_REQ` | `boolean` | NOT NULL | terminalidad |
| `orden_logico` | `D_INT_OPT` | `integer` | NULL permitido | orden documental |
| `activo` | `D_BOOL_REQ` | `boolean` | NOT NULL | vigencia del catálogo |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |

PK canónica: `estado_id`.

### 16.13 G10-M12 — TRANSICION_FUNCIONAL

#### Tabla `transicion_funcional`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `transicion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `maquina_codigo` | `D_CODE` | `text` | NOT NULL | SM-ER o SM-DIS |
| `codigo` | `D_CODE` | `text` | NOT NULL | identificador canónico |
| `nombre` | `D_TEXT_REQ` | `text` | NOT NULL | denominación |
| `estado_origen_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `estado_funcional.estado_id` |
| `estado_destino_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `estado_funcional.estado_id` |
| `capacidad_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | capacidad requerida |
| `activa` | `D_BOOL_REQ` | `boolean` | NOT NULL | vigencia |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |

PK canónica: `transicion_id`.

### 16.14 G10-M13 — CONTROL

#### Tabla `control`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `control_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `periodo_er_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | contexto ER |
| `codigo` | `D_CODE` | `text` | NOT NULL | identificador funcional |
| `nombre` | `D_TEXT_REQ` | `text` | NOT NULL | denominación |
| `descripcion` | `D_TEXT_OPT` | `text` | NULL permitido | alcance |
| `tipo_control` | `D_CODE` | `text` | NOT NULL | clasificación |
| `activo` | `D_BOOL_REQ` | `boolean` | NOT NULL | vigencia |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `control_id`.

### 16.15 G10-M14 — EVALUACION

#### Tabla `evaluacion`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `evaluacion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `control_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `control.control_id` |
| `objeto_revision_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `objeto_revision.objeto_revision_id` |
| `actor_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | evaluador |
| `resultado_codigo` | `D_CODE` | `text` | NOT NULL | resultado funcional |
| `comentario` | `D_TEXT_OPT` | `text` | NULL permitido | justificación |
| `evaluada_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | persistencia |

PK canónica: `evaluacion_id`.

### 16.16 G10-M15 — OBSERVACION

#### Tabla `observacion`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `observacion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `evaluacion_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `evaluacion.evaluacion_id` |
| `actor_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | autor |
| `tipo_observacion` | `D_CODE` | `text` | NOT NULL | clasificación |
| `contenido` | `D_TEXT_REQ` | `text` | NOT NULL | contenido sustantivo |
| `criticidad` | `D_CODE` | `text` | NOT NULL | nivel |
| `observada_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | persistencia |

PK canónica: `observacion_id`.

### 16.17 G10-M16 — VALIDACION

#### Tabla `validacion`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `validacion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `evaluacion_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `evaluacion.evaluacion_id` |
| `actor_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | validador |
| `resultado_codigo` | `D_CODE` | `text` | NOT NULL | resultado |
| `fundamento` | `D_TEXT_OPT` | `text` | NULL permitido | motivación |
| `validada_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | persistencia |

PK canónica: `validacion_id`.

### 16.18 G10-M17 — EVIDENCIA

#### Tabla `evidencia`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `evidencia_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `periodo_er_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | contexto de Entrega-Recepción |
| `actor_incorpora_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | actor que incorpora |
| `tipo_evidencia` | `D_CODE` | `text` | NOT NULL | clasificación |
| `nombre` | `D_TEXT_REQ` | `text` | NOT NULL | denominación |
| `descripcion` | `D_TEXT_OPT` | `text` | NULL permitido | descripción |
| `content_hash` | `D_TEXT_REQ` | `text` | NOT NULL | huella de integridad |
| `storage_locator` | `D_TEXT_REQ` | `text` | NOT NULL | referencia de almacenamiento |
| `mime_type` | `D_TEXT_OPT` | `text` | NULL permitido | tipo de contenido |
| `tamano_bytes` | `D_INT_OPT` | `integer` | NULL permitido | tamaño cuando aplique |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | incorporación |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia controlada |

PK canónica: `evidencia_id`.

### 16.19 G10-M18 — DISCREPANCIA

#### Tabla `discrepancia`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `discrepancia_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `acto_er_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `acto_entrega_recepcion.acto_er_id` |
| `objeto_revision_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `objeto_revision.objeto_revision_id` |
| `estado_dis_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | estado vigente de SM-DIS |
| `codigo` | `D_CODE` | `text` | NOT NULL | identificador funcional |
| `descripcion` | `D_TEXT_REQ` | `text` | NOT NULL | contenido sustantivo |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `discrepancia_id`.

### 16.20 G10-M19 — SOLICITUD_ACLARACION

#### Tabla `solicitud_aclaracion`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `solicitud_aclaracion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `discrepancia_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `discrepancia.discrepancia_id` |
| `actor_solicitante_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `actor_funcional.actor_id` |
| `secuencia` | `D_INT_REQ` | `integer` | NOT NULL | ordinal dentro de la Discrepancia |
| `motivo` | `D_TEXT_REQ` | `text` | NOT NULL | fundamento de la solicitud |
| `solicitada_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante de solicitud |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación persistente |

PK canónica: `solicitud_aclaracion_id`.

### 16.21 G10-M20 — ACLARACION

#### Tabla `aclaracion`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `aclaracion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `solicitud_aclaracion_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `solicitud_aclaracion.solicitud_aclaracion_id` |
| `actor_presenta_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `actor_funcional.actor_id` |
| `contenido` | `D_TEXT_REQ` | `text` | NOT NULL | respuesta sustantiva |
| `presentada_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante de presentación |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación persistente |

PK canónica: `aclaracion_id`.

### 16.22 G10-M21 — RESOLUCION

#### Tabla `resolucion`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `resolucion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `discrepancia_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `discrepancia.discrepancia_id` |
| `actor_resolutor_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `actor_funcional.actor_id` |
| `resultado_estado_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `estado_funcional.estado_id` |
| `fundamento` | `D_TEXT_REQ` | `text` | NOT NULL | motivación de la decisión |
| `resuelta_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante de resolución |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación persistente |

PK canónica: `resolucion_id`.

### 16.23 G10-M22 — VINCULO_EVIDENCIA

#### Tabla `vinculo_evidencia`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `vinculo_evidencia_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `evidencia_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `evidencia.evidencia_id` |
| `entity_type` | `D_CODE` | `text` | NOT NULL | tipo de entidad vinculada |
| `entity_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | identidad lógica vinculada |
| `uso_evidencia` | `D_CODE` | `text` | NOT NULL | finalidad probatoria |
| `actor_vincula_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | actor que crea vínculo |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante de vinculación |

PK canónica: `vinculo_evidencia_id`.

### 16.24 G10-M23 — EVENTO_TRAZABILIDAD

#### Tabla `evento_trazabilidad`

| Columna | Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `evento_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `periodo_er_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | contexto |
| `actor_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | actor causal |
| `transicion_id` | `D_UUID_FK_OPT` | `uuid` | NULL permitido | transición funcional cuando aplique |
| `estado_origen_id` | `D_UUID_FK_OPT` | `uuid` | NULL permitido | estado precedente |
| `estado_destino_id` | `D_UUID_FK_OPT` | `uuid` | NULL permitido | estado resultante |
| `entity_type` | `D_CODE` | `text` | NOT NULL | clase de entidad afectada |
| `entity_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | entidad afectada |
| `evento_tipo` | `D_CODE` | `text` | NOT NULL | clasificación |
| `occurred_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante causal |
| `correlation_id` | `D_UUID_FK_OPT` | `uuid` | NULL permitido | correlación de proceso |
| `causation_id` | `D_UUID_FK_OPT` | `uuid` | NULL permitido | evento causal precedente |
| `metadata` | `D_JSON_OPT` | `jsonb` | NULL permitido | metadatos complementarios |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | persistencia |

PK canónica: `evento_id`.

### 16.25 Reglas de reconciliación G11-B03R

#### G11-B03R-R01 — Autoridad de G10

La estructura atributo por atributo de esta sección deriva directamente de POST-RLS-G10.

#### G11-B03R-R02 — Cobertura cerrada

El diccionario deberá contener exactamente las 23 entidades canónicas aprobadas.

#### G11-B03R-R03 — Sin columnas inferidas

No se incorporarán columnas adicionales por conveniencia técnica o inferencia funcional durante G11-B03.

#### G11-B03R-R04 — Sin renombrado silencioso

Los nombres físicos aprobados en G10 no deberán renombrarse silenciosamente en G11.

#### G11-B03R-R05 — Dominios preservados

Todo atributo conservará el dominio físico G10 hasta que una decisión posterior formalmente aprobada disponga lo contrario.

#### G11-B03R-R06 — Constraints preservados

G11 preservará como baseline 23 PK, 43 FK, 17 UQ y 10 CHECK.

#### Reconciliación canónica de unicidades con POST-RLS-G10

La matriz física de G11 adopta como autoridad la baseline reconciliada de
POST-RLS-G10 y reconoce 17 restricciones de unicidad `G10-UQ01` a
`G10-UQ17`.

En particular:

- `G10-UQ02` — `unidad_administrativa(municipio_id, codigo)`;
- `G10-UQ03` — `actor_funcional(municipio_id, codigo)`;
- `G10-UQ13` — `municipio(codigo)`;
- `G10-UQ14` — `objeto_revision(acto_er_id, codigo)`;
- `G10-UQ15` — `discrepancia(acto_er_id, codigo)`;
- `G10-UQ16` — `aclaracion(solicitud_aclaracion_id)`;
- `G10-UQ17` — `resolucion(discrepancia_id)`.

Esta reconciliación sustituye únicamente la referencia cuantitativa previa de
unicidades y no modifica las 23 PK, 43 FK, 10 CHECK ni los 18 índices candidatos
definidos por la baseline física.

G11 no reinterpretará estas restricciones: su materialización ejecutable
deberá preservar exactamente la semántica aprobada en POST-RLS-G10.

#### G11-B03R-R07 — Relaciones diferidas a B04

La enumeración y materialización nominal de G10-FK01..G10-FK43 se realizará en G11-B04.

#### G11-B03R-R08 — No SQL ejecutable

G11-B03R no genera CREATE TABLE, ALTER TABLE, migraciones ni otro SQL ejecutable.

### 16.26 Conteos de control

| Elemento | Baseline |
|---|---:|
| Entidades | 23 |
| PK | 23 |
| FK | 43 |
| UQ | 12 |
| CHECK | 10 |
| Índices candidatos | 18 |

### 16.27 Resultado esperado

El cierre de G11-B03R deberá acreditar identidad estructural entre el diccionario físico de G11 y POST-RLS-G10, eliminando cualquier deriva introducida durante la descomposición documental de B02/B03.

## 17. Matriz física canónica de claves foráneas

### 17.1 Propósito

G11-B04 materializa documentalmente el catálogo completo de claves foráneas aprobado en POST-RLS-G10.

Las relaciones de esta sección conservan origen, columna FK, destino, cardinalidad y nulabilidad aprobados, sin introducir relaciones adicionales.

La política referencial base será `ON UPDATE RESTRICT` y `ON DELETE RESTRICT`, conforme a G10-CON05 y G10-CON06.

Esta sección no constituye todavía SQL ejecutable.

### 17.2 Matriz maestra G10-FK01..G10-FK43

| ID | Tabla origen | Columna FK | Tabla destino | Cardinalidad | Nulabilidad | ON UPDATE | ON DELETE |
|---|---|---|---|---|---|---|---|
| `G10-FK01` | `periodo_entrega_recepcion` | `municipio_id` | `municipio` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK02` | `unidad_administrativa` | `municipio_id` | `municipio` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK03` | `acto_entrega_recepcion` | `periodo_er_id` | `periodo_entrega_recepcion` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK04` | `objeto_revision` | `acto_er_id` | `acto_entrega_recepcion` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK05` | `objeto_revision` | `unidad_id` | `unidad_administrativa` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK06` | `discrepancia` | `acto_er_id` | `acto_entrega_recepcion` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK07` | `discrepancia` | `objeto_revision_id` | `objeto_revision` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK08` | `actor_funcional` | `municipio_id` | `municipio` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK09` | `actor_funcional` | `unidad_id` | `unidad_administrativa` | N:0..1 | NULL permitido | `RESTRICT` | `RESTRICT` |
| `G10-FK10` | `rol_capacidad` | `rol_id` | `rol_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK11` | `rol_capacidad` | `capacidad_id` | `capacidad_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK12` | `asignacion_funcional` | `actor_id` | `actor_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK13` | `asignacion_funcional` | `rol_id` | `rol_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK14` | `asignacion_funcional` | `periodo_er_id` | `periodo_entrega_recepcion` | N:0..1 | NULL permitido | `RESTRICT` | `RESTRICT` |
| `G10-FK15` | `asignacion_funcional` | `unidad_id` | `unidad_administrativa` | N:0..1 | NULL permitido | `RESTRICT` | `RESTRICT` |
| `G10-FK16` | `solicitud_aclaracion` | `discrepancia_id` | `discrepancia` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK17` | `solicitud_aclaracion` | `actor_solicitante_id` | `actor_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK18` | `aclaracion` | `solicitud_aclaracion_id` | `solicitud_aclaracion` | 0..1:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK19` | `aclaracion` | `actor_presenta_id` | `actor_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK20` | `resolucion` | `discrepancia_id` | `discrepancia` | 0..1:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK21` | `resolucion` | `actor_resolutor_id` | `actor_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK22` | `resolucion` | `resultado_estado_id` | `estado_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK23` | `evidencia` | `periodo_er_id` | `periodo_entrega_recepcion` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK24` | `evidencia` | `actor_incorpora_id` | `actor_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK25` | `vinculo_evidencia` | `evidencia_id` | `evidencia` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK26` | `vinculo_evidencia` | `actor_vincula_id` | `actor_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK27` | `evento_trazabilidad` | `periodo_er_id` | `periodo_entrega_recepcion` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK28` | `evento_trazabilidad` | `actor_id` | `actor_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK29` | `evento_trazabilidad` | `transicion_id` | `transicion_funcional` | N:0..1 | NULL permitido | `RESTRICT` | `RESTRICT` |
| `G10-FK30` | `evento_trazabilidad` | `estado_origen_id` | `estado_funcional` | N:0..1 | NULL permitido | `RESTRICT` | `RESTRICT` |
| `G10-FK31` | `evento_trazabilidad` | `estado_destino_id` | `estado_funcional` | N:0..1 | NULL permitido | `RESTRICT` | `RESTRICT` |
| `G10-FK32` | `evento_trazabilidad` | `causation_id` | `evento_trazabilidad` | N:0..1 | NULL permitido | `RESTRICT` | `RESTRICT` |
| `G10-FK33` | `transicion_funcional` | `estado_origen_id` | `estado_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK34` | `transicion_funcional` | `estado_destino_id` | `estado_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK35` | `transicion_funcional` | `capacidad_id` | `capacidad_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK36` | `control` | `periodo_er_id` | `periodo_entrega_recepcion` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK37` | `evaluacion` | `control_id` | `control` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK38` | `evaluacion` | `objeto_revision_id` | `objeto_revision` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK39` | `evaluacion` | `actor_id` | `actor_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK40` | `observacion` | `evaluacion_id` | `evaluacion` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK41` | `observacion` | `actor_id` | `actor_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK42` | `validacion` | `evaluacion_id` | `evaluacion` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |
| `G10-FK43` | `validacion` | `actor_id` | `actor_funcional` | N:1 | NOT NULL | `RESTRICT` | `RESTRICT` |

### 17.3 Reglas de materialización referencial

#### G11-B04-R01 — Catálogo cerrado

G11-B04 reconoce exactamente 43 claves foráneas canónicas, identificadas como G10-FK01..G10-FK43.

#### G11-B04-R02 — Autoridad de G10

Origen, columna FK, destino y cardinalidad deberán corresponder exactamente a POST-RLS-G10.

#### G11-B04-R03 — Nulabilidad preservada

Una FK sólo podrá admitir NULL cuando la definición física aprobada en G10 lo permita expresamente.

#### G11-B04-R04 — Actualización restrictiva

Toda FK canónica utilizará como política base `ON UPDATE RESTRICT`.

#### G11-B04-R05 — Borrado restrictivo

Toda FK canónica utilizará como política base `ON DELETE RESTRICT`.

#### G11-B04-R06 — Sin cascada destructiva

No se autoriza `ON DELETE CASCADE` para las relaciones canónicas de esta baseline.

#### G11-B04-R07 — Integridad no trivial

La existencia de una FK no sustituirá las reglas contextuales, RBAC, SoD, máquinas de estado o precondiciones transaccionales definidas en G10.

#### G11-B04-R08 — Referencias polimórficas

Las referencias polimórficas `entity_type + entity_id` no deberán inventarse como una FK convencional única.

#### G11-B04-R09 — Historia protegida

Una relación referencial no deberá habilitar destrucción silenciosa de historia sustantiva.

#### G11-B04-R10 — No SQL ejecutable

B04 documenta el contrato referencial; la generación de constraints SQL ejecutables permanece diferida.

### 17.4 Clasificación por obligatoriedad

- FK obligatorias documentadas: **36**.
- FK opcionales documentadas: **7**.
- Total: **43**.

### 17.5 Frontera de G11-B04

G11-B04 no implementa todavía:

- `ALTER TABLE ... ADD CONSTRAINT`;
- migraciones SQL;
- triggers;
- políticas RLS;
- funciones de autorización;
- integridad polimórfica ejecutable;
- locking;
- despliegue contra Supabase.

### 17.6 Resultado esperado

El cierre de G11-B04 deberá acreditar que las 43 relaciones canónicas de G10 se encuentran representadas exactamente una vez y conservan sus propiedades referenciales básicas.
