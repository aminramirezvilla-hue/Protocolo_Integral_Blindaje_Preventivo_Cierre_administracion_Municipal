# POST-RLS G12 — S21I Routing Contract

**Versión:** 0.2.0
**Estado:** Proposed
**Baseline de origen:** G12 / S21I
**Ámbito:** contrato arquitectónico documental de routing especializado
**Implementación ejecutable:** diferida

---

## 1. Propósito

Este documento establece el contrato canónico de routing requerido para
vincular un objetivo lógico de mutación autorizado con un contrato
especializado, una relación PostgreSQL física y un conjunto explícito de
operaciones permitidas.

El contrato existe para impedir que la aplicación cliente, el orquestador
o cualquier entrada no confiable pueda seleccionar dinámicamente tablas,
columnas, SQL arbitrario o rutas de privilegio.

---

## 2. Alcance

Este contrato se limita a definir la arquitectura documental de routing
posterior a G12 y previa a cualquier materialización ejecutable de:

- funciones PostgreSQL;
- roles PostgreSQL;
- policies RLS;
- GRANT;
- REVOKE;
- DDL;
- DML;
- migraciones;
- deployment.

No constituye por sí mismo implementación ejecutable.

---

## 3. Invariantes arquitectónicas heredadas

Permanecen vigentes las siguientes decisiones:

- `CLIENT_DIRECT_DATABASE_ACCESS = PROHIBITED`
- `EXECUTION_BOUNDARY = SERVER_MEDIATED`
- `SECURITY_INVOKER = PRESERVED`
- `RLS = PRESERVED`
- `DEFAULT_DENY = PRESERVED`
- `EXPECTED_ROW_VERSION = PRESERVED`
- `CANONICAL_LOGICAL_PRINCIPAL = CATU_GUARDED_UPDATE_RUNTIME_PRINCIPAL`
- `CURRENT_USER_AS_END_USER = PROHIBITED`
- `MUTATOR_OWNER_BYPASSRLS = NO`
- `MUTATOR_OWNER_TABLE_OWNER = NO`

La identidad del usuario final deberá proceder exclusivamente de una
identidad de solicitud verificada en contexto transaccional.

---

## 4. Modelo de routing

El modelo autorizado es:

`LOGICAL_TARGET`
→ `SPECIALIZED_CONTRACT`
→ `PHYSICAL_RELATION`
→ `EXPLICIT_ALLOWED_OPERATION`

El routing será una **allowlist explícita**.

No se autoriza resolución dinámica de relaciones físicas a partir de
texto proporcionado por el cliente.

### Regla de rechazo

Todo objetivo lógico no registrado deberá producir rechazo por defecto.

`UNKNOWN_TARGET_BEHAVIOR = REJECT`

---

## 5. Registro lógico de targets

Los valores exactos de `logical_target` permanecen diferidos hasta que
exista evidencia suficiente para materializarlos.

Estado actual:

`EXACT_LOGICAL_TARGET_VALUES = DEFERRED`

Ningún valor lógico será inferido exclusivamente a partir del nombre de
una tabla física.

---

## 6. Registro de contratos especializados

Cada `logical_target` deberá resolver a exactamente un contrato
especializado.

Cardinalidad:

`ONE_LOGICAL_TARGET_TO_ONE_SPECIALIZED_CONTRACT`

Cada contrato especializado deberá identificar de manera explícita:

1. relación física;
2. operación u operaciones admitidas;
3. clave primaria;
4. predicado de autorización;
5. contrato de concurrencia;
6. validación;
7. mapeo de resultado;
8. auditoría.

Los identificadores concretos permanecen diferidos:

`EXACT_SPECIALIZED_CONTRACT_IDS = DEFERRED`

---

## 7. Relaciones físicas actualmente acreditadas

La fuente física de esquema acreditada es:

`backend/supabase/schema.sql`

Las relaciones actualmente evidenciadas son:

- `public.workspaces`
- `public.workspace_members`
- `public.assessments`
- `public.evidence_refs`
- `public.audit_log`

La existencia física de estas relaciones **no implica autorización
automática** para `guarded_update`.

Por tanto:

`EXACT_TARGET_TO_RELATION_BINDINGS = DEFERRED`

---

## 8. Vinculación a relación física

Una relación podrá ser incorporada al routing únicamente mediante un
contrato especializado explícito.

No se admitirá:

- nombre de tabla proveniente del cliente;
- nombre de tabla construido dinámicamente;
- inferencia por similitud semántica;
- selección genérica de relación;
- SQL arbitrario;
- fallback automático a otra tabla.

Regla:

`PHYSICAL_RELATION_BINDING = EXPLICIT_ALLOWLIST_ONLY`

---

## 9. Matriz de operaciones permitidas

La política global es:

`DEFAULT_OPERATION_POLICY = DENY_UNLESS_EXPLICITLY_LISTED`

La operación que puede continuar a diseño en la línea actual es:

`UPDATE`

`INSERT` y `DELETE` permanecerán prohibidos salvo que un gate posterior
los autorice expresamente y materialice su contrato especializado.

Estado:

- `UPDATE = CONTRACTUALLY_POSSIBLE_SUBJECT_TO_SPECIALIZED_BINDING`
- `INSERT = NOT_AUTHORIZED_UNLESS_EXPLICITLY_MATERIALIZED_LATER`
- `DELETE = NOT_AUTHORIZED_UNLESS_EXPLICITLY_MATERIALIZED_LATER`

---

## 10. Contrato de autorización

Cada contrato especializado deberá demostrar de forma explícita cómo la
identidad del usuario final autoriza la fila objetivo.

Fuente de identidad:

`VERIFIED_TRANSACTION_LOCAL_REQUEST_IDENTITY`

No se admite como identidad del usuario final:

- `current_user`;
- `session_user`;
- rol PostgreSQL de conexión;
- password PostgreSQL;
- `service_role`;
- `postgres`;
- identidad no verificada proveniente del cliente.

Los predicados concretos permanecen diferidos:

`EXACT_AUTHORIZATION_COLUMNS = DEFERRED`

---

## 11. Contrato de concurrencia optimista

Todo path de `UPDATE` deberá incorporar control de concurrencia optimista.

Regla conceptual:

`PRIMARY_KEY`
+
`EXPECTED_ROW_VERSION`
+
`AUTHORIZATION_PREDICATE`

deberán participar en el punto final de mutación.

La columna física exacta de versionado permanece diferida:

`EXACT_VERSION_COLUMNS = DEFERRED`

La clave primaria exacta por contrato permanece diferida:

`EXACT_PRIMARY_KEY_COLUMNS = DEFERRED`

---

## 12. Contrato de validación

Cada contrato especializado deberá definir:

- campos mutables;
- campos inmutables;
- tipos esperados;
- nulabilidad;
- reglas de dominio;
- límites;
- transiciones de estado permitidas;
- restricciones específicas del agregado.

No se autoriza un mutator universal de columnas arbitrarias.

---

## 13. Contrato de resultados

Los resultados del mutator deberán conservar la semántica de G12,
incluyendo al menos:

- `UPDATED`
- `NOT_FOUND_OR_NOT_VISIBLE`
- `VERSION_CONFLICT`
- `VALIDATION_ERROR`
- `SPECIALIZED_CONTRACT_REJECTED`

La discriminación física exacta de los resultados se resolverá en gates
posteriores.

---

## 14. Contrato de auditoría

Toda mutación materializada posteriormente deberá conservar trazabilidad
suficiente para identificar:

- solicitud;
- usuario final verificado;
- target lógico;
- contrato especializado;
- relación física;
- operación;
- identidad de fila;
- versión esperada;
- resultado;
- timestamp;
- contexto mínimo requerido para auditoría.

Este documento no define todavía escritura física de auditoría.

---

## 15. Política default-deny

La ausencia de cualquiera de los siguientes elementos deberá impedir la
mutación:

- target lógico registrado;
- contrato especializado válido;
- relación física vinculada;
- operación autorizada;
- autorización de fila;
- contrato de concurrencia;
- validación satisfactoria.

Regla:

`NO_COMPLETE_SPECIALIZED_CONTRACT = REJECT`

---

## 16. Patrones expresamente rechazados

Quedan prohibidos:

- `NO_DYNAMIC_TABLE_NAME_FROM_CLIENT_INPUT`
- `NO_DYNAMIC_COLUMN_NAME_FROM_CLIENT_INPUT`
- `NO_RAW_SQL_FROM_CLIENT`
- `NO_GENERIC_MUTATOR_WITH_ARBITRARY_RELATION`
- `NO_DIRECT_DATABASE_ACCESS_FROM_CLIENT`
- `NO_AUTHENTICATED_TABLE_DML`
- `NO_PUBLIC_EXECUTE_ON_INTERNAL_MUTATOR`
- `NO_SERVICE_ROLE_AS_RUNTIME`
- `NO_POSTGRES_AS_RUNTIME`
- `NO_BYPASSRLS_MUTATOR`

También queda prohibido derivar targets DML de acciones referenciales
como:

- `ON UPDATE CASCADE`
- `ON UPDATE RESTRICT`
- `ON UPDATE SET NULL`
- `ON UPDATE SET DEFAULT`
- `ON UPDATE NO ACTION`

Estas expresiones no constituyen relaciones objetivo de routing.

---

## 17. Separación de capas

La cadena arquitectónica canónica será:

1. `PUBLIC_API_CONTRACT`
2. `ORCHESTRATOR`
3. `ROUTING_ALLOWLIST`
4. `SPECIALIZED_CONTRACT`
5. `INTERNAL_MUTATOR`
6. `RLS_POLICY`
7. `PHYSICAL_RELATION`

El cliente no podrá omitir ni sustituir ninguna capa.

---

## 18. Modelo de privilegios

El rol autenticado no tendrá DML directo sobre las relaciones objetivo.

`AUTHENTICATED_ROLE_DIRECT_DML = PROHIBITED`

El orquestador tampoco tendrá DML directo sobre tablas.

`ORCHESTRATOR_DIRECT_TABLE_DML = PROHIBITED`

El mutator interno recibirá únicamente el privilegio mínimo indispensable
para el contrato especializado correspondiente.

`MUTATOR_ROLE_DML = EXPLICIT_MINIMUM_PER_SPECIALIZED_CONTRACT`

---

## 19. Elementos deliberadamente diferidos

Permanecen sin materializar:

- `EXACT_LOGICAL_TARGET_VALUES`
- `EXACT_SPECIALIZED_CONTRACT_IDS`
- `EXACT_TARGET_TO_RELATION_BINDINGS`
- `EXACT_PRIMARY_KEY_COLUMNS`
- `EXACT_AUTHORIZATION_COLUMNS`
- `EXACT_VERSION_COLUMNS`
- `EXACT_POLICY_NAMES`
- `EXACT_FUNCTION_NAMES`
- `EXACT_ROLE_NAMES`
- `EXACT_GRANTS`
- `EXACT_REVOKES`
- `ROUTING_IMPLEMENTATION`
- `POLICY_DDL`
- `FUNCTION_DDL`
- `ROLE_DDL`
- `SQL_MIGRATION`

Ninguno de estos elementos podrá ser completado por inferencia sin un
gate específico de evidencia y decisión.

---

## 20. Frontera de implementación

Este documento constituye exclusivamente autoridad arquitectónica
documental.

No:

- crea roles;
- altera roles;
- crea policies;
- altera policies;
- crea funciones;
- altera funciones;
- ejecuta SQL;
- ejecuta DDL;
- ejecuta DML;
- concede privilegios;
- revoca privilegios;
- modifica `schema.sql`;
- modifica Supabase;
- configura deployment.

---

## 21. Estado de las relaciones físicas

| Relación física | Binding lógico | Operación | Autorización | Versionado | Estado |
|---|---|---|---|---|---|
| `public.workspaces` | DEFERRED | DEFERRED | DEFERRED | DEFERRED | UNBOUND |
| `public.workspace_members` | DEFERRED | DEFERRED | DEFERRED | DEFERRED | UNBOUND |
| `public.assessments` | DEFERRED | DEFERRED | DEFERRED | DEFERRED | UNBOUND |
| `public.evidence_refs` | DEFERRED | DEFERRED | DEFERRED | DEFERRED | UNBOUND |
| `public.audit_log` | DEFERRED | DEFERRED | DEFERRED | DEFERRED | UNBOUND |

`UNBOUND` no significa inutilizable ni excluida. Significa únicamente que
no existe todavía autorización documental suficiente para asociarla a un
target lógico de `guarded_update`.

---

## 22. Próximo gate

El siguiente gate deberá determinar qué relaciones físicas pueden ser
candidatas reales de mutación mediante `guarded_update`, distinguiendo:

- datos operativos mutables;
- tablas de membresía o autorización;
- evidencia;
- bitácoras append-only;
- relaciones que deban quedar fuera del mutator.

Sólo después podrá diseñarse el registro concreto de `logical_target`.

---

## 23. Resultado de decisión

Queda establecido:

`ROUTING_MODEL = EXPLICIT_ALLOWLIST_LOGICAL_TARGET_TO_SPECIALIZED_CONTRACT_TO_PHYSICAL_RELATION_AND_ALLOWED_OPERATION`

`UNKNOWN_TARGET_BEHAVIOR = REJECT`

`DEFAULT_OPERATION_POLICY = DENY_UNLESS_EXPLICITLY_LISTED`

`CLIENT_SELECTED_TABLE = PROHIBITED`

`CLIENT_SELECTED_COLUMN = PROHIBITED`

`CLIENT_SELECTED_SQL = PROHIBITED`

`EXECUTABLE_IMPLEMENTATION = DEFERRED`
