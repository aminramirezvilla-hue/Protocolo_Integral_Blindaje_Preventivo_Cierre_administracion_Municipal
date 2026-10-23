# CATU E-R — Persistencia Física y Modelo de Datos 0.2.0

## 1. Identificación

- Producto: CATU E-R — Blindaje Preventivo Municipal
- Serie: 0.2.x
- Baseline funcional precedente: POST-RLS-G08
- Baseline de origen: `dev/v0.2.0`
- Rama: `docs/post-rls-g09-persistence-v0.2.0`
- Gate: `POST-RLS-G09`
- Naturaleza: documental / arquitectura de datos / persistencia / integridad referencial
- Estado inicial: propuesta para revisión

## 2. Propósito

Definir el modelo lógico y físico de persistencia necesario para materializar de forma consistente los modelos funcionales aprobados en POST-RLS-G05, POST-RLS-G06, POST-RLS-G07 y POST-RLS-G08.

POST-RLS-G09 deberá transformar las entidades, relaciones, estados, capacidades y eventos previamente definidos en estructuras persistentes verificables, sin alterar todavía el comportamiento productivo de CATU E-R.

Este gate no implementa migraciones productivas, backend operativo ni cambios de runtime.

## 3. Objetivo funcional

G09 deberá especificar, como mínimo:

- entidades persistentes;
- identificadores y claves primarias;
- claves foráneas;
- cardinalidades físicas;
- restricciones de integridad;
- persistencia de estados;
- relaciones entre Discrepancias, Aclaraciones y Resoluciones;
- asociación de Evidencias;
- eventos de trazabilidad;
- persistencia de identidad del actor;
- referencias a roles y capacidades efectivas;
- reglas de inmutabilidad histórica;
- versionado lógico;
- timestamps y causalidad;
- estrategia de borrado lógico;
- concurrencia y control de modificación;
- fronteras hacia una futura implementación física.

## 4. Principios rectores

### G09-P01 — Persistencia derivada del dominio

La estructura persistente deberá derivarse del modelo funcional aprobado y no redefinir silenciosamente su semántica.

### G09-P02 — Identidad estable

Toda entidad persistente relevante deberá disponer de identidad inequívoca y estable durante todo su ciclo de vida.

### G09-P03 — Integridad referencial

Las relaciones funcionales obligatorias deberán expresarse mediante referencias persistentes verificables.

### G09-P04 — Estado explícito

Los estados definidos en POST-RLS-G06 deberán persistirse explícitamente y no inferirse exclusivamente a partir de atributos incidentales.

### G09-P05 — Historia no destructiva

Las actuaciones históricas válidamente registradas no deberán perderse mediante actualización destructiva.

### G09-P06 — Trazabilidad causal

Toda actuación sustantiva deberá poder reconstruirse mediante actor, instante, entidad afectada, evento causante y estado resultante.

### G09-P07 — Segregación semántica

Autenticación, autorización, dominio funcional y persistencia deberán conservar responsabilidades separadas.

### G09-P08 — Denegación estructural

La ausencia de relaciones, capacidades o condiciones obligatorias no deberá interpretarse como autorización implícita.

### G09-P09 — Portabilidad

El modelo deberá evitar dependencias innecesarias de un proveedor específico mientras permanezca en fase documental.

### G09-P10 — Evolución controlada

Los cambios posteriores de esquema deberán poder versionarse sin romper silenciosamente el significado histórico de los registros existentes.

## 5. Frontera de POST-RLS-G09

POST-RLS-G09 definirá:

- modelo lógico persistente;
- nombres canónicos de entidades;
- relaciones y cardinalidades;
- claves primarias y foráneas;
- restricciones de unicidad;
- restricciones de nulabilidad;
- estado persistente;
- trazabilidad;
- borrado lógico;
- versionado;
- concurrencia conceptual;
- reglas de integridad;
- criterios para futuras migraciones.

POST-RLS-G09 no implementará todavía:

- SQL productivo;
- migraciones ejecutables;
- tablas reales en Supabase;
- políticas RLS productivas;
- triggers productivos;
- funciones SQL;
- cambios de `app.js`;
- cambios de HTML o CSS;
- cambios del Service Worker;
- sincronización multiusuario;
- despliegue;
- publicación de versión.

## 6. Resultado esperado

Al cierre de POST-RLS-G09 deberá existir una especificación de persistencia suficientemente precisa para transformar el dominio funcional CATU E-R 0.2.x en un esquema implementable, auditable y trazable, sin introducir contradicciones con POST-RLS-G05, POST-RLS-G06, POST-RLS-G07 o POST-RLS-G08.

---

**Estado:** Propuesta para revisión.
**Serie:** CATU E-R 0.2.x.
**Gate:** POST-RLS-G09.
**Naturaleza:** documental / arquitectura de datos / persistencia / integridad referencial.

## 7. Catálogo canónico de entidades persistentes

### 7.1 Criterios de inclusión

Una entidad funcional se incorporará al modelo persistente cuando satisfaga al menos uno de los siguientes criterios:

- posea identidad propia durante su ciclo de vida;
- deba conservar historia independiente;
- participe como extremo de relaciones con integridad referencial;
- constituya un agregado o componente sustantivo del dominio;
- represente una asignación, asociación o vínculo con atributos propios;
- constituya un catálogo normativo o funcional necesario para validar estados, transiciones, roles o capacidades;
- deba ser referenciada inequívocamente por eventos de trazabilidad.

No todo concepto funcional se convertirá automáticamente en tabla física.

La clasificación utilizada en este catálogo es:

- `RAÍZ`: raíz de agregado o contexto persistente;
- `SUBORDINADA`: entidad con identidad propia dependiente de otra entidad del dominio;
- `CATÁLOGO`: conjunto controlado de valores canónicos;
- `ASOCIATIVA`: relación persistente con semántica o atributos propios;
- `EVENTO`: registro histórico inmutable o append-only.

La denominación física definitiva, tipos de datos, PK, FK, índices y restricciones serán especificados en bloques posteriores de POST-RLS-G09.

### G09-E01 — Municipio

- Nombre lógico: `MUNICIPIO`.
- Clasificación: `RAÍZ`.
- Función: delimitar el contexto institucional y territorial dentro del cual se desarrolla uno o más procesos de Entrega-Recepción.
- Identidad: propia y estable.
- Regla: un Municipio podrá contener uno o varios Periodos de Entrega-Recepción.

### G09-E02 — Periodo de Entrega-Recepción

- Nombre lógico: `PERIODO_ENTREGA_RECEPCION`.
- Clasificación: `RAÍZ`.
- Función: representar el agregado principal sobre el cual opera SM-ER.
- Identidad: propia y estable.
- Regla: deberá conservar explícitamente el estado vigente de SM-ER.
- Regla: pertenecerá inequívocamente a un Municipio.

### G09-E03 — Unidad Administrativa

- Nombre lógico: `UNIDAD_ADMINISTRATIVA`.
- Clasificación: `SUBORDINADA`.
- Función: representar las unidades institucionales sujetas al proceso de Entrega-Recepción.
- Identidad: propia dentro del contexto institucional.
- Regla: podrá asociarse con múltiples responsables o actores mediante asignaciones funcionales.

### G09-E04 — Actor Funcional

- Nombre lógico: `ACTOR_FUNCIONAL`.
- Clasificación: `RAÍZ`.
- Función: identificar a la persona o sujeto institucional que realiza, valida, consulta, controla o resuelve actuaciones.
- Identidad: propia y estable.
- Regla: no equivale necesariamente a una cuenta de autenticación.
- Regla: autenticación y autorización permanecerán semánticamente separadas.

### G09-E05 — Asignación Funcional

- Nombre lógico: `ASIGNACION_FUNCIONAL`.
- Clasificación: `ASOCIATIVA`.
- Función: vincular un Actor Funcional con un Rol Funcional dentro de un contexto, alcance y vigencia determinados.
- Identidad: propia cuando deba conservar historia de asignaciones.
- Regla: deberá permitir revocación sin destrucción del antecedente histórico.
- Regla: no otorgará capacidades distintas de las expresamente derivadas de su rol y contexto.

### G09-E06 — Rol Funcional

- Nombre lógico: `ROL_FUNCIONAL`.
- Clasificación: `CATÁLOGO`.
- Función: persistir los roles canónicos definidos en POST-RLS-G07.
- Regla: los códigos funcionales serán estables y versionables.
- Regla: no se inferirán roles a partir de cargos administrativos por simple equivalencia nominal.

### G09-E07 — Capacidad Funcional

- Nombre lógico: `CAPACIDAD_FUNCIONAL`.
- Clasificación: `CATÁLOGO`.
- Función: representar las capacidades canónicas definidas en POST-RLS-G07.
- Regla: la ausencia de capacidad aplicable implicará denegación por defecto.
- Regla: una capacidad no sustituye la validación del estado funcional requerido.

### G09-E08 — Rol-Capacidad

- Nombre lógico: `ROL_CAPACIDAD`.
- Clasificación: `ASOCIATIVA`.
- Función: expresar la matriz persistente entre roles y capacidades.
- Regla: deberá permitir distinguir capacidades ordinarias, condicionadas, preparatorias y de consulta.
- Regla: su existencia no deberá eliminar las restricciones SoD.

### G09-E09 — Estado Funcional

- Nombre lógico: `ESTADO_FUNCIONAL`.
- Clasificación: `CATÁLOGO`.
- Función: registrar los códigos y semántica de estados canónicos definidos en POST-RLS-G06.
- Regla: deberá distinguir el ámbito de la máquina `SM-ER` o `SM-DIS`.
- Regla: los estados terminales deberán identificarse explícitamente.

### G09-E10 — Transición Funcional

- Nombre lógico: `TRANSICION_FUNCIONAL`.
- Clasificación: `CATÁLOGO`.
- Función: registrar las transiciones canónicas aprobadas en POST-RLS-G06.
- Regla: deberá vincular estado origen, evento funcional y estado destino.
- Regla: no constituye por sí misma evidencia de que una transición haya sido ejecutada.

### G09-E11 — Control

- Nombre lógico: `CONTROL`.
- Clasificación: `SUBORDINADA`.
- Función: representar controles preventivos o verificaciones definidas dentro del proceso.
- Identidad: propia.
- Regla: podrá originar Evaluaciones, Observaciones, Validaciones y referencias de Evidencia.

### G09-E12 — Evaluación

- Nombre lógico: `EVALUACION`.
- Clasificación: `SUBORDINADA`.
- Función: registrar el resultado de una evaluación practicada sobre un Control u objeto funcional aplicable.
- Identidad: propia.
- Regla: deberá conservar actor, fecha, resultado y trazabilidad.

### G09-E13 — Observación

- Nombre lógico: `OBSERVACION`.
- Clasificación: `SUBORDINADA`.
- Función: representar un señalamiento preventivo, concurrente o de validación distinto de una Discrepancia.
- Identidad: propia.
- Regla: una Observación no deberá convertirse implícitamente en Discrepancia sin la actuación formal correspondiente.

### G09-E14 — Validación

- Nombre lógico: `VALIDACION`.
- Clasificación: `SUBORDINADA`.
- Función: registrar una actuación formal de comprobación o aprobación funcional.
- Identidad: propia.
- Regla: deberá identificar actor, objeto validado, resultado, instante y evidencia aplicable.

### G09-E15 — Evidencia

- Nombre lógico: `EVIDENCIA`.
- Clasificación: `RAÍZ`.
- Función: identificar de forma estable una evidencia incorporada al proceso.
- Identidad: propia e independiente de las entidades que la referencien.
- Regla: una Evidencia preexistente no deberá duplicarse físicamente por el solo hecho de ser utilizada por múltiples actuaciones.

### G09-E16 — Acto de Entrega-Recepción

- Nombre lógico: `ACTO_ENTREGA_RECEPCION`.
- Clasificación: `SUBORDINADA`.
- Función: representar la formalización del hito de Entrega-Recepción previsto en POST-RLS-G05 y POST-RLS-G06.
- Identidad: propia.
- Regla: deberá vincularse inequívocamente con su Periodo de Entrega-Recepción.
- Regla: podrá originar cero o múltiples Discrepancias durante la revisión entrante.

### G09-E17 — Objeto de Revisión

- Nombre lógico: `OBJETO_REVISION`.
- Clasificación: `SUBORDINADA`.
- Función: proporcionar una referencia estable e inequívoca al elemento concreto revisado que origina o sustenta una Discrepancia.
- Identidad: propia dentro del contexto de revisión.
- Regla: toda Discrepancia deberá referenciar exactamente un Objeto de Revisión.
- Regla: POST-RLS-G09 deberá evitar referencias polimórficas sin integridad verificable.

### G09-E18 — Discrepancia

- Nombre lógico: `DISCREPANCIA`.
- Clasificación: `SUBORDINADA`.
- Función: persistir el objeto formal definido en POST-RLS-G08.
- Identidad: propia y estable.
- Regla: pertenecerá a un Acto de Entrega-Recepción.
- Regla: deberá referenciar exactamente un Objeto de Revisión.
- Regla: deberá conservar explícitamente el estado vigente de SM-DIS.
- Regla: su historia no deberá sustituirse destructivamente.

### G09-E19 — Solicitud de Aclaración

- Nombre lógico: `SOLICITUD_ACLARACION`.
- Clasificación: `SUBORDINADA`.
- Función: representar cada requerimiento formal de aclaración emitido durante el ciclo de una Discrepancia.
- Identidad: propia.
- Regla: deberá pertenecer inequívocamente a una Discrepancia.
- Regla: múltiples solicitudes deberán conservar orden cronológico y causal.

### G09-E20 — Aclaración

- Nombre lógico: `ACLARACION`.
- Clasificación: `SUBORDINADA`.
- Función: persistir cada respuesta formal de la Administración Saliente.
- Identidad: propia e independiente.
- Regla: deberá referenciar inequívocamente la Solicitud de Aclaración que le dio origen.
- Regla: no modificará ni sustituirá silenciosamente Aclaraciones anteriores.

### G09-E21 — Resolución

- Nombre lógico: `RESOLUCION`.
- Clasificación: `SUBORDINADA`.
- Función: persistir la Resolución final de una Discrepancia.
- Identidad: propia.
- Regla: dentro del flujo ordinario sólo podrá existir una Resolución final vigente por Discrepancia.
- Regla: deberá identificar uno de los resultados terminales definidos por SM-DIS.
- Regla: una revisión extraordinaria futura no deberá sobrescribir silenciosamente la Resolución histórica original.

### G09-E22 — Vínculo de Evidencia

- Nombre lógico: `VINCULO_EVIDENCIA`.
- Clasificación: `ASOCIATIVA`.
- Función: relacionar una Evidencia con la actuación o entidad funcional que la utiliza.
- Identidad: propia cuando sea necesario conservar semántica del vínculo.
- Regla: deberá distinguir, al menos, evidencia de origen, evidencia aportada, evidencia de valoración y evidencia considerada en Resolución.
- Regla: no implicará duplicación física de la Evidencia.

### G09-E23 — Evento de Trazabilidad

- Nombre lógico: `EVENTO_TRAZABILIDAD`.
- Clasificación: `EVENTO`.
- Función: registrar de forma histórica y no destructiva las actuaciones relevantes del sistema.
- Regla: su naturaleza será append-only salvo mecanismos extraordinarios expresamente gobernados.
- Regla: deberá permitir identificar como mínimo actor, instante, evento, entidad afectada, identidad de la entidad, estado origen y estado destino cuando exista transición.
- Regla: podrá referenciar una Transición Funcional canónica.
- Regla: constituirá la base para reconstrucción causal y auditoría histórica.

### 7.2 Clasificación consolidada

| Código | Entidad | Clasificación |
|---|---|---|
| G09-E01 | MUNICIPIO | RAÍZ |
| G09-E02 | PERIODO_ENTREGA_RECEPCION | RAÍZ |
| G09-E03 | UNIDAD_ADMINISTRATIVA | SUBORDINADA |
| G09-E04 | ACTOR_FUNCIONAL | RAÍZ |
| G09-E05 | ASIGNACION_FUNCIONAL | ASOCIATIVA |
| G09-E06 | ROL_FUNCIONAL | CATÁLOGO |
| G09-E07 | CAPACIDAD_FUNCIONAL | CATÁLOGO |
| G09-E08 | ROL_CAPACIDAD | ASOCIATIVA |
| G09-E09 | ESTADO_FUNCIONAL | CATÁLOGO |
| G09-E10 | TRANSICION_FUNCIONAL | CATÁLOGO |
| G09-E11 | CONTROL | SUBORDINADA |
| G09-E12 | EVALUACION | SUBORDINADA |
| G09-E13 | OBSERVACION | SUBORDINADA |
| G09-E14 | VALIDACION | SUBORDINADA |
| G09-E15 | EVIDENCIA | RAÍZ |
| G09-E16 | ACTO_ENTREGA_RECEPCION | SUBORDINADA |
| G09-E17 | OBJETO_REVISION | SUBORDINADA |
| G09-E18 | DISCREPANCIA | SUBORDINADA |
| G09-E19 | SOLICITUD_ACLARACION | SUBORDINADA |
| G09-E20 | ACLARACION | SUBORDINADA |
| G09-E21 | RESOLUCION | SUBORDINADA |
| G09-E22 | VINCULO_EVIDENCIA | ASOCIATIVA |
| G09-E23 | EVENTO_TRAZABILIDAD | EVENTO |

### 7.3 Decisiones de modelado de B01

1. `ACTOR_FUNCIONAL` no se equipara a una cuenta de autenticación.
2. `ROL_FUNCIONAL` y `CAPACIDAD_FUNCIONAL` se modelan como catálogos gobernados, no como atributos libres.
3. `ROL_CAPACIDAD` y `ASIGNACION_FUNCIONAL` se mantienen separadas para distinguir definición de permisos y asignación efectiva.
4. `ESTADO_FUNCIONAL` y `TRANSICION_FUNCIONAL` describen semántica canónica; la ejecución histórica se registra mediante `EVENTO_TRAZABILIDAD`.
5. `EVIDENCIA` conserva identidad propia y sus múltiples usos se resuelven mediante `VINCULO_EVIDENCIA`.
6. `SOLICITUD_ACLARACION` y `ACLARACION` son entidades distintas para preservar causalidad e historial.
7. `RESOLUCION` es independiente de `DISCREPANCIA` para preservar identidad, fundamentación, evidencia considerada e inmutabilidad histórica.
8. `OBJETO_REVISION` se incorpora como referencia estable para evitar que una Discrepancia dependa de una referencia polimórfica débil o no verificable.
9. El estado vigente de SM-ER deberá materializarse en `PERIODO_ENTREGA_RECEPCION`.
10. El estado vigente de SM-DIS deberá materializarse en `DISCREPANCIA`.
11. La historia de transiciones no se obtendrá únicamente del estado vigente; deberá conservarse mediante eventos trazables.
12. La existencia de una entidad en este catálogo no implica todavía una tabla física uno-a-uno; esa decisión será formalizada posteriormente.

## 8. Claves, relaciones e integridad referencial

### 8.1 Convenciones de identidad

El modelo utilizará dos clases conceptuales de identificador:

1. **Identificador técnico estable (`*_id`)**
   - identifica inequívocamente una instancia persistente;
   - no deberá reutilizarse;
   - no deberá depender de atributos de negocio susceptibles de cambio;
   - su representación física definitiva se decidirá al implementar el esquema.

2. **Código funcional (`codigo`)**
   - identifica semánticamente estados, transiciones, roles, capacidades y otros catálogos gobernados;
   - deberá ser único dentro de su ámbito;
   - no sustituye la identidad técnica cuando exista historia, versionado o referencias persistentes.

Como criterio preferente, las entidades transaccionales utilizarán identidad técnica independiente de los atributos de negocio.

### 8.2 Reglas generales de claves

#### G09-K01 — PK no reutilizable

Toda entidad con identidad propia deberá disponer de una clave primaria estable, única y no reutilizable.

#### G09-K02 — FK explícita

Toda relación obligatoria entre entidades persistentes deberá materializarse mediante una referencia verificable.

#### G09-K03 — No dependencia de etiquetas

Nombres, descripciones, cargos, denominaciones administrativas o textos visibles no podrán utilizarse como sustitutos de una clave.

#### G09-K04 — Integridad histórica

Una referencia histórica no deberá modificarse silenciosamente para apuntar a una entidad distinta.

#### G09-K05 — Catálogos gobernados

Los catálogos funcionales deberán mantener código canónico único, estado de vigencia y versión semántica cuando corresponda.

#### G09-K06 — Ausencia de cascada destructiva por defecto

La eliminación de una entidad padre no deberá producir eliminación física automática de historia, evidencia, resoluciones o eventos trazables.

### 8.3 Matriz canónica de identidad

| Entidad | PK lógica | Claves/referencias relevantes | Nulabilidad estructural |
|---|---|---|---|
| `MUNICIPIO` | `municipio_id` | `codigo_oficial` candidato a UNIQUE | PK obligatoria |
| `PERIODO_ENTREGA_RECEPCION` | `periodo_er_id` | `municipio_id`, `estado_er_id` | municipio y estado obligatorios |
| `UNIDAD_ADMINISTRATIVA` | `unidad_id` | contexto institucional | identidad obligatoria |
| `ACTOR_FUNCIONAL` | `actor_id` | referencia externa de identidad opcional | identidad obligatoria |
| `ASIGNACION_FUNCIONAL` | `asignacion_id` | `actor_id`, `rol_id`, contexto, vigencia | actor y rol obligatorios |
| `ROL_FUNCIONAL` | `rol_id` | `codigo` UNIQUE | código obligatorio |
| `CAPACIDAD_FUNCIONAL` | `capacidad_id` | `codigo` UNIQUE | código obligatorio |
| `ROL_CAPACIDAD` | `rol_capacidad_id` | `rol_id`, `capacidad_id` | ambas FK obligatorias |
| `ESTADO_FUNCIONAL` | `estado_id` | `codigo`, `maquina` | código y máquina obligatorios |
| `TRANSICION_FUNCIONAL` | `transicion_id` | `codigo`, `estado_origen_id`, `estado_destino_id` | origen y destino obligatorios |
| `CONTROL` | `control_id` | `periodo_er_id`, contexto funcional | periodo obligatorio |
| `EVALUACION` | `evaluacion_id` | `control_id`, `actor_id` | control y actor obligatorios |
| `OBSERVACION` | `observacion_id` | objeto/contexto revisado, `actor_id` | actor obligatorio |
| `VALIDACION` | `validacion_id` | objeto validado, `actor_id` | actor obligatorio |
| `EVIDENCIA` | `evidencia_id` | identificador externo/hash cuando exista | identidad obligatoria |
| `ACTO_ENTREGA_RECEPCION` | `acto_er_id` | `periodo_er_id` | periodo obligatorio |
| `OBJETO_REVISION` | `objeto_revision_id` | `acto_er_id` o contexto de revisión | contexto obligatorio |
| `DISCREPANCIA` | `discrepancia_id` | `acto_er_id`, `objeto_revision_id`, `estado_dis_id` | las tres referencias obligatorias |
| `SOLICITUD_ACLARACION` | `solicitud_aclaracion_id` | `discrepancia_id`, `actor_id` | discrepancia y actor obligatorios |
| `ACLARACION` | `aclaracion_id` | `solicitud_aclaracion_id`, `actor_id` | solicitud y actor obligatorios |
| `RESOLUCION` | `resolucion_id` | `discrepancia_id`, `actor_id`, `estado_terminal_id` | referencias obligatorias |
| `VINCULO_EVIDENCIA` | `vinculo_evidencia_id` | `evidencia_id`, entidad/actuación destino | evidencia y destino obligatorios |
| `EVENTO_TRAZABILIDAD` | `evento_id` | `actor_id`, `transicion_id` opcional, entidad afectada | actor y entidad afectada obligatorios |

La matriz anterior expresa identidad lógica. Los tipos físicos de las claves quedan diferidos a la especificación de implementación.

### 8.4 Relaciones estructurales principales

#### G09-R01 — Municipio → Periodo de Entrega-Recepción

Cardinalidad:

`MUNICIPIO [1] → [0..*] PERIODO_ENTREGA_RECEPCION`

Reglas:

- cada Periodo pertenecerá exactamente a un Municipio;
- un Municipio podrá conservar múltiples periodos históricos;
- la eliminación física de un Municipio con periodos históricos deberá estar prohibida.

#### G09-R02 — Periodo → Acto de Entrega-Recepción

Cardinalidad:

`PERIODO_ENTREGA_RECEPCION [1] → [0..1] ACTO_ENTREGA_RECEPCION`

Reglas:

- dentro del flujo ordinario existirá como máximo un Acto formal vigente por Periodo;
- la ausencia del Acto será válida antes de `ER-40 ENTREGADO`;
- una futura rectificación no sustituirá destructivamente el Acto original.

#### G09-R03 — Acto → Objeto de Revisión

Cardinalidad:

`ACTO_ENTREGA_RECEPCION [1] → [0..*] OBJETO_REVISION`

Cada Objeto de Revisión deberá pertenecer a un contexto inequívoco de revisión.

#### G09-R04 — Acto → Discrepancia

Cardinalidad:

`ACTO_ENTREGA_RECEPCION [1] → [0..*] DISCREPANCIA`

Reglas:

- una Discrepancia no podrá existir fuera del contexto del Acto correspondiente;
- el Acto podrá no producir Discrepancias.

#### G09-R05 — Objeto de Revisión → Discrepancia

Cardinalidad:

`OBJETO_REVISION [1] → [0..*] DISCREPANCIA`

Cada Discrepancia deberá referenciar exactamente un Objeto de Revisión.

#### G09-R06 — Discrepancia → Solicitud de Aclaración

Cardinalidad:

`DISCREPANCIA [1] → [0..*] SOLICITUD_ACLARACION`

Las solicitudes deberán conservar orden cronológico y causal.

#### G09-R07 — Solicitud de Aclaración → Aclaración

Cardinalidad ordinaria:

`SOLICITUD_ACLARACION [1] → [0..1] ACLARACION`

La respuesta deberá corresponder inequívocamente a la solicitud que la originó.

Una ampliación futura que requiera múltiples respuestas a una misma solicitud deberá formalizarse expresamente antes de modificar esta cardinalidad.

#### G09-R08 — Discrepancia → Resolución

Cardinalidad ordinaria:

`DISCREPANCIA [1] → [0..1] RESOLUCION`

Reglas:

- no podrá existir más de una Resolución final ordinaria vigente;
- la Resolución será opcional mientras la Discrepancia no haya alcanzado estado terminal;
- la existencia de Resolución deberá ser coherente con `DIS-90A`, `DIS-90B` o `DIS-90C`.

#### G09-R09 — Actor → Asignación Funcional

Cardinalidad:

`ACTOR_FUNCIONAL [1] → [0..*] ASIGNACION_FUNCIONAL`

La revocación de una asignación no eliminará su historia.

#### G09-R10 — Rol → Asignación Funcional

Cardinalidad:

`ROL_FUNCIONAL [1] → [0..*] ASIGNACION_FUNCIONAL`

Una asignación deberá referenciar un Rol existente y vigente para el contexto aplicable.

#### G09-R11 — Rol ↔ Capacidad

Cardinalidad conceptual:

`ROL_FUNCIONAL [0..*] ↔ [0..*] CAPACIDAD_FUNCIONAL`

La relación se materializará mediante `ROL_CAPACIDAD`.

No se inferirán capacidades por simple pertenencia organizacional.

#### G09-R12 — Máquina → Estado vigente

`PERIODO_ENTREGA_RECEPCION.estado_er_id`
deberá referenciar un `ESTADO_FUNCIONAL` perteneciente a `SM-ER`.

`DISCREPANCIA.estado_dis_id`
deberá referenciar un `ESTADO_FUNCIONAL` perteneciente a `SM-DIS`.

Será inválida una referencia cruzada de máquina.

#### G09-R13 — Transición → Estados

Cada `TRANSICION_FUNCIONAL` deberá referenciar:

- exactamente un estado origen;
- exactamente un estado destino;
- una única máquina funcional.

El estado origen y el estado destino deberán pertenecer a la misma máquina.

#### G09-R14 — Evidencia ↔ actuaciones

Una misma `EVIDENCIA` podrá utilizarse en cero o múltiples actuaciones.

Una actuación podrá utilizar cero o múltiples Evidencias.

La asociación se resolverá mediante `VINCULO_EVIDENCIA`, evitando duplicación física del objeto de evidencia.

#### G09-R15 — Entidad → Evento de Trazabilidad

Toda entidad sustantiva podrá originar múltiples `EVENTO_TRAZABILIDAD`.

Un Evento deberá referenciar una única entidad afectada como objeto primario del evento.

La estrategia física para referencias heterogéneas deberá preservar integridad verificable y no se resolverá mediante una referencia polimórfica débil sin controles adicionales.

### 8.5 Restricciones de unicidad mínimas

Deberán existir conceptualmente las siguientes restricciones:

- `ROL_FUNCIONAL.codigo` único;
- `CAPACIDAD_FUNCIONAL.codigo` único;
- `ESTADO_FUNCIONAL (maquina, codigo)` único;
- `TRANSICION_FUNCIONAL (maquina, codigo)` único;
- `ROL_CAPACIDAD (rol_id, capacidad_id)` sin duplicados activos equivalentes;
- una sola Resolución ordinaria vigente por Discrepancia;
- una sola identidad técnica por entidad persistente;
- una Aclaración no podrá pertenecer simultáneamente a más de una Solicitud de Aclaración.

### 8.6 Reglas de nulabilidad

Serán obligatorias, como mínimo:

- la pertenencia de Periodo a Municipio;
- el estado vigente de un Periodo;
- el contexto padre de un Acto;
- el Objeto de Revisión de una Discrepancia;
- el estado vigente de una Discrepancia;
- la Discrepancia padre de cada Solicitud;
- la Solicitud padre de cada Aclaración;
- el actor responsable de actuaciones sustantivas;
- la Evidencia en cada Vínculo de Evidencia;
- la entidad afectada en cada Evento de Trazabilidad.

Será opcional:

- la Resolución mientras no exista estado terminal;
- la transición canónica en eventos que no representen cambio de estado;
- referencias externas de autenticación;
- fechas de revocación mientras una asignación permanezca vigente.

### 8.7 Política conceptual de eliminación

POST-RLS-G09 adopta como regla general:

`NO DELETE FÍSICO DE HISTORIA SUSTANTIVA`

Las siguientes entidades deberán considerarse históricamente protegidas una vez utilizadas:

- Periodos de Entrega-Recepción;
- Actos de Entrega-Recepción;
- Evaluaciones;
- Validaciones;
- Observaciones formalizadas;
- Evidencias referenciadas;
- Discrepancias;
- Solicitudes de Aclaración;
- Aclaraciones;
- Resoluciones;
- Asignaciones funcionales históricas;
- Eventos de Trazabilidad.

Cuando sea necesario retirar una entidad de operación ordinaria deberán preferirse mecanismos como:

- estado de vigencia;
- revocación;
- baja lógica;
- supersesión explícita;
- cierre;
- anulación gobernada;

sin destruir la trazabilidad precedente.

### 8.8 Integridad del ciclo SM-DIS

La persistencia deberá impedir conceptualmente:

1. crear una Aclaración sin Solicitud de Aclaración;
2. asociar una Aclaración a una Discrepancia diferente de aquella de su Solicitud;
3. crear más de una Resolución ordinaria vigente para la misma Discrepancia;
4. asignar a una Discrepancia un estado ajeno a SM-DIS;
5. registrar una Resolución cuyo resultado contradiga el estado terminal persistido;
6. cerrar el proceso ER cuando exista una Discrepancia no terminal;
7. eliminar evidencia histórica utilizada por una actuación;
8. modificar silenciosamente una Resolución histórica;
9. sustituir la identidad del actor que ejecutó una actuación;
10. alterar un Evento de Trazabilidad como mecanismo ordinario de corrección.

### 8.9 Integridad RBAC y SoD

La persistencia de autorizaciones deberá conservar separadamente:

`ACTOR_FUNCIONAL`
→ `ASIGNACION_FUNCIONAL`
→ `ROL_FUNCIONAL`
→ `ROL_CAPACIDAD`
→ `CAPACIDAD_FUNCIONAL`

La existencia de la cadena anterior será necesaria pero no suficiente para autorizar una actuación.

La autorización efectiva deberá considerar adicionalmente:

- contexto;
- vigencia;
- estado funcional;
- capacidad requerida;
- reglas SoD;
- restricciones de POST-RLS-G06;
- restricciones de POST-RLS-G07;
- condiciones específicas de POST-RLS-G08.

### 8.10 Decisiones diferidas de G09-B02

Quedan deliberadamente fuera de este bloque:

- tipo físico definitivo de PK;
- UUID frente a otro identificador técnico;
- nombres físicos definitivos de tablas;
- tipos SQL;
- índices;
- `CHECK`;
- `FOREIGN KEY` ejecutables;
- `ON DELETE`;
- `ON UPDATE`;
- triggers;
- RLS;
- estrategia física definitiva del vínculo heterogéneo de Evidencia;
- estrategia física definitiva del objeto afectado en Evento de Trazabilidad;
- migraciones;
- política de concurrencia ejecutable.

Estas decisiones deberán resolverse antes de implementación productiva y sin contradecir las cardinalidades e invariantes aquí aprobadas.

## 9. Modelo físico candidato

### 9.1 Principios del modelo físico

El modelo físico candidato deberá conservar las decisiones funcionales de POST-RLS-G05 a POST-RLS-G08 sin introducir dependencias innecesarias de un proveedor específico.

Se adoptan los siguientes principios:

#### G09-F01 — Identificador técnico opaco

Las entidades transaccionales utilizarán un identificador técnico opaco como PK.

La tecnología definitiva del identificador queda diferida, pero deberá cumplir:

- unicidad;
- estabilidad;
- no reutilización;
- independencia de atributos de negocio;
- generación compatible con operación distribuida futura.

#### G09-F02 — Timestamps obligatorios

Las entidades sustantivas deberán conservar, como mínimo:

- `created_at`;
- `updated_at` cuando la entidad admita modificación ordinaria;
- `created_by` o referencia funcional equivalente cuando corresponda.

Las entidades históricas o append-only podrán omitir `updated_at` si su semántica prohíbe actualización ordinaria.

#### G09-F03 — UTC como referencia temporal

Los instantes persistidos deberán expresarse utilizando una referencia temporal inequívoca y normalizable.

La representación física deberá permitir reconstruir correctamente el orden temporal independientemente de la zona horaria del usuario.

#### G09-F04 — Versionado optimista

Las entidades susceptibles de edición concurrente deberán disponer de un mecanismo de control de versión.

El candidato conceptual será:

`row_version`

o mecanismo equivalente.

Una actualización deberá ser rechazada cuando la versión persistida haya cambiado desde la última lectura utilizada por el actor.

#### G09-F05 — Baja lógica controlada

Cuando una entidad deje de estar operativamente disponible, deberán preferirse atributos de vigencia o baja lógica frente al borrado físico.

Ejemplos conceptuales:

- `is_active`;
- `valid_from`;
- `valid_to`;
- `revoked_at`;
- `closed_at`;
- `superseded_at`.

La elección dependerá de la semántica de cada entidad.

#### G09-F06 — Inmutabilidad de historia crítica

Las siguientes clases deberán tratarse como históricamente protegidas:

- eventos de trazabilidad;
- resoluciones finalizadas;
- actuaciones ejecutadas;
- evidencias referenciadas;
- asignaciones revocadas;
- transiciones efectivamente registradas.

Su modificación ordinaria deberá estar prohibida o fuertemente restringida.

### 9.2 Estrategia física de tablas

El modelo candidato se agrupa en cinco familias.

#### A. Contexto institucional y proceso

1. `municipio`
2. `periodo_entrega_recepcion`
3. `unidad_administrativa`
4. `actor_funcional`
5. `acto_entrega_recepcion`
6. `objeto_revision`

#### B. Autorización funcional

7. `rol_funcional`
8. `capacidad_funcional`
9. `rol_capacidad`
10. `asignacion_funcional`

#### C. Máquinas de estado

11. `estado_funcional`
12. `transicion_funcional`

#### D. Dominio operativo y revisión

13. `control`
14. `evaluacion`
15. `observacion`
16. `validacion`
17. `evidencia`
18. `discrepancia`
19. `solicitud_aclaracion`
20. `aclaracion`
21. `resolucion`
22. `vinculo_evidencia`

#### E. Auditoría y trazabilidad

23. `evento_trazabilidad`

La lista anterior constituye una propuesta física inicial y no una obligación inmutable de implementación uno-a-uno.

### 9.3 Convenciones físicas de nombre

Se adoptan provisionalmente las siguientes convenciones:

- nombres de tabla en singular;
- `snake_case`;
- PK con sufijo `_id`;
- FK con el mismo nombre lógico de la PK referenciada;
- códigos funcionales en columna `codigo`;
- timestamps con sufijo `_at`;
- indicadores booleanos con prefijo `is_`;
- atributos de versión con nombre `row_version`;
- no utilizar nombres de columnas ambiguos como `status`, `type`, `data` o `value` sin calificación semántica.

### 9.4 Columnas transversales candidatas

Para entidades transaccionales modificables:

| Columna | Finalidad |
|---|---|
| `*_id` | PK técnica |
| `created_at` | instante de creación |
| `created_by_actor_id` | actor funcional creador |
| `updated_at` | última modificación permitida |
| `updated_by_actor_id` | actor funcional de última modificación |
| `row_version` | control optimista de concurrencia |
| `is_active` | vigencia operativa cuando aplique |

No todas las entidades requerirán todas las columnas.

En entidades históricas protegidas deberá minimizarse el conjunto de campos actualizables.

### 9.5 Persistencia de estados vigentes

#### G09-F07 — Estado actual SM-ER

`periodo_entrega_recepcion` deberá conservar:

`estado_er_id`

como referencia obligatoria a `estado_funcional`.

La referencia deberá corresponder exclusivamente a un estado de `SM-ER`.

#### G09-F08 — Estado actual SM-DIS

`discrepancia` deberá conservar:

`estado_dis_id`

como referencia obligatoria a `estado_funcional`.

La referencia deberá corresponder exclusivamente a un estado de `SM-DIS`.

#### G09-F09 — Historia separada del estado vigente

El estado actual no sustituirá la historia.

Toda transición efectiva deberá producir además un registro persistente de trazabilidad.

### 9.6 Evento de trazabilidad

`evento_trazabilidad` se modelará como entidad append-only.

Campos conceptuales mínimos:

- `evento_id`;
- `event_type`;
- `occurred_at`;
- `actor_id`;
- `periodo_er_id` cuando aplique;
- `entity_type`;
- `entity_id`;
- `transition_id` cuando aplique;
- `estado_origen_id` cuando aplique;
- `estado_destino_id` cuando aplique;
- `correlation_id`;
- `causation_id` cuando exista;
- `metadata_version`;
- resumen o metadatos mínimos de auditoría.

### 9.7 Referencia de entidad en trazabilidad

La pareja:

`entity_type`
+
`entity_id`

se admite provisionalmente como mecanismo lógico para eventos heterogéneos.

Sin embargo, esta decisión queda condicionada a que la implementación garantice:

- catálogo cerrado de tipos de entidad;
- validación de existencia de la entidad referenciada;
- imposibilidad de referencias arbitrarias;
- conservación histórica aun cuando la entidad deje de estar activa;
- auditoría de la creación del vínculo.

No se considera suficiente una relación polimórfica sin controles de integridad.

### 9.8 Vínculos de evidencia

`vinculo_evidencia` deberá contener conceptualmente:

- `vinculo_evidencia_id`;
- `evidencia_id`;
- `entity_type`;
- `entity_id`;
- `uso_evidencia`;
- `created_at`;
- `created_by_actor_id`.

`uso_evidencia` deberá pertenecer a un catálogo o dominio controlado.

Valores conceptuales iniciales:

- `ORIGEN`;
- `APORTADA`;
- `VALORACION`;
- `RESOLUCION`;
- `CONTROL`;
- `VALIDACION`;
- `TRAZABILIDAD`.

La implementación física definitiva deberá valorar si esta asociación polimórfica se conserva o se reemplaza por tablas asociativas especializadas.

### 9.9 Resolución e inmutabilidad

`resolucion` deberá contener conceptualmente:

- `resolucion_id`;
- `discrepancia_id`;
- `actor_id`;
- `estado_terminal_id`;
- `resultado_codigo`;
- `fundamentacion`;
- `resolved_at`;
- `created_at`;
- `row_version`, únicamente mientras no se haya formalizado;
- indicador o timestamp de formalización.

Una vez formalizada:

- no deberá sobrescribirse silenciosamente;
- no deberá cambiar el resultado terminal mediante actualización ordinaria;
- cualquier revisión extraordinaria deberá generar una nueva actuación vinculada a la original.

### 9.10 Solicitud de Aclaración y Aclaración

`solicitud_aclaracion` deberá conservar:

- identidad propia;
- `discrepancia_id`;
- actor solicitante;
- fecha de solicitud;
- contenido;
- secuencia causal;
- estado de atención cuando proceda.

`aclaracion` deberá conservar:

- identidad propia;
- `solicitud_aclaracion_id`;
- actor que responde;
- fecha de respuesta;
- contenido;
- referencias de evidencia;
- secuencia histórica.

No se permitirá reemplazar una Aclaración anterior mediante edición destructiva una vez utilizada para valoración.

### 9.11 Evidencia

`evidencia` representará el objeto lógico de evidencia y no necesariamente el binario físico.

Campos conceptuales candidatos:

- `evidencia_id`;
- `nombre`;
- `descripcion`;
- `media_type`;
- `storage_locator`;
- `content_hash`;
- `size_bytes`;
- `created_at`;
- `created_by_actor_id`;
- `is_active`.

El contenido binario podrá almacenarse fuera de la base relacional, conservando en persistencia una referencia verificable.

### 9.12 Integridad de Evidencia

#### G09-F10 — Hash de contenido

Cuando técnicamente sea posible, una Evidencia deberá conservar un hash criptográfico del contenido.

El hash servirá para detectar alteraciones y no sustituirá los controles de acceso.

#### G09-F11 — No duplicación semántica

El mismo objeto físico podrá ser referenciado por múltiples actuaciones sin duplicarse necesariamente.

#### G09-F12 — Evidencia histórica protegida

Una Evidencia utilizada en una Resolución, Validación o actuación formal no deberá eliminarse físicamente mediante operación ordinaria.

### 9.13 Catálogos y versionado semántico

Los catálogos:

- `rol_funcional`;
- `capacidad_funcional`;
- `estado_funcional`;
- `transicion_funcional`;

deberán disponer de:

- código canónico;
- nombre;
- descripción;
- ámbito;
- vigencia;
- versión semántica cuando corresponda.

Un cambio de significado no deberá reutilizar silenciosamente el mismo código sin control de versión.

### 9.14 Concurrencia

#### G09-F13 — Actualización optimista

Las entidades modificables deberán utilizar control optimista de concurrencia.

Conceptualmente:

1. el cliente lee `row_version = N`;
2. intenta actualizar indicando `N`;
3. la operación sólo tendrá éxito si la versión vigente continúa siendo `N`;
4. la nueva versión pasa a `N+1`;
5. si ya cambió, la actualización se rechaza y deberá revalidarse.

#### G09-F14 — No last-write-wins silencioso

Para entidades sustantivas no se admitirá como política ordinaria:

`última escritura gana`

sin verificación de versión.

### 9.15 Borrado lógico y vigencia

No todas las entidades deberán utilizar un mismo patrón.

Se distinguen:

- **catálogos:** vigencia mediante `is_active` y/o fechas;
- **asignaciones:** `valid_from`, `valid_to`, `revoked_at`;
- **procesos:** cierre mediante estado funcional y `closed_at`;
- **evidencias:** disponibilidad operativa separada de conservación histórica;
- **eventos:** sin borrado lógico ordinario;
- **resoluciones:** formalización e inmutabilidad posterior.

### 9.16 Restricciones candidatas de implementación

La implementación posterior deberá considerar, como mínimo:

- `NOT NULL` para relaciones obligatorias;
- `UNIQUE` para códigos canónicos;
- `UNIQUE` compuesto cuando la semántica lo exija;
- `FOREIGN KEY` para relaciones verificables;
- validaciones de máquina para estados y transiciones;
- restricción de una Resolución ordinaria vigente por Discrepancia;
- restricciones de consistencia temporal;
- validación de actores y capacidades;
- protección contra modificación destructiva de historia.

### 9.17 Frontera de G09-B03

G09-B03 sí define:

- propuesta de tablas;
- nombres físicos candidatos;
- campos transversales;
- estrategia temporal;
- estado vigente;
- historia;
- trazabilidad;
- concurrencia optimista;
- borrado lógico;
- manejo conceptual de evidencia.

G09-B03 todavía no define:

- sintaxis SQL;
- DDL;
- tipos SQL definitivos;
- UUID concreto;
- índices físicos definitivos;
- triggers;
- RLS;
- procedimientos almacenados;
- migraciones;
- esquema Supabase productivo;
- implementación frontend o backend.

## 10. Matriz física de tablas y restricciones

### 10.1 Convenciones de la matriz

La presente matriz constituye una especificación física candidata previa a DDL.

Convenciones:

- `PK`: clave primaria;
- `FK`: clave foránea;
- `UQ`: unicidad;
- `NN`: no nulo;
- `OPT`: opcional;
- `IMM`: inmutable una vez formalizado;
- `AO`: append-only;
- `RV`: control optimista mediante `row_version`.

Los tipos indicados son tipos lógicos, no tipos SQL definitivos.

### 10.2 `municipio`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `municipio_id` | identificador | PK, NN |
| `codigo_oficial` | texto corto | UQ, NN |
| `nombre` | texto | NN |
| `entidad_federativa_codigo` | texto corto | NN |
| `is_active` | booleano | NN |
| `created_at` | instante | NN |
| `updated_at` | instante | NN |
| `row_version` | entero/version | NN, RV |

Reglas:

- `municipio_id` no será reutilizable;
- un Municipio referenciado históricamente no deberá eliminarse físicamente;
- `codigo_oficial` deberá mantenerse estable o versionarse explícitamente.

### 10.3 `periodo_entrega_recepcion`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `periodo_er_id` | identificador | PK, NN |
| `municipio_id` | identificador | FK, NN |
| `estado_er_id` | identificador | FK, NN |
| `fecha_inicio` | fecha | NN |
| `fecha_fin` | fecha | OPT |
| `closed_at` | instante | OPT |
| `created_at` | instante | NN |
| `created_by_actor_id` | identificador | FK, OPT |
| `updated_at` | instante | NN |
| `updated_by_actor_id` | identificador | FK, OPT |
| `row_version` | entero/version | NN, RV |

Reglas:

- `estado_er_id` deberá pertenecer exclusivamente a `SM-ER`;
- `fecha_fin` no podrá preceder a `fecha_inicio`;
- una vez cerrado el Periodo, modificaciones sustantivas deberán estar restringidas.

### 10.4 `unidad_administrativa`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `unidad_id` | identificador | PK, NN |
| `municipio_id` | identificador | FK, NN |
| `codigo` | texto corto | NN |
| `nombre` | texto | NN |
| `is_active` | booleano | NN |
| `created_at` | instante | NN |
| `updated_at` | instante | NN |
| `row_version` | entero/version | NN, RV |

Restricción candidata:

`UQ (municipio_id, codigo)`

### 10.5 `actor_funcional`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `actor_id` | identificador | PK, NN |
| `display_name` | texto | NN |
| `external_identity_ref` | texto | OPT |
| `is_active` | booleano | NN |
| `created_at` | instante | NN |
| `updated_at` | instante | NN |
| `row_version` | entero/version | NN, RV |

Reglas:

- la identidad funcional no dependerá exclusivamente de autenticación externa;
- desactivar al actor no alterará actuaciones históricas.

### 10.6 `acto_entrega_recepcion`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `acto_er_id` | identificador | PK, NN |
| `periodo_er_id` | identificador | FK, NN |
| `formalized_at` | instante | OPT |
| `formalized_by_actor_id` | identificador | FK, OPT |
| `created_at` | instante | NN |
| `row_version` | entero/version | NN, RV |

Restricción candidata:

`UQ ordinaria (periodo_er_id)` para el Acto vigente del flujo ordinario.

Una rectificación extraordinaria futura deberá modelarse sin sobrescribir el Acto original.

### 10.7 `objeto_revision`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `objeto_revision_id` | identificador | PK, NN |
| `acto_er_id` | identificador | FK, NN |
| `objeto_tipo` | código controlado | NN |
| `referencia_funcional` | texto | NN |
| `descripcion` | texto | OPT |
| `created_at` | instante | NN |
| `created_by_actor_id` | identificador | FK, OPT |
| `row_version` | entero/version | NN, RV |

Reglas:

- `objeto_tipo` deberá provenir de dominio controlado;
- `referencia_funcional` no sustituirá la PK.

### 10.8 `rol_funcional`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `rol_id` | identificador | PK, NN |
| `codigo` | texto corto | UQ, NN |
| `nombre` | texto | NN |
| `descripcion` | texto | OPT |
| `version_semantica` | texto corto | NN |
| `is_active` | booleano | NN |
| `created_at` | instante | NN |

### 10.9 `capacidad_funcional`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `capacidad_id` | identificador | PK, NN |
| `codigo` | texto corto | UQ, NN |
| `nombre` | texto | NN |
| `descripcion` | texto | OPT |
| `version_semantica` | texto corto | NN |
| `is_active` | booleano | NN |
| `created_at` | instante | NN |

### 10.10 `rol_capacidad`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `rol_capacidad_id` | identificador | PK, NN |
| `rol_id` | identificador | FK, NN |
| `capacidad_id` | identificador | FK, NN |
| `modo` | código controlado | NN |
| `valid_from` | instante | NN |
| `valid_to` | instante | OPT |
| `created_at` | instante | NN |

Restricción candidata:

`UQ activa (rol_id, capacidad_id, modo)`

La implementación deberá impedir duplicados activos equivalentes.

### 10.11 `asignacion_funcional`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `asignacion_id` | identificador | PK, NN |
| `actor_id` | identificador | FK, NN |
| `rol_id` | identificador | FK, NN |
| `periodo_er_id` | identificador | FK, OPT |
| `unidad_id` | identificador | FK, OPT |
| `valid_from` | instante | NN |
| `valid_to` | instante | OPT |
| `revoked_at` | instante | OPT |
| `revoked_by_actor_id` | identificador | FK, OPT |
| `created_at` | instante | NN |
| `row_version` | entero/version | NN, RV |

Reglas:

- la asignación deberá tener alcance explícito;
- `revoked_at` no borrará la asignación;
- una asignación revocada permanecerá consultable históricamente.

### 10.12 `estado_funcional`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `estado_id` | identificador | PK, NN |
| `maquina` | código controlado | NN |
| `codigo` | texto corto | NN |
| `nombre` | texto | NN |
| `is_terminal` | booleano | NN |
| `version_semantica` | texto corto | NN |
| `is_active` | booleano | NN |

Restricción:

`UQ (maquina, codigo)`

### 10.13 `transicion_funcional`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `transicion_id` | identificador | PK, NN |
| `maquina` | código controlado | NN |
| `codigo` | texto corto | NN |
| `estado_origen_id` | identificador | FK, NN |
| `estado_destino_id` | identificador | FK, NN |
| `nombre_evento` | texto corto | NN |
| `version_semantica` | texto corto | NN |
| `is_active` | booleano | NN |

Restricciones:

- `UQ (maquina, codigo)`;
- origen y destino deberán pertenecer a la misma máquina.

### 10.14 `control`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `control_id` | identificador | PK, NN |
| `periodo_er_id` | identificador | FK, NN |
| `unidad_id` | identificador | FK, OPT |
| `codigo` | texto corto | NN |
| `descripcion` | texto | NN |
| `created_at` | instante | NN |
| `created_by_actor_id` | identificador | FK, OPT |
| `updated_at` | instante | NN |
| `row_version` | entero/version | NN, RV |

### 10.15 `evaluacion`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `evaluacion_id` | identificador | PK, NN |
| `control_id` | identificador | FK, NN |
| `actor_id` | identificador | FK, NN |
| `resultado_codigo` | código controlado | NN |
| `contenido` | texto | OPT |
| `evaluated_at` | instante | NN |
| `created_at` | instante | NN |
| `row_version` | entero/version | NN, RV |

Una Evaluación utilizada como antecedente formal no deberá alterarse destructivamente.

### 10.16 `observacion`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `observacion_id` | identificador | PK, NN |
| `periodo_er_id` | identificador | FK, NN |
| `objeto_revision_id` | identificador | FK, OPT |
| `actor_id` | identificador | FK, NN |
| `contenido` | texto | NN |
| `observed_at` | instante | NN |
| `created_at` | instante | NN |
| `row_version` | entero/version | NN, RV |

Una Observación no equivaldrá automáticamente a Discrepancia.

### 10.17 `validacion`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `validacion_id` | identificador | PK, NN |
| `periodo_er_id` | identificador | FK, NN |
| `actor_id` | identificador | FK, NN |
| `resultado_codigo` | código controlado | NN |
| `contenido` | texto | OPT |
| `validated_at` | instante | NN |
| `created_at` | instante | NN |
| `row_version` | entero/version | NN, RV |

### 10.18 `evidencia`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `evidencia_id` | identificador | PK, NN |
| `nombre` | texto | NN |
| `descripcion` | texto | OPT |
| `media_type` | texto corto | OPT |
| `storage_locator` | texto | NN |
| `content_hash` | texto | OPT |
| `size_bytes` | entero | OPT |
| `created_at` | instante | NN |
| `created_by_actor_id` | identificador | FK, NN |
| `is_active` | booleano | NN |

Reglas:

- una Evidencia referenciada históricamente no deberá eliminarse físicamente;
- la ubicación física podrá cambiar sin alterar `evidencia_id`;
- un cambio de contenido deberá detectarse mediante hash cuando éste exista.

### 10.19 `discrepancia`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `discrepancia_id` | identificador | PK, NN |
| `acto_er_id` | identificador | FK, NN |
| `objeto_revision_id` | identificador | FK, NN |
| `estado_dis_id` | identificador | FK, NN |
| `registered_by_actor_id` | identificador | FK, NN |
| `descripcion` | texto | NN |
| `registered_at` | instante | NN |
| `created_at` | instante | NN |
| `updated_at` | instante | NN |
| `row_version` | entero/version | NN, RV |

Reglas:

- `estado_dis_id` deberá pertenecer a `SM-DIS`;
- no podrá cerrarse silenciosamente mediante eliminación;
- la historia de estados residirá además en trazabilidad.

### 10.20 `solicitud_aclaracion`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `solicitud_aclaracion_id` | identificador | PK, NN |
| `discrepancia_id` | identificador | FK, NN |
| `actor_id` | identificador | FK, NN |
| `secuencia` | entero | NN |
| `contenido` | texto | NN |
| `requested_at` | instante | NN |
| `created_at` | instante | NN |
| `row_version` | entero/version | NN, RV |

Restricción candidata:

`UQ (discrepancia_id, secuencia)`

### 10.21 `aclaracion`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `aclaracion_id` | identificador | PK, NN |
| `solicitud_aclaracion_id` | identificador | FK, NN |
| `actor_id` | identificador | FK, NN |
| `contenido` | texto | NN |
| `responded_at` | instante | NN |
| `created_at` | instante | NN |
| `row_version` | entero/version | NN, RV |

Restricción ordinaria:

`UQ (solicitud_aclaracion_id)`

Una Aclaración utilizada en valoración no deberá editarse destructivamente.

### 10.22 `resolucion`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `resolucion_id` | identificador | PK, NN |
| `discrepancia_id` | identificador | FK, NN |
| `actor_id` | identificador | FK, NN |
| `estado_terminal_id` | identificador | FK, NN |
| `resultado_codigo` | código controlado | NN |
| `fundamentacion` | texto | NN |
| `resolved_at` | instante | NN |
| `formalized_at` | instante | OPT |
| `created_at` | instante | NN |
| `row_version` | entero/version | NN, RV hasta formalización |

Restricción ordinaria:

`UQ vigente (discrepancia_id)`

Una Resolución formalizada será `IMM`.

### 10.23 `vinculo_evidencia`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `vinculo_evidencia_id` | identificador | PK, NN |
| `evidencia_id` | identificador | FK, NN |
| `entity_type` | código controlado | NN |
| `entity_id` | identificador | NN |
| `uso_evidencia` | código controlado | NN |
| `created_at` | instante | NN |
| `created_by_actor_id` | identificador | FK, NN |

Restricción candidata:

`UQ (evidencia_id, entity_type, entity_id, uso_evidencia)`

Esta tabla requerirá en implementación un mecanismo adicional para garantizar la existencia de `entity_id` según `entity_type`.

### 10.24 `evento_trazabilidad`

| Campo | Tipo lógico | Restricción |
|---|---|---|
| `evento_id` | identificador | PK, NN, AO |
| `event_type` | código controlado | NN, AO |
| `occurred_at` | instante | NN, AO |
| `actor_id` | identificador | FK, NN, AO |
| `periodo_er_id` | identificador | FK, OPT, AO |
| `entity_type` | código controlado | NN, AO |
| `entity_id` | identificador | NN, AO |
| `transicion_id` | identificador | FK, OPT, AO |
| `estado_origen_id` | identificador | FK, OPT, AO |
| `estado_destino_id` | identificador | FK, OPT, AO |
| `correlation_id` | identificador | NN, AO |
| `causation_id` | identificador | OPT, AO |
| `metadata_version` | texto corto | NN, AO |
| `metadata` | estructura versionada | OPT, AO |

Reglas:

- no habrá actualización ordinaria;
- no habrá borrado ordinario;
- la corrección se realizará mediante evento compensatorio o extraordinario;
- `correlation_id` permitirá agrupar eventos de una misma operación lógica;
- `causation_id` permitirá reconstruir causalidad cuando sea aplicable.

### 10.25 Matriz consolidada PK/FK

| Tabla | PK | FK principales |
|---|---|---|
| `municipio` | `municipio_id` | — |
| `periodo_entrega_recepcion` | `periodo_er_id` | `municipio_id`, `estado_er_id` |
| `unidad_administrativa` | `unidad_id` | `municipio_id` |
| `actor_funcional` | `actor_id` | — |
| `acto_entrega_recepcion` | `acto_er_id` | `periodo_er_id`, `formalized_by_actor_id` |
| `objeto_revision` | `objeto_revision_id` | `acto_er_id` |
| `rol_funcional` | `rol_id` | — |
| `capacidad_funcional` | `capacidad_id` | — |
| `rol_capacidad` | `rol_capacidad_id` | `rol_id`, `capacidad_id` |
| `asignacion_funcional` | `asignacion_id` | `actor_id`, `rol_id`, `periodo_er_id`, `unidad_id` |
| `estado_funcional` | `estado_id` | — |
| `transicion_funcional` | `transicion_id` | `estado_origen_id`, `estado_destino_id` |
| `control` | `control_id` | `periodo_er_id`, `unidad_id` |
| `evaluacion` | `evaluacion_id` | `control_id`, `actor_id` |
| `observacion` | `observacion_id` | `periodo_er_id`, `objeto_revision_id`, `actor_id` |
| `validacion` | `validacion_id` | `periodo_er_id`, `actor_id` |
| `evidencia` | `evidencia_id` | `created_by_actor_id` |
| `discrepancia` | `discrepancia_id` | `acto_er_id`, `objeto_revision_id`, `estado_dis_id`, `registered_by_actor_id` |
| `solicitud_aclaracion` | `solicitud_aclaracion_id` | `discrepancia_id`, `actor_id` |
| `aclaracion` | `aclaracion_id` | `solicitud_aclaracion_id`, `actor_id` |
| `resolucion` | `resolucion_id` | `discrepancia_id`, `actor_id`, `estado_terminal_id` |
| `vinculo_evidencia` | `vinculo_evidencia_id` | `evidencia_id`, `created_by_actor_id` |
| `evento_trazabilidad` | `evento_id` | `actor_id`, `periodo_er_id`, `transicion_id`, `estado_origen_id`, `estado_destino_id` |

### 10.26 Integridad que no puede resolverse sólo con FK simples

Las siguientes reglas requerirán mecanismos adicionales en implementación:

1. garantizar que `estado_er_id` pertenezca a `SM-ER`;
2. garantizar que `estado_dis_id` pertenezca a `SM-DIS`;
3. garantizar que origen y destino de una Transición pertenezcan a la misma máquina;
4. validar referencias `entity_type + entity_id`;
5. mantener una sola Resolución ordinaria vigente por Discrepancia;
6. bloquear cierre de SM-ER con Discrepancias no terminales;
7. validar SoD antes de actuaciones sustantivas;
8. impedir actualización destructiva de Eventos;
9. impedir modificación ordinaria de Resoluciones formalizadas;
10. impedir eliminación física de Evidencia histórica referenciada;
11. controlar concurrencia mediante versión;
12. garantizar correspondencia entre resultado de Resolución y estado terminal SM-DIS.

La implementación futura deberá decidir qué reglas se resuelven mediante:

- constraints;
- índices únicos parciales;
- triggers;
- funciones transaccionales;
- capa de servicio;
- RLS;
- o combinación explícitamente documentada de mecanismos.

### 10.27 Resultado de G09-B04

Al cierre de este bloque existe una matriz física candidata suficiente para diseñar posteriormente DDL y migraciones sin tener que reinterpretar la semántica funcional de POST-RLS-G05 a POST-RLS-G08.

El modelo permanece independiente del proveedor y todavía no modifica infraestructura productiva.

## 11. Modelo de dependencias y ERD canónico

### 11.1 Propósito

Este bloque establece la estructura relacional canónica previa a DDL y define un orden de materialización que evite dependencias circulares innecesarias.

Se distinguen:

- relaciones de dominio;
- dependencias físicas fuertes mediante FK;
- referencias heterogéneas sujetas a control adicional;
- dependencias de catálogos;
- dependencias históricas y de trazabilidad.

El modelo continúa siendo independiente del proveedor.

### 11.2 ERD canónico de dominio

#### G09-ER01 — Municipio y Periodo

`MUNICIPIO [1] → [0..*] PERIODO_ENTREGA_RECEPCION`

#### G09-ER02 — Municipio y Unidad Administrativa

`MUNICIPIO [1] → [0..*] UNIDAD_ADMINISTRATIVA`

#### G09-ER03 — Periodo y Acto

`PERIODO_ENTREGA_RECEPCION [1] → [0..1] ACTO_ENTREGA_RECEPCION`

#### G09-ER04 — Acto y Objeto de Revisión

`ACTO_ENTREGA_RECEPCION [1] → [0..*] OBJETO_REVISION`

#### G09-ER05 — Acto y Discrepancia

`ACTO_ENTREGA_RECEPCION [1] → [0..*] DISCREPANCIA`

#### G09-ER06 — Objeto y Discrepancia

`OBJETO_REVISION [1] → [0..*] DISCREPANCIA`

#### G09-ER07 — Discrepancia y Solicitud

`DISCREPANCIA [1] → [0..*] SOLICITUD_ACLARACION`

#### G09-ER08 — Solicitud y Aclaración

`SOLICITUD_ACLARACION [1] → [0..1] ACLARACION`

#### G09-ER09 — Discrepancia y Resolución

`DISCREPANCIA [1] → [0..1] RESOLUCION`

#### G09-ER10 — Actor y Asignación

`ACTOR_FUNCIONAL [1] → [0..*] ASIGNACION_FUNCIONAL`

#### G09-ER11 — Rol y Asignación

`ROL_FUNCIONAL [1] → [0..*] ASIGNACION_FUNCIONAL`

#### G09-ER12 — Rol y Capacidad

`ROL_FUNCIONAL [0..*] ↔ [0..*] CAPACIDAD_FUNCIONAL`

La relación M:N se materializa mediante `ROL_CAPACIDAD`.

#### G09-ER13 — Periodo y Control

`PERIODO_ENTREGA_RECEPCION [1] → [0..*] CONTROL`

#### G09-ER14 — Control y Evaluación

`CONTROL [1] → [0..*] EVALUACION`

#### G09-ER15 — Periodo y Observación

`PERIODO_ENTREGA_RECEPCION [1] → [0..*] OBSERVACION`

#### G09-ER16 — Periodo y Validación

`PERIODO_ENTREGA_RECEPCION [1] → [0..*] VALIDACION`

#### G09-ER17 — Evidencia y actuaciones

`EVIDENCIA [0..*] ↔ [0..*] ACTUACION_FUNCIONAL`

La relación conceptual se materializará mediante `VINCULO_EVIDENCIA`.

`ACTUACION_FUNCIONAL` no constituye una tabla autónoma en G09; representa el conjunto cerrado de tipos admitidos como destino de un vínculo.

#### G09-ER18 — Entidad y trazabilidad

`ENTIDAD_FUNCIONAL [1] → [0..*] EVENTO_TRAZABILIDAD`

`ENTIDAD_FUNCIONAL` representa conceptualmente los tipos persistentes autorizados como objeto primario de un Evento.

### 11.3 Matriz de dependencias físicas

| Código | Tabla | Dependencias fuertes previas | Dependencia especial |
|---|---|---|---|
| DDEP-01 | `municipio` | — | — |
| DDEP-02 | `actor_funcional` | — | identidad externa opcional |
| DDEP-03 | `rol_funcional` | — | — |
| DDEP-04 | `capacidad_funcional` | — | — |
| DDEP-05 | `estado_funcional` | — | — |
| DDEP-06 | `unidad_administrativa` | `municipio` | — |
| DDEP-07 | `periodo_entrega_recepcion` | `municipio`, `estado_funcional` | actor creador opcional |
| DDEP-08 | `rol_capacidad` | `rol_funcional`, `capacidad_funcional` | reglas SoD |
| DDEP-09 | `transicion_funcional` | `estado_funcional` | coherencia de máquina |
| DDEP-10 | `asignacion_funcional` | `actor_funcional`, `rol_funcional` | periodo/unidad opcionales |
| DDEP-11 | `acto_entrega_recepcion` | `periodo_entrega_recepcion` | actor formalizador opcional |
| DDEP-12 | `control` | `periodo_entrega_recepcion` | unidad y actor opcionales |
| DDEP-13 | `evidencia` | `actor_funcional` | almacenamiento externo posible |
| DDEP-14 | `objeto_revision` | `acto_entrega_recepcion` | actor creador opcional |
| DDEP-15 | `evaluacion` | `control`, `actor_funcional` | — |
| DDEP-16 | `validacion` | `periodo_entrega_recepcion`, `actor_funcional` | — |
| DDEP-17 | `observacion` | `periodo_entrega_recepcion`, `actor_funcional` | objeto opcional |
| DDEP-18 | `discrepancia` | `acto_entrega_recepcion`, `objeto_revision`, `estado_funcional`, `actor_funcional` | estado restringido a SM-DIS |
| DDEP-19 | `solicitud_aclaracion` | `discrepancia`, `actor_funcional` | — |
| DDEP-20 | `aclaracion` | `solicitud_aclaracion`, `actor_funcional` | — |
| DDEP-21 | `resolucion` | `discrepancia`, `actor_funcional`, `estado_funcional` | estado terminal SM-DIS |
| DDEP-22 | `vinculo_evidencia` | `evidencia`, `actor_funcional` | `entity_type + entity_id` |
| DDEP-23 | `evento_trazabilidad` | `actor_funcional` | periodo, transición, estados y entidad afectada según evento |

### 11.4 Orden canónico de materialización

#### L0 — Raíces y catálogos independientes

Crear primero:

1. `municipio`;
2. `actor_funcional`;
3. `rol_funcional`;
4. `capacidad_funcional`;
5. `estado_funcional`.

Estas tablas no requieren ninguna de las demás tablas de G09 para existir.

#### L1 — Contexto y definición funcional

Crear después:

1. `unidad_administrativa`;
2. `periodo_entrega_recepcion`;
3. `rol_capacidad`;
4. `transicion_funcional`.

Dependencias:

- Municipio y Estado ya existen;
- Rol y Capacidad ya existen;
- Estados de origen/destino ya existen.

#### L2 — Configuración operativa primaria

Crear:

1. `asignacion_funcional`;
2. `acto_entrega_recepcion`;
3. `control`;
4. `evidencia`.

#### L3 — Objetos subordinados iniciales

Crear:

1. `objeto_revision`;
2. `evaluacion`;
3. `validacion`.

#### L4 — Revisión y discrepancia

Crear:

1. `observacion`;
2. `discrepancia`.

#### L5 — Ciclo de aclaración

Crear:

1. `solicitud_aclaracion`.

#### L6 — Respuesta y terminación

Crear:

1. `aclaracion`;
2. `resolucion`.

#### L7 — Asociaciones transversales e historia

Crear finalmente:

1. `vinculo_evidencia`;
2. `evento_trazabilidad`.

Esta última capa depende conceptualmente de que el universo de entidades persistentes se encuentre definido.

### 11.5 Propiedad de aciclicidad

El orden L0→L7 deberá permitir crear las tablas sin ciclos físicos obligatorios.

Ninguna FK fuerte deberá requerir una tabla ubicada en un nivel posterior.

Las referencias opcionales de auditoría hacia `actor_funcional` no generan ciclos porque `actor_funcional` pertenece a L0.

Las referencias:

- `vinculo_evidencia.entity_type + entity_id`;
- `evento_trazabilidad.entity_type + entity_id`;

se clasifican como dependencias especiales y no deberán convertirse en ciclos de DDL mediante FK polimórficas improvisadas.

### 11.6 Bootstrap de catálogos

Antes de crear datos transaccionales deberán existir, como mínimo:

#### Estados SM-ER

- `ER-00 PREPARACION`
- `ER-10 INTEGRACION`
- `ER-20 EN_VALIDACION`
- `ER-30 LISTO_PARA_ENTREGA`
- `ER-40 ENTREGADO`
- `ER-50 EN_REVISION_ENTRANTE`
- `ER-90 CERRADO`

#### Estados SM-DIS

- `DIS-00 ABIERTA`
- `DIS-10 EN_ACLARACION`
- `DIS-20 EN_VALORACION`
- `DIS-90A RESUELTA_SOLVENTADA`
- `DIS-90B RESUELTA_NO_SOLVENTADA`
- `DIS-90C RESUELTA_IMPROCEDENTE`

#### Transiciones

Deberán cargarse las 7 transiciones SM-ER y las 8 transiciones SM-DIS aprobadas en POST-RLS-G06.

#### RBAC

Deberán cargarse:

- 10 roles funcionales de POST-RLS-G07;
- 18 capacidades funcionales de POST-RLS-G07;
- matriz `rol_capacidad` aprobada;
- reglas SoD aplicables.

Los datos semilla deberán estar versionados y ser reproducibles.

### 11.7 Dependencias de cierre

El cierre funcional de un Periodo deberá depender de la consistencia agregada:

`PERIODO_ENTREGA_RECEPCION`
→ `ACTO_ENTREGA_RECEPCION`
→ `DISCREPANCIA`
→ estado terminal de cada Discrepancia
→ `RESOLUCION` cuando corresponda.

`ER-90 CERRADO` no podrá alcanzarse mientras exista una Discrepancia asociada en:

- `DIS-00`;
- `DIS-10`;
- `DIS-20`.

### 11.8 Dependencia de autorización

Una operación sustantiva deberá recorrer conceptualmente:

`ACTOR_FUNCIONAL`
→ `ASIGNACION_FUNCIONAL`
→ `ROL_FUNCIONAL`
→ `ROL_CAPACIDAD`
→ `CAPACIDAD_FUNCIONAL`

y además validar:

`ESTADO_FUNCIONAL`
+
`TRANSICION_FUNCIONAL`
+
SoD
+
contexto institucional
+
vigencia.

La existencia de una FK no constituye por sí misma autorización.

### 11.9 Dependencia de trazabilidad

Una actuación sustantiva deberá producir una relación causal reconstruible:

`Actor`
→ `capacidad efectiva`
→ `evento`
→ `entidad afectada`
→ `estado origen`
→ `estado destino`
→ `instante`
→ `correlation_id`.

Cuando una actuación derive de otra:

`causation_id`

deberá permitir reconstruir dicha relación causal.

### 11.10 Orden conceptual de carga de datos

La secuencia mínima recomendada será:

1. catálogos estructurales;
2. Municipio;
3. actores;
4. unidades administrativas;
5. Periodo;
6. asignaciones funcionales;
7. controles y objetos sujetos a entrega;
8. Acto de Entrega-Recepción;
9. objetos de revisión;
10. Discrepancias;
11. solicitudes;
12. Aclaraciones;
13. Resoluciones;
14. Evidencias y vínculos;
15. eventos de trazabilidad correspondientes.

Esta secuencia es conceptual y podrá optimizarse durante implementación siempre que se preserve la integridad.

### 11.11 Regla de migraciones

Toda futura migración deberá declarar:

- versión origen;
- versión destino;
- tablas afectadas;
- dependencias;
- transformación de datos;
- compatibilidad hacia atrás cuando aplique;
- validaciones previas;
- validaciones posteriores;
- estrategia de rollback o compensación;
- impacto sobre historia;
- impacto sobre trazabilidad.

No se admitirá una migración que cambie silenciosamente el significado histórico de códigos, estados, roles o capacidades.

### 11.12 Criterios de aceptación de G09-B05

G09-B05 se considerará completo cuando:

- existan 18 relaciones canónicas de dominio;
- las 23 tablas dispongan de clasificación de dependencia;
- exista un orden L0→L7;
- no existan ciclos fuertes obligatorios;
- se documente bootstrap de estados, transiciones y RBAC;
- se preserve la regla de cierre agregado;
- se preserve la cadena Actor→Rol→Capacidad;
- se documente causalidad de eventos;
- la frontera de referencias heterogéneas quede explícita;
- no se haya introducido DDL productivo.

## 12. Gate de consistencia integral G05→G09

### 12.1 Propósito

G09-B06 constituye el gate documental de consistencia transversal entre:

- POST-RLS-G05 — Modelo Funcional Canónico;
- POST-RLS-G06 — Máquinas de Estados y Transiciones;
- POST-RLS-G07 — RBAC y Segregación de Funciones;
- POST-RLS-G08 — Discrepancias, Aclaraciones y Resoluciones;
- POST-RLS-G09 — Persistencia Física y Modelo de Datos.

Su propósito es acreditar que la transformación:

`modelo funcional`
→ `estados y transiciones`
→ `autorización`
→ `dominio operativo`
→ `persistencia`

se mantiene semánticamente consistente y trazable.

Este gate no implementa runtime, DDL, migraciones ni comportamiento productivo.

### 12.2 Regla de precedencia

Las especificaciones deberán interpretarse conforme a la siguiente cadena:

`G05`
→ `G06`
→ `G07`
→ `G08`
→ `G09`

Una especificación posterior podrá materializar o precisar una decisión anterior, pero no podrá contradecirla silenciosamente.

Cuando exista una decisión deliberadamente diferida deberá permanecer identificada como tal.

### 12.3 Dimensiones de consistencia

#### G09-CI01 — Existencia documental

Los cinco artefactos G05–G09 deberán encontrarse disponibles y versionados dentro del repositorio.

#### G09-CI02 — Consistencia de dominio

Los conceptos fundamentales definidos en G05 deberán conservar identidad semántica en los artefactos posteriores.

Entre ellos:

- Periodo de Entrega-Recepción;
- Administración Saliente;
- Administración Entrante;
- Acto de Entrega-Recepción;
- Discrepancia;
- Evidencia;
- Aclaración;
- Resolución;
- trazabilidad.

#### G09-CI03 — Consistencia de estados

G06 continuará siendo la autoridad funcional de estados y transiciones.

Deberán conservarse:

- 7 estados SM-ER;
- 6 estados SM-DIS;
- 7 transiciones SM-ER;
- 8 transiciones SM-DIS;
- terminalidad definida;
- cierre agregado condicionado.

#### G09-CI04 — Consistencia RBAC

G07 continuará siendo la autoridad de:

- roles funcionales;
- capacidades;
- segregación de funciones;
- mínimo privilegio;
- denegación por defecto.

G08 y G09 deberán respetar esas reglas y no inferir privilegios adicionales.

#### G09-CI05 — Consistencia de Discrepancias

G08 continuará siendo la autoridad del ciclo funcional:

`Discrepancia`
→ `Solicitud de Aclaración`
→ `Aclaración`
→ `Valoración`
→ `Resolución`.

G09 deberá materializar dicho ciclo sin modificar sus estados, transiciones ni terminalidad.

#### G09-CI06 — Consistencia de cardinalidades

Las cardinalidades aprobadas funcionalmente deberán tener una representación persistente compatible.

Particularmente:

- un Acto puede producir cero o múltiples Discrepancias;
- una Discrepancia pertenece a un único objeto revisado;
- una Discrepancia puede generar múltiples Solicitudes de Aclaración;
- cada Solicitud admite ordinariamente cero o una Aclaración;
- una Discrepancia admite ordinariamente cero o una Resolución final vigente.

#### G09-CI07 — Consistencia de cierre agregado

`ER-90 CERRADO` no podrá alcanzarse mientras exista una Discrepancia asociada en estado no terminal.

Se consideran no terminales:

- `DIS-00 ABIERTA`;
- `DIS-10 EN_ACLARACION`;
- `DIS-20 EN_VALORACION`.

#### G09-CI08 — Consistencia de terminalidad

Los únicos resultados terminales ordinarios de SM-DIS serán:

- `DIS-90A RESUELTA_SOLVENTADA`;
- `DIS-90B RESUELTA_NO_SOLVENTADA`;
- `DIS-90C RESUELTA_IMPROCEDENTE`.

La persistencia no deberá crear estados terminales alternativos por inferencia.

#### G09-CI09 — Consistencia de autorización

Una operación sustantiva deberá depender conjuntamente de:

- identidad del actor;
- asignación funcional vigente;
- rol;
- capacidad;
- contexto;
- estado funcional;
- transición aplicable;
- reglas SoD.

La persistencia de relaciones RBAC no constituye por sí sola autorización efectiva.

#### G09-CI10 — Consistencia histórica

G05–G09 deberán preservar conjuntamente:

- identidad estable;
- historia no destructiva;
- evidencia no sustituida silenciosamente;
- Resoluciones formalizadas protegidas;
- eventos de trazabilidad;
- actor causante;
- correlación causal;
- estado origen y destino cuando corresponda.

### 12.4 Condición de aprobación

G09-B06 sólo podrá declararse `PASS` cuando:

1. existan los cinco artefactos G05–G09;
2. G06 mantenga sus conteos canónicos;
3. G07 mantenga roles y capacidades canónicas;
4. G08 mantenga transiciones e invariantes aprobados;
5. G09 conserve entidades, relaciones y dependencias aprobadas;
6. las terminalidades G06/G08/G09 sean compatibles;
7. las capacidades relevantes de G07 estén referenciadas coherentemente por G08;
8. el cierre agregado permanezca protegido;
9. no existan errores Markdown o trailing whitespace;
10. el repositorio sólo contenga el cambio documental esperado para G09.

### 12.5 Resultado esperado

La aprobación de G09-B06 acreditará que el modelo de persistencia candidato puede avanzar a cierre documental y revisión de integración sin reinterpretar las decisiones funcionales aprobadas en G05–G08.

El resultado de este gate no constituye todavía autorización para ejecutar DDL, migraciones o cambios productivos.
