# CATU E-R — RBAC Saliente–Entrante y Segregación de Funciones 0.2.0

## 1. Identificación

- Producto: CATU E-R — Blindaje Preventivo Municipal
- Serie: 0.2.x
- Baseline funcional precedente: POST-RLS-G06
- Baseline de origen: `dev/v0.2.0`
- Rama: `docs/post-rls-g07-rbac-v0.2.0`
- Gate: `POST-RLS-G07`
- Naturaleza: documental / autorización funcional / RBAC / segregación de funciones
- Estado inicial: propuesta para revisión

## 2. Propósito

Definir el modelo funcional de autorización que gobernará quién puede ejecutar, validar, resolver, consultar o administrar las actuaciones asociadas con las máquinas SM-ER y SM-DIS definidas en POST-RLS-G06.

G07 establece semántica de roles, capacidades, incompatibilidades y segregación de funciones antes de modificar el RBAC productivo.

Este gate no implementa permisos en runtime.

## 3. Modelo conceptual de autorización

CATU E-R distinguirá expresamente perspectiva funcional, rol funcional, capacidad y restricción de segregación de funciones.

La pertenencia a una perspectiva no otorgará por sí sola permisos técnicos.

Los permisos efectivos deberán derivarse de capacidades expresamente asignadas a roles funcionales.

### 3.1 Perspectiva funcional

Representa la posición institucional desde la cual se participa en el proceso.

Perspectivas canónicas iniciales:

- `P-SAL` — Administración Saliente;
- `P-ENT` — Administración Entrante;
- `P-CTL` — Control, vigilancia o auditoría;
- `P-ADM` — Administración funcional del sistema;
- `P-CON` — Consulta o lectura.

Una perspectiva no equivale necesariamente a un único rol ni a una unidad administrativa específica.

### 3.2 Rol funcional

Representa una responsabilidad funcional ejercida dentro del proceso.

Un rol podrá estar asociado con una o más capacidades, sujeto a las restricciones de segregación definidas en G07.

### 3.3 Capacidad

Representa una acción autorizable y auditable sobre una entidad funcional o transición.

Las capacidades deberán ser explícitas, de granularidad suficiente y denegadas por defecto cuando no exista asignación.

### 3.4 Segregación de funciones

La segregación de funciones impedirá que una misma combinación de roles concentre facultades incompatibles cuando ello comprometa independencia, revisión, validación, resolución o control.

Las incompatibilidades se definirán como reglas funcionales antes de implementarse en RBAC productivo.

## 4. Roles funcionales canónicos

### R-SAL-01 — Integrador Saliente
Integra información, evidencias y elementos sujetos a entrega.

### R-SAL-02 — Responsable Saliente
Asume responsabilidad funcional sobre información o unidades objeto de entrega y puede promover actuaciones autorizadas de la perspectiva Saliente.

### R-VAL-01 — Validador
Revisa condiciones previas y emite validaciones o devoluciones conforme a las reglas funcionales aplicables.

### R-ENT-01 — Revisor Entrante
Revisa los elementos recibidos y puede identificar hallazgos susceptibles de discrepancia.

### R-ENT-02 — Gestor de Discrepancias
Registra discrepancias, solicita aclaraciones y promueve su valoración conforme a SM-DIS.

### R-RES-01 — Resolutor
Emite la resolución funcional final de una discrepancia cuando se cumplen las precondiciones correspondientes.

### R-OIC-01 — Control / OIC
Ejerce funciones de vigilancia, consulta, verificación o control independiente según el marco institucional aplicable.

### R-CIE-01 — Responsable de Cierre
Ejecuta o autoriza el cierre funcional del proceso cuando se satisfacen las condiciones de cierre agregado.

### R-ADM-01 — Administrador Funcional
Administra configuración funcional, asignaciones y parámetros autorizados sin adquirir automáticamente facultades sustantivas sobre el proceso.

### R-AUD-01 — Auditor / Consulta
Dispone de acceso de lectura y trazabilidad conforme al alcance autorizado, sin capacidad ordinaria de modificar estados.

Los roles anteriores son funcionales y no presuponen equivalencia directa con puestos, cargos o unidades administrativas específicas.

## 5. Capacidades funcionales canónicas

Las capacidades constituyen la unidad mínima de autorización funcional de G07.

La ausencia de una capacidad asignada implicará denegación por defecto.

### CAP-ER-01 — Iniciar integración
Autoriza ejecutar `ER-T01 INICIAR_INTEGRACION`.

### CAP-ER-02 — Solicitar validación
Autoriza ejecutar `ER-T02 SOLICITAR_VALIDACION`.

### CAP-ER-03 — Devolver a integración
Autoriza ejecutar `ER-T03 DEVOLVER_A_INTEGRACION`.

### CAP-ER-04 — Aprobar entrega
Autoriza ejecutar `ER-T04 APROBAR_ENTREGA`.

### CAP-ER-05 — Formalizar entrega-recepción
Autoriza ejecutar `ER-T05 FORMALIZAR_ENTREGA_RECEPCION`.

### CAP-ER-06 — Iniciar revisión entrante
Autoriza ejecutar `ER-T06 INICIAR_REVISION_ENTRANTE`.

### CAP-ER-07 — Cerrar revisión
Autoriza ejecutar `ER-T07 CERRAR_REVISION`.

### CAP-DIS-01 — Registrar discrepancia
Autoriza ejecutar `DIS-T01 REGISTRAR_DISCREPANCIA`.

### CAP-DIS-02 — Solicitar aclaración
Autoriza ejecutar `DIS-T02 SOLICITAR_ACLARACION`.

### CAP-DIS-02B — Iniciar valoración directa
Autoriza ejecutar `DIS-T02B INICIAR_VALORACION_DIRECTA`.

### CAP-DIS-03 — Presentar aclaración
Autoriza ejecutar `DIS-T03 PRESENTAR_ACLARACION`.

### CAP-DIS-04 — Solicitar aclaración adicional
Autoriza ejecutar `DIS-T04 REQUERIR_ACLARACION_ADICIONAL`.

### CAP-DIS-05A — Resolver solventada
Autoriza ejecutar `DIS-T05A RESOLVER_SOLVENTADA`.

### CAP-DIS-05B — Resolver no solventada
Autoriza ejecutar `DIS-T05B RESOLVER_NO_SOLVENTADA`.

### CAP-DIS-05C — Resolver improcedente
Autoriza ejecutar `DIS-T05C RESOLVER_IMPROCEDENTE`.

### CAP-CTL-01 — Consultar trazabilidad
Autoriza consultar eventos, estados, actores y evidencias dentro del alcance concedido.

### CAP-CTL-02 — Consultar evidencia
Autoriza lectura de evidencias sin facultad de modificación sustantiva.

### CAP-ADM-01 — Administrar asignaciones RBAC
Autoriza administrar asignaciones funcionales conforme a reglas de gobierno, sin conferir automáticamente capacidades sustantivas.

## 6. Matriz RBAC de transiciones

### 6.1 Convenciones

- `E` — puede ejecutar la transición;
- `P` — puede promover o preparar la actuación, sin ejecutarla por sí solo;
- `C` — puede consultar la actuación y su trazabilidad;
- `X` — capacidad incompatible o expresamente no autorizada;
- `—` — sin atribución funcional definida por G07.

La matriz expresa autorización funcional mínima. No sustituye las precondiciones de estado definidas en POST-RLS-G06.

### 6.2 SM-ER — Proceso de Entrega-Recepción

| Transición | Capacidad | Rol ejecutor primario | Roles de apoyo / consulta | Restricción principal |
|---|---|---|---|---|
| `ER-T01` | `CAP-ER-01` | `R-SAL-01` / `R-SAL-02` | `R-OIC-01`, `R-AUD-01` = C | perspectiva Entrante no ejecuta |
| `ER-T02` | `CAP-ER-02` | `R-SAL-02` | `R-SAL-01` = P; `R-OIC-01`, `R-AUD-01` = C | Validador no prepara su propia solicitud |
| `ER-T03` | `CAP-ER-03` | `R-VAL-01` | `R-OIC-01`, `R-AUD-01` = C | Saliente no valida su propia integración |
| `ER-T04` | `CAP-ER-04` | `R-VAL-01` | `R-OIC-01`, `R-AUD-01` = C | Saliente no aprueba su propia entrega |
| `ER-T05` | `CAP-ER-05` | `R-SAL-02` y actor Entrante institucionalmente facultado | `R-OIC-01`, `R-AUD-01` = C | requiere actuación bilateral o equivalente formal |
| `ER-T06` | `CAP-ER-06` | `R-ENT-01` | `R-ENT-02` = P; `R-OIC-01`, `R-AUD-01` = C | Saliente no inicia revisión entrante |
| `ER-T07` | `CAP-ER-07` | `R-CIE-01` | `R-OIC-01`, `R-AUD-01` = C | bloqueado con discrepancias no terminales |

### 6.3 SM-DIS — Discrepancias

| Transición | Capacidad | Rol ejecutor primario | Roles de apoyo / consulta | Restricción principal |
|---|---|---|---|---|
| `DIS-T01` | `CAP-DIS-01` | `R-ENT-02` | `R-ENT-01` = P; `R-OIC-01`, `R-AUD-01` = C | Saliente no registra discrepancias contra su propia entrega |
| `DIS-T02` | `CAP-DIS-02` | `R-ENT-02` | `R-ENT-01` = P; `R-OIC-01`, `R-AUD-01` = C | Saliente no se auto-solicita aclaración |
| `DIS-T02B` | `CAP-DIS-02B` | `R-ENT-02` o `R-RES-01` según parametrización posterior | `R-OIC-01`, `R-AUD-01` = C | requiere suficiencia documental para valoración directa |
| `DIS-T03` | `CAP-DIS-03` | `R-SAL-02` | `R-SAL-01` = P; `R-OIC-01`, `R-AUD-01` = C | Entrante no responde por Saliente |
| `DIS-T04` | `CAP-DIS-04` | `R-ENT-02` o `R-RES-01` | `R-OIC-01`, `R-AUD-01` = C | Saliente no determina unilateralmente insuficiencia de su propia aclaración |
| `DIS-T05A` | `CAP-DIS-05A` | `R-RES-01` | `R-OIC-01`, `R-AUD-01` = C | quien aclaró no debe resolver ordinariamente la misma discrepancia |
| `DIS-T05B` | `CAP-DIS-05B` | `R-RES-01` | `R-OIC-01`, `R-AUD-01` = C | quien aclaró no debe resolver ordinariamente la misma discrepancia |
| `DIS-T05C` | `CAP-DIS-05C` | `R-RES-01` | `R-OIC-01`, `R-AUD-01` = C | quien aclaró no debe resolver ordinariamente la misma discrepancia |

La asignación exacta de actor institucional para capacidades bilaterales o concurrentes deberá parametrizarse conforme al marco normativo y organizacional aplicable.

## 7. Segregación de funciones — SoD

La segregación de funciones se aplicará como control preventivo sobre combinaciones de roles y capacidades incompatibles.

### 7.1 Principios SoD

- quien integra no deberá validar ordinariamente su propia integración;
- quien prepara una solicitud no deberá aprobarla cuando ello elimine una instancia independiente de revisión;
- quien presenta una aclaración no deberá resolver ordinariamente la misma discrepancia;
- quien administra asignaciones RBAC no deberá autoasignarse capacidades sustantivas sin control adicional;
- los roles de auditoría y consulta no modificarán estados ordinarios;
- las funciones de control no adquirirán automáticamente facultades operativas;
- las excepciones deberán ser explícitas, justificadas y trazables;
- la ausencia de una excepción documentada implicará aplicación de la incompatibilidad.

### 7.2 Matriz de incompatibilidades funcionales

| Regla | Función A | Función B | Tipo | Resultado |
|---|---|---|---|---|
| `SOD-01` | `R-SAL-01` / `R-SAL-02` integrar | `R-VAL-01` validar la misma integración | Crítica | Incompatible sobre el mismo objeto |
| `SOD-02` | `R-SAL-02` solicitar validación | `R-VAL-01` aprobar la misma solicitud cuando recaiga en la misma persona | Crítica | Incompatible salvo excepción formal |
| `SOD-03` | `R-SAL-02` presentar aclaración | `R-RES-01` resolver la misma discrepancia | Crítica | Incompatible |
| `SOD-04` | `R-ENT-02` registrar discrepancia | `R-RES-01` resolverla | Media | Permitido sólo si el modelo institucional lo autoriza expresamente; preferencia por separación |
| `SOD-05` | `R-ADM-01` administrar RBAC | autoasignarse capacidades sustantivas | Crítica | Prohibido sin control adicional |
| `SOD-06` | `R-AUD-01` auditoría / consulta | modificar estados | Crítica | Prohibido |
| `SOD-07` | `R-OIC-01` control independiente | ejecutar actuaciones sustantivas ordinarias | Alta | No autorizado por defecto |
| `SOD-08` | `R-CIE-01` cerrar revisión | mantener discrepancias activas | Crítica | Bloqueado por regla de cierre agregado |
| `SOD-09` | actor que formaliza entrega | alterar retrospectivamente evidencia base | Crítica | Prohibido |
| `SOD-10` | cualquier rol | modificar silenciosamente trazabilidad histórica | Crítica | Prohibido |

### 7.3 Incompatibilidad contextual

La incompatibilidad podrá evaluarse no sólo por coexistencia de roles, sino también por identidad del objeto, periodo, unidad administrativa, discrepancia o actuación concreta.

Una persona podría ejercer roles distintos en contextos diferentes cuando no exista conflicto material y el modelo institucional aplicable lo permita.

### 7.4 Excepciones SoD

Toda excepción a una regla de segregación deberá registrar como mínimo:

- regla exceptuada;
- fundamento;
- actor que autoriza;
- actor beneficiado;
- alcance;
- entidad u objeto afectado;
- vigencia;
- fecha y hora;
- evidencia justificativa;
- evento de trazabilidad asociado.

Las excepciones no deberán modificar ni eliminar la regla original.

### 7.5 Prohibición de privilegio implícito

La acumulación de roles no implicará unión automática de todas sus capacidades cuando exista una regla SoD aplicable.

El motor de autorización futuro deberá evaluar primero capacidad y contexto y después las restricciones de segregación.

## 8. Gobierno de asignaciones y permisos

### 8.1 Denegación por defecto

Toda capacidad no asignada expresamente deberá considerarse denegada.

### 8.2 Mínimo privilegio

Cada usuario deberá recibir únicamente las capacidades necesarias para sus funciones y alcance institucional.

### 8.3 Alcance de autorización

Las capacidades podrán restringirse posteriormente por municipio, periodo, unidad administrativa, objeto, expediente, discrepancia u otro contexto funcional.

### 8.4 Administración separada de operación

`R-ADM-01` administra configuración y asignaciones, pero no obtiene por ese hecho capacidades operativas de SM-ER o SM-DIS.

### 8.5 Trazabilidad de asignaciones

Toda alta, baja o modificación de roles y capacidades deberá generar un evento de trazabilidad con actor, instante, valor anterior y valor posterior.

### 8.6 Revocación

La revocación de una capacidad impedirá nuevas actuaciones desde el momento efectivo de revocación sin alterar actuaciones históricas válidamente ejecutadas.

### 8.7 Sesiones y autorización

La autorización efectiva deberá evaluarse al momento de ejecutar una actuación sensible y no depender únicamente de una condición histórica de inicio de sesión.

### 8.8 Separación entre autenticación y autorización

La autenticación acredita identidad; la autorización determina capacidades efectivas. G07 no presume que identidad autenticada implique permiso operativo.

## 9. Matriz consolidada rol → capacidad

### 9.1 Convenciones

- `E` — capacidad de ejecución ordinaria;
- `E*` — ejecución condicionada, concurrente o pendiente de parametrización institucional;
- `P` — promoción o preparación sin facultad de ejecución final;
- `C` — consulta;
- `—` — capacidad no asignada.

La matriz representa el perfil funcional mínimo previsto por G07 y deberá interpretarse conjuntamente con las reglas SoD.

### 9.2 Matriz por rol

| Rol | Capacidades ER | Capacidades DIS | Capacidades transversales | Restricción dominante |
|---|---|---|---|---|
| `R-SAL-01` Integrador Saliente | `CAP-ER-01` E; `CAP-ER-02` P | `CAP-DIS-03` P | — | no valida ni resuelve su propia actuación |
| `R-SAL-02` Responsable Saliente | `CAP-ER-01` E; `CAP-ER-02` E; `CAP-ER-05` E* | `CAP-DIS-03` E | — | no valida su propia integración ni resuelve su propia aclaración |
| `R-VAL-01` Validador | `CAP-ER-03` E; `CAP-ER-04` E | — | `CAP-CTL-01` C; `CAP-CTL-02` C | independencia respecto de la preparación validada |
| `R-ENT-01` Revisor Entrante | `CAP-ER-05` E*; `CAP-ER-06` E | `CAP-DIS-01` P; `CAP-DIS-02` P | `CAP-CTL-01` C; `CAP-CTL-02` C | no actúa por la Administración Saliente |
| `R-ENT-02` Gestor de Discrepancias | `CAP-ER-06` P | `CAP-DIS-01` E; `CAP-DIS-02` E; `CAP-DIS-02B` E*; `CAP-DIS-04` E* | `CAP-CTL-01` C; `CAP-CTL-02` C | preferencia por separación respecto de la resolución |
| `R-RES-01` Resolutor | — | `CAP-DIS-02B` E*; `CAP-DIS-04` E*; `CAP-DIS-05A` E; `CAP-DIS-05B` E; `CAP-DIS-05C` E | `CAP-CTL-01` C; `CAP-CTL-02` C | no resuelve ordinariamente discrepancias que haya aclarado |
| `R-OIC-01` Control / OIC | — | — | `CAP-CTL-01` C; `CAP-CTL-02` C | control independiente; sin operación sustantiva por defecto |
| `R-CIE-01` Responsable de Cierre | `CAP-ER-07` E | — | `CAP-CTL-01` C; `CAP-CTL-02` C | cierre bloqueado con discrepancias no terminales |
| `R-ADM-01` Administrador Funcional | — | — | `CAP-ADM-01` E; `CAP-CTL-01` C | no obtiene capacidades sustantivas por administrar RBAC |
| `R-AUD-01` Auditor / Consulta | — | — | `CAP-CTL-01` C; `CAP-CTL-02` C | sólo lectura; no modifica estados |

### 9.3 Regla sobre `CAP-ER-05`

`CAP-ER-05 FORMALIZAR_ENTREGA_RECEPCION` se considera una capacidad concurrente o bilateral.

Su ejecución efectiva requerirá participación de la Administración Saliente y del actor de la Administración Entrante institucionalmente facultado.

La inclusión de `R-ENT-01` como portador provisional `E*` no establece todavía equivalencia jurídica entre Revisor Entrante y receptor formal.

La identificación definitiva del actor Entrante competente queda diferida a parametrización institucional.

### 9.4 Regla sobre capacidades condicionadas `E*`

Una capacidad marcada `E*` no deberá transformarse en permiso productivo irrestricto.

Su habilitación futura requerirá comprobar:

- contexto institucional;
- estado vigente de la entidad;
- precondiciones de POST-RLS-G06;
- reglas SoD aplicables;
- alcance del usuario;
- ausencia de conflicto material;
- trazabilidad de la autorización.

### 9.5 Ausencia de privilegio por acumulación

La pertenencia simultánea a varios roles no producirá automáticamente la suma efectiva de sus capacidades.

Cuando exista conflicto entre una asignación y una regla SoD, prevalecerá la restricción hasta que exista una excepción formal válida.

### 9.6 Perfiles de sólo lectura

`R-OIC-01` y `R-AUD-01` dispondrán por defecto únicamente de capacidades de consulta y trazabilidad.

Cualquier ampliación de facultades operativas deberá documentarse expresamente y no podrá inferirse de su función de control, vigilancia o auditoría.

## 10. Alcance y límites de POST-RLS-G07

POST-RLS-G07 define exclusivamente la semántica funcional de autorización, roles, capacidades y segregación de funciones aplicable a las máquinas SM-ER y SM-DIS.

G07 no implementa todavía un motor RBAC productivo.

Queda fuera de alcance de este gate:

- modificación de `app.js`;
- modificación de HTML o CSS productivo;
- modificación del Service Worker o caché;
- cambios en persistencia o esquema físico de datos;
- creación productiva de usuarios, grupos o roles;
- integración con proveedor de identidad;
- autenticación multifactor;
- implementación física de permisos;
- migración de usuarios o workspaces existentes;
- interfaz de administración RBAC;
- delegaciones temporales productivas;
- automatización de excepciones SoD;
- definición jurídica universal de puestos o cargos municipales;
- sincronización multiusuario;
- despliegue o publicación de una nueva versión.

Las equivalencias entre roles funcionales CATU E-R y cargos, puestos, unidades administrativas o autoridades concretas deberán resolverse mediante parametrización institucional y normativa.

## 11. Decisiones diferidas

### G07-D01 — Mapeo organizacional

Definir la correspondencia entre roles funcionales CATU E-R y puestos, cargos, unidades administrativas o autoridades de cada institución.

### G07-D02 — Alcance contextual de permisos

Definir la estructura física mediante la cual una capacidad se limitará por municipio, periodo, unidad administrativa, expediente, objeto, discrepancia u otra entidad funcional.

### G07-D03 — Formalización bilateral de `ER-T05`

Definir el mecanismo operativo y probatorio para representar la concurrencia Saliente–Entrante en la formalización del Acto de Entrega-Recepción.

### G07-D04 — Gobierno de excepciones SoD

Definir quién puede solicitar, aprobar, revocar y auditar excepciones a reglas de segregación, así como su vigencia y controles compensatorios.

### G07-D05 — Facultades operativas de control / OIC

Determinar, conforme al marco institucional aplicable, si `R-OIC-01` conservará exclusivamente facultades de consulta y vigilancia o podrá ejercer capacidades operativas específicas.

### G07-D06 — Gobierno del Administrador Funcional

Definir aprobación, doble control o mecanismo equivalente para altas, bajas y modificaciones sensibles ejecutadas por `R-ADM-01`.

### G07-D07 — Delegación y suplencia

Definir el modelo de delegación temporal, suplencia, expiración automática y revocación anticipada de capacidades.

### G07-D08 — Integración autenticación–autorización

Definir proveedor de identidad, ciclo de sesión, reevaluación de permisos, revocación efectiva y tratamiento de credenciales sin confundir autenticación con autorización.

### G07-D09 — Persistencia y versionado RBAC

Definir tablas, estructuras, versionado, migraciones y conservación histórica de asignaciones, capacidades y excepciones.

### G07-D10 — Acceso extraordinario

Definir, si resulta necesario, un mecanismo de acceso extraordinario o `break-glass`, con justificación, temporalidad, control reforzado y trazabilidad obligatoria.

## 12. Invariantes heredados

La implementación futura del modelo RBAC no podrá degradar:

- las máquinas de estados aprobadas en POST-RLS-G06;
- las precondiciones y causas de rechazo de cada transición;
- la terminalidad de SM-ER y SM-DIS;
- el cierre agregado del proceso;
- la trazabilidad de actuaciones;
- la integridad histórica de evidencias;
- la operación local-first;
- la operación offline acreditada;
- la segregación entre Administración Saliente y Entrante;
- la validación independiente cuando resulte aplicable;
- la compatibilidad controlada con la serie 0.1.x;
- la integridad de controles, evaluaciones y validación OIC existentes.

Una autorización nunca deberá convertir en válida una transición funcionalmente prohibida por POST-RLS-G06.

## 13. Criterios de aceptación de POST-RLS-G07

G07 podrá cerrarse cuando:

- estén diferenciadas perspectiva, rol, capacidad y restricción SoD;
- exista un catálogo canónico de roles funcionales;
- exista un catálogo canónico de capacidades;
- las 15 transiciones ordinarias de G06 estén cubiertas por capacidades;
- cada transición tenga identificado un ejecutor funcional primario o una regla explícita de concurrencia;
- existan reglas de consulta y sólo lectura;
- exista denegación por defecto;
- se establezca el principio de mínimo privilegio;
- exista una matriz formal de segregación de funciones;
- las incompatibilidades críticas estén documentadas;
- las excepciones SoD exijan fundamento y trazabilidad;
- la administración RBAC no implique privilegio sustantivo automático;
- los perfiles de auditoría y control no adquieran operación sustantiva por inferencia;
- exista una matriz consolidada rol → capacidad;
- las capacidades condicionadas `E*` estén expresamente identificadas;
- las decisiones diferidas estén documentadas;
- el cambio permanezca exclusivamente documental;
- el documento sea integrado a `dev/v0.2.0` mediante Pull Request;
- el repositorio quede limpio después de la integración.

## 14. Resultado esperado

Al cierre de POST-RLS-G07 deberá existir una especificación funcional suficiente para diseñar e implementar posteriormente un motor de autorización basado en capacidades, contexto y segregación de funciones, sin introducir privilegios implícitos ni contradicciones con las máquinas de estados aprobadas en POST-RLS-G06.

---

**Estado:** Propuesta para revisión.
**Serie:** CATU E-R 0.2.x.
**Gate:** POST-RLS-G07.
**Naturaleza:** documental / autorización funcional / RBAC / segregación de funciones.
