# CATU E-R — Discrepancias, Aclaraciones y Resoluciones 0.2.0

## 1. Identificación

- Producto: CATU E-R — Blindaje Preventivo Municipal
- Línea de producto: Entrega-Recepción Municipal
- Serie evolutiva: 0.2.x
- Baseline de origen: `dev/v0.2.0`
- Commit de baseline: `2fe5741`
- Baseline funcional precedente: POST-RLS-G07
- Rama de trabajo: `docs/post-rls-g08-discrepancies-v0.2.0`
- Gate: `POST-RLS-G08`
- Naturaleza: documental / dominio / workflow / trazabilidad funcional
- Estado inicial: propuesta para revisión

## 2. Propósito

Definir el modelo funcional canónico de Discrepancias, Aclaraciones y
Resoluciones que gobernará la etapa de revisión de la Administración Entrante
en CATU E-R 0.2.x.

POST-RLS-G08 desarrolla las entidades y reglas ya establecidas en:

- POST-RLS-G05 — Modelo Funcional Canónico;
- POST-RLS-G06 — Máquina de Estados y Transiciones;
- POST-RLS-G07 — RBAC Saliente–Entrante y Segregación de Funciones.

Este gate no modifica las máquinas de estados aprobadas ni implementa todavía
persistencia, interfaz, permisos productivos o comportamiento de runtime.

## 3. Objetivo funcional

Establecer una especificación suficientemente precisa para que una
Discrepancia pueda:

1. identificar inequívocamente el objeto revisado;
2. expresar el hallazgo formal detectado por la Administración Entrante;
3. conservar su fundamento y contexto;
4. asociar evidencia pertinente;
5. solicitar cero, una o múltiples aclaraciones cuando corresponda;
6. conservar cada aclaración como actuación independiente y trazable;
7. pasar a valoración cuando existan elementos suficientes;
8. recibir una única resolución final vigente;
9. alcanzar uno de los estados terminales definidos en POST-RLS-G06;
10. contribuir al cálculo de la condición de cierre agregado del proceso.

## 4. Principios rectores

### G08-P01 — La Discrepancia es un objeto formal de recepción

Una Discrepancia sólo podrá originarse durante la revisión entrante del proceso
y deberá referenciar de manera inequívoca un objeto efectivamente sujeto a
entrega, recepción o verificación.

No deberá confundirse con una Observación preventiva o de validación.

### G08-P02 — Identidad propia

Cada Discrepancia deberá conservar una identidad funcional única durante todo
su ciclo de vida.

La solicitud de aclaraciones adicionales no creará una nueva Discrepancia.

### G08-P03 — Vinculación al objeto revisado

Toda Discrepancia deberá conservar referencia suficiente hacia el objeto que le
dio origen.

Según corresponda, dicho objeto podrá relacionarse funcionalmente con:

- control;
- evaluación;
- evidencia;
- unidad administrativa;
- responsable;
- actuación;
- elemento entregable;
- u otra entidad funcional posteriormente parametrizada.

G08 no define todavía claves físicas ni estructuras de persistencia.

### G08-P04 — Separación entre hallazgo, aclaración y resolución

La Discrepancia representa el hallazgo formal.

La Aclaración representa la respuesta formal de la Administración Saliente.

La Resolución representa la determinación final emitida por el actor competente.

Estas tres entidades no deberán fusionarse conceptualmente ni sustituirse entre
sí.

### G08-P05 — Aclaraciones múltiples

Una Discrepancia podrá recibir cero, una o múltiples Aclaraciones durante su
ciclo de atención.

Cada Aclaración deberá conservar:

- identidad propia;
- autoría;
- fecha y hora;
- contenido;
- evidencia asociada cuando corresponda;
- referencia a la Discrepancia;
- trazabilidad propia.

La presentación de una Aclaración no cerrará automáticamente la Discrepancia.

### G08-P06 — Resolución única vigente

Cada Discrepancia podrá tener como máximo una Resolución final vigente dentro
del flujo ordinario.

La resolución deberá corresponder a uno de los resultados terminales definidos
por POST-RLS-G06:

- `DIS-90A RESUELTA_SOLVENTADA`;
- `DIS-90B RESUELTA_NO_SOLVENTADA`;
- `DIS-90C RESUELTA_IMPROCEDENTE`.

### G08-P07 — Trazabilidad integral

Toda actuación sustantiva relacionada con una Discrepancia deberá producir o
estar asociada a un Evento de Trazabilidad.

Como mínimo deberá poder reconstruirse:

- actor;
- rol o capacidad efectiva;
- instante;
- actuación;
- entidad afectada;
- estado anterior;
- estado posterior;
- evidencia vinculada cuando exista.

### G08-P08 — Respeto a SM-DIS

POST-RLS-G08 no crea estados ni transiciones alternativos a los aprobados en
POST-RLS-G06.

El ciclo funcional seguirá:

`DIS-00 ABIERTA`
→ `DIS-10 EN_ACLARACION` cuando se requiera pronunciamiento
→ `DIS-20 EN_VALORACION`
→ estado terminal correspondiente.

También se conserva la transición directa:

`DIS-00 ABIERTA`
→ `DIS-20 EN_VALORACION`

cuando existan elementos suficientes para valorar sin solicitar aclaración.

### G08-P09 — Respeto a RBAC y SoD

Toda actuación deberá respetar las capacidades, roles y restricciones de
segregación definidas en POST-RLS-G07.

En particular:

- la Administración Saliente no registra discrepancias contra su propia entrega;
- la Administración Entrante no presenta aclaraciones por la Saliente;
- quien presenta una aclaración no deberá resolver ordinariamente la misma
  Discrepancia;
- auditoría y control no adquieren facultades sustantivas por inferencia;
- la ausencia de capacidad aplicable implica denegación por defecto.

### G08-P10 — Inmutabilidad histórica

Las actuaciones históricas válidamente ejecutadas no deberán ser sobrescritas
silenciosamente.

Correcciones, sustituciones, anulaciones o decisiones extraordinarias futuras
deberán conservar referencia al registro precedente y generar trazabilidad
adicional.

## 5. Frontera de POST-RLS-G08

G08 definirá funcionalmente:

- estructura conceptual de la Discrepancia;
- estructura conceptual de la Aclaración;
- estructura conceptual de la Resolución;
- relaciones funcionales entre ellas;
- reglas de creación;
- reglas de aclaración;
- reglas de valoración;
- reglas de resolución;
- cardinalidades;
- invariantes;
- trazabilidad mínima;
- criterios funcionales de cierre;
- decisiones que deberán trasladarse a persistencia en POST-RLS-G09.

G08 no implementará todavía:

- tablas;
- claves físicas;
- JSON productivo;
- migraciones;
- cambios de `app.js`;
- cambios de HTML o CSS;
- formularios productivos;
- nuevos permisos productivos;
- cambios al Service Worker;
- cambios de caché;
- sincronización multiusuario;
- despliegue;
- publicación de versión.


## 6. Modelo canónico de entidades funcionales

El presente apartado define los elementos mínimos que deberán existir
conceptualmente para soportar el ciclo Discrepancia–Aclaración–Resolución.

Los elementos descritos son atributos funcionales.

No constituyen todavía:

- nombres de columnas;
- claves primarias;
- claves foráneas;
- tipos de datos físicos;
- tablas;
- índices;
- estructuras JSON;
- contratos de API.

Su representación física se definirá en POST-RLS-G09.

### 6.1 Discrepancia

La Discrepancia constituye el objeto principal del subproceso SM-DIS.

Deberá conservar funcionalmente, como mínimo:

- identificador funcional único;
- referencia al Periodo de Entrega-Recepción;
- referencia al Acto de Entrega-Recepción;
- referencia inequívoca al objeto revisado;
- unidad administrativa relacionada, cuando corresponda;
- clasificación o naturaleza funcional del hallazgo;
- descripción del hallazgo;
- fundamento o criterio utilizado;
- fecha y hora de registro;
- actor que registra;
- rol y capacidad efectiva utilizados;
- estado vigente de SM-DIS;
- evidencia relacionada;
- historial de aclaraciones;
- resolución final, cuando exista;
- eventos de trazabilidad asociados.

La Discrepancia deberá permanecer identificable durante todo su ciclo de vida,
independientemente de los cambios de estado que experimente.

### 6.2 Objeto revisado

Toda Discrepancia deberá referenciar un objeto revisado.

El objeto revisado constituye la entidad o actuación concreta respecto de la
cual la Administración Entrante formula el hallazgo.

Podrá corresponder, según el modelo funcional y la parametrización posterior, a:

- un Control;
- una Evaluación;
- una Evidencia;
- una Unidad Administrativa;
- un Responsable;
- una actuación;
- un documento;
- un elemento entregable;
- un componente del expediente;
- otra entidad funcional expresamente admitida.

La referencia deberá ser suficientemente específica para permitir reconstruir
qué elemento fue revisado y cuál era su contexto al momento de formular la
Discrepancia.

POST-RLS-G09 determinará la estrategia física para representar referencias a
objetos de distinta naturaleza.

### 6.3 Fundamento de la Discrepancia

Toda Discrepancia deberá expresar el criterio que permita comprender por qué el
hallazgo fue formulado.

El fundamento podrá corresponder funcionalmente a:

- requisito incumplido;
- ausencia documental;
- inconsistencia;
- diferencia entre información declarada y evidencia disponible;
- insuficiencia de acreditación;
- incumplimiento de una regla funcional;
- contradicción entre elementos del expediente;
- condición definida mediante parametrización normativa posterior.

G08 no establece todavía un catálogo jurídico universal de fundamentos.

La codificación normativa y territorial deberá ser parametrizable y no deberá
confundirse con la estructura funcional de la Discrepancia.

### 6.4 Evidencia asociada a la Discrepancia

Una Discrepancia podrá estar sustentada por una o múltiples Evidencias.

La asociación con Evidencia deberá permitir distinguir, cuando corresponda:

- evidencia objeto de revisión;
- evidencia utilizada para fundamentar el hallazgo;
- evidencia incorporada posteriormente durante el ciclo de aclaración;
- evidencia utilizada en la valoración;
- evidencia considerada para la Resolución final.

Una Evidencia preexistente no deberá duplicarse físicamente por el solo hecho de
ser referenciada desde una Discrepancia.

La estrategia física de asociación será definida en POST-RLS-G09.

## 7. Aclaración

### 7.1 Naturaleza funcional

La Aclaración es la respuesta formal de la Administración Saliente a una
Discrepancia respecto de la cual se ha solicitado pronunciamiento.

No constituye:

- una modificación de la Discrepancia original;
- una Resolución;
- una nueva Discrepancia;
- una sustitución silenciosa de evidencia histórica.

### 7.2 Contenido funcional mínimo

Cada Aclaración deberá conservar, como mínimo:

- identificador funcional propio;
- referencia inequívoca a la Discrepancia;
- secuencia dentro del ciclo de aclaraciones;
- actor que presenta;
- rol y capacidad efectiva;
- fecha y hora de presentación;
- contenido de la respuesta;
- evidencia aportada o referenciada;
- evento de trazabilidad;
- relación con la solicitud de aclaración que le dio origen.

Cuando existan múltiples Aclaraciones, cada una deberá conservar identidad
independiente.

### 7.3 Secuencia de aclaraciones

Las Aclaraciones deberán conservar orden cronológico y causal.

Conceptualmente:

```text
DISCREPANCIA
     |
     +-- Solicitud de aclaración 1
     |        |
     |        +-- Aclaración 1
     |
     +-- Valoración
              |
              +-- ¿información suficiente?
                     |
                     +-- SÍ --> Resolución
                     |
                     +-- NO --> Solicitud de aclaración 2
                                   |
                                   +-- Aclaración 2
                                          |
                                          +-- nueva valoración
```

### 7.4 Evidencia aportada mediante Aclaración

Una Aclaración podrá:

- referenciar Evidencia ya existente;
- incorporar referencia a nueva Evidencia;
- explicar Evidencia previamente entregada;
- relacionar múltiples Evidencias.

La presentación de nueva Evidencia no deberá eliminar ni reemplazar
silenciosamente la Evidencia histórica utilizada previamente.

## 8. Valoración

### 8.1 Naturaleza funcional

La Valoración representa el análisis mediante el cual un actor funcionalmente
competente determina si existen elementos suficientes para emitir una
Resolución o si debe requerirse una nueva Aclaración.

La Valoración no constituye un nuevo estado independiente de SM-DIS.

Se ejecuta dentro de:

`DIS-20 EN_VALORACION`.

### 8.2 Ingreso a valoración

Una Discrepancia podrá ingresar a `DIS-20 EN_VALORACION` mediante:

- `DIS-T02B INICIAR_VALORACION_DIRECTA`, cuando no resulte necesaria una
  Aclaración; o
- `DIS-T03 PRESENTAR_ACLARACION`, después de recibir respuesta de la
  Administración Saliente.

### 8.3 Resultado funcional de la valoración

La valoración deberá conducir únicamente a una de las siguientes decisiones
ordinarias:

1. solicitar una Aclaración adicional mediante `DIS-T04`;
2. resolver como solventada mediante `DIS-T05A`;
3. resolver como no solventada mediante `DIS-T05B`;
4. resolver como improcedente mediante `DIS-T05C`.

La valoración por sí misma no podrá introducir estados adicionales.

### 8.4 Elementos mínimos de valoración

La decisión deberá poder fundamentarse funcionalmente en:

- Discrepancia original;
- objeto revisado;
- fundamento;
- evidencia asociada;
- Aclaraciones disponibles;
- evidencia aportada mediante Aclaraciones;
- contexto institucional aplicable;
- historial de actuaciones;
- reglas de autorización y SoD vigentes.

G08 no establece todavía algoritmos automáticos de decisión.

## 9. Resolución

### 9.1 Naturaleza funcional

La Resolución constituye la determinación final ordinaria de una Discrepancia.

Deberá ser emitida únicamente desde `DIS-20 EN_VALORACION`.

### 9.2 Contenido funcional mínimo

Toda Resolución deberá conservar, como mínimo:

- identificador funcional;
- referencia inequívoca a la Discrepancia;
- resultado;
- fundamento de la determinación;
- actor que resuelve;
- rol y capacidad efectiva;
- fecha y hora;
- evidencia considerada;
- referencia a las Aclaraciones valoradas, cuando existan;
- estado terminal resultante;
- evento de trazabilidad asociado.

### 9.3 Resultados ordinarios

Los únicos resultados ordinarios definidos por G08 serán:

| Resultado funcional | Transición | Estado terminal |
|---|---|---|
| Solventada | `DIS-T05A` | `DIS-90A RESUELTA_SOLVENTADA` |
| No solventada | `DIS-T05B` | `DIS-90B RESUELTA_NO_SOLVENTADA` |
| Improcedente | `DIS-T05C` | `DIS-90C RESUELTA_IMPROCEDENTE` |

G08 no incorpora resultados terminales adicionales.

### 9.4 Efecto de la Resolución

Una Resolución válida:

- termina el flujo ordinario de la Discrepancia;
- impide nuevas Aclaraciones ordinarias;
- impide una nueva Resolución ordinaria concurrente;
- contribuye al cálculo de cierre agregado de SM-ER;
- permanece disponible para consulta histórica y trazabilidad.

### 9.5 Revisión extraordinaria

G08 no define un mecanismo productivo de reapertura o sustitución de una
Resolución terminal.

Si posteriormente resulta necesario habilitar:

- revisión extraordinaria;
- revocación;
- nulidad;
- sustitución;
- corrección material;

deberá diseñarse un mecanismo explícito que:

- no altere silenciosamente la Resolución original;
- conserve la cadena histórica;
- identifique fundamento;
- identifique autoridad competente;
- genere trazabilidad reforzada.

## 10. Cardinalidades funcionales

Las cardinalidades mínimas del modelo serán:

```text
Periodo de Entrega-Recepción
        |
        +-- Acto de Entrega-Recepción [1]
                 |
                 +-- Discrepancia [0..*]
                         |
                         +-- Objeto revisado [1]
                         |
                         +-- Evidencias [0..*]
                         |
                         +-- Aclaraciones [0..*]
                         |       |
                         |       +-- Evidencias [0..*]
                         |
                         +-- Resolución final [0..1]
                                 |
                                 +-- Evidencias consideradas [0..*]
```

Reglas derivadas:

- un Acto de Entrega-Recepción podrá originar cero o múltiples Discrepancias;
- cada Discrepancia corresponderá a un único proceso de Entrega-Recepción;
- cada Discrepancia deberá identificar al menos un objeto revisado principal;
- una Discrepancia podrá asociarse con cero o múltiples Evidencias;
- una Discrepancia podrá recibir cero o múltiples Aclaraciones;
- cada Aclaración pertenecerá a una sola Discrepancia;
- una Aclaración podrá asociarse con cero o múltiples Evidencias;
- cada Discrepancia podrá tener cero o una Resolución final vigente;
- cada Resolución pertenecerá a una sola Discrepancia;
- una Resolución podrá referenciar múltiples Evidencias y Aclaraciones;
- una Evidencia podrá ser referenciada por múltiples actuaciones sin requerir duplicación material del contenido.

Estas cardinalidades son exclusivamente funcionales.

POST-RLS-G09 definirá su representación física.

## 11. Invariantes de integridad del subproceso

### G08-I01 — Identidad estable
Una Discrepancia no cambiará de identidad durante su ciclo.

### G08-I02 — Objeto obligatorio
No podrá existir una Discrepancia ordinaria sin objeto revisado identificable.

### G08-I03 — Creación contextual
Una Discrepancia ordinaria sólo podrá crearse mientras SM-ER se encuentre en `ER-50 EN_REVISION_ENTRANTE`.

### G08-I04 — Aclaración subordinada
No podrá existir una Aclaración sin una Discrepancia asociada.

### G08-I05 — Resolución subordinada
No podrá existir una Resolución sin una Discrepancia asociada.

### G08-I06 — Resolución única
No podrá existir simultáneamente más de una Resolución final vigente para la misma Discrepancia dentro del flujo ordinario.

### G08-I07 — Estado coherente
El resultado de la Resolución deberá corresponder exactamente con el estado terminal de SM-DIS alcanzado.

### G08-I08 — No cierre con discrepancia activa
SM-ER no podrá ejecutar `ER-T07 CERRAR_REVISION` mientras exista al menos una Discrepancia en `DIS-00 ABIERTA`, `DIS-10 EN_ACLARACION` o `DIS-20 EN_VALORACION`.

### G08-I09 — Historia no destructiva
Una nueva Aclaración no sustituirá una Aclaración anterior.

### G08-I10 — Evidencia no destructiva
La asociación posterior de nueva Evidencia no eliminará las referencias históricas previamente utilizadas.

### G08-I11 — Autorización no sustituye estado
La posesión de una capacidad RBAC nunca habilitará una transición prohibida por el estado vigente de SM-DIS.

### G08-I12 — Estado no sustituye autorización
La existencia de una transición funcionalmente válida no habilitará su ejecución si el actor carece de la capacidad requerida por POST-RLS-G07.

## 12. Reglas operativas canónicas del ciclo SM-DIS

Las reglas siguientes especializan funcionalmente las ocho transiciones ordinarias
definidas en POST-RLS-G06 y las vinculan con las capacidades establecidas en
POST-RLS-G07.

G08 no crea transiciones nuevas. Cuando exista conflicto entre este documento y
la máquina de estados aprobada en G06, prevalecerá G06 hasta que exista una
decisión arquitectónica formal que modifique ambos artefactos de manera
coordinada.

### G08-T01 — `DIS-T01 REGISTRAR_DISCREPANCIA`

**Naturaleza:** creación de una nueva Discrepancia.

- Contexto de origen: `ER-50 EN_REVISION_ENTRANTE`.
- Estado previo de SM-DIS: no aplica; la entidad aún no existe.
- Evento: `REGISTRAR_DISCREPANCIA`.
- Estado destino: `DIS-00 ABIERTA`.
- Capacidad requerida: `CAP-DIS-01`.
- Rol ejecutor primario: `R-ENT-02 Gestor de Discrepancias`.
- Participación permitida conforme a G07: `R-ENT-01 Revisor Entrante` únicamente bajo el alcance parametrizado correspondiente.
- Roles de control o consulta: `R-OIC-01` y `R-AUD-01`, sin facultad sustantiva por inferencia.

Precondiciones mínimas:

1. SM-ER se encuentra en `ER-50 EN_REVISION_ENTRANTE`;
2. existe un objeto revisado identificable;
3. el actor posee `CAP-DIS-01`;
4. existe descripción suficiente del hallazgo;
5. el objeto pertenece al periodo o acto de entrega-recepción vigente;
6. no se intenta registrar una Discrepancia contra una entrega propia de la Administración Saliente.

Efectos mínimos:

1. se crea una Discrepancia con identidad única;
2. se vincula al objeto revisado;
3. se registra el fundamento disponible;
4. se asocia la Evidencia inicial cuando exista;
5. se establece `DIS-00 ABIERTA`;
6. se genera Evento de Trazabilidad.

Causas mínimas de rechazo:

- SM-ER no se encuentra en `ER-50`;
- objeto revisado ausente o no identificable;
- actor sin capacidad;
- intento de registro por la Administración Saliente contra su propia entrega;
- duplicación material detectada conforme a una regla futura de idempotencia;
- incumplimiento de una precondición obligatoria.

### G08-T02 — `DIS-T02 SOLICITAR_ACLARACION`

**Naturaleza:** apertura del primer ciclo de aclaración.

- Origen: `DIS-00 ABIERTA`.
- Evento: `SOLICITAR_ACLARACION`.
- Destino: `DIS-10 EN_ACLARACION`.
- Capacidad requerida: `CAP-DIS-02`.
- Rol ejecutor primario: `R-ENT-02 Gestor de Discrepancias`.
- Rol Entrante de apoyo, cuando corresponda: `R-ENT-01`.
- Roles de control o consulta: `R-OIC-01` y `R-AUD-01`.

Precondiciones mínimas:

1. la Discrepancia existe y se encuentra en `DIS-00`;
2. no existe Resolución final vigente;
3. el actor posee `CAP-DIS-02`;
4. existe materia concreta respecto de la cual se requiere pronunciamiento de la Administración Saliente;
5. la solicitud identifica suficientemente qué debe ser aclarado.

Efectos mínimos:

1. se registra la solicitud de aclaración;
2. se preserva su identidad causal;
3. la Discrepancia pasa a `DIS-10 EN_ACLARACION`;
4. se genera Evento de Trazabilidad;
5. se mantiene íntegra la Evidencia previa.

Causas mínimas de rechazo:

- estado distinto de `DIS-00`;
- actor sin capacidad;
- ausencia de materia concreta a aclarar;
- existencia de Resolución final;
- intento de auto-solicitud por la Administración Saliente;
- incumplimiento de reglas SoD.

### G08-T02B — `DIS-T02B INICIAR_VALORACION_DIRECTA`

**Naturaleza:** ingreso a valoración sin abrir ciclo de aclaración.

- Origen: `DIS-00 ABIERTA`.
- Evento: `INICIAR_VALORACION_DIRECTA`.
- Destino: `DIS-20 EN_VALORACION`.
- Capacidad requerida: `CAP-DIS-02B`.
- Rol ejecutor primario: `R-ENT-02` o `R-RES-01`, conforme a la parametrización institucional aprobada.
- Roles de control o consulta: `R-OIC-01` y `R-AUD-01`.

Precondiciones mínimas:

1. la Discrepancia se encuentra en `DIS-00`;
2. existe información suficiente para iniciar valoración;
3. no resulta necesario un pronunciamiento de la Administración Saliente;
4. no existe Resolución final;
5. el actor posee `CAP-DIS-02B`.

Efectos mínimos:

1. se documenta la suficiencia para valoración directa;
2. la Discrepancia pasa a `DIS-20 EN_VALORACION`;
3. no se crea solicitud de aclaración ficticia;
4. se genera Evento de Trazabilidad.

Causas mínimas de rechazo:

- información insuficiente;
- necesidad material de pronunciamiento de la Administración Saliente;
- estado distinto de `DIS-00`;
- actor sin capacidad;
- Resolución final ya existente.

### G08-T03 — `DIS-T03 PRESENTAR_ACLARACION`

**Naturaleza:** incorporación formal de la respuesta de la Administración Saliente a una solicitud de aclaración vigente.

- Origen: `DIS-10 EN_ACLARACION`.
- Evento: `PRESENTAR_ACLARACION`.
- Destino: `DIS-20 EN_VALORACION`.
- Capacidad requerida: `CAP-DIS-03`.
- Rol ejecutor primario: `R-SAL-02 Responsable Saliente`.
- Rol de apoyo permitido: `R-SAL-01 Integrador Saliente`, sin sustituir la responsabilidad funcional del ejecutor primario.
- Roles de control o consulta: `R-OIC-01` y `R-AUD-01`.
- Restricción SoD dominante: la Administración Entrante no podrá responder en nombre de la Administración Saliente.

Precondiciones mínimas:

1. la Discrepancia se encuentra en `DIS-10 EN_ACLARACION`;
2. existe una solicitud de aclaración vigente y causalmente identificada;
3. el actor posee `CAP-DIS-03`;
4. la Aclaración referencia inequívocamente la Discrepancia y la solicitud que le dio origen;
5. el contenido de respuesta se encuentra identificado;
6. se conserva la Evidencia histórica y, cuando corresponda, se referencia nueva Evidencia sin sustitución silenciosa.

Efectos mínimos:

1. se crea una nueva Aclaración con identidad propia;
2. se registra su relación causal con la solicitud de aclaración;
3. se registra el actor, rol y capacidad efectiva;
4. se registran fecha y hora;
5. se preservan las referencias de Evidencia existentes;
6. se incorporan nuevas referencias de Evidencia cuando proceda;
7. la Discrepancia pasa a `DIS-20 EN_VALORACION`;
8. se genera Evento de Trazabilidad.

Causas mínimas de rechazo:

- estado distinto de `DIS-10`;
- inexistencia de solicitud de aclaración vigente;
- actor sin capacidad;
- respuesta sin referencia inequívoca a la Discrepancia o a la solicitud;
- intento de modificación silenciosa de una Aclaración anterior;
- intento de presentar respuesta por un actor Entrante en sustitución del Saliente;
- existencia de Resolución final vigente;
- incumplimiento de reglas SoD.

### G08-T04 — `DIS-T04 SOLICITAR_ACLARACION_ADICIONAL`

**Naturaleza:** reapertura ordinaria del ciclo de aclaración cuando la valoración determina que la información disponible todavía es insuficiente para resolver.

- Origen: `DIS-20 EN_VALORACION`.
- Evento: `SOLICITAR_ACLARACION_ADICIONAL`.
- Destino: `DIS-10 EN_ACLARACION`.
- Capacidad requerida: `CAP-DIS-04`.
- Rol ejecutor primario: `R-ENT-02 Gestor de Discrepancias` o `R-RES-01 Resolutor`, conforme a la parametrización institucional aprobada.
- Roles de control o consulta: `R-OIC-01` y `R-AUD-01`.
- Restricción SoD dominante: la Administración Saliente no podrá determinar unilateralmente la insuficiencia de su propia Aclaración.

Precondiciones mínimas:

1. la Discrepancia se encuentra en `DIS-20 EN_VALORACION`;
2. no existe Resolución final vigente;
3. la valoración identifica insuficiencia concreta de información;
4. el actor posee `CAP-DIS-04`;
5. la nueva solicitud identifica qué aspecto permanece insuficientemente aclarado;
6. la nueva solicitud puede distinguirse causalmente de las solicitudes anteriores.

Efectos mínimos:

1. se crea una nueva solicitud de aclaración con identidad propia;
2. se preserva el historial de solicitudes y Aclaraciones anteriores;
3. se registra el motivo funcional de la nueva solicitud;
4. la Discrepancia pasa a `DIS-10 EN_ACLARACION`;
5. no se crea una nueva Discrepancia;
6. se genera Evento de Trazabilidad.

Causas mínimas de rechazo:

- estado distinto de `DIS-20`;
- actor sin capacidad;
- inexistencia de insuficiencia identificable;
- existencia de Resolución final vigente;
- intento de sustituir o eliminar el historial de Aclaraciones;
- intento de crear una nueva Discrepancia para continuar el mismo ciclo;
- incumplimiento de reglas SoD.

### G08-T05A — `DIS-T05A RESOLVER_SOLVENTADA`

**Naturaleza:** terminación ordinaria favorable de la Discrepancia.

- Origen: `DIS-20 EN_VALORACION`.
- Evento: `RESOLVER_SOLVENTADA`.
- Destino: `DIS-90A RESUELTA_SOLVENTADA`.
- Capacidad requerida: `CAP-DIS-05A`.
- Rol ejecutor primario: `R-RES-01 Resolutor`.
- Roles de control o consulta: `R-OIC-01` y `R-AUD-01`.
- Restricción SoD dominante: quien haya presentado una Aclaración no deberá resolver ordinariamente la misma Discrepancia.

Precondiciones mínimas:

1. la Discrepancia se encuentra en `DIS-20 EN_VALORACION`;
2. la valoración ha concluido y existe información suficiente;
3. el actor posee `CAP-DIS-05A`;
4. no existe Resolución final vigente;
5. el expediente de valoración identifica los elementos considerados;
6. el resultado funcional corresponde a solventación;
7. se satisfacen las restricciones SoD de POST-RLS-G07.

Efectos mínimos:

1. se crea una Resolución final con identidad propia;
2. se registra el resultado `SOLVENTADA`;
3. se preservan las Aclaraciones y Evidencias consideradas;
4. SM-DIS pasa a `DIS-90A RESUELTA_SOLVENTADA`;
5. la Discrepancia deja de admitir transiciones ordinarias;
6. el resultado queda disponible para el cálculo del cierre agregado de SM-ER;
7. se genera Evento de Trazabilidad.

Causas mínimas de rechazo:

- estado distinto de `DIS-20`;
- actor sin capacidad;
- valoración incompleta;
- existencia de Resolución final vigente;
- resultado material incompatible con solventación;
- incumplimiento de reglas SoD;
- ausencia de elementos mínimos que fundamenten la Resolución.

### G08-T05B — `DIS-T05B RESOLVER_NO_SOLVENTADA`

**Naturaleza:** terminación ordinaria desfavorable de la Discrepancia.

- Origen: `DIS-20 EN_VALORACION`.
- Evento: `RESOLVER_NO_SOLVENTADA`.
- Destino: `DIS-90B RESUELTA_NO_SOLVENTADA`.
- Capacidad requerida: `CAP-DIS-05B`.
- Rol ejecutor primario: `R-RES-01 Resolutor`.
- Roles de control o consulta: `R-OIC-01` y `R-AUD-01`.
- Restricción SoD dominante: quien haya presentado una Aclaración no deberá resolver ordinariamente la misma Discrepancia.

Precondiciones mínimas:

1. la Discrepancia se encuentra en `DIS-20 EN_VALORACION`;
2. la valoración ha concluido y existe información suficiente;
3. el actor posee `CAP-DIS-05B`;
4. no existe Resolución final vigente;
5. el expediente de valoración identifica los elementos considerados;
6. el resultado funcional corresponde a no solventación;
7. se satisfacen las restricciones SoD de POST-RLS-G07.

Efectos mínimos:

1. se crea una Resolución final con identidad propia;
2. se registra el resultado `NO_SOLVENTADA`;
3. se preservan las Aclaraciones y Evidencias consideradas;
4. SM-DIS pasa a `DIS-90B RESUELTA_NO_SOLVENTADA`;
5. la Discrepancia deja de admitir transiciones ordinarias;
6. el resultado queda disponible para el cálculo del cierre agregado de SM-ER;
7. se genera Evento de Trazabilidad.

Causas mínimas de rechazo:

- estado distinto de `DIS-20`;
- actor sin capacidad;
- valoración incompleta;
- existencia de Resolución final vigente;
- resultado material incompatible con no solventación;
- incumplimiento de reglas SoD;
- ausencia de elementos mínimos que fundamenten la Resolución.

### G08-T05C — `DIS-T05C RESOLVER_IMPROCEDENTE`

**Naturaleza:** terminación ordinaria por improcedencia funcional de la Discrepancia.

- Origen: `DIS-20 EN_VALORACION`.
- Evento: `RESOLVER_IMPROCEDENTE`.
- Destino: `DIS-90C RESUELTA_IMPROCEDENTE`.
- Capacidad requerida: `CAP-DIS-05C`.
- Rol ejecutor primario: `R-RES-01 Resolutor`.
- Roles de control o consulta: `R-OIC-01` y `R-AUD-01`.
- Restricción SoD dominante: quien haya presentado una Aclaración no deberá resolver ordinariamente la misma Discrepancia.

Precondiciones mínimas:

1. la Discrepancia se encuentra en `DIS-20 EN_VALORACION`;
2. la valoración ha concluido y existe información suficiente;
3. el actor posee `CAP-DIS-05C`;
4. no existe Resolución final vigente;
5. el expediente de valoración identifica los elementos considerados;
6. existe fundamento funcional para determinar improcedencia;
7. se satisfacen las restricciones SoD de POST-RLS-G07.

Efectos mínimos:

1. se crea una Resolución final con identidad propia;
2. se registra el resultado `IMPROCEDENTE`;
3. se preservan las Aclaraciones y Evidencias consideradas;
4. SM-DIS pasa a `DIS-90C RESUELTA_IMPROCEDENTE`;
5. la Discrepancia deja de admitir transiciones ordinarias;
6. el resultado queda disponible para el cálculo del cierre agregado de SM-ER;
7. se genera Evento de Trazabilidad.

Causas mínimas de rechazo:

- estado distinto de `DIS-20`;
- actor sin capacidad;
- valoración incompleta;
- existencia de Resolución final vigente;
- ausencia de fundamento funcional para improcedencia;
- incumplimiento de reglas SoD;
- ausencia de elementos mínimos que fundamenten la Resolución.
