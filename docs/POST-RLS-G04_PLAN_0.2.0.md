# CATU E-R — Baseline de Planeación 0.2.0

## 1. Identificación

- Producto: CATU E-R — Blindaje Preventivo Municipal
- Línea de producto: Entrega-Recepción Municipal
- Versión estable precedente: 0.1.8
- Rama estable: `release/v0.1.8`
- Rama de mantenimiento: `maint/v0.1.x`
- Rama de desarrollo: `dev/v0.2.0`
- Gate de planeación: `POST-RLS-G04`
- Naturaleza del cambio: documental / planeación / gobernanza

## 2. Propósito

Establecer la baseline de planeación para la evolución controlada de CATU E-R
desde la versión estable 0.1.8 hacia la línea 0.2.0.

La versión 0.2.0 deberá evolucionar el producto sin degradar las capacidades
funcionales, de persistencia, seguridad lógica, trazabilidad, operación
local-first y comportamiento PWA acreditadas durante la liberación 0.1.8.

Este documento no implementa cambios funcionales.

## 3. Baseline heredada

La versión 0.2.0 parte de la liberación estable CATU E-R 0.1.8 y hereda como
mínimo las siguientes capacidades acreditadas:

1. Persistencia del espacio de trabajo.
2. Persistencia de evaluaciones de controles.
3. Gestión de evidencias.
4. Flujo de validación OIC.
5. RBAC y segregación funcional de perfiles.
6. Operación online/offline.
7. Recuperación de conectividad.
8. Persistencia local-first.
9. Exportación JSON/CSV.
10. Consistencia del reporte ejecutivo.
11. Service Worker y caché operativos.
12. Integridad del estado de producción.
13. Trazabilidad de cambios y gobierno Git.
14. Funcionamiento responsivo acreditado en entorno móvil.

La evolución 0.2.0 no deberá introducir regresiones sobre estas capacidades.

## 4. Invariantes de arquitectura

Durante el ciclo 0.2.0 deberán preservarse los siguientes invariantes:

- arquitectura PWA local-first;
- funcionamiento offline para las operaciones expresamente soportadas;
- persistencia local resiliente;
- separación entre datos, estado de interfaz y reglas funcionales;
- control de acceso por perfil;
- segregación de funciones;
- trazabilidad de operaciones relevantes;
- protección de la baseline estable;
- evolución exclusivamente mediante ramas de trabajo y Pull Request;
- ausencia de modificaciones directas sobre `release/v0.1.8`;
- mantenimiento correctivo de la serie 0.1.x exclusivamente mediante
  `maint/v0.1.x`.

## 5. Objetivo funcional de la serie 0.2.x

La serie 0.2.x preparará la evolución del producto desde la versión inicial
centrada en la administración saliente hacia un núcleo funcional común capaz
de soportar progresivamente dos perspectivas operativas:

- Administración Saliente: preparar, corregir, integrar y acreditar.
- Administración Entrante: recibir, revisar, verificar, formular
  discrepancias y dar seguimiento.

La incorporación de la perspectiva Entrante será incremental. La versión
0.2.0 no presupone que todo el modo Entrante quede implementado en un único
incremento.

## 6. Principio de diseño

La evolución deberá evitar duplicar el modelo de datos o crear dos
aplicaciones independientes.

Se priorizará un núcleo común de:

- municipio;
- periodo de entrega-recepción;
- controles;
- evidencias;
- responsables;
- observaciones;
- validaciones;
- discrepancias;
- seguimiento;
- trazabilidad.

Las diferencias entre Saliente y Entrante deberán expresarse mediante
permisos, estados, vistas, acciones autorizadas y reglas de transición.

## 7. Alcance preliminar 0.2.0

La planeación de 0.2.0 deberá evaluar y ordenar al menos las siguientes líneas:

### G04-L1 — Modelo de roles y perspectivas

Revisar el RBAC vigente y definir la extensión necesaria para representar
acciones de administración saliente y administración entrante sin degradar
la segregación existente.

### G04-L2 — Ciclo de estado de controles

Definir estados y transiciones que permitan distinguir:

- preparación;
- evaluación;
- validación;
- recepción;
- revisión;
- discrepancia;
- aclaración;
- cierre.

### G04-L3 — Discrepancias y aclaraciones

Definir el modelo mínimo para registrar discrepancias de recepción,
responsable, fundamento, evidencia asociada, aclaración, estatus y resolución.

### G04-L4 — Trazabilidad

Determinar qué eventos deberán incorporarse a la bitácora para garantizar
reconstrucción cronológica y atribución de actuaciones.

### G04-L5 — Reporte ejecutivo

Evaluar la evolución del reporte para distinguir el estado de preparación
saliente del estado de revisión o recepción entrante.

### G04-L6 — Persistencia y compatibilidad

Definir una estrategia de evolución del esquema que preserve la capacidad de
abrir y tratar de forma controlada workspaces producidos por la serie 0.1.x.

### G04-L7 — Operación offline

Garantizar que las nuevas funciones críticas mantengan coherencia con el
modelo local-first y establezcan reglas explícitas de sincronización o
resolución cuando corresponda.

## 8. Fuera de alcance de este gate

POST-RLS-G04 no autoriza por sí mismo:

- cambios de runtime;
- cambios al Service Worker;
- cambios en `sw.js`;
- cambios en caché;
- cambios de esquema de datos;
- creación de nuevos controles productivos;
- modificación de reglas de negocio;
- modificación de perfiles productivos;
- cambios en reportes;
- cambios en producción;
- modificación de la release estable 0.1.8.

Cada implementación deberá contar con su propio gate y evidencia.

## 9. Estrategia de implementación

Toda modificación funcional de 0.2.0 deberá seguir:

`dev/v0.2.0`
→ rama de trabajo
→ implementación acotada
→ pruebas
→ evidencia
→ Pull Request
→ revisión
→ integración controlada.

No se permiten commits funcionales directos sobre `dev/v0.2.0`.

## 10. Clasificación de cambios

Los cambios del ciclo deberán clasificarse antes de implementarse como:

- DOC — documentación / gobernanza;
- UX — interfaz y experiencia;
- DOM — modelo de dominio;
- DAT — persistencia / migración;
- RBAC — roles y permisos;
- WF — workflow / estados;
- REP — reportes;
- OFF — offline / Service Worker / caché;
- EXP — exportación / interoperabilidad;
- QA — pruebas y acreditación.

Una modificación que afecte más de una clase deberá declarar expresamente
sus impactos cruzados.

## 11. Gates mínimos

La serie 0.2.0 deberá utilizar como mínimo:

1. gate de definición;
2. gate de implementación;
3. gate de integridad estática;
4. gate funcional;
5. gate de persistencia;
6. gate RBAC;
7. gate offline cuando corresponda;
8. gate de regresión;
9. gate de aceptación;
10. gate de integración.

Ningún incremento se considerará acreditado únicamente porque compile,
renderice o permita realizar la acción principal.

## 12. Criterios transversales de aceptación

Cada incremento deberá demostrar, según aplique:

- alcance acotado;
- ausencia de cambios no autorizados;
- conservación de información existente;
- atribución correcta por perfil;
- persistencia después de recarga;
- consistencia después de reinicio;
- comportamiento offline coherente;
- recuperación de conectividad;
- ausencia de regresión de funciones 0.1.8;
- exportación consistente;
- trazabilidad suficiente;
- worktree limpio;
- referencias protegidas intactas.

## 13. Estrategia de compatibilidad

La versión 0.2.0 deberá privilegiar compatibilidad hacia atrás con workspaces
0.1.x.

Cuando sea necesario modificar estructuras persistidas deberá definirse antes
de la implementación:

- versión de esquema;
- mecanismo de detección;
- migración;
- respaldo;
- rollback lógico;
- tratamiento de datos desconocidos;
- prueba de apertura de workspace legado.

No se permitirá una modificación destructiva silenciosa.

## 14. Orden lógico preliminar

El ciclo se organizará preferentemente en este orden:

1. modelo funcional 0.2.0;
2. estados y transiciones;
3. RBAC ampliado;
4. discrepancias y aclaraciones;
5. trazabilidad;
6. persistencia y migración;
7. interfaz;
8. reportes;
9. offline;
10. exportación;
11. regresión integral;
12. aceptación.

Este orden podrá ajustarse mediante un gate documental específico cuando
exista justificación técnica.

## 15. Condición de cierre de G04

POST-RLS-G04 quedará cerrado cuando:

- esta baseline haya sido revisada;
- se integre mediante Pull Request a `dev/v0.2.0`;
- las ramas estable y de mantenimiento permanezcan intactas;
- exista evidencia de la integración;
- el repositorio quede limpio;
- se autorice expresamente el primer incremento funcional 0.2.0.

Hasta entonces no se considera autorizada la mutación del runtime.

---

**Estado:** Baseline de planeación propuesta.  
**Serie:** CATU E-R 0.2.x.  
**Control:** POST-RLS-G04.
