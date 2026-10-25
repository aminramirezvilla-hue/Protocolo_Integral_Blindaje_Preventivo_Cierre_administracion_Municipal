# CATU E-R — DDL Canónico y Reglas de Integridad Física 0.2.0

## 1. Identificación

- Producto: CATU E-R — Blindaje Preventivo Municipal
- Serie: 0.2.x
- Baseline funcional precedente: POST-RLS-G09
- Baseline de origen: `dev/v0.2.0`
- Rama: `docs/post-rls-g10-ddl-v0.2.0`
- Gate: `POST-RLS-G10`
- Naturaleza: documental / DDL / integridad física / persistencia relacional
- Estado inicial: propuesta para revisión

## 2. Propósito

Definir la especificación canónica de estructuras relacionales y reglas de integridad física necesarias para materializar el modelo de persistencia aprobado en POST-RLS-G09.

POST-RLS-G10 transformará el modelo lógico y físico candidato de G09 en una especificación DDL suficientemente precisa para permitir posteriormente la generación controlada de migraciones ejecutables.

Este gate no modificará todavía bases de datos, runtime, frontend, Service Worker, caché ni despliegues productivos.

## 3. Principios rectores

### G10-P01 — Fidelidad al modelo aprobado

Toda estructura física deberá derivarse de entidades, relaciones, cardinalidades, restricciones e invariantes aprobadas en POST-RLS-G09.

### G10-P02 — Integridad antes que conveniencia

Las restricciones susceptibles de expresarse declarativamente deberán preferirse sobre validaciones exclusivamente procedimentales.

### G10-P03 — No pérdida histórica

La implementación física no deberá permitir sobrescritura o destrucción silenciosa de historia sustantiva.

### G10-P04 — Denegación estructural

La ausencia de una relación, capacidad o autorización requerida no deberá interpretarse como autorización implícita.

### G10-P05 — Trazabilidad causal

Los eventos relevantes deberán conservar identidad, actor, temporalidad, causalidad y correlación suficientes para reconstruir la secuencia de actuación.

### G10-P06 — Separación de responsabilidades

El DDL no deberá asumir funciones de autorización que correspondan a RBAC, RLS, aplicación o capa de servicios.

### G10-P07 — Evolución controlada

Las estructuras deberán permitir migraciones futuras sin reinterpretar silenciosamente el significado histórico de los registros existentes.

## 4. Frontera de POST-RLS-G10

POST-RLS-G10 definirá:

- nombres físicos definitivos;
- tipos de datos;
- claves primarias;
- claves foráneas;
- nulabilidad;
- unicidad;
- restricciones `CHECK`;
- reglas referenciales;
- estrategia de borrado;
- temporalidad;
- versionado optimista;
- trazabilidad;
- índices candidatos;
- orden de creación;
- restricciones que requieren mecanismos superiores al DDL declarativo;
- criterios de aceptación para una futura migración.

POST-RLS-G10 no implementará todavía:

- migraciones ejecutables;
- despliegue contra Supabase;
- políticas RLS productivas;
- triggers productivos;
- RPC productivas;
- seed productivo;
- cambios de `app.js`;
- cambios HTML/CSS;
- Service Worker;
- caché;
- sincronización multiusuario;
- publicación de versión.


## 5. Matriz canónica de materialización

La presente matriz constituye el puente normativo entre las entidades lógicas aprobadas en POST-RLS-G09 y las futuras estructuras DDL.

La existencia de una fila en esta matriz no implica todavía la creación física de la tabla ni determina por sí misma el tipo SQL de sus atributos.

### 5.1 Convenciones de materialización

Se utilizarán las siguientes clasificaciones:

- `CAT` — catálogo o referencia relativamente estable;
- `CORE` — entidad nuclear del proceso de Entrega-Recepción;
- `SEC` — entidad de autorización, roles o capacidades;
- `CTL` — entidad de control, evaluación o validación;
- `DIS` — entidad perteneciente al ciclo de Discrepancias;
- `EVI` — entidad de evidencia y vinculación probatoria;
- `AUD` — entidad de trazabilidad o auditoría.

Mutabilidad:

- `M` — mutable bajo reglas controladas;
- `CM` — mutable condicionalmente;
- `AO` — append-only;
- `IM` — inmutable una vez consolidada.

Temporalidad:

- `V` — estado vigente;
- `H` — histórico;
- `VH` — vigente con conservación histórica;
- `EV` — orientada a evento.

Criticidad:

- `A` — alta;
- `M` — media;
- `B` — baja.

### 5.2 Matriz de las 23 entidades canónicas

| ID | Entidad lógica G09 | Tabla física candidata | Clave primaria lógica | Clase | Mutabilidad | Temporalidad | Criticidad |
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

### 5.3 Reglas de identidad física

#### G10-I01 — Correspondencia unívoca

Cada entidad canónica de POST-RLS-G09 deberá disponer de exactamente una identidad física principal en G10.

La existencia de tablas auxiliares futuras no deberá alterar la identidad semántica de la entidad original.

#### G10-I02 — Clave primaria explícita

Toda tabla deberá disponer de una clave primaria explícita, estable y no reutilizable.

La tecnología concreta de generación de identificadores se definirá en una sección posterior de POST-RLS-G10.

#### G10-I03 — Identidad independiente de atributos de negocio

Los códigos administrativos, nombres, folios, números consecutivos o descripciones no deberán utilizarse por sí solos como identidad física primaria.

#### G10-I04 — No reutilización

Una identidad previamente utilizada no deberá reasignarse a una entidad distinta, aun cuando el registro original deje de encontrarse vigente.

#### G10-I05 — Persistencia histórica

Las entidades clasificadas `AO`, `IM`, `H` o `EV` deberán preservar su significado histórico y no podrán ser sustituidas silenciosamente por otro registro con la misma identidad.

### 5.4 Reglas preliminares de mutabilidad

La clasificación de mutabilidad de esta matriz representa el régimen mínimo permitido:

- `AO` prohíbe actualización ordinaria destructiva;
- `IM` prohíbe modificación sustantiva después de consolidación;
- `CM` exige condiciones explícitas para cada modificación;
- ninguna clasificación autoriza borrado físico de historia sustantiva.

Las reglas específicas de `INSERT`, `UPDATE` y `DELETE` serán formalizadas posteriormente en POST-RLS-G10.


## 6. Tipos físicos canónicos y dominios

### 6.1 Principios de tipado físico

#### G10-T01 — Identificadores primarios

Las claves primarias técnicas de las entidades canónicas utilizarán conceptualmente el tipo PostgreSQL `uuid`.

La generación efectiva del identificador deberá producir valores globalmente únicos y no depender de secuencias de negocio.

La función concreta de generación será fijada antes de producir migraciones ejecutables.

#### G10-T02 — Identificadores foráneos

Toda clave foránea que referencie una entidad identificada mediante `uuid` utilizará el mismo tipo físico.

No se permitirán conversiones implícitas entre identificadores incompatibles.

#### G10-T03 — Texto de longitud variable

Los atributos textuales cuya longitud máxima no constituya una regla sustantiva utilizarán `text`.

No se utilizará `varchar(n)` únicamente por convención técnica cuando no exista una restricción funcional real sobre `n`.

#### G10-T04 — Códigos controlados

Los códigos canónicos de estados, roles, capacidades, transiciones y demás catálogos funcionales utilizarán `text` acompañado de restricciones `UNIQUE`, `NOT NULL` y, cuando corresponda, `CHECK`.

#### G10-T05 — Booleanos

Los atributos binarios utilizarán `boolean`.

Cuando la ausencia de valor tenga significado distinto de `false`, la nulabilidad deberá documentarse expresamente.

#### G10-T06 — Enteros

Los contadores, secuencias funcionales y ordinales utilizarán `integer` cuando su rango esperado sea compatible.

No se emplearán enteros como identificadores primarios de las entidades canónicas definidas en G10.

#### G10-T07 — Temporalidad

Las fechas y horas que representen eventos, creación, actualización, vigencia o resolución utilizarán conceptualmente `timestamptz`.

La persistencia deberá conservar un instante inequívoco independientemente de la zona horaria de presentación.

#### G10-T08 — Fechas sin componente horario

Las fechas que representen exclusivamente un día calendario utilizarán `date`.

No deberán almacenarse como texto.

#### G10-T09 — Datos estructurados

`jsonb` sólo podrá utilizarse cuando:

- la estructura sea variable de forma legítima;
- no sustituya relaciones que requieran integridad referencial;
- no oculte atributos que deban ser consultables, restringibles o auditables como columnas ordinarias;
- exista justificación funcional expresa.

#### G10-T10 — Valores monetarios o decimales

Los valores monetarios o cantidades que requieran precisión decimal utilizarán `numeric(p,s)` con precisión y escala determinadas por regla de negocio.

No se utilizarán tipos de punto flotante para cantidades monetarias.

### 6.2 Dominios físicos base

| Dominio G10 | Tipo PostgreSQL candidato | Nulabilidad por defecto | Uso |
|---|---|---|---|
| `D_UUID_PK` | `uuid` | `NOT NULL` | clave primaria técnica |
| `D_UUID_FK_REQ` | `uuid` | `NOT NULL` | clave foránea obligatoria |
| `D_UUID_FK_OPT` | `uuid` | `NULL` permitido | clave foránea opcional |
| `D_CODE` | `text` | `NOT NULL` | código funcional o catálogo |
| `D_TEXT_REQ` | `text` | `NOT NULL` | texto funcional obligatorio |
| `D_TEXT_OPT` | `text` | `NULL` permitido | texto complementario |
| `D_BOOL_REQ` | `boolean` | `NOT NULL` | indicador binario obligatorio |
| `D_INT_REQ` | `integer` | `NOT NULL` | contador u ordinal obligatorio |
| `D_INT_OPT` | `integer` | `NULL` permitido | entero opcional |
| `D_DATE_REQ` | `date` | `NOT NULL` | fecha obligatoria |
| `D_DATE_OPT` | `date` | `NULL` permitido | fecha opcional |
| `D_TS_REQ` | `timestamptz` | `NOT NULL` | instante obligatorio |
| `D_TS_OPT` | `timestamptz` | `NULL` permitido | instante opcional |
| `D_JSON_OPT` | `jsonb` | `NULL` permitido | metadatos estructurados justificados |
| `D_NUMERIC` | `numeric(p,s)` | según atributo | cantidad decimal exacta |

### 6.3 Convención de claves primarias

Las 23 entidades canónicas utilizarán como PK física candidata:

| Tabla | PK | Dominio |
|---|---|---|
| `municipio` | `municipio_id` | `D_UUID_PK` |
| `periodo_entrega_recepcion` | `periodo_er_id` | `D_UUID_PK` |
| `unidad_administrativa` | `unidad_id` | `D_UUID_PK` |
| `actor_funcional` | `actor_id` | `D_UUID_PK` |
| `acto_entrega_recepcion` | `acto_er_id` | `D_UUID_PK` |
| `objeto_revision` | `objeto_revision_id` | `D_UUID_PK` |
| `rol_funcional` | `rol_id` | `D_UUID_PK` |
| `capacidad_funcional` | `capacidad_id` | `D_UUID_PK` |
| `rol_capacidad` | `rol_capacidad_id` | `D_UUID_PK` |
| `asignacion_funcional` | `asignacion_id` | `D_UUID_PK` |
| `estado_funcional` | `estado_id` | `D_UUID_PK` |
| `transicion_funcional` | `transicion_id` | `D_UUID_PK` |
| `control` | `control_id` | `D_UUID_PK` |
| `evaluacion` | `evaluacion_id` | `D_UUID_PK` |
| `observacion` | `observacion_id` | `D_UUID_PK` |
| `validacion` | `validacion_id` | `D_UUID_PK` |
| `evidencia` | `evidencia_id` | `D_UUID_PK` |
| `discrepancia` | `discrepancia_id` | `D_UUID_PK` |
| `solicitud_aclaracion` | `solicitud_aclaracion_id` | `D_UUID_PK` |
| `aclaracion` | `aclaracion_id` | `D_UUID_PK` |
| `resolucion` | `resolucion_id` | `D_UUID_PK` |
| `vinculo_evidencia` | `vinculo_evidencia_id` | `D_UUID_PK` |
| `evento_trazabilidad` | `evento_id` | `D_UUID_PK` |

### 6.4 Temporalidad transversal

Salvo excepción documentada, las entidades mutables o de vigencia deberán considerar:

- `created_at` — `D_TS_REQ`;
- `updated_at` — `D_TS_REQ` cuando exista mutabilidad;
- `row_version` — `D_INT_REQ` cuando se requiera control de concurrencia optimista.

Las entidades orientadas a evento o append-only deberán priorizar:

- `occurred_at` — `D_TS_REQ`;
- `created_at` — `D_TS_REQ`;
- `correlation_id` — `D_UUID_FK_OPT` o UUID causal equivalente;
- `causation_id` — `D_UUID_FK_OPT` o UUID causal equivalente.

La semántica exacta de `correlation_id` y `causation_id` se mantendrá alineada con POST-RLS-G09.

### 6.5 Regla de nulabilidad

#### G10-N01 — Obligatorio por semántica

Todo atributo necesario para establecer identidad, pertenencia, estado vigente, autoría, causalidad obligatoria o integridad referencial deberá declararse `NOT NULL`.

#### G10-N02 — Nulabilidad explícita

`NULL` sólo se permitirá cuando represente de manera válida uno de los siguientes casos:

- dato todavía no producido;
- relación verdaderamente opcional;
- evento aún no ocurrido;
- atributo no aplicable;
- decisión funcional explícitamente diferida.

#### G10-N03 — NULL no equivale a valor vacío

No deberá utilizarse indistintamente:

- `NULL`;
- cadena vacía;
- cero;
- `false`;
- código artificial como `N/A`;

para representar ausencia de información.

#### G10-N04 — FK opcional

Una FK nullable deberá corresponder a una cardinalidad opcional aprobada en G09.

La nulabilidad técnica no deberá alterar una cardinalidad funcional obligatoria.

### 6.6 Generación de identificadores

La estrategia candidata para PK `uuid` será generación automática por base de datos o por una capa de infraestructura autorizada.

La elección definitiva entre mecanismos como `gen_random_uuid()` u otra alternativa compatible con PostgreSQL/Supabase queda diferida hasta el gate que produzca DDL ejecutable.

No se autoriza todavía dependencia productiva de una extensión específica.

### 6.7 Prohibiciones de tipado

No se permitirá, salvo justificación expresa:

- almacenar UUID como texto;
- almacenar fechas como texto;
- almacenar booleanos como `0/1`, `S/N` o equivalentes textuales;
- utilizar `jsonb` para sustituir relaciones normalizables;
- utilizar `float` o `double precision` para cantidades monetarias;
- utilizar códigos de negocio como PK técnica;
- utilizar valores mágicos para sustituir `NULL`;
- reutilizar una identidad eliminada o histórica.


## 7. Esquema físico del núcleo transaccional

### 7.1 Criterio de diseño

El núcleo transaccional materializa la estructura mínima necesaria para identificar:

- municipio;
- periodo formal de Entrega-Recepción;
- unidad administrativa;
- acto de Entrega-Recepción;
- objeto sujeto a revisión;
- discrepancia derivada de la revisión.

Las definiciones de esta sección constituyen contratos físicos documentales. No representan todavía sentencias DDL ejecutables.

### 7.2 Tabla `municipio`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `municipio_id` | `D_UUID_PK` | NOT NULL | PK |
| `codigo` | `D_CODE` | NOT NULL | código administrativo único |
| `nombre` | `D_TEXT_REQ` | NOT NULL | denominación oficial |
| `activo` | `D_BOOL_REQ` | NOT NULL | vigencia funcional |
| `created_at` | `D_TS_REQ` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | NOT NULL | última modificación controlada |
| `row_version` | `D_INT_REQ` | NOT NULL | concurrencia optimista |

Reglas:

- `municipio_id` será PK;
- `codigo` deberá ser único;
- el código administrativo no sustituirá a la PK técnica;
- un municipio utilizado históricamente no deberá borrarse físicamente.

### 7.3 Tabla `periodo_entrega_recepcion`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `periodo_er_id` | `D_UUID_PK` | NOT NULL | PK |
| `municipio_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `municipio.municipio_id` |
| `codigo` | `D_CODE` | NOT NULL | identificador funcional |
| `fecha_inicio` | `D_DATE_REQ` | NOT NULL | inicio del periodo |
| `fecha_fin` | `D_DATE_OPT` | NULL permitido | término previsto o efectivo |
| `estado_er_id` | `D_UUID_FK_REQ` | NOT NULL | referencia a estado funcional |
| `created_at` | `D_TS_REQ` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | NOT NULL | concurrencia optimista |

Reglas:

- `periodo_er_id` será PK;
- `municipio_id` será FK obligatoria;
- la combinación `municipio_id + codigo` deberá ser única;
- `fecha_fin`, cuando exista, no podrá ser anterior a `fecha_inicio`;
- el estado vigente deberá corresponder a la máquina SM-ER aprobada en POST-RLS-G06.

### 7.4 Tabla `unidad_administrativa`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `unidad_id` | `D_UUID_PK` | NOT NULL | PK |
| `municipio_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `municipio.municipio_id` |
| `codigo` | `D_CODE` | NOT NULL | código institucional |
| `nombre` | `D_TEXT_REQ` | NOT NULL | denominación |
| `activo` | `D_BOOL_REQ` | NOT NULL | vigencia |
| `created_at` | `D_TS_REQ` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | NOT NULL | concurrencia optimista |

Reglas:

- `unidad_id` será PK;
- `municipio_id` será FK obligatoria;
- la combinación `municipio_id + codigo` deberá ser única;
- una unidad con referencias históricas no deberá eliminarse físicamente.

### 7.5 Tabla `acto_entrega_recepcion`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `acto_er_id` | `D_UUID_PK` | NOT NULL | PK |
| `periodo_er_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `periodo_entrega_recepcion.periodo_er_id` |
| `codigo` | `D_CODE` | NOT NULL | identificador funcional |
| `fecha_acto` | `D_DATE_REQ` | NOT NULL | fecha formal |
| `estado_er_id` | `D_UUID_FK_REQ` | NOT NULL | estado vigente de SM-ER |
| `created_at` | `D_TS_REQ` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | NOT NULL | concurrencia optimista |

Reglas:

- `acto_er_id` será PK;
- `periodo_er_id` será FK obligatoria;
- la combinación `periodo_er_id + codigo` deberá ser única;
- no podrá existir un Acto de Entrega-Recepción fuera de un periodo válido.

### 7.6 Tabla `objeto_revision`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `objeto_revision_id` | `D_UUID_PK` | NOT NULL | PK |
| `acto_er_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `acto_entrega_recepcion.acto_er_id` |
| `unidad_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `unidad_administrativa.unidad_id` |
| `codigo` | `D_CODE` | NOT NULL | identificador del objeto |
| `tipo_objeto` | `D_CODE` | NOT NULL | clasificación funcional |
| `descripcion` | `D_TEXT_REQ` | NOT NULL | objeto sujeto a revisión |
| `created_at` | `D_TS_REQ` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | NOT NULL | concurrencia optimista |

Reglas:

- `objeto_revision_id` será PK;
- `acto_er_id` será FK obligatoria;
- `unidad_id` será FK obligatoria;
- la combinación `acto_er_id + codigo` deberá ser única;
- el objeto deberá pertenecer a una unidad del mismo contexto municipal del periodo.

### 7.7 Tabla `discrepancia`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `discrepancia_id` | `D_UUID_PK` | NOT NULL | PK |
| `acto_er_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `acto_entrega_recepcion.acto_er_id` |
| `objeto_revision_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `objeto_revision.objeto_revision_id` |
| `estado_dis_id` | `D_UUID_FK_REQ` | NOT NULL | estado vigente de SM-DIS |
| `codigo` | `D_CODE` | NOT NULL | identificador funcional |
| `descripcion` | `D_TEXT_REQ` | NOT NULL | contenido sustantivo |
| `created_at` | `D_TS_REQ` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | NOT NULL | concurrencia optimista |

Reglas:

- `discrepancia_id` será PK;
- `acto_er_id`, `objeto_revision_id` y `estado_dis_id` serán obligatorios;
- la combinación `acto_er_id + codigo` deberá ser única;
- la Discrepancia deberá referirse a un objeto perteneciente al mismo Acto;
- su estado deberá pertenecer a SM-DIS;
- una Discrepancia terminal no podrá ser convertida silenciosamente a un estado no terminal.

### 7.8 Relaciones estructurales del núcleo

| ID | Origen | FK | Destino | Cardinalidad |
|---|---|---|---|---|
| G10-FK01 | `periodo_entrega_recepcion` | `municipio_id` | `municipio` | N:1 |
| G10-FK02 | `unidad_administrativa` | `municipio_id` | `municipio` | N:1 |
| G10-FK03 | `acto_entrega_recepcion` | `periodo_er_id` | `periodo_entrega_recepcion` | N:1 |
| G10-FK04 | `objeto_revision` | `acto_er_id` | `acto_entrega_recepcion` | N:1 |
| G10-FK05 | `objeto_revision` | `unidad_id` | `unidad_administrativa` | N:1 |
| G10-FK06 | `discrepancia` | `acto_er_id` | `acto_entrega_recepcion` | N:1 |
| G10-FK07 | `discrepancia` | `objeto_revision_id` | `objeto_revision` | N:1 |

### 7.9 Restricciones de coherencia contextual

#### G10-CX01 — Municipio del periodo

Todo `periodo_entrega_recepcion` deberá pertenecer exactamente a un municipio.

#### G10-CX02 — Unidad en contexto municipal

Una `unidad_administrativa` asociada a un `objeto_revision` deberá pertenecer al mismo municipio del periodo al que pertenece el Acto.

#### G10-CX03 — Objeto en contexto del Acto

Una `discrepancia` no podrá referenciar un `objeto_revision` perteneciente a otro Acto de Entrega-Recepción.

#### G10-CX04 — Estado de dominio correcto

`estado_er_id` sólo podrá referenciar estados de SM-ER.

`estado_dis_id` sólo podrá referenciar estados de SM-DIS.

#### G10-CX05 — Prohibición de borrado en cascada sustantivo

Ninguna de las relaciones del núcleo autorizará borrado físico en cascada que destruya:

- actos;
- objetos revisados;
- discrepancias;
- historia de estados;
- evidencia;
- trazabilidad.


## 8. Esquema físico de autorización, RBAC y segregación de funciones

### 8.1 Principios de materialización RBAC

El modelo físico de autorización deberá preservar las reglas funcionales definidas en POST-RLS-G07.

La autenticación de identidad y la autorización funcional permanecerán separadas.

La existencia de un usuario autenticado no implicará por sí misma ninguna capacidad operativa.

### 8.2 Tabla `actor_funcional`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `actor_id` | `D_UUID_PK` | NOT NULL | PK |
| `municipio_id` | `D_UUID_FK_REQ` | NOT NULL | contexto institucional |
| `unidad_id` | `D_UUID_FK_OPT` | NULL permitido | adscripción opcional |
| `codigo` | `D_CODE` | NOT NULL | identificador funcional |
| `nombre` | `D_TEXT_REQ` | NOT NULL | denominación funcional |
| `activo` | `D_BOOL_REQ` | NOT NULL | vigencia |
| `created_at` | `D_TS_REQ` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | NOT NULL | concurrencia optimista |

Reglas:

- `actor_id` será PK;
- `municipio_id` será obligatorio;
- `unidad_id`, cuando exista, deberá pertenecer al mismo municipio;
- la identidad funcional no dependerá de credenciales de autenticación;
- un actor histórico no deberá eliminarse físicamente.

### 8.3 Tabla `rol_funcional`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `rol_id` | `D_UUID_PK` | NOT NULL | PK |
| `codigo` | `D_CODE` | NOT NULL | código canónico |
| `nombre` | `D_TEXT_REQ` | NOT NULL | denominación |
| `descripcion` | `D_TEXT_OPT` | NULL permitido | descripción funcional |
| `activo` | `D_BOOL_REQ` | NOT NULL | vigencia |
| `created_at` | `D_TS_REQ` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | NOT NULL | concurrencia optimista |

Reglas:

- `rol_id` será PK;
- `codigo` deberá ser único;
- la desactivación no deberá destruir asignaciones históricas.

### 8.4 Tabla `capacidad_funcional`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `capacidad_id` | `D_UUID_PK` | NOT NULL | PK |
| `codigo` | `D_CODE` | NOT NULL | código canónico |
| `nombre` | `D_TEXT_REQ` | NOT NULL | denominación |
| `descripcion` | `D_TEXT_OPT` | NULL permitido | semántica funcional |
| `condicionada` | `D_BOOL_REQ` | NOT NULL | identifica capacidad E* |
| `activo` | `D_BOOL_REQ` | NOT NULL | vigencia |
| `created_at` | `D_TS_REQ` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | NOT NULL | concurrencia optimista |

Reglas:

- `capacidad_id` será PK;
- `codigo` deberá ser único;
- las capacidades condicionadas no deberán convertirse automáticamente en privilegios irrestrictos.

### 8.5 Tabla `rol_capacidad`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `rol_capacidad_id` | `D_UUID_PK` | NOT NULL | PK |
| `rol_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `rol_funcional.rol_id` |
| `capacidad_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `capacidad_funcional.capacidad_id` |
| `tipo_asignacion` | `D_CODE` | NOT NULL | E, E*, P, C o equivalente aprobado |
| `created_at` | `D_TS_REQ` | NOT NULL | creación |

Reglas:

- `rol_capacidad_id` será PK;
- `rol_id + capacidad_id` deberá ser único;
- la asociación no deberá crear capacidades no previstas en G07;
- la ausencia de asociación implicará denegación por defecto.

### 8.6 Tabla `asignacion_funcional`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `asignacion_id` | `D_UUID_PK` | NOT NULL | PK |
| `actor_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `actor_funcional.actor_id` |
| `rol_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `rol_funcional.rol_id` |
| `periodo_er_id` | `D_UUID_FK_OPT` | NULL permitido | alcance temporal/contextual |
| `unidad_id` | `D_UUID_FK_OPT` | NULL permitido | alcance organizacional |
| `vigente_desde` | `D_TS_REQ` | NOT NULL | inicio |
| `vigente_hasta` | `D_TS_OPT` | NULL permitido | término |
| `revocada_at` | `D_TS_OPT` | NULL permitido | revocación |
| `created_at` | `D_TS_REQ` | NOT NULL | creación |
| `row_version` | `D_INT_REQ` | NOT NULL | concurrencia optimista |

Reglas:

- `asignacion_id` será PK;
- la asignación deberá tener alcance explícito;
- no deberá presumirse alcance global cuando `periodo_er_id` o `unidad_id` sean requeridos por contexto;
- una asignación revocada permanecerá históricamente disponible;
- la revocación no implicará borrado físico.

### 8.7 Relaciones RBAC

| ID | Origen | FK | Destino | Cardinalidad |
|---|---|---|---|---|
| G10-FK08 | `actor_funcional` | `municipio_id` | `municipio` | N:1 |
| G10-FK09 | `actor_funcional` | `unidad_id` | `unidad_administrativa` | N:0..1 |
| G10-FK10 | `rol_capacidad` | `rol_id` | `rol_funcional` | N:1 |
| G10-FK11 | `rol_capacidad` | `capacidad_id` | `capacidad_funcional` | N:1 |
| G10-FK12 | `asignacion_funcional` | `actor_id` | `actor_funcional` | N:1 |
| G10-FK13 | `asignacion_funcional` | `rol_id` | `rol_funcional` | N:1 |
| G10-FK14 | `asignacion_funcional` | `periodo_er_id` | `periodo_entrega_recepcion` | N:0..1 |
| G10-FK15 | `asignacion_funcional` | `unidad_id` | `unidad_administrativa` | N:0..1 |

### 8.8 Reglas físicas derivadas de SoD

#### G10-SOD01 — Denegación por defecto

La ausencia de una relación válida Actor → Asignación → Rol → Capacidad deberá producir ausencia de autorización funcional.

#### G10-SOD02 — No acumulación automática

La pertenencia simultánea a varios roles no deberá implicar automáticamente la suma irrestricta de capacidades cuando exista una regla de incompatibilidad.

#### G10-SOD03 — No autoadministración sustantiva

Quien administre asignaciones RBAC no deberá adquirir por ese solo hecho capacidades operativas sustantivas.

#### G10-SOD04 — Control y auditoría sin operación implícita

Los roles de control, vigilancia, auditoría o consulta no deberán adquirir facultades de modificación ordinaria salvo autorización explícita.

#### G10-SOD05 — Capacidad condicionada

Las capacidades clasificadas como condicionadas requerirán validación adicional antes de convertirse en autorización efectiva.

#### G10-SOD06 — Revocación preservada

La revocación deberá impedir uso futuro de la asignación sin eliminar la evidencia histórica de su existencia.

#### G10-SOD07 — Alcance contextual

La autorización efectiva deberá considerar actor, rol, capacidad, periodo, unidad y contexto institucional aplicable.

#### G10-SOD08 — Autenticación separada

La identidad autenticada deberá resolverse separadamente de la autorización funcional.

### 8.9 Incompatibilidades y decisiones diferidas

La especificación física deberá soportar posteriormente una matriz explícita de incompatibilidades SoD.

G10 no define todavía:

- tabla productiva de incompatibilidades;
- políticas RLS;
- funciones SQL de autorización;
- triggers RBAC;
- resolución dinámica de capacidades;
- integración con proveedor de identidad;
- claims de autenticación;
- JWT productivo.

Estas decisiones deberán conservar las reglas sustantivas aprobadas en POST-RLS-G07.


## 9. Esquema físico del ciclo de Discrepancias, Aclaraciones y Resoluciones

### 9.1 Principio de persistencia del ciclo SM-DIS

La persistencia del ciclo SM-DIS deberá conservar la semántica aprobada en POST-RLS-G06, POST-RLS-G07, POST-RLS-G08 y POST-RLS-G09.

En particular:

- una Discrepancia puede originar cero o múltiples Solicitudes de Aclaración;
- cada Solicitud de Aclaración podrá producir como máximo una Aclaración ordinaria;
- una Discrepancia podrá tener como máximo una Resolución ordinaria final vigente;
- la Resolución ordinaria deberá conducir exclusivamente a uno de los estados terminales aprobados;
- ninguna actuación posterior podrá sobrescribir silenciosamente la historia precedente.

### 9.2 Tabla `solicitud_aclaracion`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `solicitud_aclaracion_id` | `D_UUID_PK` | NOT NULL | PK |
| `discrepancia_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `discrepancia.discrepancia_id` |
| `actor_solicitante_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `actor_funcional.actor_id` |
| `secuencia` | `D_INT_REQ` | NOT NULL | ordinal dentro de la Discrepancia |
| `motivo` | `D_TEXT_REQ` | NOT NULL | fundamento de la solicitud |
| `solicitada_at` | `D_TS_REQ` | NOT NULL | instante de solicitud |
| `created_at` | `D_TS_REQ` | NOT NULL | creación persistente |

Reglas:

- `solicitud_aclaracion_id` será PK;
- `discrepancia_id` será obligatoria;
- `actor_solicitante_id` deberá identificar al actor que promovió la actuación;
- `secuencia` deberá ser positiva;
- `discrepancia_id + secuencia` deberá ser único;
- una solicitud histórica no deberá eliminarse ni reescribirse para representar una solicitud posterior.

### 9.3 Tabla `aclaracion`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `aclaracion_id` | `D_UUID_PK` | NOT NULL | PK |
| `solicitud_aclaracion_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `solicitud_aclaracion.solicitud_aclaracion_id` |
| `actor_presenta_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `actor_funcional.actor_id` |
| `contenido` | `D_TEXT_REQ` | NOT NULL | respuesta sustantiva |
| `presentada_at` | `D_TS_REQ` | NOT NULL | instante de presentación |
| `created_at` | `D_TS_REQ` | NOT NULL | creación persistente |

Reglas:

- `aclaracion_id` será PK;
- `solicitud_aclaracion_id` deberá ser única en `aclaracion`;
- una Solicitud de Aclaración tendrá cardinalidad física `0..1` respecto de una Aclaración ordinaria;
- la Aclaración no sustituye ni modifica la Discrepancia original;
- quien presenta una Aclaración no adquiere por ese hecho facultad para resolver la misma Discrepancia.

### 9.4 Tabla `resolucion`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `resolucion_id` | `D_UUID_PK` | NOT NULL | PK |
| `discrepancia_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `discrepancia.discrepancia_id` |
| `actor_resolutor_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `actor_funcional.actor_id` |
| `resultado_estado_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `estado_funcional.estado_id` |
| `fundamento` | `D_TEXT_REQ` | NOT NULL | motivación de la decisión |
| `resuelta_at` | `D_TS_REQ` | NOT NULL | instante de resolución |
| `created_at` | `D_TS_REQ` | NOT NULL | creación persistente |

Reglas:

- `resolucion_id` será PK;
- `discrepancia_id` deberá ser única para la Resolución ordinaria prevista en G08;
- `resultado_estado_id` sólo podrá identificar:
  - `DIS-90A RESUELTA_SOLVENTADA`;
  - `DIS-90B RESUELTA_NO_SOLVENTADA`;
  - `DIS-90C RESUELTA_IMPROCEDENTE`;
- la Resolución deberá conservar actor, fundamento e instante inequívoco;
- una Resolución válida será histórica e inmutable;
- una revisión extraordinaria futura no deberá sobrescribir físicamente la Resolución original.

### 9.5 Relaciones del ciclo SM-DIS

| ID | Origen | FK | Destino | Cardinalidad |
|---|---|---|---|---|
| G10-FK16 | `solicitud_aclaracion` | `discrepancia_id` | `discrepancia` | N:1 |
| G10-FK17 | `solicitud_aclaracion` | `actor_solicitante_id` | `actor_funcional` | N:1 |
| G10-FK18 | `aclaracion` | `solicitud_aclaracion_id` | `solicitud_aclaracion` | 0..1:1 |
| G10-FK19 | `aclaracion` | `actor_presenta_id` | `actor_funcional` | N:1 |
| G10-FK20 | `resolucion` | `discrepancia_id` | `discrepancia` | 0..1:1 |
| G10-FK21 | `resolucion` | `actor_resolutor_id` | `actor_funcional` | N:1 |
| G10-FK22 | `resolucion` | `resultado_estado_id` | `estado_funcional` | N:1 |

### 9.6 Unicidades funcionales del ciclo

#### G10-DIS01 — Secuencia de solicitudes

La combinación:

`discrepancia_id + secuencia`

deberá ser única.

La numeración no constituye identidad primaria y no deberá reutilizarse dentro de la misma Discrepancia.

#### G10-DIS02 — Una Aclaración ordinaria por solicitud

`solicitud_aclaracion_id` deberá ser única en `aclaracion`.

Una respuesta adicional exigirá una nueva Solicitud de Aclaración conforme al ciclo aprobado.

#### G10-DIS03 — Una Resolución ordinaria por Discrepancia

`discrepancia_id` deberá ser única en `resolucion` mientras POST-RLS-G08 mantenga el modelo de una única Resolución ordinaria final.

Una futura revisión extraordinaria requerirá un modelo explícito distinto y no podrá simularse mediante actualización destructiva de esta fila.

### 9.7 Reglas de coherencia de estado

#### G10-DIS04 — Solicitud desde estado válido

Una Solicitud de Aclaración ordinaria sólo podrá registrarse cuando la Discrepancia se encuentre en un estado que permita `DIS-T02` o `DIS-T04`.

#### G10-DIS05 — Aclaración subordinada

Toda Aclaración deberá derivar inequívocamente de una Solicitud de Aclaración existente.

No se autoriza Aclaración huérfana.

#### G10-DIS06 — Resolución subordinada

Toda Resolución deberá pertenecer inequívocamente a una Discrepancia existente.

No se autoriza Resolución huérfana.

#### G10-DIS07 — Resultado terminal

Una Resolución ordinaria sólo podrá producir uno de los tres resultados terminales:

- `DIS-90A RESUELTA_SOLVENTADA`;
- `DIS-90B RESUELTA_NO_SOLVENTADA`;
- `DIS-90C RESUELTA_IMPROCEDENTE`.

#### G10-DIS08 — No reapertura implícita

Después de existir una Resolución ordinaria válida no deberá permitirse:

- nueva Aclaración ordinaria;
- nueva Resolución ordinaria concurrente;
- retorno silencioso a `DIS-00`;
- retorno silencioso a `DIS-10`;
- retorno silencioso a `DIS-20`.

### 9.8 Reglas de segregación aplicables al ciclo

#### G10-DIS09 — Solicitante y respuesta

La Administración Entrante o actor autorizado podrá solicitar aclaración conforme a RBAC.

La Administración Saliente o actor autorizado podrá presentar la Aclaración correspondiente.

La asignación concreta deberá resolverse mediante capacidades y contexto institucional.

#### G10-DIS10 — Separación aclaración-resolución

Quien haya presentado una Aclaración no deberá resolver ordinariamente la misma Discrepancia cuando la regla SoD aplicable lo prohíba.

La integridad de esta regla podrá requerir posteriormente mecanismo transaccional, trigger o servicio autorizado.

#### G10-DIS11 — Capacidad efectiva

La existencia de una FK válida hacia `actor_funcional` no constituye autorización suficiente.

Toda actuación deberá satisfacer además RBAC, capacidades, alcance, vigencia y reglas SoD.

### 9.9 Inmutabilidad histórica

#### G10-DIS12 — Solicitudes y Aclaraciones append-only

Las Solicitudes de Aclaración y Aclaraciones válidamente emitidas deberán preservarse como historia sustantiva.

Las correcciones posteriores no deberán sobrescribir silenciosamente la actuación original.

#### G10-DIS13 — Resolución inmutable

Una Resolución ordinaria consolidada no deberá admitir modificación sustantiva ordinaria.

Cualquier mecanismo futuro de:

- revisión extraordinaria;
- nulidad;
- revocación;
- sustitución;
- corrección material;

deberá conservar la Resolución original, identificar fundamento y autoridad competente y generar trazabilidad reforzada.

### 9.10 Cierre agregado y SM-ER

#### G10-DIS14 — Bloqueo de cierre

Mientras exista al menos una Discrepancia asociada al proceso en:

- `DIS-00 ABIERTA`;
- `DIS-10 EN_ACLARACION`;
- `DIS-20 EN_VALORACION`;

la transición `ER-T07 CERRAR_REVISION` deberá permanecer bloqueada.

#### G10-DIS15 — Disponibilidad para cierre

Sólo las Discrepancias en:

- `DIS-90A RESUELTA_SOLVENTADA`;
- `DIS-90B RESUELTA_NO_SOLVENTADA`;
- `DIS-90C RESUELTA_IMPROCEDENTE`;

podrán contribuir positivamente al cálculo del cierre agregado.

### 9.11 Frontera de implementación de B05

G10-B05 establece la semántica física pero todavía no decide el mecanismo ejecutable para:

- garantizar estado previo válido antes de INSERT;
- impedir actualizaciones destructivas;
- verificar SoD entre aclarador y resolutor;
- comprobar capacidades efectivas;
- materializar el bloqueo agregado de `ER-T07`;
- implementar índices parciales o triggers;
- resolver concurrencia entre solicitudes o resoluciones simultáneas.

La ubicación definitiva de cada regla entre constraint, índice, trigger, función SQL o capa transaccional será establecida antes de generar migraciones ejecutables.


## 10. Evidencia, vínculo probatorio y trazabilidad causal

### 10.1 Principios generales

La persistencia de Evidencia y Trazabilidad deberá permitir reconstruir:

- qué elemento probatorio existía;
- cuándo fue incorporado;
- quién lo incorporó;
- a qué entidad o actuación fue asociado;
- para qué uso probatorio fue considerado;
- qué actuación causó un evento posterior;
- qué eventos pertenecen a una misma cadena funcional.

La existencia de evidencia no implicará por sí misma valoración favorable, suficiencia probatoria ni autorización funcional.

### 10.2 Tabla `evidencia`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `evidencia_id` | `D_UUID_PK` | NOT NULL | PK |
| `periodo_er_id` | `D_UUID_FK_REQ` | NOT NULL | contexto de Entrega-Recepción |
| `actor_incorpora_id` | `D_UUID_FK_REQ` | NOT NULL | actor que incorpora |
| `tipo_evidencia` | `D_CODE` | NOT NULL | clasificación |
| `nombre` | `D_TEXT_REQ` | NOT NULL | denominación |
| `descripcion` | `D_TEXT_OPT` | NULL permitido | descripción |
| `content_hash` | `D_TEXT_REQ` | NOT NULL | huella de integridad |
| `storage_locator` | `D_TEXT_REQ` | NOT NULL | referencia de almacenamiento |
| `mime_type` | `D_TEXT_OPT` | NULL permitido | tipo de contenido |
| `tamano_bytes` | `D_INT_OPT` | NULL permitido | tamaño cuando aplique |
| `created_at` | `D_TS_REQ` | NOT NULL | incorporación |
| `row_version` | `D_INT_REQ` | NOT NULL | concurrencia controlada |

Reglas:

- `evidencia_id` será PK;
- una Evidencia tendrá identidad propia independiente de las entidades que la referencien;
- `content_hash` deberá conservar la huella del contenido incorporado;
- `storage_locator` no deberá interpretarse como identidad sustantiva;
- la modificación del contenido deberá producir nueva identidad o nueva versión explícitamente trazada;
- una Evidencia histórica referenciada no deberá eliminarse físicamente.

### 10.3 Tabla `vinculo_evidencia`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `vinculo_evidencia_id` | `D_UUID_PK` | NOT NULL | PK |
| `evidencia_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `evidencia.evidencia_id` |
| `entity_type` | `D_CODE` | NOT NULL | tipo de entidad vinculada |
| `entity_id` | `D_UUID_FK_REQ` | NOT NULL | identidad lógica vinculada |
| `uso_evidencia` | `D_CODE` | NOT NULL | finalidad probatoria |
| `actor_vincula_id` | `D_UUID_FK_REQ` | NOT NULL | actor que crea vínculo |
| `created_at` | `D_TS_REQ` | NOT NULL | instante de vinculación |

Reglas:

- `vinculo_evidencia_id` será PK;
- una Evidencia podrá vincularse a múltiples entidades o actuaciones;
- un mismo vínculo lógico no deberá duplicarse silenciosamente;
- la combinación `evidencia_id + entity_type + entity_id + uso_evidencia` deberá ser única;
- el vínculo será append-only;
- eliminar un vínculo histórico no deberá constituir operación ordinaria permitida.

### 10.4 Semántica de `entity_type`

`entity_type` permitirá identificar la clase lógica de la entidad referenciada por `entity_id`.

Inicialmente deberá contemplar, al menos:

- `OBJETO_REVISION`;
- `DISCREPANCIA`;
- `SOLICITUD_ACLARACION`;
- `ACLARACION`;
- `RESOLUCION`;
- `CONTROL`;
- `EVALUACION`;
- `OBSERVACION`;
- `VALIDACION`;
- `ACTO_ENTREGA_RECEPCION`.

La combinación polimórfica `entity_type + entity_id` no puede resolverse completamente mediante una FK convencional única.

Su mecanismo definitivo de integridad queda diferido a una combinación controlada de:

- constraint;
- trigger;
- función SQL;
- capa transaccional;
- o una futura normalización por tablas de vínculo específicas.

### 10.5 Tabla `evento_trazabilidad`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `evento_id` | `D_UUID_PK` | NOT NULL | PK |
| `periodo_er_id` | `D_UUID_FK_REQ` | NOT NULL | contexto |
| `actor_id` | `D_UUID_FK_REQ` | NOT NULL | actor causal |
| `transicion_id` | `D_UUID_FK_OPT` | NULL permitido | transición funcional cuando aplique |
| `estado_origen_id` | `D_UUID_FK_OPT` | NULL permitido | estado precedente |
| `estado_destino_id` | `D_UUID_FK_OPT` | NULL permitido | estado resultante |
| `entity_type` | `D_CODE` | NOT NULL | clase de entidad afectada |
| `entity_id` | `D_UUID_FK_REQ` | NOT NULL | entidad afectada |
| `evento_tipo` | `D_CODE` | NOT NULL | clasificación |
| `occurred_at` | `D_TS_REQ` | NOT NULL | instante causal |
| `correlation_id` | `D_UUID_FK_OPT` | NULL permitido | correlación de proceso |
| `causation_id` | `D_UUID_FK_OPT` | NULL permitido | evento causal precedente |
| `metadata` | `D_JSON_OPT` | NULL permitido | metadatos complementarios |
| `created_at` | `D_TS_REQ` | NOT NULL | persistencia |

### 10.6 Relaciones de evidencia y trazabilidad

| ID | Origen | FK | Destino | Cardinalidad |
|---|---|---|---|---|
| G10-FK23 | `evidencia` | `periodo_er_id` | `periodo_entrega_recepcion` | N:1 |
| G10-FK24 | `evidencia` | `actor_incorpora_id` | `actor_funcional` | N:1 |
| G10-FK25 | `vinculo_evidencia` | `evidencia_id` | `evidencia` | N:1 |
| G10-FK26 | `vinculo_evidencia` | `actor_vincula_id` | `actor_funcional` | N:1 |
| G10-FK27 | `evento_trazabilidad` | `periodo_er_id` | `periodo_entrega_recepcion` | N:1 |
| G10-FK28 | `evento_trazabilidad` | `actor_id` | `actor_funcional` | N:1 |
| G10-FK29 | `evento_trazabilidad` | `transicion_id` | `transicion_funcional` | N:0..1 |
| G10-FK30 | `evento_trazabilidad` | `estado_origen_id` | `estado_funcional` | N:0..1 |
| G10-FK31 | `evento_trazabilidad` | `estado_destino_id` | `estado_funcional` | N:0..1 |
| G10-FK32 | `evento_trazabilidad` | `causation_id` | `evento_trazabilidad` | N:0..1 |

### 10.7 Reglas de integridad probatoria

#### G10-EVI01 — Identidad independiente

La Evidencia conservará identidad propia y no deberá duplicarse físicamente por el solo hecho de ser utilizada en múltiples actuaciones.

#### G10-EVI02 — Integridad de contenido

El `content_hash` deberá permitir detectar modificación no autorizada del contenido persistido.

El algoritmo de hash productivo será determinado antes de implementación.

#### G10-EVI03 — Asociación explícita

Toda utilización de Evidencia deberá materializarse mediante un `vinculo_evidencia` explícito.

No deberá inferirse uso probatorio únicamente por proximidad documental o pertenencia al mismo periodo.

#### G10-EVI04 — Uso semántico

`uso_evidencia` deberá distinguir, cuando corresponda:

- antecedente;
- soporte de hallazgo;
- evidencia aportada en aclaración;
- evidencia de valoración;
- evidencia considerada en resolución;
- evidencia de control o validación.

#### G10-EVI05 — No destrucción histórica

Una Evidencia o vínculo utilizado en una actuación consolidada no deberá eliminarse silenciosamente.

### 10.8 Reglas de trazabilidad

#### G10-TRZ01 — Append-only

`evento_trazabilidad` deberá modelarse como registro append-only.

No se permitirán actualizaciones ordinarias que reescriban retrospectivamente un evento consolidado.

#### G10-TRZ02 — Actor identificable

Todo evento operativo deberá identificar al actor funcional responsable cuando exista actuación humana o institucional atribuible.

#### G10-TRZ03 — Temporalidad inequívoca

`occurred_at` deberá conservar el instante efectivo del evento.

`created_at` conservará el instante de persistencia cuando sea necesario distinguirlos.

#### G10-TRZ04 — Correlación

`correlation_id` permitirá agrupar eventos pertenecientes a una misma operación, flujo o unidad causal.

#### G10-TRZ05 — Causalidad

`causation_id` permitirá identificar el evento precedente que originó directamente otro evento cuando exista tal relación.

Un evento no deberá declararse causante de sí mismo.

#### G10-TRZ06 — Estados y transición

Cuando un evento represente cambio de estado:

- `transicion_id` deberá corresponder a una transición válida;
- `estado_origen_id` deberá corresponder al estado previo;
- `estado_destino_id` deberá corresponder al estado resultante.

#### G10-TRZ07 — No sustitución por metadata

`metadata` no deberá utilizarse para ocultar atributos que requieran columnas estructuradas, integridad referencial o consulta normativa.

#### G10-TRZ08 — Historia no destructiva

La corrección de un evento histórico deberá materializarse mediante un nuevo evento explícitamente relacionado con el antecedente, no mediante sobrescritura silenciosa.

### 10.9 Reglas de referencia polimórfica

#### G10-POLY01 — Tipo conocido

Todo `entity_type` deberá pertenecer a un catálogo cerrado o conjunto controlado.

#### G10-POLY02 — Identidad existente

`entity_id` deberá corresponder a una entidad existente del tipo declarado.

#### G10-POLY03 — Coherencia tipo-identidad

No será válida una combinación donde `entity_type` declare una clase distinta de la entidad realmente identificada.

#### G10-POLY04 — Mecanismo diferido

La integridad polimórfica no se considerará resuelta mediante una FK simple.

La estrategia física definitiva deberá decidirse antes de producir DDL ejecutable.

### 10.10 Frontera de G10-B06

G10-B06 no implementa todavía:

- almacenamiento físico de archivos;
- proveedor de objetos o buckets;
- políticas de acceso a archivos;
- algoritmo productivo de hash;
- triggers append-only;
- funciones de trazabilidad;
- catálogo SQL definitivo de `entity_type`;
- RLS sobre evidencia;
- retención o archivado físico;
- firma electrónica o sellado de tiempo.

Estos mecanismos deberán preservar las reglas aquí definidas.


## 11. Materialización física de estados y transiciones

### 11.1 Propósito

La presente sección define la estructura física documental necesaria para representar las máquinas de estados aprobadas en POST-RLS-G06.

El modelo deberá preservar:

- identidad estable de cada estado;
- identidad estable de cada transición;
- separación entre SM-ER y SM-DIS;
- terminalidad explícita;
- relación inequívoca origen → transición → destino;
- trazabilidad histórica;
- compatibilidad con RBAC y capacidades de POST-RLS-G07.

### 11.2 Tabla `estado_funcional`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `estado_id` | `D_UUID_PK` | NOT NULL | PK |
| `maquina_codigo` | `D_CODE` | NOT NULL | SM-ER o SM-DIS |
| `codigo` | `D_CODE` | NOT NULL | código canónico |
| `nombre` | `D_TEXT_REQ` | NOT NULL | denominación |
| `descripcion` | `D_TEXT_OPT` | NULL permitido | semántica |
| `es_inicial` | `D_BOOL_REQ` | NOT NULL | estado inicial |
| `es_terminal` | `D_BOOL_REQ` | NOT NULL | terminalidad |
| `orden_logico` | `D_INT_OPT` | NULL permitido | orden documental |
| `activo` | `D_BOOL_REQ` | NOT NULL | vigencia del catálogo |
| `created_at` | `D_TS_REQ` | NOT NULL | creación |

Reglas:

- `estado_id` será PK;
- `maquina_codigo + codigo` deberá ser único;
- un código de estado no deberá cambiar de significado histórico;
- la desactivación de un estado no eliminará referencias históricas;
- por máquina deberá existir exactamente un estado inicial ordinario;
- los estados terminales deberán identificarse explícitamente.

### 11.3 Estados canónicos de SM-ER

| Código | Nombre lógico | Inicial | Terminal |
|---|---|---|---|
| `ER-00` | `PREPARACION` | Sí | No |
| `ER-10` | `INTEGRACION` | No | No |
| `ER-20` | `VALIDACION` | No | No |
| `ER-30` | `ENTREGA_FORMAL` | No | No |
| `ER-40` | `REVISION_ENTRANTE` | No | No |
| `ER-50` | `ACLARACIONES` | No | No |
| `ER-90` | `CERRADO` | No | Sí |

SM-ER conservará los siete estados definidos en POST-RLS-G06.

### 11.4 Estados canónicos de SM-DIS

| Código | Nombre lógico | Inicial | Terminal |
|---|---|---|---|
| `DIS-00` | `ABIERTA` | Sí | No |
| `DIS-10` | `EN_ACLARACION` | No | No |
| `DIS-20` | `EN_VALORACION` | No | No |
| `DIS-90A` | `RESUELTA_SOLVENTADA` | No | Sí |
| `DIS-90B` | `RESUELTA_NO_SOLVENTADA` | No | Sí |
| `DIS-90C` | `RESUELTA_IMPROCEDENTE` | No | Sí |

SM-DIS conservará los seis estados definidos en POST-RLS-G06.

### 11.5 Tabla `transicion_funcional`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `transicion_id` | `D_UUID_PK` | NOT NULL | PK |
| `maquina_codigo` | `D_CODE` | NOT NULL | SM-ER o SM-DIS |
| `codigo` | `D_CODE` | NOT NULL | identificador canónico |
| `nombre` | `D_TEXT_REQ` | NOT NULL | denominación |
| `estado_origen_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `estado_funcional.estado_id` |
| `estado_destino_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `estado_funcional.estado_id` |
| `capacidad_id` | `D_UUID_FK_REQ` | NOT NULL | capacidad requerida |
| `activa` | `D_BOOL_REQ` | NOT NULL | vigencia |
| `created_at` | `D_TS_REQ` | NOT NULL | creación |

Reglas:

- `transicion_id` será PK;
- `maquina_codigo + codigo` deberá ser único;
- origen y destino deberán pertenecer a la misma máquina;
- `capacidad_id` deberá corresponder a la capacidad funcional exigida;
- una transición inactiva no deberá borrar historia previamente generada.

### 11.6 Transiciones canónicas SM-ER

| Código | Origen | Destino | Capacidad |
|---|---|---|---|
| `ER-T01` | `ER-00` | `ER-10` | `CAP-ER-01` |
| `ER-T02` | `ER-10` | `ER-20` | `CAP-ER-02` |
| `ER-T03` | `ER-20` | `ER-10` | `CAP-ER-03` |
| `ER-T04` | `ER-20` | `ER-30` | `CAP-ER-04` |
| `ER-T05` | `ER-30` | `ER-40` | `CAP-ER-05` |
| `ER-T06` | `ER-40` | `ER-50` | `CAP-ER-06` |
| `ER-T07` | `ER-40` o `ER-50` | `ER-90` | `CAP-ER-07` |

La formalización física definitiva de múltiples orígenes permitidos para `ER-T07` podrá requerir más de una fila física o una relación auxiliar.

Esa decisión queda diferida hasta el diseño ejecutable del DDL.

### 11.7 Transiciones canónicas SM-DIS

| Código | Origen | Destino | Capacidad |
|---|---|---|---|
| `DIS-T01` | `DIS-00` | `DIS-00` | `CAP-DIS-01` |
| `DIS-T02` | `DIS-00` | `DIS-10` | `CAP-DIS-02` |
| `DIS-T02B` | `DIS-00` | `DIS-20` | `CAP-DIS-02B` |
| `DIS-T03` | `DIS-10` | `DIS-20` | `CAP-DIS-03` |
| `DIS-T04` | `DIS-20` | `DIS-10` | `CAP-DIS-04` |
| `DIS-T05A` | `DIS-20` | `DIS-90A` | `CAP-DIS-05A` |
| `DIS-T05B` | `DIS-20` | `DIS-90B` | `CAP-DIS-05B` |
| `DIS-T05C` | `DIS-20` | `DIS-90C` | `CAP-DIS-05C` |

SM-DIS conservará las ocho transiciones aprobadas.

### 11.8 Relaciones físicas de máquinas

| ID | Origen | FK | Destino | Cardinalidad |
|---|---|---|---|---|
| G10-FK33 | `transicion_funcional` | `estado_origen_id` | `estado_funcional` | N:1 |
| G10-FK34 | `transicion_funcional` | `estado_destino_id` | `estado_funcional` | N:1 |
| G10-FK35 | `transicion_funcional` | `capacidad_id` | `capacidad_funcional` | N:1 |

### 11.9 Invariantes físicos de estado

#### G10-SM01 — Máquina coherente

El estado origen y el estado destino de una transición deberán pertenecer a la misma `maquina_codigo`.

#### G10-SM02 — Código único por máquina

La combinación `maquina_codigo + codigo` deberá ser única tanto en estados como en transiciones.

#### G10-SM03 — Estado inicial único

Cada máquina deberá disponer exactamente de un estado ordinario marcado `es_inicial = true`.

#### G10-SM04 — Terminalidad explícita

Todo estado terminal deberá declarar `es_terminal = true`.

La terminalidad no deberá inferirse únicamente por ausencia de transiciones salientes.

#### G10-SM05 — No salida ordinaria desde terminal

No deberá existir una transición ordinaria activa cuyo origen sea un estado terminal.

#### G10-SM06 — Capacidad requerida

Toda transición operativa deberá identificar una `capacidad_id`.

Una transición existente sin capacidad válida no deberá interpretarse como ejecutable.

#### G10-SM07 — Autorización separada de topología

La existencia topológica de una transición válida no implica autorización del actor.

La ejecución requerirá además RBAC, asignación, vigencia, alcance y reglas SoD.

#### G10-SM08 — Transición trazable

Toda ejecución efectiva de transición deberá producir un `evento_trazabilidad` que identifique:

- transición;
- estado origen;
- estado destino;
- actor;
- instante;
- entidad afectada.

#### G10-SM09 — No salto de estados

No deberá permitirse cambiar el estado persistido de una entidad sin una transición válida o mecanismo extraordinario formalmente definido.

#### G10-SM10 — Historia protegida

Una modificación posterior del catálogo de estados o transiciones no deberá reinterpretar silenciosamente eventos históricos ya registrados.

### 11.10 Protección específica de `ER-T07`

`ER-T07 CERRAR_REVISION` tendrá protección adicional.

Además de:

- transición topológicamente válida;
- `CAP-ER-07`;
- autorización RBAC;
- alcance institucional;

deberá comprobarse que no exista una Discrepancia asociada al proceso en estado:

- `DIS-00`;
- `DIS-10`;
- `DIS-20`.

La materialización ejecutable de esta regla podrá requerir validación transaccional superior a una FK o `CHECK` convencional.

### 11.11 Relación estado persistido → evento

Cuando una entidad cambie de estado:

1. deberá verificarse el estado vigente;
2. deberá verificarse la transición solicitada;
3. deberá verificarse la capacidad efectiva;
4. deberán verificarse las precondiciones;
5. deberá materializarse el nuevo estado;
6. deberá generarse el correspondiente `evento_trazabilidad`.

La actualización de estado y la creación del evento deberán pertenecer conceptualmente a la misma unidad transaccional.

### 11.12 Frontera de G10-B07

G10-B07 no implementa todavía:

- seed SQL de estados;
- seed SQL de transiciones;
- triggers de cambio de estado;
- funciones RPC;
- locking;
- políticas RLS;
- motor de autorización;
- migraciones;
- transacciones productivas.

Estas decisiones deberán respetar la topología y los invariantes aquí establecidos.


## 12. Control, Evaluación, Observación y Validación

### 12.1 Propósito

Las entidades `control`, `evaluacion`, `observacion` y `validacion` materializan la capa transversal de revisión, control preventivo, valoración técnica y acreditación de cumplimiento.

Su persistencia deberá conservar:

- identidad propia;
- actor responsable;
- contexto de Entrega-Recepción;
- objeto o actuación evaluada;
- temporalidad;
- resultado;
- evidencia asociable;
- trazabilidad;
- separación entre observación y validación.

Una Observación no equivale automáticamente a una Discrepancia y una Validación no sustituye una Resolución.

### 12.2 Tabla `control`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `control_id` | `D_UUID_PK` | NOT NULL | PK |
| `periodo_er_id` | `D_UUID_FK_REQ` | NOT NULL | contexto ER |
| `codigo` | `D_CODE` | NOT NULL | identificador funcional |
| `nombre` | `D_TEXT_REQ` | NOT NULL | denominación |
| `descripcion` | `D_TEXT_OPT` | NULL permitido | alcance |
| `tipo_control` | `D_CODE` | NOT NULL | clasificación |
| `activo` | `D_BOOL_REQ` | NOT NULL | vigencia |
| `created_at` | `D_TS_REQ` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | NOT NULL | concurrencia optimista |

Reglas:

- `control_id` será PK;
- la combinación `periodo_er_id + codigo` deberá ser única;
- la definición del Control deberá conservarse aun cuando deje de estar activa;
- un Control no otorga por sí mismo capacidad operativa al actor que lo consulta o administra.

### 12.3 Tabla `evaluacion`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `evaluacion_id` | `D_UUID_PK` | NOT NULL | PK |
| `control_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `control.control_id` |
| `objeto_revision_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `objeto_revision.objeto_revision_id` |
| `actor_id` | `D_UUID_FK_REQ` | NOT NULL | evaluador |
| `resultado_codigo` | `D_CODE` | NOT NULL | resultado funcional |
| `comentario` | `D_TEXT_OPT` | NULL permitido | justificación |
| `evaluada_at` | `D_TS_REQ` | NOT NULL | instante |
| `created_at` | `D_TS_REQ` | NOT NULL | persistencia |

Reglas:

- `evaluacion_id` será PK;
- deberá existir un Control válido;
- deberá existir un Objeto de Revisión válido;
- el actor deberá contar con capacidad suficiente;
- una Evaluación histórica no deberá sobrescribirse silenciosamente.

### 12.4 Tabla `observacion`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `observacion_id` | `D_UUID_PK` | NOT NULL | PK |
| `evaluacion_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `evaluacion.evaluacion_id` |
| `actor_id` | `D_UUID_FK_REQ` | NOT NULL | autor |
| `tipo_observacion` | `D_CODE` | NOT NULL | clasificación |
| `contenido` | `D_TEXT_REQ` | NOT NULL | contenido sustantivo |
| `criticidad` | `D_CODE` | NOT NULL | nivel |
| `observada_at` | `D_TS_REQ` | NOT NULL | instante |
| `created_at` | `D_TS_REQ` | NOT NULL | persistencia |

Reglas:

- `observacion_id` será PK;
- toda Observación deberá depender de una Evaluación;
- la Observación deberá conservar autoría;
- una Observación no generará automáticamente una Discrepancia;
- cualquier promoción a Discrepancia deberá producir una actuación explícita y trazable.

### 12.5 Tabla `validacion`

| Columna | Dominio | Nulabilidad | Restricción conceptual |
|---|---|---|---|
| `validacion_id` | `D_UUID_PK` | NOT NULL | PK |
| `evaluacion_id` | `D_UUID_FK_REQ` | NOT NULL | FK → `evaluacion.evaluacion_id` |
| `actor_id` | `D_UUID_FK_REQ` | NOT NULL | validador |
| `resultado_codigo` | `D_CODE` | NOT NULL | resultado |
| `fundamento` | `D_TEXT_OPT` | NULL permitido | motivación |
| `validada_at` | `D_TS_REQ` | NOT NULL | instante |
| `created_at` | `D_TS_REQ` | NOT NULL | persistencia |

Reglas:

- `validacion_id` será PK;
- toda Validación deberá depender de una Evaluación;
- el actor deberá contar con capacidad efectiva;
- la Validación no deberá modificar silenciosamente la Evaluación;
- la Validación no sustituye una Resolución de SM-DIS.

### 12.6 Relaciones físicas CTL

| ID | Origen | FK | Destino | Cardinalidad |
|---|---|---|---|---|
| G10-FK36 | `control` | `periodo_er_id` | `periodo_entrega_recepcion` | N:1 |
| G10-FK37 | `evaluacion` | `control_id` | `control` | N:1 |
| G10-FK38 | `evaluacion` | `objeto_revision_id` | `objeto_revision` | N:1 |
| G10-FK39 | `evaluacion` | `actor_id` | `actor_funcional` | N:1 |
| G10-FK40 | `observacion` | `evaluacion_id` | `evaluacion` | N:1 |
| G10-FK41 | `observacion` | `actor_id` | `actor_funcional` | N:1 |
| G10-FK42 | `validacion` | `evaluacion_id` | `evaluacion` | N:1 |
| G10-FK43 | `validacion` | `actor_id` | `actor_funcional` | N:1 |

### 12.7 Invariantes CTL

#### G10-CTL01 — Contexto consistente

El Control, la Evaluación y el Objeto de Revisión deberán pertenecer al mismo contexto de Entrega-Recepción.

#### G10-CTL02 — Evaluación independiente

Una Evaluación tendrá identidad propia y no deberá utilizarse como sustituto de una Observación, Validación o Resolución.

#### G10-CTL03 — Observación subordinada

Toda Observación deberá referenciar exactamente una Evaluación existente.

#### G10-CTL04 — Validación subordinada

Toda Validación deberá referenciar exactamente una Evaluación existente.

#### G10-CTL05 — No promoción implícita

Una Observación no deberá convertirse automáticamente en Discrepancia.

La creación de una Discrepancia derivada deberá constituir una actuación explícita y trazable.

#### G10-CTL06 — No resolución implícita

Una Validación no deberá equivaler a una Resolución terminal de SM-DIS.

#### G10-CTL07 — Actor autorizado

La existencia de una FK a `actor_funcional` no acreditará por sí misma autorización.

La actuación deberá cumplir RBAC, capacidad, alcance, vigencia y SoD.

#### G10-CTL08 — Historia preservada

Evaluaciones, Observaciones y Validaciones consolidadas no deberán sobrescribirse silenciosamente.

#### G10-CTL09 — Evidencia vinculable

Control, Evaluación, Observación y Validación podrán participar en `vinculo_evidencia` conforme a la semántica de G10-B06.

#### G10-CTL10 — Trazabilidad

Las actuaciones relevantes deberán poder generar `evento_trazabilidad`.

### 12.8 Cardinalidades conceptuales

La estructura mínima será:

```text
PERIODO_ENTREGA_RECEPCION
        |
        +--- CONTROL [0..*]
                 |
                 +--- EVALUACION [0..*]
                          |
                          +--- OBSERVACION [0..*]
                          |
                          +--- VALIDACION [0..*]
```

Cada Evaluación deberá estar asociada además a exactamente un `objeto_revision`.

### 12.9 Frontera de G10-B08

G10-B08 no define todavía:

- catálogos productivos de tipos de control;
- catálogo de criticidad;
- reglas automáticas de promoción Observación → Discrepancia;
- scoring;
- ponderaciones;
- formularios productivos;
- triggers;
- RLS;
- funciones SQL;
- generación automática de hallazgos.

Estas funciones deberán respetar las identidades, relaciones y reglas aquí definidas.

## 13. Matriz maestra de constraints e integridad referencial

### 13.1 Propósito

La presente sección consolida las restricciones estructurales mínimas que deberán trasladarse al DDL ejecutable.

La matriz distingue:

- claves primarias;
- claves foráneas;
- unicidades;
- restricciones `CHECK`;
- política `ON DELETE`;
- política `ON UPDATE`;
- reglas que no pueden resolverse únicamente mediante constraints declarativos.

La existencia de esta matriz no constituye todavía DDL productivo ni migración ejecutable.

### 13.2 Principios de integridad física

#### G10-CON01 — Identidad inmutable

Las claves primarias técnicas no deberán modificarse una vez persistidas.

#### G10-CON02 — Denegación estructural

La ausencia de una relación obligatoria deberá invalidar la operación y nunca interpretarse como autorización implícita.

#### G10-CON03 — No borrado destructivo ordinario

Las entidades sustantivas, históricas, probatorias, de autorización o trazabilidad no deberán eliminarse físicamente mediante operaciones ordinarias.

#### G10-CON04 — Sin cascadas destructivas implícitas

No se utilizará `ON DELETE CASCADE` sobre información sustantiva o histórica salvo decisión arquitectónica posterior expresamente justificada.

#### G10-CON05 — Actualización restrictiva

Las FK canónicas utilizarán como política base `ON UPDATE RESTRICT`.

#### G10-CON06 — Borrado restrictivo

Las FK canónicas utilizarán como política base `ON DELETE RESTRICT`.

#### G10-CON07 — Invariantes complejos fuera de CHECK

Las reglas que dependan de múltiples filas, múltiples tablas, estado vigente, RBAC, SoD o secuencias históricas no deberán simularse mediante un `CHECK` insuficiente.

#### G10-CON08 — Integridad histórica

Las restricciones físicas deberán preservar la interpretación histórica de estados, transiciones, capacidades, evidencia y eventos.

### 13.3 Matriz maestra de claves primarias

| ID | Tabla | Clave primaria |
|---|---|---|
| G10-PK01 | `municipio` | `municipio_id` |
| G10-PK02 | `periodo_entrega_recepcion` | `periodo_er_id` |
| G10-PK03 | `unidad_administrativa` | `unidad_id` |
| G10-PK04 | `actor_funcional` | `actor_id` |
| G10-PK05 | `acto_entrega_recepcion` | `acto_er_id` |
| G10-PK06 | `objeto_revision` | `objeto_revision_id` |
| G10-PK07 | `rol_funcional` | `rol_id` |
| G10-PK08 | `capacidad_funcional` | `capacidad_id` |
| G10-PK09 | `rol_capacidad` | `rol_capacidad_id` |
| G10-PK10 | `asignacion_funcional` | `asignacion_id` |
| G10-PK11 | `estado_funcional` | `estado_id` |
| G10-PK12 | `transicion_funcional` | `transicion_id` |
| G10-PK13 | `control` | `control_id` |
| G10-PK14 | `evaluacion` | `evaluacion_id` |
| G10-PK15 | `observacion` | `observacion_id` |
| G10-PK16 | `validacion` | `validacion_id` |
| G10-PK17 | `evidencia` | `evidencia_id` |
| G10-PK18 | `discrepancia` | `discrepancia_id` |
| G10-PK19 | `solicitud_aclaracion` | `solicitud_aclaracion_id` |
| G10-PK20 | `aclaracion` | `aclaracion_id` |
| G10-PK21 | `resolucion` | `resolucion_id` |
| G10-PK22 | `vinculo_evidencia` | `vinculo_evidencia_id` |
| G10-PK23 | `evento_trazabilidad` | `evento_id` |

Toda PK deberá ser:

- `NOT NULL`;
- estable;
- no reutilizable;
- independiente de códigos de negocio;
- apta para referencia histórica.

### 13.4 Consolidación de claves foráneas

Las relaciones G10-FK01 a G10-FK43 definidas en las secciones precedentes constituyen el catálogo canónico inicial de claves foráneas.

Política base:

| Propiedad | Política |
|---|---|
| `ON UPDATE` | `RESTRICT` |
| `ON DELETE` | `RESTRICT` |
| FK obligatoria | `NOT NULL` |
| FK opcional | `NULL` únicamente cuando la semántica lo permita |
| borrado físico de padre referenciado | denegado por defecto |
| reinterpretación histórica | prohibida |

Las excepciones deberán identificarse explícitamente antes de producir migraciones.

### 13.5 Matriz maestra de unicidad

La presente matriz consolida las restricciones de unicidad físicamente
materializables documentadas en las secciones precedentes.

| ID | Tabla | Columnas |
|---|---|---|
| G10-UQ01 | `periodo_entrega_recepcion` | `municipio_id, codigo` |
| G10-UQ02 | `unidad_administrativa` | `municipio_id, codigo` |
| G10-UQ03 | `actor_funcional` | `municipio_id, codigo` |
| G10-UQ04 | `acto_entrega_recepcion` | `periodo_er_id, codigo` |
| G10-UQ05 | `rol_funcional` | `codigo` |
| G10-UQ06 | `capacidad_funcional` | `codigo` |
| G10-UQ07 | `rol_capacidad` | `rol_id, capacidad_id` |
| G10-UQ08 | `estado_funcional` | `maquina_codigo, codigo` |
| G10-UQ09 | `transicion_funcional` | `maquina_codigo, codigo` |
| G10-UQ10 | `control` | `periodo_er_id, codigo` |
| G10-UQ11 | `vinculo_evidencia` | `evidencia_id, entity_type, entity_id, uso_evidencia` |
| G10-UQ12 | `solicitud_aclaracion` | `discrepancia_id, secuencia` |
| G10-UQ13 | `municipio` | `codigo` |
| G10-UQ14 | `objeto_revision` | `acto_er_id, codigo` |
| G10-UQ15 | `discrepancia` | `acto_er_id, codigo` |
| G10-UQ16 | `aclaracion` | `solicitud_aclaracion_id` |
| G10-UQ17 | `resolucion` | `discrepancia_id` |

Las restricciones de unicidad deberán expresar identidad funcional y no
sustituir las PK técnicas.

#### 13.5.1 Reconciliación documental de unicidades

La consolidación precedente corrige una inconsistencia documental detectada
durante la preparación de POST-RLS-G11.

En particular:

- `G10-UQ02` utiliza `municipio_id` como ámbito físico de
  `unidad_administrativa`, conforme a la definición canónica de la tabla;
- `G10-UQ03` conserva la intención de unicidad contextual ya presente en la
  matriz maestra y utiliza `municipio_id`, que es el contexto institucional
  obligatorio realmente definido para `actor_funcional`;
- `G10-UQ13` a `G10-UQ17` incorporan restricciones de unicidad ya declaradas
  expresamente en las reglas locales de las tablas correspondientes;
- la reconciliación no altera PK, FK, cardinalidades, máquinas de estado,
  RBAC, SoD ni reglas sustantivas de negocio;
- la reconciliación continúa siendo documental y no genera SQL ejecutable.

### 13.6 Matriz maestra de CHECK

| ID | Ámbito | Regla |
|---|---|---|
| G10-CK01 | versionado | `row_version >= 1` cuando exista |
| G10-CK02 | evidencia | `tamano_bytes IS NULL OR tamano_bytes >= 0` |
| G10-CK03 | asignación | `vigente_hasta IS NULL OR vigente_hasta >= vigente_desde` |
| G10-CK04 | estados | `maquina_codigo IN ('SM-ER','SM-DIS')` |
| G10-CK05 | transiciones | `maquina_codigo IN ('SM-ER','SM-DIS')` |
| G10-CK06 | trazabilidad | `causation_id IS NULL OR causation_id <> evento_id` |
| G10-CK07 | códigos | los códigos obligatorios no podrán ser cadena vacía |
| G10-CK08 | evidencia | `content_hash` obligatorio no podrá ser cadena vacía |
| G10-CK09 | orden lógico | valores de orden o secuencia deberán ser positivos cuando existan |
| G10-CK10 | terminalidad | los valores booleanos deberán persistirse explícitamente y no inferirse de texto |

Estas reglas constituyen el mínimo declarativo.

### 13.7 Reglas que requieren integridad superior a CHECK

No deberán resolverse únicamente con `CHECK`:

- cierre agregado de `ER-T07`;
- coherencia entre `estado_origen_id`, `estado_destino_id` y `maquina_codigo`;
- existencia real de `entity_type + entity_id`;
- RBAC y capacidad efectiva;
- segregación de funciones;
- autorización contextual;
- unicidad de resolución ordinaria vigente por Discrepancia;
- append-only de eventos;
- append-only de vínculos probatorios;
- consistencia causal entre eventos;
- promoción explícita Observación → Discrepancia;
- transiciones válidas según estado vigente.

Su materialización podrá requerir:

- FK compuestas;
- índices únicos parciales;
- triggers;
- funciones SQL;
- procedimientos/RPC;
- transacciones;
- políticas de autorización.

### 13.8 Política de borrado

Se establece como criterio inicial:

**RESTRICT**

para:

- dominio municipal;
- periodos;
- actos;
- objetos de revisión;
- Discrepancias;
- Solicitudes de Aclaración;
- Aclaraciones;
- Resoluciones;
- Evidencias;
- Eventos de trazabilidad;
- estados;
- transiciones;
- roles;
- capacidades;
- asignaciones históricas;
- controles;
- evaluaciones;
- observaciones;
- validaciones.

La inactivación o revocación deberá preferirse al borrado físico.

### 13.9 Política de actualización

Las claves técnicas y referencias canónicas no deberán modificarse ordinariamente.

`ON UPDATE RESTRICT` será la política predeterminada.

Los cambios de semántica funcional deberán realizarse mediante:

- nueva versión;
- nueva fila;
- revocación;
- inactivación;
- o mecanismo histórico expresamente definido.

### 13.10 Política de nulabilidad

Una FK podrá ser `NULL` únicamente cuando la ausencia tenga significado funcional explícito.

No deberá utilizarse `NULL` para representar:

- autorización desconocida;
- actor omitido cuando sea obligatorio;
- estado inexistente;
- relación no validada;
- error de integridad;
- omisión de datos requeridos.

### 13.11 Política de índices derivados de constraints

Toda:

- PK;
- UQ;
- FK utilizada intensivamente en navegación;
- columna de estado;
- columna de contexto;
- columna de correlación;
- columna de temporalidad crítica;

deberá evaluarse para indexación durante el diseño físico ejecutable.

La existencia de una FK no se considerará por sí misma evidencia de que exista un índice adecuado.

### 13.12 Decisiones deliberadamente diferidas

Permanecen diferidas:

- nombres físicos definitivos de constraints;
- uso exacto de `NO ACTION` frente a `RESTRICT`;
- índices parciales;
- índices funcionales;
- constraints diferibles;
- estrategia física de referencias polimórficas;
- implementación de append-only;
- mecanismo ejecutable de `ER-T07`;
- locking;
- nivel de aislamiento;
- triggers;
- RLS;
- DDL productivo.

Estas decisiones deberán cerrarse antes de la primera migración ejecutable.

### 13.13 Criterios de aceptación de G10-B09

G10-B09 se considerará completo cuando:

- existan 23 PK canónicas;
- las 43 FK documentadas permanezcan trazables;
- exista política explícita `ON DELETE`;
- exista política explícita `ON UPDATE`;
- existan unicidades funcionales documentadas;
- existan reglas `CHECK` mínimas;
- estén identificados los invariantes no resolubles declarativamente;
- no exista cascada destructiva implícita;
- se preserve la historia;
- no se haya generado todavía DDL productivo.

## 14. Estrategia de índices y orden de materialización

### 14.1 Propósito

La presente sección define la estrategia física candidata para:

- indexación;
- navegación por claves foráneas;
- consultas por estado;
- recuperación histórica;
- trazabilidad;
- orden de creación de entidades;
- incorporación posterior de constraints;
- preparación de la futura generación de DDL.

G10-B10 no genera todavía SQL productivo.

La topología aquí definida deberá validarse nuevamente contra el catálogo completo de 43 FK antes de producir una migración ejecutable.

### 14.2 Principios de indexación

#### G10-IDX01 — PK y UQ primero

Las PK y restricciones UQ deberán utilizar preferentemente los índices creados implícitamente por el motor, evitando duplicación física innecesaria.

#### G10-IDX02 — FK de navegación

Las FK utilizadas en joins, navegación del dominio o validaciones frecuentes deberán evaluarse para indexación explícita.

#### G10-IDX03 — Contexto institucional

Las referencias a `periodo_er_id`, `municipio_id`, `unidad_id` y `actor_id` deberán disponer de rutas de acceso eficientes cuando participen en filtros operativos.

#### G10-IDX04 — Estado vigente

Las columnas de estado utilizadas para determinar situación vigente de SM-ER o SM-DIS deberán disponer de una estrategia de indexación compatible con su cardinalidad real.

#### G10-IDX05 — Temporalidad

Las columnas `created_at`, `updated_at`, `occurred_at`, `vigente_desde`, `vigente_hasta`, `evaluada_at`, `observada_at` y `validada_at` deberán indexarse únicamente cuando exista un patrón real de consulta que lo justifique.

#### G10-IDX06 — Discrepancias

La recuperación de Discrepancias por Acto, Objeto de Revisión y estado deberá contar con una ruta de acceso física eficiente.

#### G10-IDX07 — Ciclo de aclaraciones

Las Solicitudes de Aclaración y Aclaraciones deberán poder recuperarse eficientemente por Discrepancia, solicitud y secuencia.

#### G10-IDX08 — Resolución

La recuperación de la Resolución vigente de una Discrepancia deberá poder realizarse sin recorrido completo de la tabla.

#### G10-IDX09 — Evidencia

La búsqueda de Evidencia y sus vínculos deberá considerar `evidencia_id`, `entity_type`, `entity_id` y `uso_evidencia`.

#### G10-IDX10 — Trazabilidad

`evento_trazabilidad` deberá permitir navegación eficiente por:

- actor;
- periodo;
- transición;
- entidad afectada;
- `correlation_id`;
- `causation_id`;
- temporalidad.

#### G10-IDX11 — Autorización

La evaluación de asignaciones funcionales deberá poder filtrar eficientemente por actor, rol, periodo, unidad, vigencia y revocación.

#### G10-IDX12 — No sobreindexación

No deberá crearse un índice sin un patrón de consulta, constraint, FK o requisito de integridad que justifique su costo de escritura y mantenimiento.

#### G10-IDX13 — Índices parciales diferidos

Los índices parciales para estados activos, asignaciones vigentes o resoluciones vigentes permanecen diferidos hasta definir la semántica SQL ejecutable.

#### G10-IDX14 — Medición posterior

La estrategia final deberá revisarse con evidencia de planes de ejecución, cardinalidad y selectividad durante la fase de implementación.

### 14.3 Índices candidatos de navegación

| ID | Tabla | Columnas candidatas | Justificación |
|---|---|---|---|
| G10-IX01 | `periodo_entrega_recepcion` | `municipio_id` | navegación municipal |
| G10-IX02 | `unidad_administrativa` | `periodo_er_id` | contexto ER |
| G10-IX03 | `actor_funcional` | `periodo_er_id` | actores por periodo |
| G10-IX04 | `acto_entrega_recepcion` | `periodo_er_id` | actos por periodo |
| G10-IX05 | `objeto_revision` | `acto_er_id` | objetos por acto |
| G10-IX06 | `asignacion_funcional` | `actor_id, periodo_er_id` | autorización |
| G10-IX07 | `transicion_funcional` | `estado_origen_id, estado_destino_id` | navegación de máquina |
| G10-IX08 | `control` | `periodo_er_id` | controles por periodo |
| G10-IX09 | `evaluacion` | `control_id, objeto_revision_id` | valoración |
| G10-IX10 | `observacion` | `evaluacion_id` | observaciones por evaluación |
| G10-IX11 | `validacion` | `evaluacion_id` | validaciones por evaluación |
| G10-IX12 | `discrepancia` | `acto_er_id, objeto_revision_id, estado_dis_id` | ciclo SM-DIS |
| G10-IX13 | `solicitud_aclaracion` | `discrepancia_id` | ciclo de aclaraciones |
| G10-IX14 | `resolucion` | `discrepancia_id` | resolución de discrepancia |
| G10-IX15 | `vinculo_evidencia` | `entity_type, entity_id` | evidencia polimórfica |
| G10-IX16 | `evento_trazabilidad` | `correlation_id, occurred_at` | secuencia causal |
| G10-IX17 | `evento_trazabilidad` | `causation_id` | causalidad |
| G10-IX18 | `evento_trazabilidad` | `actor_id, occurred_at` | auditoría por actor |

La lista anterior es candidata.

La existencia definitiva de cada índice deberá comprobar que no esté ya satisfecha por una PK, UQ u otro índice compuesto equivalente.

### 14.4 Orden lógico candidato de materialización

El orden de materialización se organiza por niveles de dependencia.

No sustituye el análisis automático del grafo de las 43 FK.

#### G10-ORD-L0 — Catálogos raíz

- `municipio`
- `rol_funcional`
- `capacidad_funcional`
- `estado_funcional`

No deberán depender de entidades operativas posteriores.

#### G10-ORD-L1 — Contexto y catálogos relacionados

- `periodo_entrega_recepcion`
- `rol_capacidad`
- `transicion_funcional`

Este nivel materializa contexto institucional, relación Rol→Capacidad y topología de estados.

#### G10-ORD-L2 — Estructura organizacional y acto

- `unidad_administrativa`
- `acto_entrega_recepcion`
- `control`

Estas entidades dependen del contexto ya creado.

#### G10-ORD-L3 — Actores y objetos

- `actor_funcional`
- `objeto_revision`

La dependencia física exacta deberá verificarse contra las FK canónicas.

#### G10-ORD-L4 — Operación primaria

- `asignacion_funcional`
- `evaluacion`
- `discrepancia`
- `evidencia`

En este nivel comienzan las actuaciones operativas e información probatoria.

#### G10-ORD-L5 — Actuaciones subordinadas

- `observacion`
- `validacion`
- `solicitud_aclaracion`

Estas entidades requieren antecedentes ya persistidos.

#### G10-ORD-L6 — Cierre y asociaciones

- `aclaracion`
- `resolucion`
- `vinculo_evidencia`

La asociación de evidencia deberá respetar la semántica polimórfica aprobada.

#### G10-ORD-L7 — Trazabilidad

- `evento_trazabilidad`

El evento se materializa al final del orden estructural por su carácter transversal.

La posición física definitiva de cualquier entidad podrá adelantarse cuando sus FK reales lo permitan.

Si una FK contradice este orden candidato, prevalecerá el grafo efectivo de dependencias documentado en G10.

### 14.5 Propiedad de aciclicidad

La construcción física deberá buscar un grafo acíclico de creación.

Cuando exista una referencia que produzca dependencia circular, deberán evaluarse, en este orden:

1. crear inicialmente la tabla sin la FK circular;
2. crear las tablas dependientes;
3. incorporar posteriormente la FK mediante `ALTER TABLE`;
4. documentar expresamente la razón del diferimiento.

No deberá eliminarse una restricción funcional únicamente para simplificar el orden de creación.

### 14.6 Plan de materialización DDL

#### G10-MAT01 — Dominios y prerrequisitos

Materializar:

- extensiones estrictamente necesarias;
- dominios;
- tipos;
- convenciones de nombres;
- esquema lógico.

No crear todavía datos operativos.

#### G10-MAT02 — Tablas y claves primarias

Crear las 23 tablas canónicas con:

- PK;
- nulabilidad básica;
- columnas;
- tipos;
- valores por defecto estrictamente técnicos.

#### G10-MAT03 — Unicidades y CHECK

Incorporar:

- G10-UQ01 a G10-UQ17;
- G10-CK01 a G10-CK10;
- restricciones declarativas locales.

#### G10-MAT04 — Claves foráneas

Incorporar las FK canónicas G10-FK01 a G10-FK43 respetando:

- `ON DELETE RESTRICT`;
- `ON UPDATE RESTRICT`;
- obligatoriedad;
- orden topológico;
- dependencias diferidas expresamente justificadas.

#### G10-MAT05 — Índices

Crear únicamente los índices que:

- no estén cubiertos por PK/UQ;
- soporten FK críticas;
- respondan a navegación conocida;
- soporten estado, temporalidad, autorización o trazabilidad.

#### G10-MAT06 — Integridad procedural posterior

Quedan para una fase posterior:

- triggers;
- funciones;
- RPC;
- append-only ejecutable;
- protección ejecutable de `ER-T07`;
- RBAC productivo;
- SoD productivo;
- RLS;
- referencias polimórficas ejecutables;
- locking;
- aislamiento transaccional.

### 14.7 Verificación previa a generación SQL

Antes de generar DDL ejecutable deberá comprobarse:

- 23/23 tablas;
- 23/23 PK;
- 43/43 FK;
- 17/17 UQ;
- 10/10 CHECK;
- ausencia de ciclos no gestionados;
- política referencial consistente;
- orden de materialización coherente;
- ausencia de índices redundantes evidentes;
- invariantes complejos identificados;
- fronteras de implementación preservadas.

### 14.8 Artefactos futuros derivados

El cierre satisfactorio de POST-RLS-G10 permitirá posteriormente producir, en ramas independientes y controladas:

- especificación SQL canónica;
- migración inicial;
- seed de catálogos;
- seed de estados y transiciones;
- constraints avanzados;
- índices físicos;
- funciones de integridad;
- políticas RLS;
- pruebas de migración;
- pruebas de rollback;
- pruebas de integridad referencial.

Ninguno de estos artefactos forma parte todavía de G10-B10.

### 14.9 Criterios de aceptación de G10-B10

G10-B10 se considerará completo cuando:

- existan 14 principios de indexación;
- exista una matriz candidata de índices;
- existan 8 niveles de materialización;
- exista estrategia explícita para dependencias circulares;
- existan 6 fases de materialización DDL;
- el plan preserve las 23 PK, 43 FK, 17 UQ y 10 CHECK;
- se mantenga `RESTRICT` como política referencial base;
- se diferencien constraints declarativos de integridad procedural;
- no se haya generado SQL productivo;
- el documento permanezca estructuralmente íntegro.

## 15. Gate de consistencia integral G05→G10

### 15.1 Propósito

El presente gate verifica que la especificación física de POST-RLS-G10 preserve, sin reinterpretación sustantiva, las decisiones funcionales aprobadas en POST-RLS-G05 a POST-RLS-G09.

G10-B11 no introduce nuevas entidades, estados, transiciones, roles, capacidades ni reglas de negocio.

Su función es determinar readiness documental para staging.

### 15.2 Cadena de autoridad

La cadena de especificaciones aplicable es:

- POST-RLS-G05 — Modelo Funcional Canónico;
- POST-RLS-G06 — Máquinas de Estados y Transiciones;
- POST-RLS-G07 — RBAC y Segregación de Funciones;
- POST-RLS-G08 — Discrepancias, Aclaraciones y Resoluciones;
- POST-RLS-G09 — Persistencia Física y Modelo de Datos;
- POST-RLS-G10 — DDL Canónico y Reglas de Integridad Física.

Una especificación posterior podrá materializar una decisión anterior, pero no modificar silenciosamente su semántica.

### 15.3 Invariantes heredados

G10 deberá conservar, como mínimo:

- identidad funcional estable;
- 7 transiciones canónicas de SM-ER;
- 8 transiciones canónicas de SM-DIS;
- estados terminales de Discrepancia aprobados;
- 10 roles funcionales;
- 18 capacidades funcionales;
- segregación de funciones;
- denegación por defecto;
- mínimo privilegio;
- cierre agregado protegido de ER;
- una única Resolución ordinaria vigente por Discrepancia;
- evidencia histórica no destructiva;
- trazabilidad causal;
- persistencia append-only cuando corresponda;
- 23 entidades canónicas;
- 23 PK;
- 43 FK;
- 17 restricciones UQ;
- 10 restricciones CHECK;
- política referencial restrictiva.

### 15.4 Readiness estructural

POST-RLS-G10 podrá considerarse candidato a staging únicamente cuando:

- G10-B01 a G10-B10 estén materialmente representados;
- la estructura física preserve G05→G09;
- no existan contradicciones de estados o transiciones;
- no se creen facultades RBAC implícitas;
- no exista cascada destructiva ordinaria;
- permanezca explícita la frontera entre integridad declarativa y procedural;
- no exista SQL productivo dentro del alcance documental;
- el Markdown permanezca balanceado;
- no exista trailing whitespace;
- el único cambio pendiente de la rama corresponda al artefacto G10.

### 15.5 Estado de readiness

Un resultado satisfactorio de G10-B11 autorizará exclusivamente:

1. staging del documento `POST-RLS-G10_DDL_0.2.0.md`;
2. revisión del staged diff;
3. commit documental;
4. Pull Request hacia `dev/v0.2.0`.

No autoriza todavía:

- migraciones SQL;
- DDL ejecutable;
- modificaciones de Supabase;
- cambios de backend;
- cambios de runtime;
- RLS productivo;
- triggers productivos;
- despliegue.

### 15.6 Resultado esperado

El cierre satisfactorio de POST-RLS-G10 deberá acreditar una especificación física suficientemente determinada para iniciar posteriormente, en una rama independiente, la generación controlada de DDL ejecutable sin reinterpretar G05, G06, G07, G08, G09 o G10.
