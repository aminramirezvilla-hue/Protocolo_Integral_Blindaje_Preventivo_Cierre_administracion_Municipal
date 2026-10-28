# ADR POST-RLS G12 S21H — Contrato de conectividad PostgreSQL

**Versión:** 0.2.0
**Estado:** Proposed
**Baseline de origen:** f63c2e0
**Ámbito:** contrato arquitectónico documental
**Implementación ejecutable:** diferida

## 1. Propósito

Este ADR establece el contrato arquitectónico canónico de conectividad entre el componente server-side responsable de `catu.guarded_update` y PostgreSQL.

No materializa todavía conectividad física, credenciales, roles PostgreSQL, secretos, pooler, conexión directa, migraciones ni deployment.

## 2. Decisiones heredadas

Permanecen vigentes las siguientes decisiones:

- `SERVER_RUNTIME = SUPABASE_EDGE_FUNCTIONS`
- `RUNTIME_ENGINE = DENO_COMPATIBLE_TYPESCRIPT`
- `DEPLOYMENT_TARGET = SUPABASE_HOSTED_EDGE_RUNTIME`
- `EXECUTION_BOUNDARY = SERVER_MEDIATED`
- `CLIENT_DIRECT_DATABASE_ACCESS = PROHIBITED`
- `CANONICAL_LOGICAL_PRINCIPAL = CATU_GUARDED_UPDATE_RUNTIME_PRINCIPAL`

## 3. Evidencia disponible

La evidencia acreditada en gates previos establece:

- no existe conectividad PostgreSQL ejecutable materializada;
- no existe Edge Function física acreditada;
- no existen dependencias DB ejecutables acreditadas;
- existe una referencia documental a pooler;
- dicha referencia no constituye configuración ni implementación;
- no existe base suficiente para seleccionar todavía conexión directa, Supavisor, session pooler, transaction pooler u otro mecanismo físico.

Por tanto:

`EVIDENCE_CLASS = POOLER_SIGNAL_DOCUMENTAL_ONLY`

## 4. Decisión arquitectónica S21H

Se establece:

`DATABASE_CONNECTIVITY_MECHANISM = MANAGED_POSTGRESQL_CONNECTIVITY_REQUIRED`

La semántica de esta decisión es:

1. `catu.guarded_update` deberá ser invocada exclusivamente desde una frontera server-side controlada.
2. La conectividad PostgreSQL será responsabilidad exclusiva del componente server-side.
3. La aplicación cliente no podrá establecer conectividad PostgreSQL directa.
4. La conectividad deberá ser compatible con el runtime Supabase Edge definido en S21G.
5. La elección del mecanismo físico de conectividad permanece diferida.
6. La identidad de conexión permanecerá separada de la identidad del cliente.
7. La identidad de conexión no otorgará por sí misma autorización de fila.
8. RLS seguirá siendo autoridad independiente y obligatoria.
9. `SECURITY INVOKER` permanecerá preservado.
10. `default-deny` permanecerá preservado.
11. `security_context` continuará gobernando autenticación, autorización y visibilidad.
12. La operación seguirá sometida a control de concurrencia optimista mediante `expected_row_version`.

## 5. Frontera cliente / servidor / base de datos

La cadena arquitectónica canónica será:

`CLIENT -> SERVER_EXECUTION_COMPONENT -> DATABASE_CONNECTIVITY_MECHANISM -> CONNECTION_IDENTITY -> EXECUTION_IDENTITY -> catu.guarded_update`

La aplicación cliente:

- no conocerá credenciales PostgreSQL;
- no recibirá cadenas de conexión PostgreSQL;
- no establecerá sesiones PostgreSQL directas;
- no invocará directamente `catu.guarded_update`;
- no determinará la identidad física PostgreSQL de ejecución.

El componente server-side será responsable de mediar la operación.

## 6. Separación de identidades

Deberán mantenerse conceptualmente separadas:

- identidad del usuario o cliente;
- identidad de conexión;
- identidad de ejecución;
- principal lógico de aplicación;
- identidad física PostgreSQL.

El principal lógico canónico continúa siendo:

`CATU_GUARDED_UPDATE_RUNTIME_PRINCIPAL`

Este identificador no constituye todavía un rol PostgreSQL físico.

## 7. Autoridad de seguridad preservada

Permanecen como invariantes:

- `SECURITY INVOKER`;
- RLS;
- `default-deny`;
- `security_context`;
- `expected_row_version`;
- `NOT_FOUND_OR_NOT_VISIBLE`;
- `UPDATED`;
- `VERSION_CONFLICT`;
- `VALIDATION_ERROR`;
- `SPECIALIZED_CONTRACT_REJECTED`.

La existencia futura de una conexión PostgreSQL no podrá utilizarse para eludir estas autoridades.

## 8. Mecanismo físico de conectividad

Permanece expresamente diferida la selección entre:

- conexión PostgreSQL directa;
- Supavisor;
- pooler en modo session;
- pooler en modo transaction;
- mecanismo administrado equivalente;
- otra estrategia compatible con Supabase Edge Runtime.

La decisión física requerirá evidencia técnica específica de plataforma y runtime.

## 9. Identidades diferidas

Permanecen sin resolver:

- `CONNECTION_IDENTITY`;
- `EXECUTION_IDENTITY`;
- nombre PostgreSQL físico;
- rol PostgreSQL físico;
- `LOGIN` / `NOLOGIN`;
- membership;
- herencia;
- credenciales;
- material de secretos;
- ownership;
- `GRANT EXECUTE`;
- `REVOKE`.

## 10. Gestión de secretos

La futura materialización deberá garantizar:

- ningún secreto en bundle cliente;
- ningún secreto en JavaScript navegador;
- ningún secreto en `localStorage`;
- ningún secreto versionado en Git;
- ningún secreto expuesto mediante variables públicas;
- ninguna credencial PostgreSQL disponible al cliente.

El mecanismo concreto de gestión de secretos permanece diferido.

## 11. Concurrencia

La conectividad física futura no alterará el contrato de concurrencia optimista.

`expected_row_version` seguirá siendo condición necesaria para operaciones mutables gobernadas.

## 12. RLS y autorización de fila

La conectividad PostgreSQL no sustituye RLS.

La identidad de conexión no concede por sí misma:

- visibilidad de filas;
- autorización de modificación;
- bypass de `security_context`;
- bypass de `default-deny`;
- bypass de contratos especializados.

## 13. Propiedades obligatorias de la implementación futura

La implementación física futura deberá:

1. operar exclusivamente server-side;
2. mantener separada la identidad del cliente de la identidad PostgreSQL;
3. proteger credenciales;
4. preservar `SECURITY INVOKER`;
5. preservar RLS;
6. preservar `default-deny`;
7. preservar `security_context`;
8. respetar `expected_row_version`;
9. ser compatible con Supabase Edge Runtime;
10. permitir auditoría y rollback;
11. no exponer secretos al cliente;
12. mantener mínimo privilegio.

## 14. Decisiones no autorizadas por este ADR

Este ADR no autoriza:

- crear backend;
- crear Edge Function;
- crear conexión PostgreSQL;
- configurar Supavisor;
- configurar pooler;
- crear secretos;
- crear credenciales;
- crear roles PostgreSQL;
- alterar roles;
- conceder privilegios;
- revocar privilegios;
- modificar ownership;
- modificar `schema.sql`;
- ejecutar SQL;
- ejecutar DDL;
- ejecutar DML;
- crear migraciones;
- ejecutar deployment;
- modificar G12;
- modificar S21G.

## 15. Diferimientos

Quedan expresamente diferidos a gates posteriores:

- `PHYSICAL_CONNECTIVITY_MECHANISM`;
- `CONNECTION_IDENTITY`;
- `EXECUTION_IDENTITY`;
- `PHYSICAL_POSTGRESQL_ROLE`;
- `LOGIN_NOLOGIN`;
- `CREDENTIAL_MATERIAL`;
- `SECRET_STORAGE`;
- `GRANT_EXECUTE`;
- `REVOKE`;
- `OWNERSHIP`;
- implementación ejecutable;
- migración;
- rollback físico;
- pruebas transaccionales reales.

## 16. Siguiente decisión requerida

El siguiente gate deberá determinar, con evidencia técnica específica de Supabase Edge Runtime, cuál mecanismo físico satisface este contrato:

`MANAGED_POSTGRESQL_CONNECTIVITY_REQUIRED`

Sólo después podrá autorizarse la selección entre conexión directa, pooler/Supavisor u otro mecanismo compatible.

## 17. Resultado de decisión

Queda establecido como contrato canónico:

`SERVER_RUNTIME = SUPABASE_EDGE_FUNCTIONS`

`DEPLOYMENT_TARGET = SUPABASE_HOSTED_EDGE_RUNTIME`

`EXECUTION_BOUNDARY = SERVER_MEDIATED`

`CLIENT_DIRECT_DATABASE_ACCESS = PROHIBITED`

`DATABASE_CONNECTIVITY_MECHANISM = MANAGED_POSTGRESQL_CONNECTIVITY_REQUIRED`

`PHYSICAL_CONNECTIVITY_MECHANISM = DEFERRED`

`CONNECTION_IDENTITY = DEFERRED`

`EXECUTION_IDENTITY = DEFERRED`

`PHYSICAL_POSTGRESQL_ROLE = DEFERRED`

`CANONICAL_LOGICAL_PRINCIPAL = CATU_GUARDED_UPDATE_RUNTIME_PRINCIPAL`

La implementación ejecutable continúa diferida.
