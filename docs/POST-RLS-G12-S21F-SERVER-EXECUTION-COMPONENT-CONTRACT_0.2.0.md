# POST-RLS G12 — S21F Server Execution Component Contract

**Versión:** 0.2.0
**Estado:** Proposed
**Baseline de origen:** `bd894f5`
**Ámbito:** contrato arquitectónico documental
**Implementación ejecutable:** diferida

## 1. Propósito

Este documento define el contrato arquitectónico del componente server-side requerido para mediar la invocación futura de `catu.guarded_update`.

La decisión parte de evidencia acreditada en S21F:

- no existe actualmente un `SERVER_EXECUTION_COMPONENT` ejecutable;
- `backend/supabase/schema.sql` constituye infraestructura de persistencia y no un backend de aplicación;
- el service worker pertenece a la superficie cliente/cache;
- no existe referencia ejecutable a `guarded_update`;
- no existe primitiva acreditada de conectividad PostgreSQL;
- la identidad PostgreSQL física permanece diferida.

## 2. Decisión arquitectónica

La operación futura de `guarded_update` deberá quedar detrás de una frontera server-side controlada.

La cadena arquitectónica canónica será:

`CLIENT -> SERVER_EXECUTION_COMPONENT -> DATABASE_CONNECTIVITY_MECHANISM -> CONNECTION_IDENTITY -> EXECUTION_IDENTITY -> catu.guarded_update`

El cliente no invocará directamente la función PostgreSQL ni poseerá credenciales capaces de hacerlo.

## 3. Responsabilidad del componente

El `SERVER_EXECUTION_COMPONENT` será responsable de:

1. recibir solicitudes autenticadas provenientes de la aplicación;
2. validar estructura y semántica del request;
3. establecer el contexto efectivo del sujeto;
4. aplicar controles de autorización previos a cualquier acceso a base de datos;
5. invocar exclusivamente operaciones server-side expresamente autorizadas;
6. transportar el contexto requerido por RLS y `security_context`;
7. gestionar la transacción asociada a la operación;
8. normalizar respuestas y errores;
9. evitar exposición de detalles internos de PostgreSQL;
10. generar evidencia suficiente para trazabilidad y auditoría;
11. preservar idempotencia cuando el contrato funcional lo requiera;
12. impedir cualquier bypass del catálogo especializado acreditado.

## 4. Trust boundary

El `SERVER_EXECUTION_COMPONENT` constituye una frontera de confianza entre:

- cliente no confiable o parcialmente confiable; y
- infraestructura persistente gobernada por PostgreSQL/Supabase.

Toda entrada procedente del cliente deberá considerarse no confiable hasta ser validada.

Ningún parámetro enviado por el cliente podrá utilizarse directamente para:

- seleccionar dinámicamente funciones PostgreSQL;
- resolver nombres de tablas;
- elegir schemas;
- construir SQL dinámico;
- seleccionar roles PostgreSQL;
- modificar `search_path`;
- elevar privilegios;
- modificar políticas RLS.

## 5. Contrato lógico de entrada

La futura interfaz server-side deberá representar, como mínimo:

- identidad autenticada del solicitante;
- operación funcional solicitada;
- `target_entity`;
- `primary_key`;
- `expected_row_version`;
- `payload`;
- identificador de correlación;
- metadatos mínimos de trazabilidad.

La operación solicitada deberá resolverse mediante catálogo cerrado o routing especializado.

## 6. Contrato lógico de salida

El componente deberá preservar el contrato lógico ya acreditado para `guarded_update`:

- `status`;
- `target_entity`;
- `primary_key`;
- `row_version`;
- `updated_at`;
- `event_id`;
- `error_code`;
- `error_detail`.

La traducción a HTTP o RPC deberá definirse en un gate posterior.

## 7. Política de autenticación

El componente requerirá autenticación explícita del sujeto antes de aceptar operaciones mutables.

Permanece diferido el mecanismo concreto:

- sesión;
- JWT;
- PostgREST JWT;
- token de aplicación;
- mecanismo equivalente.

No queda autorizado en este gate ningún mecanismo específico.

## 8. Política de autorización

La autenticación no constituirá autorización suficiente.

El componente deberá:

- determinar explícitamente el principal funcional;
- validar alcance;
- validar operación;
- validar entidad objetivo;
- preservar RLS;
- preservar `security_context`;
- aplicar `default-deny`.

No podrá inferirse autorización únicamente por:

- existencia de sesión;
- pertenencia a un rol genérico;
- identidad técnica de conexión;
- posesión de credenciales de infraestructura.

## 9. Conectividad hacia PostgreSQL

El mecanismo físico permanece deliberadamente diferido.

Deberá acreditarse en un gate posterior uno de los mecanismos permitidos, por ejemplo:

- conexión PostgreSQL directa server-side;
- pool de conexiones;
- RPC controlado;
- mecanismo Supabase server-side;
- arquitectura equivalente explícitamente acreditada.

La elección deberá demostrar separación entre:

`CONNECTION_IDENTITY`

y

`EXECUTION_IDENTITY`.

## 10. Identidad de conexión

La identidad física PostgreSQL todavía no queda determinada.

El principal lógico canónico permanece `CATU_GUARDED_UPDATE_RUNTIME_PRINCIPAL`. Este identificador lógico no constituye todavía un rol PostgreSQL físico, no determina `LOGIN` o `NOLOGIN`, no concede `GRANT EXECUTE`, no modifica ownership y no materializa credenciales.

Por tanto permanecen diferidos:

- nombre físico del rol;
- `LOGIN`;
- `NOLOGIN`;
- membership;
- inheritance;
- ownership;
- contraseña o material equivalente;
- rotación de credenciales;
- mecanismo de secreto;
- pooling;
- asunción de rol.

## 11. Autoridad de ejecución

Se preserva la decisión acreditada:

`SECURITY INVOKER`

La futura materialización no deberá utilizar `SECURITY DEFINER` salvo una nueva decisión arquitectónica formal y explícita.

La identidad propietaria de la función no podrá emplearse como mecanismo implícito de elevación.

## 12. RLS y default-deny

RLS continuará siendo autoridad independiente y obligatoria.

El componente server-side:

- no sustituirá RLS;
- no bypassará RLS;
- no ampliará visibilidad por sí mismo;
- no convertirá la identidad técnica de conexión en autorización funcional.

`default-deny` permanecerá como política de cierre.

## 13. Gestión de secretos

Ningún secreto de base de datos podrá exponerse al navegador, PWA, service worker o bundle cliente.

Las futuras credenciales deberán existir exclusivamente en una superficie server-side acreditada.

No se autoriza almacenar secretos en:

- JavaScript cliente;
- HTML;
- service worker;
- repositorio Git;
- variables `NEXT_PUBLIC_*`;
- artefactos distribuibles al navegador.

## 14. Gestión transaccional

La operación mutable deberá ejecutarse dentro de una unidad transaccional explícita.

El contrato físico deberá definir posteriormente:

- inicio de transacción;
- commit;
- rollback;
- propagación de errores;
- comportamiento ante conflicto de `row_version`;
- comportamiento ante repetición;
- timeout;
- recuperación ante fallo.

## 15. Concurrencia

`expected_row_version` continuará siendo el mecanismo lógico de concurrencia optimista.

La identidad de conexión o el componente server-side no podrán reemplazar este control.

La actualización de `row_version` sólo podrá producirse tras una mutación confirmada.

## 16. Routing

El componente no podrá convertir `target_entity` directamente en identificador SQL.

Toda entidad deberá resolverse contra catálogo cerrado y contratos especializados previamente acreditados.

No se autoriza SQL dinámico arbitrario derivado del request.

## 17. Manejo de errores

El componente deberá distinguir entre:

- error de autenticación;
- error de autorización;
- validación;
- conflicto de versión;
- entidad inexistente o no visible;
- contrato especializado rechazado;
- fallo interno;
- fallo de conectividad.

Se preservarán, como mínimo, las categorías ya acreditadas:

- `UPDATED`;
- `VERSION_CONFLICT`;
- `NOT_FOUND_OR_NOT_VISIBLE`;
- `VALIDATION_ERROR`;
- `SPECIALIZED_CONTRACT_REJECTED`.

La representación HTTP queda diferida.

## 18. Trazabilidad

Toda operación deberá poder correlacionarse con un identificador estable.

La futura implementación deberá registrar evidencia suficiente para reconstruir:

- sujeto autenticado;
- operación solicitada;
- entidad;
- resultado;
- instante;
- `event_id`;
- correlación de request;
- resultado transaccional.

La trazabilidad no deberá almacenar secretos ni payloads sensibles sin necesidad.

## 19. Separación de responsabilidades

Cliente:

- captura;
- presentación;
- autenticación de usuario;
- envío de request.

Servidor:

- validación;
- autorización;
- mediación;
- contexto;
- conectividad;
- transacción;
- normalización de errores.

PostgreSQL:

- integridad;
- RLS;
- concurrencia;
- reglas persistentes;
- operación `guarded_update`.

## 20. Propiedades no resueltas

Permanecen diferidas:

- tecnología server-side concreta;
- proveedor de hosting;
- framework;
- runtime;
- endpoint físico;
- contrato HTTP;
- mecanismo físico de conexión;
- pool;
- identidad PostgreSQL;
- `LOGIN` / `NOLOGIN`;
- `GRANT EXECUTE`;
- `REVOKE`;
- ownership;
- secrets manager;
- JWT/PostgREST mapping;
- política de despliegue;
- migración ejecutable;
- rollback ejecutable.

## 21. Frontera de implementación

Este gate constituye exclusivamente autoridad arquitectónica documental.

No:

- crea backend;
- crea endpoint;
- crea función PostgreSQL;
- crea rol;
- altera rol;
- concede privilegios;
- revoca privilegios;
- modifica ownership;
- modifica `schema.sql`;
- ejecuta SQL;
- ejecuta DDL;
- ejecuta DML;
- crea migraciones;
- modifica Supabase;
- crea secretos;
- configura hosting.

## 22. Próximo gate

El siguiente gate deberá seleccionar y acreditar la **plataforma efectiva del `SERVER_EXECUTION_COMPONENT`**.

Como mínimo deberá resolver:

`SERVER_RUNTIME -> DEPLOYMENT_TARGET -> DATABASE_CONNECTIVITY_MECHANISM`

Sólo después podrá acreditarse:

`CONNECTION_IDENTITY -> EXECUTION_IDENTITY`

y únicamente después de ello podrá decidirse físicamente:

- rol PostgreSQL;
- `LOGIN` / `NOLOGIN`;
- `GRANT EXECUTE`;
- ownership;
- política de credenciales.

## 23. Resultado de decisión

Queda establecido como contrato canónico:

> `catu.guarded_update` deberá ser invocado exclusivamente desde un componente server-side controlado. La aplicación cliente no tendrá conectividad PostgreSQL directa ni credenciales de ejecución. El componente server-side preservará `SECURITY INVOKER`, RLS, `default-deny`, `security_context`, concurrencia optimista y routing especializado. La plataforma, mecanismo de conectividad e identidad PostgreSQL física permanecen diferidos hasta gates posteriores.
