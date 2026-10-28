# ADR — Arquitectura de conectividad de `guarded_update`

## Identificación

- **Dominio:** POST-RLS / G12
- **Gate:** S21F
- **Versión documental:** 0.2.0
- **Estado:** Proposed
- **Baseline de origen:** `c115f15`
- **Principal lógico:** `CATU_GUARDED_UPDATE_RUNTIME_PRINCIPAL`

## 1. Contexto

Los gates S19B, S20, S21A, S21B, S21C, S21D y S21E han establecido progresivamente el contrato lógico y físico objetivo de `guarded_update`, preservando como invariantes:

- semántica de retorno acreditada;
- control optimista mediante `expected_row_version`;
- `row_version` como entero;
- `SECURITY INVOKER`;
- RLS independiente y obligatoria;
- `default-deny`;
- `security_context`;
- resolución física explícita de objetos;
- retiro de autorización implícita de `PUBLIC`;
- exclusión de `service_role` como identidad canónica cliente/runtime;
- no acreditación de `authenticated` y `anon` como principal runtime;
- exclusión de `postgres` como principal funcional ordinario de aplicación.

S21E estableció el principal runtime lógico canónico:

`CATU_GUARDED_UPDATE_RUNTIME_PRINCIPAL`

La identidad física PostgreSQL de dicho principal continúa diferida.

## 2. Evidencia arquitectónica disponible

El discovery de conectividad acreditó:

- mediación server-side existente;
- ausencia de evidencia ejecutable suficiente de conexión PostgreSQL directa;
- ausencia de evidencia ejecutable suficiente de mediación PostgREST para `guarded_update`;
- ausencia de evidencia ejecutable de `SET ROLE` o mecanismo equivalente de role switching;
- ausencia de un principal PostgreSQL físico canónico ya acreditado.

Por tanto, la evidencia existente no permite seleccionar responsablemente:

- `LOGIN`;
- `NOLOGIN`;
- identidad de conexión;
- mecanismo de asunción;
- JWT/PostgREST mapping;
- credenciales;
- membership;
- ownership;
- `GRANT EXECUTE`;
- `REVOKE`;
- migración física.

## 3. Decisión

La ejecución futura de `guarded_update` deberá respetar una **frontera de ejecución mediada por servidor**.

El cliente o navegador no constituirá por sí mismo el principal PostgreSQL canónico de ejecución de `guarded_update`.

El principal funcional de aplicación continuará siendo el principal lógico dedicado:

`CATU_GUARDED_UPDATE_RUNTIME_PRINCIPAL`

La identidad PostgreSQL física que represente o materialice dicho principal deberá resolverse en un gate posterior, una vez acreditado documental y técnicamente el mecanismo efectivo de comunicación:

`server -> PostgreSQL`

Esta decisión no presume actualmente que dicho mecanismo sea:

- conexión PostgreSQL directa;
- PostgREST;
- RPC;
- `SET ROLE`;
- JWT-to-role mapping;
- role inheritance;
- identidad `LOGIN`;
- identidad `NOLOGIN`;
- ni cualquier otro mecanismo no acreditado.

## 4. Invariantes

La arquitectura posterior deberá preservar:

1. `SECURITY INVOKER`;
2. RLS como autoridad independiente y obligatoria;
3. `default-deny`;
4. `security_context`;
5. ausencia de autoridad implícita de `PUBLIC`;
6. ausencia de autorización automática por mera existencia de `authenticated`;
7. ausencia de autorización automática por mera existencia de `anon`;
8. exclusión de `service_role` como identidad canónica cliente/runtime;
9. exclusión de `postgres` como principal funcional ordinario;
10. privilegio mínimo;
11. separación entre identidad lógica y credencial física;
12. trazabilidad del sujeto efectivo de ejecución;
13. resolución explícita de objetos;
14. migraciones auditables;
15. rollback documentado.

## 5. Propiedades deliberadamente diferidas

Permanecen fuera del alcance de esta decisión:

- nombre PostgreSQL físico definitivo;
- `LOGIN` / `NOLOGIN`;
- password o secreto de conexión;
- JWT/PostgREST mapping;
- membership;
- `INHERIT` / `NOINHERIT`;
- mecanismo de asunción;
- connection pooling;
- propietario de la función;
- `GRANT EXECUTE`;
- `REVOKE`;
- DDL;
- migración;
- rollback físico.

## 6. Consecuencias

### Positivas

- evita vincular prematuramente el diseño a una identidad Supabase/PostgreSQL incorrecta;
- mantiene separación de responsabilidades entre cliente, servidor y base de datos;
- conserva las garantías ya acreditadas de RLS y mínimo privilegio;
- permite seleccionar posteriormente el mecanismo físico con evidencia ejecutable.

### Costos o dependencias

La materialización ejecutable de `guarded_update` permanecerá bloqueada hasta acreditar:

1. componente server-side que invocará la operación;
2. mecanismo real de conexión o mediación hacia PostgreSQL;
3. identidad de conexión;
4. identidad efectiva de ejecución;
5. relación entre ambas identidades, si fueran diferentes;
6. privilegios mínimos requeridos;
7. mecanismo de provisión de credenciales;
8. comportamiento bajo pooling;
9. integración con RLS;
10. migración y rollback.

## 7. Alternativas no adoptadas

No se adopta todavía:

- `PUBLIC`;
- `authenticated`;
- `anon`;
- `service_role`;
- `postgres`;
- un rol `LOGIN` dedicado;
- un rol `NOLOGIN` dedicado;
- `SET ROLE`;
- JWT/PostgREST role mapping;
- conexión PostgreSQL directa como arquitectura canónica.

Estas alternativas permanecen rechazadas o diferidas según la evidencia acreditada en S21B–S21F.

## 8. Frontera de implementación

Este ADR constituye exclusivamente autoridad arquitectónica documental.

No:

- crea roles PostgreSQL;
- altera roles;
- concede privilegios;
- revoca privilegios;
- modifica ownership;
- modifica `schema.sql`;
- ejecuta SQL;
- ejecuta DDL;
- ejecuta DML;
- crea migraciones;
- modifica Supabase.

## 9. Siguiente decisión requerida

El siguiente gate deberá identificar y acreditar la arquitectura efectiva:

`SERVER_EXECUTION_COMPONENT -> DATABASE_CONNECTIVITY_MECHANISM -> CONNECTION_IDENTITY -> EXECUTION_IDENTITY`

Sólo después de acreditar esa cadena podrá determinarse si el principal físico de `guarded_update` será:

- un rol dedicado `LOGIN`;
- un rol dedicado `NOLOGIN`;
- un execution role asumido por una identidad de conexión distinta;
- o una arquitectura equivalente expresamente acreditada.

## 10. Resultado

Queda establecida como decisión arquitectónica propuesta:

> `guarded_update` operará detrás de una frontera server-side. `CATU_GUARDED_UPDATE_RUNTIME_PRINCIPAL` permanece como principal lógico canónico y dedicado. Su identidad PostgreSQL física no será inferida ni materializada hasta acreditar el mecanismo efectivo server-to-database y la separación, en su caso, entre identidad de conexión e identidad de ejecución.
