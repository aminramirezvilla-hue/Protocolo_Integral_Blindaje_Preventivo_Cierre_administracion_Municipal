# ADR-POST-RLS-G12-S21G — Server Runtime y Deployment Target

**Versión:** 0.2.0
**Estado:** Proposed
**Baseline de origen:** `0ccd3f1`
**Dominio:** G12 / `guarded_update` / infraestructura de ejecución server-side
**Tipo de decisión:** arquitectura de ejecución
**Predecesor:** S21F — Server Execution Component Contract

---

## 1. Propósito

Este Architecture Decision Record establece el runtime server-side y el
deployment target canónicos que deberán soportar la implementación futura de
`catu.guarded_update`.

La decisión se deriva del contrato S21F, que establece una frontera de
ejecución mediada por servidor y prohíbe conectividad PostgreSQL directa desde
la aplicación cliente.

Este ADR constituye exclusivamente autoridad arquitectónica documental.

No materializa infraestructura ni modifica PostgreSQL, Supabase, G12 o el
código ejecutable de la aplicación.

---

## 2. Evidencia de origen

El discovery y la revisión dirigida S21G acreditaron:

- existencia de una única superficie server-side tracked;
- existencia de una única superficie Supabase;
- dicha superficie corresponde exclusivamente a SQL;
- ausencia de código server-side ejecutable;
- ausencia de primitivas ejecutables de conectividad PostgreSQL;
- ausencia de Supabase Edge Functions materializadas;
- ausencia de `package.json`;
- ausencia de runtime manifests;
- ausencia de deployment manifests;
- existencia de `sw.js`, clasificado exclusivamente como cliente/cache;
- working tree limpio;
- index vacío;
- baseline `0ccd3f1`.

La clasificación acreditada fue:

`SQL_ONLY_SERVER_SURFACE_NO_EXECUTABLE_RUNTIME`

Por tanto, no existe actualmente un `SERVER_RUNTIME` ejecutable cuya identidad
pueda heredarse automáticamente.

---

## 3. Decisión

Se adopta como runtime server-side canónico objetivo:

`SUPABASE_EDGE_FUNCTIONS`

Su modelo de ejecución será:

`DENO_COMPATIBLE_TYPESCRIPT`

El deployment target canónico objetivo será:

`SUPABASE_HOSTED_EDGE_RUNTIME`

La cadena arquitectónica resultante será:

`CLIENT`
→ `SUPABASE_EDGE_FUNCTION`
→ `DATABASE_CONNECTIVITY_MECHANISM`
→ `CONNECTION_IDENTITY`
→ `EXECUTION_IDENTITY`
→ `catu.guarded_update`

La aplicación cliente no invocará directamente PostgreSQL ni recibirá
credenciales PostgreSQL.

---

## 4. Principio de mediación

`catu.guarded_update` deberá ser invocado exclusivamente a través de una
superficie server-side controlada.

La Edge Function actuará como frontera de mediación entre:

1. identidad del usuario o sesión cliente;
2. contexto de autorización de aplicación;
3. identidad de conexión hacia PostgreSQL;
4. identidad física de ejecución PostgreSQL;
5. ejecución de `catu.guarded_update`.

La identidad del cliente y la identidad PostgreSQL de ejecución permanecerán
separadas.

---

## 5. Principal lógico canónico

Permanece vigente:

`CATU_GUARDED_UPDATE_RUNTIME_PRINCIPAL`

Este identificador continúa siendo exclusivamente un principal lógico.

Este ADR no determina todavía:

- nombre PostgreSQL físico;
- `LOGIN` o `NOLOGIN`;
- contraseña;
- secreto;
- ownership;
- membresías;
- herencia;
- `GRANT EXECUTE`;
- `REVOKE`;
- rol de conexión;
- rol de ejecución;
- estrategia de asunción de rol.

La identidad física permanecerá diferida.

---

## 6. Compatibilidad con principal PostgreSQL dedicado

El runtime seleccionado deberá permitir que un gate posterior materialice una
identidad PostgreSQL de aplicación dedicada y gobernada.

Queda expresamente prohibido inferir que cualquiera de las siguientes
identidades constituye automáticamente el principal canónico de
`guarded_update`:

- `PUBLIC`;
- `anon`;
- `authenticated`;
- `service_role`;
- `postgres`;
- propietario de la base;
- propietario de la función;
- identidad de usuario final.

La identidad PostgreSQL física deberá acreditarse independientemente.

---

## 7. SECURITY INVOKER

Permanece vigente la decisión S21B:

`SECURITY INVOKER`

La selección de Supabase Edge Functions como runtime no modifica esta
semántica.

La función PostgreSQL futura no adquirirá privilegios adicionales por efecto
de su propiedad.

La identidad efectiva PostgreSQL deberá quedar gobernada por el mecanismo de
conectividad y ejecución que se acredite posteriormente.

---

## 8. RLS y default-deny

Permanecen vigentes como controles independientes:

- RLS;
- `default-deny`;
- `security_context`;
- validación de `target_entity`;
- contratos especializados;
- control optimista mediante `expected_row_version`.

La mediación server-side no sustituye RLS.

La existencia futura de un principal PostgreSQL dedicado tampoco sustituirá
RLS ni autorización de fila.

---

## 9. Gestión de secretos

Las credenciales o secretos que pudieran requerirse para la conectividad
server-to-database deberán residir exclusivamente en mecanismos de secretos
del runtime server-side.

No podrán:

- incorporarse al bundle cliente;
- exponerse mediante JavaScript navegador;
- almacenarse en `sw.js`;
- persistirse en LocalStorage;
- incluirse en repositorio Git;
- exponerse mediante variables públicas;
- derivarse de credenciales del usuario final.

La definición física del secreto permanece diferida.

---

## 10. Database Connectivity Mechanism

Este ADR no selecciona todavía el mecanismo físico de conectividad hacia
PostgreSQL.

Permanecen como alternativas sujetas al siguiente gate:

1. conexión PostgreSQL mediante mecanismo de pooling compatible con
   cargas serverless/edge;
2. una interfaz server-side equivalente expresamente acreditada.

La selección deberá preservar:

- principal PostgreSQL dedicado;
- mínimo privilegio;
- RLS;
- `SECURITY INVOKER`;
- control de concurrencia;
- trazabilidad;
- aislamiento de credenciales;
- comportamiento transaccional requerido por `guarded_update`.

La decisión se realizará en S21H.

---

## 11. Exclusiones

No se adopta como arquitectura canónica:

- conexión PostgreSQL directa desde el navegador;
- `sw.js` como backend;
- credencial PostgreSQL distribuida al cliente;
- `service_role` como principal lógico de `guarded_update`;
- `postgres` como principal funcional ordinario;
- `PUBLIC` como principal de ejecución;
- ejecución de `guarded_update` desde código cliente;
- inferencia automática de roles PostgreSQL a partir de JWT;
- elevación implícita de privilegios.

---

## 12. Deployment Target

La implementación objetivo deberá desplegarse en:

`SUPABASE_HOSTED_EDGE_RUNTIME`

La selección del runtime no constituye todavía deployment.

Este ADR no:

- crea Edge Functions;
- crea proyectos Supabase;
- modifica configuración Supabase;
- configura dominios;
- configura regiones;
- crea secretos;
- ejecuta CLI de Supabase;
- modifica hosting;
- configura CI/CD.

Todos esos actos permanecen sujetos a gates posteriores.

---

## 13. Contrato de entrada futuro

La Edge Function deberá recibir un contrato de aplicación controlado y no una
sentencia SQL arbitraria.

Como mínimo, la interfaz deberá preservar conceptualmente los argumentos ya
acreditados para `guarded_update`:

- `target_entity`;
- `primary_key`;
- `expected_row_version`;
- payload controlado.

La interfaz RPC/HTTP definitiva permanece diferida.

---

## 14. Contrato de salida futuro

El resultado de aplicación deberá conservar la semántica canónica ya
acreditada, incluyendo:

- `UPDATED`;
- `VERSION_CONFLICT`;
- `NOT_FOUND_OR_NOT_VISIBLE`;
- `VALIDATION_ERROR`;
- `SPECIALIZED_CONTRACT_REJECTED`.

La capa server-side no podrá degradar la semántica
`NOT_FOUND_OR_NOT_VISIBLE` exponiendo diferencias no autorizadas entre
inexistencia y falta de visibilidad.

---

## 15. Observabilidad y trazabilidad

La futura implementación server-side deberá permitir correlacionar, al menos:

`CLIENT_REQUEST`
→ `SERVER_INVOCATION`
→ `CONNECTION_IDENTITY`
→ `EXECUTION_IDENTITY`
→ `guarded_update`
→ `EVENTO_TRAZABILIDAD`

La definición física de identificadores de correlación, logging y telemetría
permanece diferida.

---

## 16. Frontera de implementación

Este ADR constituye exclusivamente autoridad arquitectónica documental.

Restricciones explícitas:

- no crea backend;
- no crea Edge Function;
- no crea endpoint;
- no crea rol PostgreSQL;
- no altera roles;
- no concede privilegios;
- no revoca privilegios;
- no modifica ownership;
- no crea secretos;
- no materializa credenciales;
- no ejecuta SQL;
- no ejecuta DDL;
- no ejecuta DML;
- no crea migraciones;
- no modifica `schema.sql`;
- no modifica Supabase;
- no ejecuta deployment;
- no modifica G12.

---

## 17. Invariantes heredados

Permanecen preservados:

1. `SECURITY INVOKER`;
2. RLS;
3. `default-deny`;
4. `security_context`;
5. `expected_row_version`;
6. atomicidad;
7. semántica no enumerativa;
8. routing especializado;
9. `EVENTO_TRAZABILIDAD`;
10. separación causal de autorización, conexión y ejecución;
11. prohibición de conectividad PostgreSQL directa desde cliente;
12. principal lógico dedicado;
13. mínimo privilegio;
14. trazabilidad auditable.

---

## 18. Decisiones expresamente diferidas

Permanecen fuera de este gate:

- `DATABASE_CONNECTIVITY_MECHANISM`;
- conexión directa vs pooler;
- modo de pooling;
- driver PostgreSQL;
- nombre PostgreSQL físico;
- `LOGIN` / `NOLOGIN`;
- `CONNECTION_IDENTITY`;
- `EXECUTION_IDENTITY`;
- ownership;
- membership;
- herencia;
- `GRANT EXECUTE`;
- `REVOKE`;
- credenciales;
- rotación de secretos;
- RPC/HTTP contract;
- política de retry;
- timeout;
- pool sizing;
- deployment físico;
- CI/CD.

---

## 19. Próximo gate

El siguiente gate deberá resolver:

`DATABASE_CONNECTIVITY_MECHANISM`
→ `CONNECTION_IDENTITY`

y deberá determinar cuál mecanismo permite preservar de manera verificable el
principal lógico:

`CATU_GUARDED_UPDATE_RUNTIME_PRINCIPAL`

sin introducir privilegios implícitos ni acceso PostgreSQL directo desde el
cliente.

---

## 20. Resultado de decisión

Queda establecida como arquitectura canónica objetivo:

`SERVER_RUNTIME = SUPABASE_EDGE_FUNCTIONS`

`RUNTIME_ENGINE = DENO_COMPATIBLE_TYPESCRIPT`

`DEPLOYMENT_TARGET = SUPABASE_HOSTED_EDGE_RUNTIME`

`EXECUTION_BOUNDARY = SERVER_MEDIATED`

`CLIENT_DIRECT_DATABASE_ACCESS = PROHIBITED`

`CANONICAL_LOGICAL_PRINCIPAL = CATU_GUARDED_UPDATE_RUNTIME_PRINCIPAL`

La materialización ejecutable permanece diferida.
