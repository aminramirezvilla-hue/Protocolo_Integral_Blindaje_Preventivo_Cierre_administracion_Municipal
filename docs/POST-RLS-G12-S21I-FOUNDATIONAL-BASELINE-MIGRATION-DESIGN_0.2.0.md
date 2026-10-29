# S21I — Foundational Baseline Migration Design

**Documento:** POST-RLS-G12-S21I-FOUNDATIONAL-BASELINE-MIGRATION-DESIGN
**Versión:** 0.2.0
**Estado:** DESIGN CERTIFICATION CANDIDATE
**Fuente canónica:** `backend/supabase/schema.sql`
**SHA-256 fuente:** `132bf4faf93e927f3ca4502517a6175ccc356f16116eae9df6bc7ddc7fc6aa11`
**HEAD de diseño:** `6dbda11cb690bfc8b7f81aac1643a5e15407de8a`

## 1. Propósito

Definir el contrato arquitectónico y operativo para materializar por primera
vez el esquema aplicativo CATU en PostgreSQL/Supabase antes de ejecutar la
migración incremental S21I de control de concurrencia por `row_version`.

Este documento es exclusivamente de diseño. No constituye una migración SQL,
no autoriza DDL/DML y no autoriza despliegue.

## 2. Estado físico acreditado

El discovery remoto previo acreditó que el esquema `public` del proyecto
Supabase no contiene actualmente las tablas aplicativas CATU.

Estado:

- `public.workspaces`: no materializada.
- `public.workspace_members`: no materializada.
- `public.assessments`: no materializada.
- `public.evidence_refs`: no materializada.
- `public.audit_log`: no materializada.
- `row_version`: no materializado.
- S21I: diseñado y versionado, pero no autorizado para ejecución física.

## 3. Fuente de verdad

La fuente canónica para el baseline fundacional es:

`backend/supabase/schema.sql`

No deberá reconstruirse el modelo desde memoria, documentación secundaria ni
desde el Dashboard de Supabase.

## 4. Alcance de propiedad

El baseline sólo podrá materializar objetos propiedad de CATU.

**Esquema aplicativo:** `public`

No se autoriza recrear objetos pertenecientes a:

- `auth`
- `storage`
- `realtime`
- `vault`
- `extensions`

Los objetos administrados por Supabase se consideran dependencias externas y
se utilizarán exclusivamente mediante referencias válidas.

## 5. Tablas aplicativas canónicas

- `public.workspaces`
- `public.workspace_members`
- `public.assessments`
- `public.evidence_refs`
- `public.audit_log`

## 6. Orden fundacional de materialización

El análisis topológico no detectó ciclos.

1. `public.workspaces`
2. `public.assessments`
3. `public.audit_log`
4. `public.evidence_refs`
5. `public.workspace_members`

Este orden deberá recertificarse contra el SQL final antes de cualquier
ejecución.

## 7. Dependencias externas

- `public.workspace_members` → `auth.users`
- `public.assessments` → `auth.users`
- `public.evidence_refs` → `auth.users`
- `public.audit_log` → `auth.users`

Referencias Supabase adicionales detectadas:

- `auth.uid`
- `auth.users`

En particular, `auth.users` podrá ser referenciado, pero nunca recreado.
`auth.uid()` se tratará como función administrada por Supabase.

## 8. Objetos auxiliares del esquema canónico

### Índices

- Ninguno.

### Funciones

- `public.is_workspace_member`
- `public.workspace_role`

### Triggers

Cantidad detectada: **0**

### Policies

- `members read workspaces`
- `members read members`
- `admin coordinator catu manage assessments`
- `members read evidence`
- `members insert evidence`
- `members read audit`

### Grants / Revokes

- GRANT detectados: **0**
- REVOKE detectados: **0**

La migración fundacional no deberá introducir privilegios que no estén
respaldados explícitamente por el esquema canónico o por una decisión
arquitectónica posterior certificada.

## 9. Secuencia de materialización propuesta

1. Preflight remoto de dependencias externas.
2. Verificación fail-closed de ausencia del baseline CATU.
3. Apertura de transacción controlada.
4. Creación de tablas aplicativas en orden de dependencias.
5. Creación de constraints e índices canónicos.
6. Creación de funciones aplicativas, si existen.
7. Creación de triggers, si existen.
8. Activación de RLS según contrato canónico.
9. Creación de policies.
10. Aplicación exclusiva de grants/revokes expresamente autorizados.
11. Verificación estructural dentro de la misma transacción.
12. Commit controlado únicamente si todos los invariantes son satisfechos.
13. Recertificación post-materialización.
14. Sólo después: evaluación de elegibilidad para S21I `row_version`.

## 10. Principios fail-closed

La futura migración fundacional deberá abortar si:

- una tabla CATU esperada ya existe de manera inesperada;
- una dependencia externa requerida no existe;
- la definición física difiere del contrato canónico;
- aparece una dependencia circular no prevista;
- se requiere recrear un objeto administrado por Supabase;
- una operación excede el ámbito `public` autorizado;
- no puede garantizarse rollback transaccional suficiente;
- el estado previo del proyecto no corresponde al baseline esperado.

No se utilizará `IF NOT EXISTS` como mecanismo para ocultar drift físico salvo
que exista una justificación explícita y posteriormente certificada.

## 11. Idempotencia

El baseline será una migración de aplicación única y controlada.

La idempotencia no significará reejecución ciega. Una segunda ejecución deberá
detectar que el baseline ya fue aplicado y entrar en estado HOLD, salvo que se
diseñe expresamente un mecanismo distinto.

## 12. Relación con S21I

`20261029_s21i_row_version_concurrency.sql` es una migración incremental.

Depende materialmente de que existan, como mínimo:

- `public.workspaces`
- `public.assessments`

Por ello:

`FOUNDATIONAL_BASELINE -> POST_BASELINE_RECERTIFICATION -> S21I`

S21I permanece **NO AUTORIZADO** hasta concluir satisfactoriamente esas fases.

## 13. Nombre del futuro artefacto SQL

El nombre definitivo de la migración fundacional permanece **DEFERRED**.

Antes de crear el archivo SQL deberá certificarse:

- convención de nombres del repositorio;
- precedencia inequívoca respecto de S21I;
- compatibilidad con la estrategia de migraciones Supabase;
- ausencia de colisión de identificadores/versiones.

## 14. Frontera actual

- DATABASE_CONNECTION = NO
- SQL_EXECUTION = NO
- DDL_EXECUTION = NO
- DML_EXECUTION = NO
- MIGRATION_APPLICATION = NO
- DEPLOYMENT = NO
- S21I_EXECUTION_AUTHORIZED = NO

## 15. Siguiente autoridad

`AUTHORIZED_FOR_FOUNDATIONAL_BASELINE_MIGRATION_DOCUMENT_RECERTIFICATION`

No se autoriza todavía crear el SQL ejecutable.
