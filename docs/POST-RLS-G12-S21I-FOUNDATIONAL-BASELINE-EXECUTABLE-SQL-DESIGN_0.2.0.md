# S21I — Foundational Baseline Executable SQL Design

**Documento:** POST-RLS-G12-S21I-FOUNDATIONAL-BASELINE-EXECUTABLE-SQL-DESIGN
**Versión:** 0.2.0
**Estado:** DOCUMENTARY DESIGN CANDIDATE
**HEAD de diseño:** `69dbef4d59705518440ea61cee1054578b610d88`
**Fuente canónica:** `backend/supabase/schema.sql`
**SHA-256 fuente:** `132bf4faf93e927f3ca4502517a6175ccc356f16116eae9df6bc7ddc7fc6aa11`

## 1. Propósito

Definir el contrato técnico del futuro artefacto SQL que materializará por
primera vez el esquema aplicativo CATU en PostgreSQL/Supabase.

Este documento no es una migración ejecutable. No contiene autorización para
crear, aplicar, ejecutar ni desplegar SQL.

## 2. Clasificación

- Tipo: `FOUNDATIONAL_APPLICATION_SCHEMA_MIGRATION`
- Esquema propiedad de CATU: `public`
- Esquemas administrados por Supabase: `auth`, `storage`, `realtime`, `vault`, `extensions`
- Recreación de objetos administrados por Supabase: `PROHIBITED`
- Nombre definitivo del archivo SQL: `DEFERRED_PENDING_SEQUENCE_CERTIFICATION`

## 3. Fuente de verdad

Todo SQL futuro deberá derivarse exclusivamente de:

`backend/supabase/schema.sql`

No se autoriza reconstruir definiciones desde memoria, documentación
secundaria, Dashboard, inferencia o una base remota.

## 4. Tablas CATU

- `public.workspaces`
- `public.workspace_members`
- `public.assessments`
- `public.evidence_refs`
- `public.audit_log`

Cantidad certificada: **5**

## 5. Dependencias internas

- `public.workspaces` → ninguna
- `public.workspace_members` → `public.workspaces`
- `public.assessments` → `public.workspaces`
- `public.evidence_refs` → `public.workspaces`
- `public.audit_log` → `public.workspaces`

## 6. Dependencias externas

- `public.workspaces` → ninguna
- `public.workspace_members` → `auth.users`
- `public.assessments` → `auth.users`
- `public.evidence_refs` → `auth.users`
- `public.audit_log` → `auth.users`

Además:

- `auth.users`: referencia externa administrada por Supabase.
- `auth.uid()`: función externa administrada por Supabase.

Estas dependencias podrán ser referenciadas, pero nunca recreadas.

## 7. Orden de materialización propuesto

1. `public.workspaces`
2. `public.workspace_members`
3. `public.assessments`
4. `public.evidence_refs`
5. `public.audit_log`

El orden deberá volver a certificarse contra el artefacto SQL final antes de
autorizar stage o ejecución.

## 8. Funciones canónicas

- `public.is_workspace_member`
- `public.workspace_role`

Cantidad certificada: **2**

El futuro SQL deberá conservar exactamente las definiciones canónicas,
incluyendo lenguaje, seguridad, argumentos, retorno y cuerpo funcional.

## 9. RLS

Tablas con `ENABLE ROW LEVEL SECURITY` detectado:

- `public.workspaces`
- `public.workspace_members`
- `public.assessments`
- `public.evidence_refs`
- `public.audit_log`

La activación de RLS deberá ocurrir sólo después de que la estructura necesaria
para las predicates exista físicamente.

## 10. Policies canónicas

- `members read workspaces` sobre `public.workspaces`
- `members read members` sobre `public.workspace_members`
- `admin coordinator catu manage assessments` sobre `public.assessments`
- `members read evidence` sobre `public.evidence_refs`
- `members insert evidence` sobre `public.evidence_refs`
- `members read audit` sobre `public.audit_log`

Cantidad certificada: **6**

El SQL final deberá preservar nombres, relaciones, comandos, roles,
predicados `USING` y cláusulas `WITH CHECK` exactamente según la fuente
canónica.

## 11. Índices explícitos

- Ninguno.

Cantidad detectada: **0**

Las PRIMARY KEY, UNIQUE y demás constraints declaradas dentro o fuera de
`CREATE TABLE` deberán conservarse adicionalmente aunque no aparezcan en esta
lista de índices explícitos.

## 12. Triggers y privilegios

- Triggers: **0**
- GRANT: **0**
- REVOKE: **0**

El artefacto SQL fundacional no deberá inventar triggers, grants o revokes
ausentes en la fuente canónica.

## 13. Estrategia transaccional requerida

El futuro artefacto deberá diseñarse para:

1. Preflight fail-closed.
2. Confirmación de ausencia del baseline CATU.
3. Confirmación de existencia de dependencias Supabase requeridas.
4. Inicio de transacción, cuando la plataforma y operación lo permitan.
5. Materialización de tablas en orden certificado.
6. Materialización de constraints e índices.
7. Materialización de funciones.
8. Habilitación de RLS.
9. Materialización de policies.
10. Verificación estructural antes del commit.
11. Commit únicamente si todos los invariantes pasan.
12. Recertificación física post-materialización.

## 14. Idempotencia fail-closed

El baseline será de aplicación única.

No se utilizará `IF NOT EXISTS` de forma general para ocultar drift.

Si cualquiera de las cinco tablas CATU existe inesperadamente, la futura
migración deberá detenerse y producir estado `HOLD`, salvo que una
recertificación posterior determine expresamente otro comportamiento.

## 15. Prohibiciones

El futuro artefacto no podrá:

- crear objetos en `auth`;
- crear objetos en `storage`;
- crear objetos en `realtime`;
- crear objetos en `vault`;
- crear objetos en `extensions`;
- recrear `auth.users`;
- recrear `auth.uid()`;
- introducir tablas CATU adicionales;
- eliminar objetos preexistentes;
- ejecutar DML de negocio;
- introducir GRANT/REVOKE no canónicos;
- aplicar S21I dentro del baseline fundacional;
- desplegarse sin physical preflight independiente.

## 16. Relación con S21I

La secuencia obligatoria permanece:

`FOUNDATIONAL_BASELINE -> POST_BASELINE_RECERTIFICATION -> S21I`

La migración de concurrencia:

`20261029_s21i_row_version_concurrency.sql`

permanece físicamente diferida.

`S21I_EXECUTION_AUTHORIZED = NO`

## 17. Convención del futuro archivo

El nombre físico definitivo permanece:

`DEFERRED_PENDING_SEQUENCE_CERTIFICATION`

Antes de crear el `.sql` deberá acreditarse que su identificador de migración
precede inequívocamente a S21I conforme a la convención real del repositorio y
del mecanismo de migraciones utilizado.

## 18. Frontera actual

- EXECUTABLE_SQL_FILE_CREATED = NO
- DATABASE_CONNECTION = NO
- SQL_EXECUTION = NO
- DDL_EXECUTION = NO
- DML_EXECUTION = NO
- MIGRATION_APPLICATION = NO
- GIT_STAGE = NO
- GIT_COMMIT = NO
- REMOTE_PUSH = NO
- DEPLOYMENT = NO
- S21I_EXECUTION_AUTHORIZED = NO

## 19. Siguiente autoridad

`AUTHORIZED_FOR_FOUNDATIONAL_BASELINE_EXECUTABLE_SQL_DOCUMENT_RECERTIFICATION`

La creación del artefacto `.sql` aún no está autorizada.
