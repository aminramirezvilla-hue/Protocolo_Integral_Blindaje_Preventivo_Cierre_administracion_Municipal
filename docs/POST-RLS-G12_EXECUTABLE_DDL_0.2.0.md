# CATU E-R — Especificación DDL Ejecutable PostgreSQL y Migración Estructural Inicial 0.2.0

## 1. Identificación

- Producto: CATU E-R — Blindaje Preventivo Municipal
- Serie: 0.2.x
- Baseline funcional precedente: POST-RLS-G11
- Baseline física autoritativa: POST-RLS-G10
- Baseline de origen: `dev/v0.2.0`
- Rama: `docs/post-rls-g12-executable-ddl-v0.2.0`
- Gate: `POST-RLS-G12`
- Naturaleza inicial: documental / decisión de implementación / preparación DDL
- Estado inicial: propuesta para revisión

## 2. Propósito

POST-RLS-G12 establecerá las decisiones de implementación necesarias para transformar de manera controlada la especificación física aprobada en POST-RLS-G10 y las convenciones PostgreSQL definidas en POST-RLS-G11 en una especificación DDL ejecutable, verificable y posteriormente migrable.

G12 no reinterpretará el dominio funcional aprobado en POST-RLS-G05 a POST-RLS-G10.

Toda decisión técnica deberá conservar la semántica funcional, las invariantes, las relaciones, las máquinas de estado, las reglas de autorización, la segregación de funciones, la evidencia histórica y la trazabilidad previamente aprobadas.

## 3. Cadena de autoridad

La cadena normativa y arquitectónica de G12 será:

`POST-RLS-G05`
→ `POST-RLS-G06`
→ `POST-RLS-G07`
→ `POST-RLS-G08`
→ `POST-RLS-G09`
→ `POST-RLS-G10`
→ `POST-RLS-G11`
→ `POST-RLS-G12`

En caso de discrepancia entre una propuesta de implementación de G12 y una decisión funcional o física previamente aprobada, prevalecerá la baseline anterior hasta que exista una modificación arquitectónica explícitamente aprobada.

## 4. Baseline estructural heredada

G12 deberá preservar, como mínimo:

- 23 entidades canónicas;
- 23 claves primarias;
- 43 claves foráneas;
- 17 restricciones de unicidad;
- 10 restricciones CHECK;
- 18 índices candidatos;
- política referencial compatible con la semántica aprobada en G10;
- máquinas de estado SM-ER y SM-DIS;
- protección del cierre agregado ER-T07;
- RBAC;
- capacidades funcionales;
- segregación de funciones — SoD;
- denegación por defecto;
- evidencia histórica;
- trazabilidad causal;
- historia no destructiva / append-only.

## 5. Principios rectores

### G12-P01 — Fidelidad funcional

El DDL no podrá modificar silenciosamente reglas de negocio, cardinalidades, estados, transiciones, autorizaciones o invariantes aprobadas.

### G12-P02 — Fidelidad física

La generación ejecutable deberá derivarse de la especificación física canónica de POST-RLS-G10 y de las convenciones aprobadas en POST-RLS-G11.

### G12-P03 — Determinismo

Una misma baseline documental deberá producir una estructura DDL materialmente equivalente.

### G12-P04 — Integridad antes que conveniencia

Las restricciones declarativas deberán preferirse frente a validaciones exclusivamente procedimentales cuando PostgreSQL permita expresar directamente la invariancia correspondiente.

### G12-P05 — No destrucción histórica

La implementación no deberá permitir eliminación o sobrescritura silenciosa de información histórica sustantiva.

### G12-P06 — Denegación por defecto

La ausencia de autorización, capacidad, relación o estado habilitante no deberá interpretarse como permiso implícito.

### G12-P07 — Separación de responsabilidades

DDL estructural, migraciones, RLS, triggers, funciones, seeds, rollback y despliegue deberán mantenerse como artefactos y decisiones diferenciables.

### G12-P08 — Reversibilidad controlada

Toda migración ejecutable futura deberá disponer de una estrategia explícita de reversión o de una justificación documentada cuando la reversión automática no sea segura.

### G12-P09 — Observabilidad

Las decisiones y operaciones críticas deberán ser técnicamente auditables y compatibles con la trazabilidad definida en los gates precedentes.

### G12-P10 — No expansión semántica

La implementación no deberá introducir estados, roles, capacidades, relaciones ni reglas funcionales que no estén autorizadas por la baseline.

## 6. Decisiones de implementación pendientes

Antes de autorizar generación de SQL ejecutable deberán resolverse formalmente:

1. versión exacta de PostgreSQL objetivo;
2. versión y capacidades disponibles de Supabase;
3. mecanismo concreto para generación de UUID;
4. esquema físico PostgreSQL definitivo;
5. convención definitiva de nombres físicos;
6. estrategia ejecutable `RESTRICT` versus `NO ACTION`;
7. orden de creación de tablas;
8. tratamiento de dependencias circulares;
9. secuencia de creación de claves foráneas;
10. materialización física de referencias polimórficas;
11. tratamiento de `row_version` y concurrencia;
12. política de timestamps;
13. estrategia para funciones de base de datos;
14. estrategia para triggers;
15. estrategia RLS;
16. modelo de autenticación / `external_subject`;
17. estrategia de migraciones;
18. estrategia de rollback;
19. seeds mínimos, si proceden;
20. validación en entorno aislado;
21. política de idempotencia de migraciones;
22. orden de despliegue;
23. criterios para promoción a entorno posterior.

## 7. Capas de materialización

G12 organizará la materialización en las siguientes capas:

### Capa A — Decisiones de plataforma

PostgreSQL, Supabase, extensiones, UUID, schemas y convenciones nominales.

### Capa B — Estructura base

Tablas, columnas, tipos, nulabilidad y claves primarias.

### Capa C — Integridad relacional

Claves foráneas, restricciones de unicidad y CHECK.

### Capa D — Integridad procedimental

Funciones, triggers y controles que no puedan materializarse declarativamente.

### Capa E — Seguridad

Autenticación, RLS, políticas y controles de autorización.

### Capa F — Migración

Migraciones ejecutables, seeds, rollback, validaciones y orden de despliegue.

## 8. Política de generación SQL

G12-B00 no autoriza todavía:

- `CREATE TABLE`;
- `ALTER TABLE`;
- `DROP`;
- `INSERT`;
- `UPDATE`;
- `DELETE`;
- `CREATE INDEX`;
- `CREATE TRIGGER`;
- `CREATE FUNCTION`;
- `CREATE POLICY`;
- RLS productivo;
- migraciones ejecutables;
- cambios de backend;
- cambios de runtime;
- despliegues.

La generación de SQL ejecutable requerirá gates posteriores expresamente aprobados.

## 9. Gates propuestos de G12

- G12-B00 — Apertura, autoridad, alcance y frontera.
- G12-B01 — Inventario de decisiones técnicas pendientes.
- G12-B02 — Plataforma PostgreSQL/Supabase y capacidades del entorno.
- G12-B03 — Convenciones físicas definitivas.
- G12-B04 — Diccionario físico ejecutable de 23 entidades.
- G12-B05 — Estrategia de dependencias y orden de creación.
- G12-B06 — PK, FK, UQ y CHECK ejecutables.
- G12-B07 — Índices y estrategia de rendimiento.
- G12-B08 — Concurrencia, temporalidad e inmutabilidad.
- G12-B09 — Funciones y triggers.
- G12-B10 — RLS y seguridad de acceso.
- G12-B11 — Migración inicial y rollback.
- G12-B12 — Generación controlada de artefactos `.sql`.
- G12-B13 — Validación estática de DDL.
- G12-B14 — Ejecución en entorno aislado.
- G12-B15 — Integridad estructural post-migración.
- G12-B16 — Integridad funcional y de seguridad.
- G12-B17 — Preparación de integración.
- G12-B18 — Cierre e incorporación a baseline.

## 10. Criterios de aceptación G12-B00

G12-B00 será acreditado cuando:

- exista un único artefacto documental G12;
- G12 identifique explícitamente la cadena G05→G12;
- la baseline estructural 23/23/43/17/10/18 quede preservada;
- se reconozcan SM-ER, SM-DIS y ER-T07;
- se preserve RBAC, SoD y denegación por defecto;
- se preserve evidencia y trazabilidad;
- estén identificadas las decisiones técnicas pendientes;
- exista separación explícita de capas;
- SQL ejecutable permanezca prohibido en B00;
- la rama G12 derive de `dev/v0.2.0`;
- no existan otros cambios en el working tree.

## 11. Resultado esperado

El cierre de G12-B00 deberá producir una frontera arquitectónica suficientemente precisa para comenzar a resolver, en gates independientes y verificables, las decisiones técnicas necesarias para generar posteriormente DDL PostgreSQL ejecutable sin reinterpretar la baseline funcional ni física aprobada.

## 12. Matriz maestra de decisiones técnicas G12

Las decisiones de esta matriz constituyen el inventario de implementación de G12.

Ninguna decisión podrá considerarse resuelta únicamente por conveniencia técnica. Toda resolución deberá:

1. conservar la autoridad funcional y física de G05→G11;
2. identificar evidencia verificable;
3. declarar dependencias;
4. señalar el gate donde adquiere carácter definitivo;
5. impedir expansión semántica no autorizada.

| ID | Decisión técnica | Autoridad precedente | Dependencias principales | Gate de resolución | Estado inicial |
|---|---|---|---|---|---|
| G12-D01 | Versión exacta de PostgreSQL objetivo | G11 | entorno objetivo | G12-B02 | RESUELTA |
| G12-D02 | Versión y capacidades disponibles de Supabase | G11 | D01 | G12-B02 | RESUELTA |
| G12-D03 | Mecanismo concreto de generación UUID | G10 / G11 | D01, D02 | G12-B02 | RESUELTA |
| G12-D04 | Schema físico PostgreSQL definitivo | G10 / G11 | D01, D02 | G12-B03 | RESUELTA |
| G12-D05 | Convención definitiva de nombres físicos | G10 / G11 | D04 | G12-B03 | RESUELTA |
| G12-D06 | Semántica ejecutable RESTRICT versus NO ACTION | G10 / G11 | D01 | G12-B03 | RESUELTA |
| G12-D07 | Orden de creación de tablas | G10 / G11 | D04, D05 | G12-B05 | RESUELTA |
| G12-D08 | Tratamiento de dependencias circulares | G10 / G11 | D07 | G12-B05 | RESUELTA |
| G12-D09 | Secuencia de creación de claves foráneas | G10 / G11 | D07, D08 | G12-B05 | RESUELTA |
| G12-D10 | Materialización de referencias polimórficas | G08 / G10 / G11 | D04, D09 | G12-B06 | RESUELTA |
| G12-D11 | Estrategia de row_version y concurrencia | G09 / G10 / G11 | D01, D04 | G12-B08 | PENDIENTE |
| G12-D12 | Política física de timestamps | G09 / G10 / G11 | D01 | G12-B08 | PENDIENTE |
| G12-D13 | Estrategia para funciones de base de datos | G07 / G10 / G11 | D01, D04 | G12-B09 | PENDIENTE |
| G12-D14 | Estrategia para triggers | G06 / G08 / G10 / G11 | D13 | G12-B09 | PENDIENTE |
| G12-D15 | Estrategia RLS | G07 / G10 / G11 | D02, D16 | G12-B10 | PENDIENTE |
| G12-D16 | Modelo de autenticación y external_subject | G07 / G11 | D02 | G12-B10 | PENDIENTE |
| G12-D17 | Estrategia de migraciones | G11 | D01-D16 | G12-B11 | PENDIENTE |
| G12-D18 | Estrategia de rollback | G11 | D17 | G12-B11 | PENDIENTE |
| G12-D19 | Seeds mínimos y gobernados, si proceden | G07 / G11 | D15-D17 | G12-B11 | PENDIENTE |
| G12-D20 | Validación en entorno aislado | G11 | D17-D19 | G12-B14 | PENDIENTE |
| G12-D21 | Política de idempotencia de migraciones | G11 | D17, D18 | G12-B11 | PENDIENTE |
| G12-D22 | Orden controlado de despliegue | G11 | D17-D21 | G12-B14 | PENDIENTE |
| G12-D23 | Criterios de promoción a entorno posterior | G11 | D20, D22 | G12-B17 | PENDIENTE |

### 12.1 Estados permitidos

Cada decisión G12-Dxx sólo podrá encontrarse en uno de los siguientes estados:

- `PENDIENTE`: identificada pero no resuelta;
- `EN_ANALISIS`: existe evaluación técnica formal en curso;
- `RESUELTA`: existe decisión explícita y evidencia suficiente;
- `DIFERIDA`: su resolución se traslada justificadamente a un gate posterior;
- `BLOQUEADA`: existe una dependencia que impide resolverla;
- `REVOCADA`: una decisión previa ha sido sustituida mediante autorización formal.

No se permitirá transición implícita entre estados.

### 12.2 Regla de autoridad

Una decisión `RESUELTA` en G12 no podrá contradecir:

- las máquinas de estado aprobadas;
- RBAC y SoD;
- la denegación por defecto;
- las cardinalidades canónicas;
- las 23 entidades;
- las 23 PK;
- las 43 FK;
- las 17 UQ;
- las 10 CHECK;
- la identidad histórica;
- la inmutabilidad sustantiva;
- la trazabilidad causal;
- la protección agregada ER-T07.

Una incompatibilidad deberá producir `BLOQUEADA` o requerir una modificación arquitectónica explícita.

### 12.3 Dependencias de decisión

Las decisiones se resolverán en el siguiente orden lógico:

`D01-D03`
→ `D04-D06`
→ `D07-D10`
→ `D11-D12`
→ `D13-D16`
→ `D17-D19`
→ `D21`
→ `D20`
→ `D22`
→ `D23`

Este orden expresa dependencia arquitectónica y no constituye todavía una secuencia ejecutable de migración.

### 12.4 Frontera de G12-B01

G12-B01 no incorpora SQL ejecutable.

G12-B01:

- inventaría decisiones;
- identifica dependencias;
- establece autoridad;
- establece estados;
- asigna gates de resolución.

G12-B01 no:

- selecciona todavía versión PostgreSQL;
- selecciona extensiones;
- genera DDL;
- genera migraciones;
- crea funciones;
- crea triggers;
- habilita RLS;
- modifica backend;
- modifica runtime;
- despliega infraestructura.

## 13. Criterios de aceptación G12-B01

G12-B01 quedará acreditado cuando:

- existan exactamente 23 decisiones `G12-D01` a `G12-D23`;
- no existan identificadores duplicados;
- todas posean autoridad precedente;
- todas posean gate de resolución;
- todas comiencen en estado `PENDIENTE`;
- exista una taxonomía cerrada de estados;
- exista una regla explícita de autoridad;
- exista una secuencia de dependencias;
- la baseline 23/23/43/17/10 permanezca protegida;
- G12-B01 no incorpore SQL ejecutable.

## 14. G12-B02 — Plataforma PostgreSQL/Supabase y UUID

### 14.1 Evidencia del entorno

La inspección read-only G12-B02-PRE fue ejecutada directamente sobre el proyecto objetivo CATU E-R mediante el SQL Editor de Supabase.

El entorno acreditado reportó:

| Propiedad | Valor observado |
|---|---|
| Plataforma de base de datos | PostgreSQL |
| `server_version` | `17.11` |
| Base consultada | `postgres` |
| Usuario de inspección | `postgres` |
| Schema actual | `public` |
| Supabase Auth detectado | `true` |
| Supabase Storage detectado | `true` |
| Schema `extensions` detectado | `true` |
| `gen_random_uuid()` disponible | `true` |
| `uuid_generate_v4()` disponible | `true` |
| `uuidv7()` disponible | `false` |
| `pgcrypto` instalada | `1.3` |
| `pgcrypto` disponible | `1.3` |
| `uuid-ossp` instalada | `1.1` |
| `uuid-ossp` disponible | `1.1` |

La inspección no creó, modificó ni eliminó objetos de base de datos.

### 14.2 G12-D01 — PostgreSQL objetivo

**Estado:** `RESUELTA`

Se adopta como entorno objetivo observado para la baseline CATU E-R 0.2.0:

`PostgreSQL 17.11`

La generación posterior de DDL deberá validarse contra PostgreSQL 17.11 mientras esta baseline permanezca vigente.

Un cambio de versión mayor requerirá revalidación explícita de compatibilidad.

Un cambio de versión menor deberá someterse al control de actualización definido para el proyecto antes de promover migraciones.

### 14.3 G12-D02 — Supabase y capacidades del entorno

**Estado:** `RESUELTA`

Se adopta Supabase como plataforma PostgreSQL administrada para el entorno objetivo.

CATU no fijará una versión comercial o de interfaz de Supabase como parte de la semántica persistente.

El contrato técnico de G12 se apoyará en capacidades verificables del entorno.

Para esta baseline se acreditan:

- PostgreSQL administrado disponible;
- Supabase Auth disponible;
- Supabase Storage disponible;
- schema `extensions` disponible;
- `pgcrypto` 1.3 instalada;
- `uuid-ossp` 1.1 instalada.

La existencia de una extensión no implica obligación de utilizarla.

Las capacidades que sean necesarias para un gate posterior deberán verificarse nuevamente antes de generar o ejecutar artefactos dependientes de ellas.

### 14.4 G12-D03 — Estrategia UUID

**Estado:** `RESUELTA`

Las claves técnicas identificadas como UUID utilizarán:

- tipo físico: `uuid`;
- generación por defecto candidata: `gen_random_uuid()`;
- versión UUID: v4.

`gen_random_uuid()` se adopta como mecanismo canónico porque se encuentra disponible en el PostgreSQL 17.11 objetivo y no requiere introducir una dependencia funcional de `uuid-ossp`.

Aunque `uuid_generate_v4()` se encuentra disponible, no será el mecanismo canónico para CATU E-R 0.2.0.

La presencia de `pgcrypto` no se utilizará como fundamento para la generación UUID, aun cuando la extensión esté instalada.

`uuidv7()` no forma parte de esta baseline porque la capacidad no fue detectada en el entorno inspeccionado.

La adopción futura de UUIDv7 requerirá una decisión arquitectónica explícita y no podrá efectuarse como sustitución silenciosa de UUIDv4.

### 14.5 Invariantes de G12-B02

Las decisiones D01-D03 no modifican:

- las 23 entidades canónicas;
- las 23 PK;
- las 43 FK;
- las 17 UQ;
- las 10 CHECK;
- los 18 índices candidatos;
- SM-ER;
- SM-DIS;
- ER-T07;
- RBAC;
- SoD;
- denegación por defecto;
- trazabilidad causal;
- historia no destructiva.

### 14.6 Frontera

G12-B02 define plataforma y convenciones de identidad técnica.

G12-B02 no:

- genera `CREATE TABLE`;
- genera `ALTER TABLE`;
- genera migraciones ejecutables;
- crea extensiones;
- modifica extensiones;
- crea funciones;
- crea triggers;
- habilita RLS;
- modifica Auth;
- modifica Storage;
- despliega infraestructura.

La existencia de SQL histórico o preliminar en el repositorio no constituye autorización para su ejecución bajo G12.

### 14.7 Resultado de decisión

Al cierre de G12-B02:

- `G12-D01` queda `RESUELTA`;
- `G12-D02` queda `RESUELTA`;
- `G12-D03` queda `RESUELTA`.

Las siguientes decisiones habilitadas para análisis son:

- `G12-D04` — schema físico PostgreSQL definitivo;
- `G12-D05` — convención definitiva de nombres físicos;
- `G12-D06` — semántica ejecutable `RESTRICT` frente a `NO ACTION`.

Su resolución corresponde a G12-B03.

## 15. G12-B03 — Schema físico, nomenclatura y política referencial

### 15.1 Propósito

G12-B03 resuelve las decisiones físicas G12-D04, G12-D05 y G12-D06 sin generar todavía DDL ejecutable.

Las decisiones de este gate preservan la autoridad de POST-RLS-G10 y las convenciones aprobadas en POST-RLS-G11.

### 15.2 G12-D04 — Schema físico PostgreSQL definitivo

**Estado:** `RESUELTA`

Se adopta como namespace canónico de persistencia de CATU E-R:

`catu`

Las 23 tablas canónicas de CATU E-R deberán materializarse posteriormente dentro del schema `catu`.

La referencia física completa adoptará la forma:

`catu.<tabla>`

Ejemplos documentales:

- `catu.municipio`
- `catu.periodo_entrega_recepcion`
- `catu.actor_funcional`
- `catu.discrepancia`
- `catu.evento_trazabilidad`

El schema `public` no constituirá el namespace canónico de las tablas CATU.

Los schemas administrados por Supabase, incluidos `auth`, `storage` y `extensions`, permanecerán separados del namespace funcional de CATU.

La exposición futura de `catu` mediante Data API, sus grants, RLS y privilegios no se autoriza en G12-B03 y deberá resolverse en los gates de seguridad correspondientes.

El DDL ejecutable futuro deberá utilizar nombres calificados con schema en los puntos donde la resolución inequívoca del objeto sea relevante, evitando depender implícitamente de `search_path`.

### 15.3 G12-D05 — Convención definitiva de nombres físicos

**Estado:** `RESUELTA`

G12 adopta y consolida las convenciones nominales de G11.

#### G12-NAM01 — Identificadores generales

Los identificadores físicos utilizarán:

- minúsculas;
- ASCII;
- `snake_case`;
- ausencia de espacios;
- ausencia de caracteres acentuados;
- ausencia ordinaria de quoted identifiers.

#### G12-NAM02 — Tablas

Las tablas conservarán el nombre lógico singular aprobado en G10/G11.

No se pluralizarán.

#### G12-NAM03 — Columnas

Las columnas utilizarán `snake_case`.

Las PK técnicas conservarán:

`<entidad>_id`

No se utilizará `id` como denominación genérica de PK canónica.

#### G12-NAM04 — Primary keys

Nombre físico:

`pk_<tabla>`

#### G12-NAM05 — Foreign keys

Nombre físico:

`fk_<tabla>__<columna_fk>`

#### G12-NAM06 — Restricciones UNIQUE

Nombre físico:

`uq_<tabla>__<columnas>`

Cuando el nombre completo exceda una longitud segura deberá emplearse una abreviatura determinista, gobernada y trazable.

#### G12-NAM07 — Restricciones CHECK

Nombre físico:

`ck_<tabla>__<regla>`

#### G12-NAM08 — Índices

Nombre físico:

`ix_<tabla>__<columnas>`

#### G12-NAM09 — Funciones

Las funciones propias de CATU utilizarán:

`fn_<dominio>__<proposito>`

La definición efectiva de funciones permanece diferida a G12-B09.

#### G12-NAM10 — Triggers

Los triggers propios de CATU utilizarán:

`trg_<tabla>__<evento>__<proposito>`

La definición efectiva de triggers permanece diferida a G12-B09.

#### G12-NAM11 — Políticas RLS

Las políticas propias de CATU utilizarán:

`pol_<tabla>__<operacion>__<proposito>`

La definición efectiva de RLS permanece diferida a G12-B10.

#### G12-NAM12 — Longitud

Ningún identificador deberá depender del truncamiento automático de PostgreSQL para obtener unicidad.

La baseline utilizará como límite operativo máximo:

`63 bytes`

Los nombres potencialmente superiores deberán reducirse mediante abreviaturas deterministas antes de generar DDL.

#### G12-NAM13 — Calificación de schema

Los artefactos ejecutables posteriores deberán preferir referencias explícitas:

`catu.<objeto>`

cuando la omisión del schema pueda introducir ambigüedad o dependencia de configuración de sesión.

### 15.4 G12-D06 — RESTRICT versus NO ACTION

**Estado:** `RESUELTA`

La política referencial canónica de las 43 FK será:

`ON UPDATE RESTRICT`

y:

`ON DELETE RESTRICT`

G12 preserva literalmente la política establecida por POST-RLS-G10 y documentada por POST-RLS-G11.

No se sustituirá silenciosamente `RESTRICT` por `NO ACTION`.

### 15.5 Semántica PostgreSQL adoptada

En PostgreSQL, `NO ACTION` y `RESTRICT` producen rechazo cuando una modificación viola integridad referencial.

La diferencia relevante para CATU es temporal:

- `NO ACTION` puede participar en comprobación diferida cuando el constraint es diferible;
- `RESTRICT` impide diferir la comprobación de la acción referencial.

CATU adopta `RESTRICT` porque la baseline exige una política de denegación estructural inmediata y no contempla que una operación temporalmente inconsistente sea regularizada posteriormente dentro de la misma transacción como mecanismo ordinario de negocio.

### 15.6 Deferrabilidad

Las 43 FK canónicas deberán declararse:

`NOT DEFERRABLE`

La declaración será explícita aunque PostgreSQL utilice `NOT DEFERRABLE` como comportamiento predeterminado.

No se autoriza para las 43 FK canónicas:

- `DEFERRABLE`;
- `INITIALLY DEFERRED`;
- `ON DELETE CASCADE`;
- `ON UPDATE CASCADE`;
- sustitución general por `NO ACTION`.

Una excepción futura requerirá decisión arquitectónica explícita y trazable.

### 15.7 Dependencias circulares

La política `RESTRICT` no impide que determinadas FK sean incorporadas después de crear las tablas cuando así lo requiera el grafo de dependencias.

La secuencia de creación y la incorporación diferida de constraints se resolverán en G12-B05.

Diferir la creación física de una FK durante una migración no equivale a declarar el constraint como `DEFERRABLE`.

### 15.8 Integridad de la baseline

G12-B03 preserva:

- 23 entidades canónicas;
- 23 PK;
- 43 FK;
- 17 UQ;
- 10 CHECK;
- 18 índices candidatos;
- SM-ER;
- SM-DIS;
- ER-T07;
- RBAC;
- SoD;
- denegación por defecto;
- evidencia histórica;
- trazabilidad causal.

### 15.9 Frontera de G12-B03

G12-B03 resuelve exclusivamente namespace, nomenclatura y semántica referencial.

G12-B03 no:

- crea el schema `catu`;
- crea tablas;
- crea constraints;
- crea índices;
- crea funciones;
- crea triggers;
- crea políticas RLS;
- concede grants;
- modifica `search_path`;
- modifica Supabase;
- ejecuta migraciones;
- genera todavía archivos `.sql`.

### 15.10 Resultado de decisión

Al cierre de G12-B03:

- `G12-D04` queda `RESUELTA`;
- `G12-D05` queda `RESUELTA`;
- `G12-D06` queda `RESUELTA`.

Quedan habilitadas las decisiones relativas a la materialización detallada del diccionario físico y posteriormente al grafo de dependencias.

## 16. G12-B04 — Diccionario físico de las 23 entidades

### 16.1 Propósito

G12-B04 materializa documentalmente el diccionario físico completo de las
23 entidades canónicas de CATU E-R sobre el namespace `catu`.

La autoridad estructural permanece en POST-RLS-G10 y POST-RLS-G11.

Este gate no redefine el dominio ni introduce columnas nuevas.

La incorporación del diccionario se realiza mediante derivación controlada
de las secciones 16.2 a 16.24 de POST-RLS-G11, evitando transcripción manual.

Las tablas utilizarán la forma física:

`catu.<tabla>`

Los tipos PostgreSQL documentados en el diccionario quedan adoptados para la
baseline G12, sujetos únicamente a las reglas posteriores expresamente
diferidas de integridad procedural, seguridad y concurrencia.

La estrategia UUID aprobada en G12-B02 permanece vigente:

- tipo físico `uuid`;
- generación canónica mediante `gen_random_uuid()`;
- UUID v4.

La incorporación de cláusulas `DEFAULT` concretas al DDL se realizará en el
gate de generación ejecutable correspondiente y no se renderiza todavía como
SQL en G12-B04.

### 16.2 G10-M01 — MUNICIPIO

#### Tabla física `catu.municipio`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
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

#### Tabla física `catu.periodo_entrega_recepcion`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `periodo_er_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `municipio_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.municipio.municipio_id` |
| `codigo` | `D_CODE` | `text` | NOT NULL | identificador funcional |
| `fecha_inicio` | `D_DATE_REQ` | `date` | NOT NULL | inicio del periodo |
| `fecha_fin` | `D_DATE_OPT` | `date` | NULL permitido | término previsto o efectivo |
| `estado_er_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | referencia a estado funcional |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `periodo_er_id`.

### 16.4 G10-M03 — UNIDAD_ADMINISTRATIVA

#### Tabla física `catu.unidad_administrativa`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `unidad_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `municipio_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.municipio.municipio_id` |
| `codigo` | `D_CODE` | `text` | NOT NULL | código institucional |
| `nombre` | `D_TEXT_REQ` | `text` | NOT NULL | denominación |
| `activo` | `D_BOOL_REQ` | `boolean` | NOT NULL | vigencia |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `unidad_id`.

### 16.5 G10-M04 — ACTOR_FUNCIONAL

#### Tabla física `catu.actor_funcional`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
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

#### Tabla física `catu.acto_entrega_recepcion`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `acto_er_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `periodo_er_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.periodo_entrega_recepcion.periodo_er_id` |
| `codigo` | `D_CODE` | `text` | NOT NULL | identificador funcional |
| `fecha_acto` | `D_DATE_REQ` | `date` | NOT NULL | fecha formal |
| `estado_er_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | estado vigente de SM-ER |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `acto_er_id`.

### 16.7 G10-M06 — OBJETO_REVISION

#### Tabla física `catu.objeto_revision`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `objeto_revision_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `acto_er_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.acto_entrega_recepcion.acto_er_id` |
| `unidad_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.unidad_administrativa.unidad_id` |
| `codigo` | `D_CODE` | `text` | NOT NULL | identificador del objeto |
| `tipo_objeto` | `D_CODE` | `text` | NOT NULL | clasificación funcional |
| `descripcion` | `D_TEXT_REQ` | `text` | NOT NULL | objeto sujeto a revisión |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `objeto_revision_id`.

### 16.8 G10-M07 — ROL_FUNCIONAL

#### Tabla física `catu.rol_funcional`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
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

#### Tabla física `catu.capacidad_funcional`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
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

#### Tabla física `catu.rol_capacidad`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `rol_capacidad_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `rol_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.rol_funcional.rol_id` |
| `capacidad_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.capacidad_funcional.capacidad_id` |
| `tipo_asignacion` | `D_CODE` | `text` | NOT NULL | E, E*, P, C o equivalente aprobado |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |

PK canónica: `rol_capacidad_id`.

### 16.11 G10-M10 — ASIGNACION_FUNCIONAL

#### Tabla física `catu.asignacion_funcional`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `asignacion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `actor_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.actor_funcional.actor_id` |
| `rol_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.rol_funcional.rol_id` |
| `periodo_er_id` | `D_UUID_FK_OPT` | `uuid` | NULL permitido | alcance temporal/contextual |
| `unidad_id` | `D_UUID_FK_OPT` | `uuid` | NULL permitido | alcance organizacional |
| `vigente_desde` | `D_TS_REQ` | `timestamptz` | NOT NULL | inicio |
| `vigente_hasta` | `D_TS_OPT` | `timestamptz` | NULL permitido | término |
| `revocada_at` | `D_TS_OPT` | `timestamptz` | NULL permitido | revocación |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `asignacion_id`.

### 16.12 G10-M11 — ESTADO_FUNCIONAL

#### Tabla física `catu.estado_funcional`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
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

#### Tabla física `catu.transicion_funcional`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `transicion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `maquina_codigo` | `D_CODE` | `text` | NOT NULL | SM-ER o SM-DIS |
| `codigo` | `D_CODE` | `text` | NOT NULL | identificador canónico |
| `nombre` | `D_TEXT_REQ` | `text` | NOT NULL | denominación |
| `estado_origen_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.estado_funcional.estado_id` |
| `estado_destino_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.estado_funcional.estado_id` |
| `capacidad_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | capacidad requerida |
| `activa` | `D_BOOL_REQ` | `boolean` | NOT NULL | vigencia |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |

PK canónica: `transicion_id`.

### 16.14 G10-M13 — CONTROL

#### Tabla física `catu.control`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
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

#### Tabla física `catu.evaluacion`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `evaluacion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `control_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.control.control_id` |
| `objeto_revision_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.objeto_revision.objeto_revision_id` |
| `actor_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | evaluador |
| `resultado_codigo` | `D_CODE` | `text` | NOT NULL | resultado funcional |
| `comentario` | `D_TEXT_OPT` | `text` | NULL permitido | justificación |
| `evaluada_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | persistencia |

PK canónica: `evaluacion_id`.

### 16.16 G10-M15 — OBSERVACION

#### Tabla física `catu.observacion`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `observacion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `evaluacion_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.evaluacion.evaluacion_id` |
| `actor_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | autor |
| `tipo_observacion` | `D_CODE` | `text` | NOT NULL | clasificación |
| `contenido` | `D_TEXT_REQ` | `text` | NOT NULL | contenido sustantivo |
| `criticidad` | `D_CODE` | `text` | NOT NULL | nivel |
| `observada_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | persistencia |

PK canónica: `observacion_id`.

### 16.17 G10-M16 — VALIDACION

#### Tabla física `catu.validacion`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `validacion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `evaluacion_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.evaluacion.evaluacion_id` |
| `actor_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | validador |
| `resultado_codigo` | `D_CODE` | `text` | NOT NULL | resultado |
| `fundamento` | `D_TEXT_OPT` | `text` | NULL permitido | motivación |
| `validada_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | persistencia |

PK canónica: `validacion_id`.

### 16.18 G10-M17 — EVIDENCIA

#### Tabla física `catu.evidencia`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
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

#### Tabla física `catu.discrepancia`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `discrepancia_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `acto_er_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.acto_entrega_recepcion.acto_er_id` |
| `objeto_revision_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.objeto_revision.objeto_revision_id` |
| `estado_dis_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | estado vigente de SM-DIS |
| `codigo` | `D_CODE` | `text` | NOT NULL | identificador funcional |
| `descripcion` | `D_TEXT_REQ` | `text` | NOT NULL | contenido sustantivo |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación |
| `updated_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | modificación controlada |
| `row_version` | `D_INT_REQ` | `integer` | NOT NULL | concurrencia optimista |

PK canónica: `discrepancia_id`.

### 16.20 G10-M19 — SOLICITUD_ACLARACION

#### Tabla física `catu.solicitud_aclaracion`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `solicitud_aclaracion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `discrepancia_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.discrepancia.discrepancia_id` |
| `actor_solicitante_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.actor_funcional.actor_id` |
| `secuencia` | `D_INT_REQ` | `integer` | NOT NULL | ordinal dentro de la Discrepancia |
| `motivo` | `D_TEXT_REQ` | `text` | NOT NULL | fundamento de la solicitud |
| `solicitada_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante de solicitud |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación persistente |

PK canónica: `solicitud_aclaracion_id`.

### 16.21 G10-M20 — ACLARACION

#### Tabla física `catu.aclaracion`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `aclaracion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `solicitud_aclaracion_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.solicitud_aclaracion.solicitud_aclaracion_id` |
| `actor_presenta_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.actor_funcional.actor_id` |
| `contenido` | `D_TEXT_REQ` | `text` | NOT NULL | respuesta sustantiva |
| `presentada_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante de presentación |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación persistente |

PK canónica: `aclaracion_id`.

### 16.22 G10-M21 — RESOLUCION

#### Tabla física `catu.resolucion`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `resolucion_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `discrepancia_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.discrepancia.discrepancia_id` |
| `actor_resolutor_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.actor_funcional.actor_id` |
| `resultado_estado_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.estado_funcional.estado_id` |
| `fundamento` | `D_TEXT_REQ` | `text` | NOT NULL | motivación de la decisión |
| `resuelta_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante de resolución |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | creación persistente |

PK canónica: `resolucion_id`.

### 16.23 G10-M22 — VINCULO_EVIDENCIA

#### Tabla física `catu.vinculo_evidencia`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
|---|---|---|---|---|
| `vinculo_evidencia_id` | `D_UUID_PK` | `uuid` | NOT NULL | PK |
| `evidencia_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | FK → `catu.evidencia.evidencia_id` |
| `entity_type` | `D_CODE` | `text` | NOT NULL | tipo de entidad vinculada |
| `entity_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | identidad lógica vinculada |
| `uso_evidencia` | `D_CODE` | `text` | NOT NULL | finalidad probatoria |
| `actor_vincula_id` | `D_UUID_FK_REQ` | `uuid` | NOT NULL | actor que crea vínculo |
| `created_at` | `D_TS_REQ` | `timestamptz` | NOT NULL | instante de vinculación |

PK canónica: `vinculo_evidencia_id`.

### 16.24 G10-M23 — EVENTO_TRAZABILIDAD

#### Tabla física `catu.evento_trazabilidad`

| Columna | Dominio G10 | Tipo PostgreSQL G12 | Nulabilidad | Restricción conceptual |
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

### 16.25 Baseline estructural autoritativa

La materialización de G12-B04 deberá preservar exactamente:

| Elemento | Baseline vigente |
|---|---:|
| Entidades | 23 |
| PK | 23 |
| FK | 43 |
| UQ | 17 |
| CHECK | 10 |
| Índices candidatos | 18 |

La cantidad autoritativa de restricciones de unicidad es **17**.

Cualquier referencia histórica previa a 12 UQ queda subordinada a la
reconciliación canónica ya aprobada en POST-RLS-G10 y POST-RLS-G11.

G12 no reabre dicha reconciliación.

### 16.26 Reglas de materialización documental B04

#### G12-B04-R01 — Cobertura cerrada

El diccionario deberá contener exactamente las 23 entidades canónicas
G10-M01 a G10-M23.

#### G12-B04-R02 — Identidad nominal

Los nombres físicos de tabla deberán conservar exactamente los nombres
singulares aprobados en G10/G11 y utilizar el schema `catu`.

#### G12-B04-R03 — Sin columnas inferidas

No se incorporarán columnas por conveniencia técnica, de interfaz, de
Supabase o de implementación.

#### G12-B04-R04 — Tipos preservados

Los tipos físicos deberán corresponder al diccionario heredado de G11:

- `uuid`;
- `text`;
- `date`;
- `timestamptz`;
- `boolean`;
- `integer`;
- `jsonb`;

según corresponda a cada atributo.

#### G12-B04-R05 — Nulabilidad preservada

`NOT NULL` y la nulabilidad permitida deberán conservar la semántica aprobada
en G10/G11.

#### G12-B04-R06 — PK preservadas

Cada entidad conservará exactamente una PK técnica canónica.

La estrategia general de generación UUID permanece gobernada por G12-D03.

#### G12-B04-R07 — Relaciones no reinterpretadas

Las referencias FK documentadas conservan su significado canónico.

La secuencia física de creación y el tratamiento de dependencias se resolverán
en G12-B05.

#### G12-B04-R08 — Unicidades reconciliadas

La autoridad vigente es G10-UQ01 a G10-UQ17.

G12-B04 no restaurará la matriz histórica de 12 UQ.

#### G12-B04-R09 — CHECK preservados

La baseline mantiene G10-CK01 a G10-CK10.

Su expresión SQL definitiva se materializará en un gate posterior sin alterar
su semántica.

#### G12-B04-R10 — Integridad superior diferida

No se resolverán todavía mediante SQL declarativo simple:

- ER-T07;
- RBAC;
- SoD;
- referencia polimórfica;
- append-only;
- consistencia causal;
- promoción Observación → Discrepancia;
- validación transaccional de máquinas de estado.

#### G12-B04-R11 — Sin SQL ejecutable

G12-B04 constituye especificación física materializable.

No crea objetos en PostgreSQL ni modifica Supabase.

### 16.27 Frontera de G12-B04

G12-B04 no:

- ejecuta DDL;
- crea el schema `catu`;
- crea tablas reales;
- crea constraints;
- crea índices;
- crea funciones;
- crea triggers;
- crea políticas RLS;
- crea seeds;
- concede permisos;
- modifica Auth;
- modifica Storage;
- modifica Supabase;
- genera migraciones ejecutables.

No se modifica todavía el estado de G12-D07, G12-D08 ni G12-D09.

Estas decisiones corresponden a G12-B05.

### 16.28 Resultado esperado

El cierre de G12-B04 deberá acreditar identidad atributo por atributo entre
el diccionario físico aprobado en G11 y las 23 tablas materializables bajo
el schema `catu`, manteniendo la baseline:

23 entidades / 23 PK / 43 FK / 17 UQ / 10 CHECK / 18 índices candidatos.

G12-B04 no autoriza todavía la creación de objetos en PostgreSQL.

## 17. G12-B05 — Grafo de dependencias y estrategia FK

### 17.1 Propósito

G12-B05 resuelve las decisiones G12-D07, G12-D08 y G12-D09 relativas a la
secuencia física de materialización, dependencias entre tablas y tratamiento
ejecutable futuro de las 43 claves foráneas canónicas.

La única autoridad para relaciones FK en este gate es el catálogo
`G10-FK01` a `G10-FK43`.

G12-B05 no infiere relaciones adicionales a partir del nombre de columnas,
dominios candidatos ni semántica aparente.

### 17.2 Principio de materialización

La materialización física se dividirá conceptualmente en dos etapas:

1. creación de las 23 tablas en orden topológico;
2. incorporación posterior de las 43 FK canónicas.

Esta separación elimina dependencia accidental del orden de declaración de
FK durante la creación inicial de tablas y permite tratar de manera uniforme
las autorreferencias.

La incorporación posterior de una FK no modifica su semántica transaccional.

Todas las FK continuarán gobernadas por:

- `ON UPDATE RESTRICT`;
- `ON DELETE RESTRICT`;
- `NOT DEFERRABLE`.

La expresión “post-creación” no significa `DEFERRABLE`.

### 17.3 Grafo de dependencias

Para efectos del orden de creación:

- una tabla hija depende de la existencia de su tabla padre;
- las autorreferencias no constituyen ciclos intertabla;
- la referencia causal de `evento_trazabilidad` se incorpora después de
  existir la propia tabla.

El grafo intertabla derivado de `G10-FK01..G10-FK43` es acíclico.

### 17.4 Orden topológico canónico

| Nivel | Tablas materializables | Cantidad |
|---|---|---:|
| L0 | `catu.capacidad_funcional`, `catu.estado_funcional`, `catu.municipio`, `catu.rol_funcional` | 4 |
| L1 | `catu.periodo_entrega_recepcion`, `catu.rol_capacidad`, `catu.transicion_funcional`, `catu.unidad_administrativa` | 4 |
| L2 | `catu.acto_entrega_recepcion`, `catu.actor_funcional`, `catu.control` | 3 |
| L3 | `catu.asignacion_funcional`, `catu.evento_trazabilidad`, `catu.evidencia`, `catu.objeto_revision` | 4 |
| L4 | `catu.discrepancia`, `catu.evaluacion`, `catu.vinculo_evidencia` | 3 |
| L5 | `catu.observacion`, `catu.resolucion`, `catu.solicitud_aclaracion`, `catu.validacion` | 4 |
| L6 | `catu.aclaracion` | 1 |

El orden entre tablas pertenecientes al mismo nivel no expresa precedencia
funcional adicional.

### 17.5 Catálogo de materialización de las 43 FK

| ID | Tabla hija | Columna FK | Tabla padre | Cardinalidad | Estrategia |
|---|---|---|---|---|---|
| G10-FK01 | `catu.periodo_entrega_recepcion` | `municipio_id` | `catu.municipio` | N:1 | post-creación |
| G10-FK02 | `catu.unidad_administrativa` | `municipio_id` | `catu.municipio` | N:1 | post-creación |
| G10-FK03 | `catu.acto_entrega_recepcion` | `periodo_er_id` | `catu.periodo_entrega_recepcion` | N:1 | post-creación |
| G10-FK04 | `catu.objeto_revision` | `acto_er_id` | `catu.acto_entrega_recepcion` | N:1 | post-creación |
| G10-FK05 | `catu.objeto_revision` | `unidad_id` | `catu.unidad_administrativa` | N:1 | post-creación |
| G10-FK06 | `catu.discrepancia` | `acto_er_id` | `catu.acto_entrega_recepcion` | N:1 | post-creación |
| G10-FK07 | `catu.discrepancia` | `objeto_revision_id` | `catu.objeto_revision` | N:1 | post-creación |
| G10-FK08 | `catu.actor_funcional` | `municipio_id` | `catu.municipio` | N:1 | post-creación |
| G10-FK09 | `catu.actor_funcional` | `unidad_id` | `catu.unidad_administrativa` | N:0..1 | post-creación |
| G10-FK10 | `catu.rol_capacidad` | `rol_id` | `catu.rol_funcional` | N:1 | post-creación |
| G10-FK11 | `catu.rol_capacidad` | `capacidad_id` | `catu.capacidad_funcional` | N:1 | post-creación |
| G10-FK12 | `catu.asignacion_funcional` | `actor_id` | `catu.actor_funcional` | N:1 | post-creación |
| G10-FK13 | `catu.asignacion_funcional` | `rol_id` | `catu.rol_funcional` | N:1 | post-creación |
| G10-FK14 | `catu.asignacion_funcional` | `periodo_er_id` | `catu.periodo_entrega_recepcion` | N:0..1 | post-creación |
| G10-FK15 | `catu.asignacion_funcional` | `unidad_id` | `catu.unidad_administrativa` | N:0..1 | post-creación |
| G10-FK16 | `catu.solicitud_aclaracion` | `discrepancia_id` | `catu.discrepancia` | N:1 | post-creación |
| G10-FK17 | `catu.solicitud_aclaracion` | `actor_solicitante_id` | `catu.actor_funcional` | N:1 | post-creación |
| G10-FK18 | `catu.aclaracion` | `solicitud_aclaracion_id` | `catu.solicitud_aclaracion` | 0..1:1 | post-creación |
| G10-FK19 | `catu.aclaracion` | `actor_presenta_id` | `catu.actor_funcional` | N:1 | post-creación |
| G10-FK20 | `catu.resolucion` | `discrepancia_id` | `catu.discrepancia` | 0..1:1 | post-creación |
| G10-FK21 | `catu.resolucion` | `actor_resolutor_id` | `catu.actor_funcional` | N:1 | post-creación |
| G10-FK22 | `catu.resolucion` | `resultado_estado_id` | `catu.estado_funcional` | N:1 | post-creación |
| G10-FK23 | `catu.evidencia` | `periodo_er_id` | `catu.periodo_entrega_recepcion` | N:1 | post-creación |
| G10-FK24 | `catu.evidencia` | `actor_incorpora_id` | `catu.actor_funcional` | N:1 | post-creación |
| G10-FK25 | `catu.vinculo_evidencia` | `evidencia_id` | `catu.evidencia` | N:1 | post-creación |
| G10-FK26 | `catu.vinculo_evidencia` | `actor_vincula_id` | `catu.actor_funcional` | N:1 | post-creación |
| G10-FK27 | `catu.evento_trazabilidad` | `periodo_er_id` | `catu.periodo_entrega_recepcion` | N:1 | post-creación |
| G10-FK28 | `catu.evento_trazabilidad` | `actor_id` | `catu.actor_funcional` | N:1 | post-creación |
| G10-FK29 | `catu.evento_trazabilidad` | `transicion_id` | `catu.transicion_funcional` | N:0..1 | post-creación |
| G10-FK30 | `catu.evento_trazabilidad` | `estado_origen_id` | `catu.estado_funcional` | N:0..1 | post-creación |
| G10-FK31 | `catu.evento_trazabilidad` | `estado_destino_id` | `catu.estado_funcional` | N:0..1 | post-creación |
| G10-FK32 | `catu.evento_trazabilidad` | `causation_id` | `catu.evento_trazabilidad` | N:0..1 | post-creación / autorreferencia |
| G10-FK33 | `catu.transicion_funcional` | `estado_origen_id` | `catu.estado_funcional` | N:1 | post-creación |
| G10-FK34 | `catu.transicion_funcional` | `estado_destino_id` | `catu.estado_funcional` | N:1 | post-creación |
| G10-FK35 | `catu.transicion_funcional` | `capacidad_id` | `catu.capacidad_funcional` | N:1 | post-creación |
| G10-FK36 | `catu.control` | `periodo_er_id` | `catu.periodo_entrega_recepcion` | N:1 | post-creación |
| G10-FK37 | `catu.evaluacion` | `control_id` | `catu.control` | N:1 | post-creación |
| G10-FK38 | `catu.evaluacion` | `objeto_revision_id` | `catu.objeto_revision` | N:1 | post-creación |
| G10-FK39 | `catu.evaluacion` | `actor_id` | `catu.actor_funcional` | N:1 | post-creación |
| G10-FK40 | `catu.observacion` | `evaluacion_id` | `catu.evaluacion` | N:1 | post-creación |
| G10-FK41 | `catu.observacion` | `actor_id` | `catu.actor_funcional` | N:1 | post-creación |
| G10-FK42 | `catu.validacion` | `evaluacion_id` | `catu.evaluacion` | N:1 | post-creación |
| G10-FK43 | `catu.validacion` | `actor_id` | `catu.actor_funcional` | N:1 | post-creación |

### 17.6 Tratamiento de la autorreferencia

`G10-FK32`:

`evento_trazabilidad.causation_id → evento_trazabilidad`

se materializará después de la creación de `catu.evento_trazabilidad`.

Esta estrategia:

- conserva causalidad;
- no introduce una tabla auxiliar;
- no convierte la FK en `DEFERRABLE`;
- no habilita ciclos intertabla;
- mantiene `ON DELETE RESTRICT`;
- mantiene `ON UPDATE RESTRICT`.

### 17.7 Política de constraints

La secuencia futura será:

1. crear schema `catu`;
2. crear las 23 tablas siguiendo L0 a L6;
3. materializar PK;
4. materializar UQ;
5. materializar CHECK;
6. incorporar las 43 FK;
7. crear los índices físicos aprobados;
8. continuar con integridad procedural;
9. habilitar seguridad sólo en los gates correspondientes.

El orden anterior describe arquitectura de migración.

G12-B05 todavía no ejecuta ninguna de estas operaciones.

### 17.8 Invariantes preservados

El grafo y el orden de materialización no podrán alterar:

- 23 entidades;
- 23 PK;
- 43 FK;
- 17 UQ;
- 10 CHECK;
- 18 índices candidatos;
- nulabilidad;
- cardinalidades;
- SM-ER;
- SM-DIS;
- ER-T07;
- RBAC;
- SoD;
- denegación por defecto;
- integridad histórica;
- trazabilidad causal.

### 17.9 Regla de autoridad de relaciones

Una columna cuyo dominio o nombre sugiera una relación no constituye por sí
misma una FK ejecutable.

Sólo podrán materializarse como FK dentro de esta baseline las relaciones
enumeradas expresamente como `G10-FK01..G10-FK43`.

Cualquier relación adicional requerirá decisión arquitectónica formal y una
modificación aprobada de la baseline.

### 17.10 Frontera de G12-B05

G12-B05 no:

- crea schema;
- crea tablas;
- ejecuta `CREATE TABLE`;
- ejecuta `ALTER TABLE`;
- crea FK reales;
- crea índices;
- crea triggers;
- crea funciones;
- crea RLS;
- modifica Supabase;
- modifica Auth;
- modifica Storage;
- ejecuta migraciones;
- genera todavía archivos `.sql`.

### 17.11 Resultado de decisión

Al cierre de G12-B05:

- `G12-D07` queda `RESUELTA`;
- `G12-D08` queda `RESUELTA`;
- `G12-D09` queda `RESUELTA`;
- existe un orden topológico determinista de siete niveles;
- quedan reconciliadas exactamente 43 FK;
- queda aislada la autorreferencia `G10-FK32`;
- no existen ciclos intertabla en la baseline;
- permanece prohibida la generación de DDL ejecutable en este gate.

## 18. G12-B06 — Materialización de referencias polimórficas

### 18.1 Propósito

G12-B06 resuelve `G12-D10 — Materialización de referencias polimórficas`.

La decisión preserva la semántica aprobada en G08, G10 y G11 para las parejas:

- `vinculo_evidencia.entity_type + vinculo_evidencia.entity_id`;
- `evento_trazabilidad.entity_type + evento_trazabilidad.entity_id`.

Una referencia polimórfica no será modelada como una FK relacional ordinaria
única.

### 18.2 Patrón físico adoptado

La materialización utilizará el patrón:

**discriminador controlado + UUID lógico + validación procedural explícita**

donde:

- `entity_type` identifica la clase lógica de la entidad referenciada;
- `entity_id` conserva la PK UUID de la entidad objetivo;
- `entity_type` será `text NOT NULL`;
- `entity_id` será `uuid NOT NULL`;
- la pareja no será contabilizada como FK convencional;
- la existencia de la identidad será comprobada mediante un mecanismo
  procedural explícito antes de aceptar la operación.

Este patrón preserva las 43 FK canónicas sin introducir una relación ficticia.

### 18.3 Catálogo inicial cerrado de tipos

El conjunto inicial autorizado será:

| `entity_type` | Tabla física objetivo | PK objetivo |
|---|---|---|
| `OBJETO_REVISION` | `catu.objeto_revision` | `objeto_revision_id` |
| `DISCREPANCIA` | `catu.discrepancia` | `discrepancia_id` |
| `SOLICITUD_ACLARACION` | `catu.solicitud_aclaracion` | `solicitud_aclaracion_id` |
| `ACLARACION` | `catu.aclaracion` | `aclaracion_id` |
| `RESOLUCION` | `catu.resolucion` | `resolucion_id` |
| `CONTROL` | `catu.control` | `control_id` |
| `EVALUACION` | `catu.evaluacion` | `evaluacion_id` |
| `OBSERVACION` | `catu.observacion` | `observacion_id` |
| `VALIDACION` | `catu.validacion` | `validacion_id` |
| `ACTO_ENTREGA_RECEPCION` | `catu.acto_entrega_recepcion` | `acto_er_id` |

El catálogo es cerrado para la baseline vigente.

La incorporación de una clase adicional requerirá modificación formal de la
baseline y no podrá inferirse por el nombre de una tabla.

### 18.4 Resolución determinista

La futura validación procedural deberá resolver `entity_type` mediante una
tabla de decisión explícita equivalente al catálogo anterior.

No se permitirá:

- interpolar libremente `entity_type` como nombre de tabla;
- aceptar identificadores de tabla suministrados por el cliente;
- construir SQL dinámico a partir de texto no gobernado;
- asumir que un UUID existente en cualquier tabla satisface la referencia.

Cada valor autorizado de `entity_type` deberá corresponder exactamente a una
tabla y una PK canónicas.

### 18.5 Regla de existencia

Para toda referencia polimórfica válida deberán cumplirse simultáneamente:

1. `entity_type` pertenece al catálogo autorizado;
2. `entity_id` no es nulo;
3. existe exactamente una identidad con ese UUID en la tabla correspondiente
   al tipo declarado;
4. tipo e identidad son coherentes.

La existencia del mismo UUID en una tabla distinta no satisface la regla.

### 18.6 Aplicación a `vinculo_evidencia`

`vinculo_evidencia` conservará:

- `evidencia_id`;
- `entity_type`;
- `entity_id`;
- `uso_evidencia`;
- `actor_vincula_id`;
- `created_at`.

La combinación canónica:

`evidencia_id + entity_type + entity_id + uso_evidencia`

continuará gobernada por `G10-UQ11`.

La integridad polimórfica no sustituye dicha unicidad.

Se preserva además `G10-IX15` sobre:

`entity_type, entity_id`

sin crear un índice adicional.

### 18.7 Aplicación a `evento_trazabilidad`

`evento_trazabilidad.entity_type + entity_id` utilizará el mismo mecanismo de
resolución controlada.

La validación polimórfica deberá coexistir con:

- actor causal;
- transición funcional;
- estado origen;
- estado destino;
- correlación;
- causalidad;
- temporalidad;
- metadata;
- semántica append-only.

La referencia polimórfica no sustituirá ninguna de las FK canónicas
`G10-FK27` a `G10-FK32`.

### 18.8 Mecanismo de integridad seleccionado

La integridad definitiva se implementará mediante:

1. columnas físicas `entity_type` y `entity_id`;
2. catálogo lógico cerrado definido por G12-B06;
3. función de validación con despacho explícito por tipo;
4. trigger de integridad sobre las operaciones autorizadas;
5. rechazo transaccional cuando tipo o identidad sean inválidos.

Los puntos 3 y 4 se especificarán y materializarán en `G12-B09`.

G12-B06 define su obligación y semántica, pero no genera todavía la función
ni el trigger.

### 18.9 No se crea una tabla adicional de tipos

G12-B06 no incorpora una entidad o tabla adicional para `entity_type`.

Esta decisión preserva exactamente las 23 entidades canónicas.

El catálogo definido en esta sección constituye una especificación cerrada de
implementación y podrá evolucionar únicamente mediante control formal de
baseline.

### 18.10 No se agrega un CHECK adicional

El catálogo de `entity_type` no se materializará en este gate mediante un
nuevo CHECK.

La baseline continuará preservando exactamente:

- 10 CHECK canónicos;
- 43 FK canónicas;
- 17 UQ;
- 23 PK;
- 18 índices candidatos.

La validación del discriminador pertenecerá al mecanismo procedural de B09.

### 18.11 Seguridad y denegación por defecto

Un `entity_type` desconocido deberá ser rechazado.

Un `entity_id` inexistente deberá ser rechazado.

Una combinación tipo-identidad incoherente deberá ser rechazada.

La futura función de validación no podrá ampliar por sí misma privilegios,
RBAC ni capacidades funcionales.

La política RLS, identidad `external_subject` y privilegios de ejecución
continúan diferidos a `G12-B10`.

### 18.12 Invariantes

G12-B06 preserva:

- 23 entidades;
- 23 PK;
- 43 FK;
- 17 UQ;
- 10 CHECK;
- 18 índices candidatos;
- `G10-UQ11`;
- `G10-IX15`;
- RBAC;
- SoD;
- denegación por defecto;
- SM-ER;
- SM-DIS;
- ER-T07;
- historia no destructiva;
- trazabilidad causal.

### 18.13 Frontera de G12-B06

G12-B06 no:

- crea una FK sobre `entity_id`;
- crea una tabla adicional;
- crea un CHECK adicional;
- genera funciones;
- genera triggers;
- ejecuta SQL;
- crea tablas;
- ejecuta `ALTER TABLE`;
- habilita RLS;
- concede privilegios;
- modifica Supabase;
- modifica Auth;
- modifica Storage;
- genera todavía archivos `.sql`.

### 18.14 Resultado de decisión

Al cierre de G12-B06:

- `G12-D10` queda `RESUELTA`;
- la estrategia física polimórfica queda determinada;
- el catálogo inicial de tipos queda cerrado;
- la resolución tipo-identidad queda definida de forma determinista;
- no se agrega ninguna FK a las 43 existentes;
- no se agrega ninguna entidad a las 23 existentes;
- no se agrega ningún CHECK a los 10 existentes;
- la implementación procedural queda gobernadamente diferida a G12-B09;
- la seguridad de acceso queda diferida a G12-B10.

### 18.15 Contrato de materialización declarativa de G12-B06

El alcance rector de G12-B06 comprende la materialización ejecutable de:

- 23 claves primarias canónicas;
- 43 claves foráneas canónicas;
- 17 restricciones de unicidad canónicas;
- G10-CK01 a G10-CK10 como reglas CHECK canónicas.

La expresión `10 CHECK` identifica diez reglas declarativas canónicas de la
baseline y no implica necesariamente diez objetos SQL físicos uno-a-uno.

Una regla transversal podrá producir más de una instancia física cuando
varias tablas posean el atributo gobernado por la regla.

La expansión física de una regla canónica no modifica el conteo lógico de
G10-CK01 a G10-CK10.

### 18.16 Materialización de PK

Las 23 PK documentadas en el diccionario físico G12-B04 deberán
materializarse exactamente una vez.

Cada PK:

- utilizará la columna primaria aprobada en G10/G12-B04;
- conservará tipo `uuid`;
- conservará `NOT NULL`;
- no será sustituida por una UQ;
- no será duplicada mediante un índice equivalente.

La creación efectiva se integrará al DDL generado en el gate de emisión
correspondiente.

### 18.17 Materialización de UQ

Las restricciones G10-UQ01 a G10-UQ17 constituyen la matriz de unicidad
autoritativa.

Las 17 UQ deberán materializarse de acuerdo con el diccionario físico
reconciliado en G10 y preservado por G12-B04.

Una UQ no deberá generar además un índice no único equivalente salvo que
exista justificación específica de rendimiento.

### 18.18 Materialización de FK

Las relaciones G10-FK01 a G10-FK43 constituyen la matriz referencial
autoritativa.

Las 43 FK deberán materializarse conforme al grafo acreditado en G12-B05.

Como política general:

- `ON UPDATE RESTRICT`;
- `ON DELETE RESTRICT`;
- ausencia de `CASCADE` implícito;
- nulabilidad conforme al diccionario físico;
- creación posterior mediante `ALTER TABLE` cuando el orden topológico lo
  requiera;
- ninguna referencia polimórfica será contabilizada como FK convencional.

La autorreferencia G10-FK32 conservará su tratamiento específico aprobado.

### 18.19 Matriz de materialización de G10-CK

| Regla | Ámbito físico | Materialización |
|---|---|---|
| G10-CK01 | toda tabla que posea `row_version` | `CHECK (row_version >= 1)` por tabla aplicable |
| G10-CK02 | `evidencia.tamano_bytes` | `CHECK (tamano_bytes IS NULL OR tamano_bytes >= 0)` |
| G10-CK03 | `asignacion_funcional.vigente_desde/vigente_hasta` | `CHECK (vigente_hasta IS NULL OR vigente_hasta >= vigente_desde)` |
| G10-CK04 | `estado_funcional.maquina_codigo` | `CHECK (maquina_codigo IN ('SM-ER','SM-DIS'))` |
| G10-CK05 | `transicion_funcional.maquina_codigo` | `CHECK (maquina_codigo IN ('SM-ER','SM-DIS'))` |
| G10-CK06 | `evento_trazabilidad.causation_id/evento_id` | `CHECK (causation_id IS NULL OR causation_id <> evento_id)` |
| G10-CK07 | toda columna obligatoria `codigo` | `CHECK (btrim(codigo) <> '')` por tabla aplicable |
| G10-CK08 | `evidencia.content_hash` | `CHECK (btrim(content_hash) <> '')` |
| G10-CK09 | `solicitud_aclaracion.secuencia` | `CHECK (secuencia > 0)` |
| G10-CK09 | `estado_funcional.orden_logico` | `CHECK (orden_logico IS NULL OR orden_logico > 0)` |
| G10-CK10 | columnas booleanas gobernadas | satisfecho mediante tipo PostgreSQL `boolean` y `NOT NULL` cuando sea obligatorio |

### 18.20 Expansión física de G10-CK01

G10-CK01 se materializará exclusivamente en las tablas que posean
`row_version`.

La inspección del diccionario físico acredita:

1. `municipio`;
2. `periodo_entrega_recepcion`;
3. `unidad_administrativa`;
4. `actor_funcional`;
5. `acto_entrega_recepcion`;
6. `objeto_revision`;
7. `rol_funcional`;
8. `capacidad_funcional`;
9. `asignacion_funcional`;
10. `control`;
11. `evidencia`;
12. `discrepancia`.

Cada instancia conservará la misma autoridad lógica G10-CK01.

### 18.21 Expansión física de G10-CK07

G10-CK07 se materializará sobre cada columna `codigo` obligatoria identificada
en el diccionario físico.

La inspección acredita:

1. `municipio.codigo`;
2. `periodo_entrega_recepcion.codigo`;
3. `unidad_administrativa.codigo`;
4. `actor_funcional.codigo`;
5. `acto_entrega_recepcion.codigo`;
6. `objeto_revision.codigo`;
7. `rol_funcional.codigo`;
8. `capacidad_funcional.codigo`;
9. `estado_funcional.codigo`;
10. `transicion_funcional.codigo`;
11. `control.codigo`;
12. `discrepancia.codigo`.

No se aplicará G10-CK07 a columnas textuales que no tengan semántica de código
canónico.

### 18.22 Materialización de G10-CK10

G10-CK10 establece una regla de representación física y no requiere un CHECK
SQL redundante.

Las propiedades booleanas deberán:

- utilizar el tipo PostgreSQL `boolean`;
- declarar `NOT NULL` cuando el dominio G10 las defina como obligatorias;
- persistir `true` o `false` de manera explícita;
- no codificar estados mediante texto;
- no utilizar `NULL` como tercer estado funcional cuando la propiedad sea
  obligatoria.

En particular, `estado_funcional.es_inicial` y
`estado_funcional.es_terminal` conservarán dicha semántica.

La misma regla aplica a las columnas `activo` y demás booleanos obligatorios
definidos por el diccionario físico.

### 18.23 Conteo lógico versus conteo físico

La baseline se mantiene en:

- 23 entidades;
- 23 PK canónicas;
- 43 FK canónicas;
- 17 UQ canónicas;
- 10 reglas CHECK canónicas;
- 18 índices candidatos.

El número de objetos `CHECK` generados físicamente podrá ser mayor que diez
debido a G10-CK01, G10-CK07 y G10-CK09.

Esto constituye expansión de una regla canónica sobre sus ámbitos físicos,
no creación de nuevas reglas sustantivas.

El generador de DDL deberá conservar trazabilidad desde cada constraint físico
hasta su ID G10-CK de origen.

### 18.24 Orden de materialización declarativa de G12-B06

La generación posterior del DDL deberá respetar:

1. tablas y columnas;
2. PK;
3. UQ y CHECK locales;
4. FK acíclicas;
5. FK diferidas que requieran `ALTER TABLE`;
6. validación estructural posterior.

Funciones, triggers, integridad polimórfica ejecutable, RLS, locking y
aislamiento transaccional permanecen fuera de esta fase.

### 18.25 Resultado reconciliado de G12-B06

Con esta reconciliación G12-B06 deja determinada la materialización
declarativa de:

- 23 PK;
- 43 FK;
- 17 UQ;
- G10-CK01 a G10-CK10.

Se preserva la semántica polimórfica establecida en las secciones 18.1 a
18.14.

La existencia polimórfica continúa diferida a G12-B09.

G12-B06 no ejecuta todavía DDL en PostgreSQL/Supabase y no crea todavía
archivos `.sql`.

#### 19. Estrategia física gobernada de índices

##### 19.1 Propósito

Este bloque consolida la estrategia física de índices derivada de
`G12-B07`, preservando la baseline estructural aprobada y evitando
materialización redundante, especulativa o prematura.

La estrategia distingue expresamente entre:

- índices implícitos derivados de PK;
- índices implícitos derivados de UQ;
- candidatos físicos adicionales;
- estructuras descartadas por redundancia;
- estructuras diferidas por ausencia de evidencia suficiente;
- materialización futura condicionada a validación empírica.

Este bloque constituye especificación física gobernada y no ejecuta DDL.

##### 19.2 Baseline preservada

G12-B07 preserva exactamente:

- 23 entidades;
- 23 PK;
- 43 FK;
- 17 UQ;
- 10 CHECK;
- 18 índices candidatos históricos;
- SM-ER;
- SM-DIS;
- ER-T07;
- RBAC;
- SoD;
- denegación por defecto;
- trazabilidad causal.

La existencia de los 18 índices candidatos históricos no implica que deban
materializarse 18 índices físicos adicionales.

##### 19.3 Regla de cobertura por PK y UQ

Toda PK materializada en PostgreSQL dispondrá de la estructura física
implícita correspondiente.

Toda UQ materializada mediante restricción `UNIQUE` dispondrá igualmente
de su estructura física de soporte.

Por tanto:

- no se duplicará una PK mediante un `CREATE INDEX` equivalente;
- no se duplicará una UQ mediante un `CREATE UNIQUE INDEX` equivalente;
- podrá descartarse un índice adicional cuando una UQ ya cubra de forma
  suficiente el mismo prefijo izquierdo requerido por el patrón de acceso.

##### 19.4 Candidatos descartados por redundancia

Los siguientes candidatos preliminares quedan retirados de la cartera
física adicional:

| ID | Tabla | Propuesta preliminar | Resolución |
|---|---|---|---|
| IX-P01 | `unidad_administrativa` | `(municipio_id)` | REDUNDANTE con UQ `(municipio_id, codigo)` |
| IX-P02 | `actor_funcional` | `(municipio_id)` | REDUNDANTE con UQ `(municipio_id, codigo)` |
| IX-P03 | `acto_entrega_recepcion` | `(periodo_er_id)` | REDUNDANTE con UQ `(periodo_er_id, codigo)` |
| IX-P08 | `solicitud_aclaracion` | `(discrepancia_id)` | REDUNDANTE con UQ `(discrepancia_id, secuencia)` |

La eliminación de estos cuatro candidatos no modifica las 17 UQ canónicas.

##### 19.5 Cartera gobernada de índices físicos adicionales

La cartera física provisional queda reducida a ocho candidatos:

| ID | Tabla | Columnas, en orden | Método previsto | Unique | Finalidad |
|---|---|---|---|---|---|
| IX-P04 | `evaluacion` | `objeto_revision_id` | `btree` | NO | evaluaciones por objeto de revisión |
| IX-P05 | `evaluacion` | `control_id` | `btree` | NO | evaluaciones por control |
| IX-P06 | `observacion` | `evaluacion_id` | `btree` | NO | observaciones por evaluación |
| IX-P07 | `validacion` | `evaluacion_id` | `btree` | NO | validaciones por evaluación |
| IX-P09 | `aclaracion` | `solicitud_aclaracion_id` | `btree` | NO | aclaraciones por solicitud |
| IX-P10 | `vinculo_evidencia` | `entity_type, entity_id` | `btree` | NO | resolución de vínculo polimórfico |
| IX-P11 | `evento_trazabilidad` | `correlation_id, occurred_at` | `btree` | NO | trazabilidad cronológica por correlación |
| IX-P12 | `transicion_funcional` | `estado_origen_id, estado_destino_id` | `btree` | NO | navegación de transición |

Los ocho registros anteriores constituyen candidatos gobernados de diseño.
No equivalen todavía a órdenes `CREATE INDEX` autorizadas.

##### 19.6 Orden de columnas de índices compuestos

Para los candidatos compuestos se fija el siguiente orden:

- `IX-P10`: `entity_type, entity_id`;
- `IX-P11`: `correlation_id, occurred_at`;
- `IX-P12`: `estado_origen_id, estado_destino_id`.

El orden responde al patrón lógico de acceso previsto y a la semántica de
prefijo izquierdo de índices B-tree.

No podrá invertirse el orden de las columnas sin una decisión técnica
posterior sustentada en evidencia de consultas y planes de ejecución.

##### 19.7 Índice polimórfico

`IX-P10` deberá considerar conjuntamente:

- `entity_type`;
- `entity_id`.

No se autoriza un índice aislado sobre `entity_id` para la asociación
polimórfica, debido a que dicho identificador carece de semántica suficiente
sin su discriminador de tipo.

##### 19.8 Trazabilidad correlacionada

`IX-P11` conserva el orden:

`correlation_id, occurred_at`

porque el patrón previsto consiste en recuperar eventos pertenecientes a una
misma correlación y posteriormente ordenarlos temporalmente.

La inclusión de `occurred_at` no autoriza por sí misma un índice temporal
independiente.

##### 19.9 Navegación de transiciones

`IX-P12` conserva el orden:

`estado_origen_id, estado_destino_id`

para permitir navegación por estado de origen y discriminación posterior por
estado de destino.

Este índice no sustituye las reglas de integridad ni la máquina de estados
canónica.

##### 19.10 Candidatos diferidos

Permanecen diferidos, entre otros:

- `causation_id`;
- `vigente_desde`;
- `vigente_hasta`;
- `content_hash`;
- `row_version`;
- `created_at`;
- `updated_at`;
- cualquier índice aislado sobre timestamps;
- cualquier estructura `actor_er_id + codigo` no acreditada;
- cualquier índice adicional derivado únicamente de la existencia de una FK.

Su eventual incorporación requerirá evidencia específica de patrón de acceso.

##### 19.11 Contrato de materialización

Un candidato de esta sección sólo podrá convertirse en índice físico
ejecutable cuando el gate correspondiente acredite, como mínimo:

1. tabla física definitiva;
2. columnas definitivas;
3. orden definitivo de columnas;
4. inexistencia de índice equivalente;
5. inexistencia de cobertura suficiente por PK/UQ;
6. patrón de acceso identificable;
7. cardinalidad o distribución de datos cuando sea relevante;
8. selectividad razonable cuando sea relevante;
9. plan de ejecución verificable;
10. ausencia de degradación desproporcionada en escritura;
11. compatibilidad con PostgreSQL objetivo;
12. trazabilidad hacia esta decisión arquitectónica.

La materialización podrá utilizar `CREATE INDEX` sólo después de superar
los gates posteriores expresamente definidos para ello.

##### 19.12 Validación empírica diferida

La siguiente evidencia queda deliberadamente diferida hasta disponer de un
entorno aislado y datos suficientemente representativos:

- cardinalidad real;
- distribución de valores;
- selectividad real;
- fan-out real;
- frecuencia real de consultas;
- `EXPLAIN`;
- `EXPLAIN ANALYZE`;
- comparación con/sin índice;
- costo de almacenamiento;
- impacto sobre `INSERT`, `UPDATE` y `DELETE`.

No se inventarán valores sustitutos para estas métricas.

##### 19.13 Política de minimización

La política de G12-B07 será mantener la menor cartera física capaz de
justificarse arquitectónicamente.

Por tanto:

- más índices no implica mayor conformidad;
- las 43 FK no implican 43 índices adicionales;
- los 18 candidatos históricos son una cota documental de referencia, no una
  obligación de materialización;
- un índice deberá demostrar utilidad independiente de una PK/UQ existente;
- todo índice compuesto deberá justificar su prefijo izquierdo;
- toda ampliación posterior requerirá trazabilidad de decisión.

##### 19.14 Frontera de implementación

G12-B07 no:

- modifica `backend/supabase/schema.sql`;
- genera todavía migraciones ejecutables;
- ejecuta `CREATE INDEX`;
- ejecuta `CREATE UNIQUE INDEX`;
- ejecuta `ANALYZE`;
- modifica Supabase;
- modifica Auth;
- modifica Storage;
- habilita o modifica RLS;
- aplica migraciones.

La materialización SQL efectiva permanece gobernadamente diferida.

##### 19.15 Resultado de decisión

Al cierre de G12-B07:

- la cartera preliminar de 12 diseños se reduce a 8 candidatos;
- 4 propuestas quedan descartadas por redundancia física;
- PK y UQ conservan su cobertura implícita;
- los 8 candidatos restantes poseen justificación arquitectónica ex ante;
- la selectividad empírica permanece diferida;
- no existe todavía autorización para ejecutar `CREATE INDEX`;
- no se modifica la baseline de 23 entidades, 23 PK, 43 FK, 17 UQ y 10 CHECK;
- no se introduce SQL ejecutable durante esta decisión.

La autorización de materialización deberá producirse exclusivamente en gates
posteriores y mediante evidencia verificable.

#### 20. G12-B08-B03 — Concurrencia optimista gobernada

##### 20.1 Propósito

G12-B08-B03 establece el contrato físico de concurrencia optimista aplicable exclusivamente a las entidades cuya autoridad física aprobada incorpora `row_version`.

Este gate determina la semántica que deberá respetar una implementación posterior en PostgreSQL/Supabase, pero no genera todavía funciones, triggers, sentencias `UPDATE`, migraciones ni modificaciones ejecutables del esquema.

La concurrencia optimista se utilizará para impedir sobrescrituras silenciosas cuando dos actores intenten modificar una misma entidad a partir de versiones diferentes de su estado persistente.

##### 20.2 Ámbito físico autorizado

`row_version` se encuentra autorizado únicamente en las siguientes trece entidades:

| Nº | Entidad | Mecanismo |
|---:|---|---|
| 1 | `ACTOR_FUNCIONAL` | `row_version` |
| 2 | `ACTO_ENTREGA_RECEPCION` | `row_version` |
| 3 | `ASIGNACION_FUNCIONAL` | `row_version` |
| 4 | `CAPACIDAD_FUNCIONAL` | `row_version` |
| 5 | `CONTROL` | `row_version` |
| 6 | `DISCREPANCIA` | `row_version` |
| 7 | `EVENTO_TRAZABILIDAD` | `row_version` |
| 8 | `EVIDENCIA` | `row_version` |
| 9 | `MUNICIPIO` | `row_version` |
| 10 | `OBJETO_REVISION` | `row_version` |
| 11 | `PERIODO_ENTREGA_RECEPCION` | `row_version` |
| 12 | `ROL_FUNCIONAL` | `row_version` |
| 13 | `UNIDAD_ADMINISTRATIVA` | `row_version` |

No se autoriza extender `row_version` por convención a las restantes entidades de la baseline.

##### 20.3 Regla C08-R01 — Estado inicial

Toda instancia nueva de una entidad incluida en el ámbito de concurrencia optimista deberá iniciar conceptualmente con:

`row_version = 1`

La forma ejecutable de asignación del valor inicial se resolverá en un gate posterior.

##### 20.4 Regla C08-R02 — Precondición de actualización

Toda operación de actualización gobernada por concurrencia optimista deberá disponer, como mínimo, de:

- la clave primaria de la instancia que se pretende modificar; y
- el valor de `row_version` conocido por el solicitante al momento de efectuar la lectura previa.

La actualización no podrá basarse exclusivamente en la clave primaria.

##### 20.5 Regla C08-R03 — Coincidencia obligatoria de versión

Una modificación será admisible únicamente cuando el valor de `row_version` suministrado por el solicitante coincida con el valor vigente almacenado para la misma instancia.

Conceptualmente:

`PK solicitada = PK persistida`

y

`row_version esperado = row_version persistido`

constituyen conjuntamente la precondición de concurrencia de una actualización gobernada.

##### 20.6 Regla C08-R04 — Incremento monotónico

Después de una actualización válida, `row_version` deberá incrementarse exactamente en una unidad.

Si la versión aceptada es `N`, la versión resultante será:

`N + 1`

No se autoriza:

- decremento;
- reutilización de versiones anteriores;
- conservación silenciosa de `N` después de una modificación gobernada;
- incremento arbitrario distinto de la política aprobada.

##### 20.7 Regla C08-R05 — Conflicto de concurrencia

Cuando la versión suministrada por el solicitante no coincida con la versión vigente almacenada, la operación deberá considerarse un conflicto de concurrencia.

El resultado deberá equivaler semánticamente a:

- ninguna instancia válida para actualizar bajo la precondición suministrada;
- ninguna sobrescritura silenciosa;
- ninguna sustitución automática del valor persistente;
- señalización explícita del conflicto a la capa solicitante.

##### 20.8 Regla C08-R06 — Prohibición de last-write-wins silencioso

La arquitectura no autoriza una política implícita de `last-write-wins` para las trece entidades gobernadas por `row_version`.

Una solicitud basada en una versión obsoleta no podrá sobrescribir silenciosamente una modificación posterior ya persistida.

##### 20.9 Regla C08-R07 — Separación semántica

`row_version` representa exclusivamente control de concurrencia optimista.

No deberá utilizarse como:

- timestamp;
- clave primaria;
- identificador funcional;
- sustituto de `created_at`;
- sustituto de `updated_at`;
- mecanismo de vigencia temporal;
- indicador de estado funcional;
- mecanismo de auditoría histórica.

Las responsabilidades permanecen separadas:

| Mecanismo | Responsabilidad |
|---|---|
| `row_version` | concurrencia optimista |
| `created_at` | instante de creación |
| `updated_at` | instante de modificación cuando aplique |
| `vigente_desde` | inicio de vigencia |
| `vigente_hasta` | fin de vigencia |
| SM-ER / SM-DIS | estados y transiciones funcionales |
| trazabilidad | historia causal y evidencia |

##### 20.10 Regla C08-R08 — Frontera procedural

La implementación concreta del incremento de `row_version` permanece diferida.

Este gate no decide todavía si el mecanismo ejecutable definitivo se materializará mediante:

- lógica transaccional explícita;
- función PostgreSQL;
- trigger;
- RPC;
- capa de aplicación;
- u otro mecanismo técnicamente compatible con la arquitectura aprobada.

La elección deberá realizarse en un gate posterior con control de atomicidad, seguridad, RLS y comportamiento transaccional.

##### 20.11 Contrato lógico de actualización

El contrato lógico autorizado es:

```text
CLIENTE
    conoce:
        primary_key = K
        row_version = N

SOLICITUD
    modificar entidad K
    condicionada a row_version = N

CASO A — COINCIDENCIA
    versión persistida = N

    resultado:
        modificación aceptada
        row_version resultante = N + 1

CASO B — NO COINCIDENCIA
    versión persistida != N

    resultado:
        modificación rechazada por concurrencia
        ninguna sobrescritura silenciosa
        estado persistente conservado

##### 21. G12-B08-B04 — Política física gobernada de timestamps

###### 21.1 Propósito

G12-B08-B04 establece la política física gobernada para los timestamps del
modelo POST-RLS-G12, preservando exactamente el ámbito materializado en el
diccionario físico G10 y evitando introducir timestamps por mera convención.

La presente decisión distingue expresamente:

- instante de creación;
- instante de modificación;
- concurrencia optimista;
- vigencia temporal;
- terminalidad funcional;
- trazabilidad histórica.

Estas responsabilidades no son intercambiables.

###### 21.2 Autoridad física acreditada

La autoridad física reconstruida desde las 23 entidades G10 establece:

- `created_at` está materializado en las 23 entidades;
- `updated_at` está materializado en 10 entidades;
- toda entidad que posee `updated_at` posee también `created_at`;
- existen 13 entidades que poseen únicamente `created_at`;
- no existe entidad que posea `updated_at` sin `created_at`;
- todos los timestamps físicos usan PostgreSQL `timestamptz`;
- los timestamps materializados son `NOT NULL`.

La cardinalidad física autoritativa es, por tanto:

| Mecanismo | Entidades físicas |
|---|---:|
| `created_at` | 23 |
| `updated_at` | 10 |
| sólo `created_at` | 13 |
| sólo `updated_at` | 0 |

Esta matriz sustituye cualquier conteo documental previo que hubiera
interpretado menciones conceptuales de `updated_at` como materialización física.

###### 21.3 Regla C08-T01 — `created_at`

`created_at` representa exclusivamente el instante persistente de creación de
la fila.

La política física aprobada es:

1. permanece presente en las 23 entidades G10;
2. mantiene tipo `timestamptz`;
3. mantiene nulabilidad `NOT NULL`;
4. no representa versión de concurrencia;
5. no sustituye `row_version`;
6. no representa vigencia funcional;
7. no debe modificarse como consecuencia de una actualización ordinaria.

###### 21.4 Regla C08-T02 — `updated_at`

`updated_at` representa el instante de modificación cuando la semántica física
de la entidad requiere registrar modificaciones posteriores.

La política física aprobada es:

1. permanece únicamente en las 10 entidades donde G10 lo materializa;
2. mantiene tipo `timestamptz`;
3. mantiene nulabilidad `NOT NULL`;
4. no se propagará automáticamente a las 13 entidades restantes;
5. no constituye mecanismo de concurrencia;
6. no sustituye `row_version`;
7. no constituye por sí solo historial de cambios.

###### 21.5 Regla C08-T03 — Relación `created_at` / `updated_at`

El modelo preservará la relación:

`updated_at ⊂ created_at`

En consecuencia:

- toda entidad con `updated_at` deberá conservar `created_at`;
- una entidad puede poseer únicamente `created_at`;
- una entidad no podrá poseer `updated_at` sin `created_at`;
- la ausencia de `updated_at` no constituye defecto estructural cuando G10 no
  lo autoriza.

###### 21.6 Regla C08-T04 — Separación respecto de `row_version`

`row_version` y los timestamps cumplen responsabilidades distintas.

`row_version`:

- gobierna concurrencia optimista;
- participa en la precondición de actualización;
- se incrementa monotónicamente cuando procede.

`created_at` y `updated_at`:

- expresan temporalidad de persistencia;
- no deben emplearse como tokens de concurrencia;
- no sustituyen la comparación de versión.

No se autoriza implementar concurrencia mediante comparación exclusiva de
timestamps.

###### 21.7 Regla C08-T05 — Separación respecto de vigencia temporal

`vigente_desde` y `vigente_hasta` representan vigencia funcional.

No son equivalentes a:

- `created_at`;
- `updated_at`;
- `row_version`.

La vigencia de una relación o asignación puede diferir de sus instantes de
creación o modificación física.

###### 21.8 Regla C08-T06 — `EVENTO_TRAZABILIDAD`

`EVENTO_TRAZABILIDAD` conserva:

- `occurred_at` como instante causal del evento;
- `created_at` como instante de persistencia;
- ausencia física de `updated_at`.

Esta ausencia es deliberada y consistente con la semántica de historia no
destructiva y trazabilidad causal.

G12-B08-B04 no incorporará `updated_at` a `EVENTO_TRAZABILIDAD`.

###### 21.9 Regla C08-T07 — No propagación por convención

No se autoriza añadir un timestamp a una entidad exclusivamente porque otras
entidades lo posean.

Toda ampliación posterior deberá acreditar:

- necesidad funcional;
- semántica temporal;
- impacto transaccional;
- interacción con auditoría;
- interacción con concurrencia;
- compatibilidad con el modelo físico aprobado.

###### 21.10 Regla C08-T08 — Actualización automática diferida

La existencia física de `updated_at` no decide todavía el mecanismo mediante el
cual será actualizado.

Queda diferida la elección entre:

- lógica de aplicación;
- función PostgreSQL;
- trigger;
- RPC;
- otro mecanismo técnicamente compatible.

El mecanismo ejecutable deberá definirse en un gate posterior junto con sus
propiedades de atomicidad, permisos, RLS y comportamiento transaccional.

###### 21.11 Invariantes preservados

G12-B08-B04 preserva íntegramente:

- 23 entidades;
- 23 PK;
- 43 FK;
- 17 UQ;
- 10 CHECK;
- 18 índices candidatos;
- política de concurrencia B03;
- semántica de historia no destructiva;
- separación entre persistencia, concurrencia, vigencia y trazabilidad.

###### 21.12 Frontera de implementación

G12-B08-B04 no:

- modifica `backend/supabase/schema.sql`;
- crea o modifica tablas;
- ejecuta `ALTER TABLE`;
- crea funciones;
- crea triggers;
- habilita o modifica RLS;
- modifica Auth;
- modifica Storage;
- ejecuta migraciones;
- modifica datos;
- impone `updated_at` a las 23 entidades.

La materialización ejecutable permanece gobernadamente diferida.

###### 21.13 Resultado de decisión

Al cierre de G12-B08-B04 queda establecido que:

- `created_at` tiene autoridad física en 23 entidades;
- `updated_at` tiene autoridad física en 10 entidades;
- las 10 entidades con `updated_at` son subconjunto de las 23 con `created_at`;
- las restantes 13 entidades no requieren `updated_at` por simple convención;
- `EVENTO_TRAZABILIDAD` conserva deliberadamente ausencia de `updated_at`;
- los timestamps no sustituyen `row_version`;
- timestamps, concurrencia, vigencia e historia conservan semánticas separadas;
- la automatización efectiva de `updated_at` permanece diferida.

No se genera ni ejecuta DDL en este gate.
