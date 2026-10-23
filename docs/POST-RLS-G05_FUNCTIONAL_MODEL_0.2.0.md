# CATU E-R — Modelo Funcional Canónico 0.2.0

## 1. Identificación

- Producto: CATU E-R — Blindaje Preventivo Municipal
- Línea de producto: Entrega-Recepción Municipal
- Serie evolutiva: 0.2.x
- Baseline de origen: `dev/v0.2.0`
- Baseline aprobada precedente: POST-RLS-G04
- Rama de trabajo: `docs/post-rls-g05-functional-model-v0.2.0`
- Gate: `POST-RLS-G05`
- Naturaleza: documental / arquitectura funcional / modelo de dominio
- Estado inicial: propuesta para revisión

## 2. Propósito

Definir el modelo funcional canónico que gobernará la evolución de CATU E-R
durante la serie 0.2.x, estableciendo un núcleo común para las perspectivas de
Administración Saliente y Administración Entrante antes de modificar runtime,
persistencia, reglas productivas, RBAC, Service Worker o interfaz.

El presente gate es exclusivamente de definición funcional.

No implementa cambios de comportamiento en la PWA.

## 3. Objetivo general

Establecer una arquitectura funcional única que permita soportar progresivamente:

- Administración Saliente: preparar, integrar, corregir, validar y acreditar;
- Administración Entrante: recibir, revisar, verificar, formular discrepancias,
  solicitar aclaraciones y cerrar la recepción.

Ambas perspectivas deberán operar sobre un mismo núcleo de información y no
mediante aplicaciones, bases de datos o modelos paralelos.

## 4. Principios rectores

### G05-P01 — Núcleo funcional único

CATU E-R mantendrá un modelo compartido de:

- municipio;
- periodo de entrega-recepción;
- unidad administrativa;
- responsable;
- control;
- evaluación;
- evidencia;
- observación;
- validación;
- discrepancia;
- aclaración;
- resolución;
- trazabilidad.

### G05-P02 — Perspectivas, no aplicaciones separadas

Las diferencias entre Saliente y Entrante se expresarán mediante:

- roles;
- permisos;
- estados;
- transiciones;
- vistas;
- acciones autorizadas;
- responsabilidades.

No se duplicará el modelo de datos por perspectiva.

### G05-P03 — Compatibilidad hacia atrás

La serie 0.2.x deberá preservar, cuando técnicamente sea viable, la apertura y
tratamiento controlado de workspaces producidos por la serie 0.1.x.

### G05-P04 — Evolución no destructiva

No se permitirá pérdida silenciosa de:

- controles;
- evaluaciones;
- evidencias;
- responsables;
- observaciones;
- validaciones;
- registros históricos.

### G05-P05 — Trazabilidad integral

Toda actuación relevante deberá poder atribuirse a:

- usuario;
- perfil;
- fecha y hora;
- entidad afectada;
- estado anterior;
- estado posterior;
- actuación realizada.

## 5. Actores funcionales

### 5.1 Administración Saliente

Responsable de preparar e integrar la información objeto de entrega.

Capacidades generales:

- registrar información;
- evaluar controles;
- incorporar evidencia;
- corregir inconsistencias;
- atender observaciones;
- formular aclaraciones;
- preparar cierre de entrega.

### 5.2 Administración Entrante

Responsable de recibir y verificar la información entregada.

Capacidades generales:

- consultar expediente;
- revisar controles;
- revisar evidencias;
- confirmar recepción;
- formular discrepancias;
- solicitar aclaraciones;
- valorar respuestas;
- cerrar revisión.

### 5.3 Órgano Interno de Control

Actor transversal responsable, según la configuración institucional aplicable, de:

- supervisión;
- validación;
- observación;
- seguimiento;
- consulta de trazabilidad;
- control del proceso.

### 5.4 Administrador del sistema

Actor técnico encargado de:

- configuración;
- usuarios;
- roles;
- parámetros;
- mantenimiento operativo autorizado.

No sustituye las funciones sustantivas de Saliente, Entrante u OIC.

## 6. Entidades funcionales canónicas

### 6.1 Municipio

Entidad organizacional raíz del proceso.

### 6.2 Periodo de Entrega-Recepción

Representa el ciclo temporal y administrativo objeto del procedimiento.

### 6.3 Unidad Administrativa

Área responsable de información, controles y evidencias.

### 6.4 Responsable

Persona vinculada funcionalmente con una unidad, actuación o elemento entregable.

### 6.5 Control

Unidad verificable del protocolo preventivo.

### 6.6 Evaluación

Valoración realizada sobre un control en un momento determinado.

### 6.7 Evidencia

Elemento documental o informativo utilizado para acreditar, soportar o contextualizar controles, evaluaciones, actuaciones, observaciones, discrepancias o aclaraciones.

Una Evidencia podrá asociarse a uno o varios Controles o actuaciones, y un Control podrá estar soportado por una o varias Evidencias.

### 6.8 Observación

Señalamiento preventivo, concurrente o de validación que requiere atención, corrección o seguimiento, pero que no constituye por sí mismo una discrepancia formal de recepción.

### 6.9 Validación

Acto mediante el cual un actor autorizado confirma una condición funcional.

### 6.10 Acto de Entrega-Recepción

Hito funcional mediante el cual la Administración Saliente pone formalmente a disposición de la Administración Entrante los elementos objeto del proceso.

El acto constituye el punto de referencia para iniciar la recepción, revisión y, cuando corresponda, la formulación de discrepancias.

### 6.11 Discrepancia

Hallazgo formal identificado por la Administración Entrante respecto de un elemento entregado, acreditado, recibido o verificado.

Toda discrepancia deberá referenciar de manera inequívoca el objeto revisado y conservar trazabilidad hacia los controles, evidencias, unidades administrativas o actuaciones que le dieron origen.

### 6.12 Aclaración

Respuesta formal de la Administración Saliente a una discrepancia.

Una discrepancia podrá recibir cero, una o múltiples aclaraciones durante su ciclo de atención. La presentación de una aclaración no implicará por sí misma el cierre de la discrepancia.

### 6.13 Resolución

Determinación final mediante la cual una discrepancia se tiene por solventada, no solventada, improcedente o cerrada bajo el criterio que posteriormente defina la máquina de estados.

Cada discrepancia podrá contar como máximo con una resolución final vigente.

### 6.14 Evento de Trazabilidad

Registro inmutable de una actuación relevante del proceso.

Los eventos de trazabilidad constituyen un mecanismo transversal y podrán referenciar cualquier entidad funcional del sistema, no únicamente elementos de la etapa de recepción.

## 7. Relaciones funcionales principales

```text
Municipio
   |
   +-- Periodo de Entrega-Recepción
          |
          +-- Unidades Administrativas
          |      +-- Responsables
          |
          +-- Controles
          |      +-- Evaluaciones
          |      +-- Observaciones
          |      +-- Validaciones
          |
          +-- Evidencias
          |      +-- asociación N:M con Controles / actuaciones
          |
          +-- Acto de Entrega-Recepción
          |      +-- Discrepancias
          |             +-- Aclaraciones [0..*]
          |             +-- Resolución final [0..1]
          |
          +-- Eventos de Trazabilidad [transversal]
```

### 7.1 Cardinalidades funcionales mínimas

- un Municipio podrá contener uno o varios Periodos de Entrega-Recepción;
- un Periodo podrá contener múltiples Unidades Administrativas;
- una Unidad Administrativa podrá tener múltiples Responsables;
- un Periodo podrá contener múltiples Controles;
- un Control podrá asociarse con múltiples Evidencias;
- una Evidencia podrá asociarse con múltiples Controles o actuaciones;
- un Acto de Entrega-Recepción podrá originar múltiples Discrepancias;
- una Discrepancia podrá recibir cero o múltiples Aclaraciones;
- una Discrepancia podrá tener cero o una Resolución final vigente;
- cualquier entidad funcional relevante podrá generar múltiples Eventos de Trazabilidad.

Estas cardinalidades son funcionales y no constituyen todavía una especificación física de persistencia.

### 7.2 Distinción semántica Observación–Discrepancia

Una Observación es un señalamiento preventivo, concurrente o de validación y puede producirse durante la preparación o revisión interna.

Una Discrepancia es un señalamiento formal de la Administración Entrante sobre información o elementos objeto de entrega y debe referenciar el objeto revisado.

Por tanto:

```text
Observación != Discrepancia

Observación   -> prevención / corrección / seguimiento
Discrepancia  -> recepción / revisión / aclaración / resolución
```

## 8. Perspectivas operativas

### 8.1 Perspectiva Saliente

El sistema priorizará:

1. preparación;
2. integración;
3. evaluación;
4. corrección;
5. validación;
6. acreditación;
7. entrega.

### 8.2 Perspectiva Entrante

El sistema priorizará:

1. recepción;
2. revisión;
3. verificación;
4. discrepancia;
5. aclaración;
6. resolución;
7. cierre.

## 9. Modelo funcional de alto nivel

```text
PREPARACIÓN
    ↓
INTEGRACIÓN
    ↓
VALIDACIÓN
    ↓
ACTO DE ENTREGA-RECEPCIÓN
    ↓
REVISIÓN ENTRANTE
    ↓
¿EXISTE DISCREPANCIA?
    ├── NO ──→ CIERRE DE REVISIÓN
    │
    └── SÍ
         ↓
     ACLARACIÓN [0..*]
         ↓
     VALORACIÓN
         ↓
     RESOLUCIÓN FINAL [0..1]
         ↓
     CIERRE DE REVISIÓN
```

Este diagrama es funcional y no constituye todavía la máquina de estados
productiva. Las transiciones definitivas deberán formalizarse en un gate
posterior.

## 10. Invariantes heredados de 0.1.8

La evolución funcional no podrá degradar:

- persistencia del workspace;
- gestión de evidencias;
- evaluación de controles;
- validación OIC;
- RBAC;
- segregación de funciones;
- exportación;
- operación local-first;
- funcionamiento offline acreditado;
- recuperación de conectividad;
- trazabilidad;
- integridad del reporte existente;
- Service Worker y caché existentes mientras no exista gate específico.

## 11. Frontera del primer incremento funcional 0.2.0

El primer incremento no deberá intentar implementar simultáneamente toda la
perspectiva Entrante.

Se priorizará una capacidad mínima coherente que permita evolucionar el núcleo
sin romper la serie 0.1.x.

La frontera exacta será determinada después de aprobar:

1. modelo de estados;
2. RBAC ampliado;
3. modelo de discrepancias y aclaraciones;
4. impacto de persistencia;
5. estrategia de migración.

## 12. Fuera de alcance de POST-RLS-G05

Este gate no autoriza:

- modificación de `app.js`;
- modificación de HTML o CSS productivo;
- modificación del Service Worker;
- modificación de caché;
- modificación del esquema persistido;
- incorporación de nuevos perfiles productivos;
- modificación de permisos productivos;
- creación de discrepancias en runtime;
- migración de workspaces;
- modificación de reportes;
- despliegue;
- publicación de una nueva versión.

## 13. Decisiones pendientes

Deberán resolverse en gates posteriores:

### D-01
Máquina de estados detallada del ciclo Saliente–Entrante.

### D-02
Matriz RBAC ampliada.

### D-03
Modelo de datos de discrepancias, aclaraciones y resoluciones.

### D-04
Reglas de edición después de la entrega.

### D-05
Responsabilidad de apertura y cierre de una discrepancia.

### D-06
Tratamiento de discrepancias parcialmente aclaradas.

### D-07
Versionado y migración de workspaces 0.1.x.

### D-08
Comportamiento offline de las nuevas actuaciones.

### D-09
Impacto en reporte ejecutivo y exportaciones.

## 14. Secuencia recomendada de gates

```text
POST-RLS-G05
Modelo Funcional Canónico
        ↓
POST-RLS-G06
Estados y Transiciones
        ↓
POST-RLS-G07
RBAC Saliente–Entrante
        ↓
POST-RLS-G08
Discrepancias / Aclaraciones / Resoluciones
        ↓
POST-RLS-G09
Persistencia y Migración
        ↓
POST-RLS-G10
Primer Incremento Funcional
```

La numeración podrá ajustarse únicamente mediante decisión documental expresa.

## 15. Criterios de aceptación de G05

POST-RLS-G05 podrá cerrarse cuando:

- exista un modelo funcional canónico único;
- Saliente y Entrante estén conceptualmente delimitados;
- estén identificados los actores transversales;
- estén definidas las entidades funcionales principales;
- se documenten invariantes heredados;
- se delimite expresamente lo que G05 no implementa;
- las decisiones pendientes estén identificadas;
- el documento sea revisado;
- el cambio permanezca exclusivamente documental;
- sea integrado a `dev/v0.2.0` mediante Pull Request;
- el repositorio quede limpio.

## 16. Resultado esperado

Al cierre de POST-RLS-G05 deberá existir una base funcional suficiente para
diseñar estados, permisos, discrepancias y persistencia sin introducir
decisiones contradictorias entre módulos.

---

**Estado:** Propuesta para revisión.
**Serie:** CATU E-R 0.2.x.
**Gate:** POST-RLS-G05.
**Naturaleza:** documental / arquitectura funcional.
