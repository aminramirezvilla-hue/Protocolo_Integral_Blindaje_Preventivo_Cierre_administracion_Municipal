# CATU E-R — Máquina de Estados y Transiciones 0.2.0

## 1. Identificación

- Producto: CATU E-R — Blindaje Preventivo Municipal
- Serie: 0.2.x
- Baseline funcional precedente: POST-RLS-G05
- Rama: `docs/post-rls-g06-state-machine-v0.2.0`
- Gate: `POST-RLS-G06`
- Naturaleza: documental / workflow / estados y transiciones
- Estado inicial: propuesta para revisión

## 2. Propósito

Definir la máquina de estados funcional que gobernará el ciclo Saliente–Entrante antes de modificar runtime, persistencia, RBAC productivo o interfaz.

Este gate no implementa comportamiento productivo.

## 3. Arquitectura del modelo de estados

CATU E-R utilizará dos máquinas de estados coordinadas y conceptualmente independientes:

1. `SM-ER` — máquina del Proceso de Entrega-Recepción.
2. `SM-DIS` — máquina de cada Discrepancia individual.

La separación evita mezclar el estado global del proceso con el ciclo de vida de objetos subordinados.

Durante `EN_REVISION_ENTRANTE` podrán coexistir cero, una o múltiples discrepancias, cada una con su propio estado.

El Acto de Entrega-Recepción es un evento de transición y no un estado persistente.

El cierre del proceso dependerá del estado agregado de las discrepancias existentes.

### 3.1 Invariantes del modelo de estados

- cada entidad deberá encontrarse en un único estado vigente de su máquina;
- toda transición deberá tener estado origen y estado destino explícitos;
- toda transición deberá registrar actor, instante y evento causante;
- ninguna transición podrá omitir estados obligatorios salvo regla expresamente documentada;
- los estados terminales no admitirán nuevas transiciones ordinarias;
- una transición rechazada no deberá modificar el estado vigente;
- toda transición efectiva deberá generar trazabilidad;
- G06 define semántica funcional, no implementación física ni permisos productivos.

## 4. Estados canónicos de SM-ER — Proceso de Entrega-Recepción

### ER-00 — PREPARACION
Estado inicial. Se habilita la organización preliminar del periodo, unidades, responsables y elementos objeto de entrega.

### ER-10 — INTEGRACION
La Administración Saliente integra información, controles, evaluaciones y evidencias requeridas para la entrega.

### ER-20 — EN_VALIDACION
La información integrada se encuentra sometida a revisión o validación previa conforme a las funciones institucionales aplicables.

### ER-30 — LISTO_PARA_ENTREGA
La integración ha superado las condiciones previas definidas y se encuentra preparada para formalizar el Acto de Entrega-Recepción.

### ER-40 — ENTREGADO
El Acto de Entrega-Recepción ha sido formalizado. La información entregada constituye la referencia para la revisión entrante.

### ER-50 — EN_REVISION_ENTRANTE
La Administración Entrante revisa los elementos recibidos y puede formular discrepancias.

### ER-90 — CERRADO
Estado terminal del proceso. La revisión ha concluido y no existen discrepancias pendientes de resolución.

## 5. Estados canónicos de SM-DIS — Discrepancia

### DIS-00 — ABIERTA
La Administración Entrante ha registrado formalmente una discrepancia vinculada a un objeto revisado.

### DIS-10 — EN_ACLARACION
La discrepancia se encuentra pendiente de una o más aclaraciones de la Administración Saliente.

### DIS-20 — EN_VALORACION
La información y aclaraciones disponibles se encuentran en valoración para determinar la resolución final.

### DIS-90A — RESUELTA_SOLVENTADA
Estado terminal. La discrepancia se considera suficientemente atendida o aclarada.

### DIS-90B — RESUELTA_NO_SOLVENTADA
Estado terminal. La discrepancia permanece materialmente no solventada al concluir su valoración.

### DIS-90C — RESUELTA_IMPROCEDENTE
Estado terminal. La discrepancia se determina improcedente conforme al criterio funcional que posteriormente se formalice.

Los estados terminales de SM-DIS representan el resultado de la Resolución final definida en POST-RLS-G05.

## 6. Transiciones canónicas de SM-ER

### ER-T01 — Iniciar integración
- Origen: `ER-00 PREPARACION`
- Evento: `INICIAR_INTEGRACION`
- Destino: `ER-10 INTEGRACION`
- Actor funcional primario: Administración Saliente
- Precondición: periodo y estructura mínima del proceso definidos.
- Efecto: habilita la integración formal de información y evidencias.
- Rechazo: si faltan datos estructurales mínimos.

### ER-T02 — Someter a validación
- Origen: `ER-10 INTEGRACION`
- Evento: `SOLICITAR_VALIDACION`
- Destino: `ER-20 EN_VALIDACION`
- Actor funcional primario: Administración Saliente
- Precondición: integración mínima requerida completada.
- Efecto: congela conceptualmente el conjunto sometido a validación.
- Rechazo: si existen elementos obligatorios incompletos.

### ER-T03 — Devolver para corrección
- Origen: `ER-20 EN_VALIDACION`
- Evento: `DEVOLVER_A_INTEGRACION`
- Destino: `ER-10 INTEGRACION`
- Actor funcional primario: actor validador autorizado
- Precondición: existencia de observaciones o incumplimientos corregibles.
- Efecto: reabre la integración para subsanar hallazgos.
- Rechazo: si el proceso ya fue formalmente entregado.

### ER-T04 — Aprobar para entrega
- Origen: `ER-20 EN_VALIDACION`
- Evento: `APROBAR_ENTREGA`
- Destino: `ER-30 LISTO_PARA_ENTREGA`
- Actor funcional primario: actor validador autorizado
- Precondición: validaciones requeridas satisfechas.
- Efecto: habilita la formalización del Acto de Entrega-Recepción.
- Rechazo: si permanecen condiciones impeditivas.

### ER-T05 — Formalizar entrega
- Origen: `ER-30 LISTO_PARA_ENTREGA`
- Evento: `FORMALIZAR_ENTREGA_RECEPCION`
- Destino: `ER-40 ENTREGADO`
- Actor funcional primario: actores institucionalmente facultados
- Precondición: condiciones formales de entrega satisfechas.
- Efecto: establece la referencia formal de lo entregado.
- Rechazo: si no se acredita el acto correspondiente.

### ER-T06 — Iniciar revisión entrante
- Origen: `ER-40 ENTREGADO`
- Evento: `INICIAR_REVISION_ENTRANTE`
- Destino: `ER-50 EN_REVISION_ENTRANTE`
- Actor funcional primario: Administración Entrante
- Precondición: Acto de Entrega-Recepción formalizado.
- Efecto: habilita revisión y formulación de discrepancias.
- Rechazo: si el proceso no está formalmente entregado.

### ER-T07 — Cerrar revisión
- Origen: `ER-50 EN_REVISION_ENTRANTE`
- Evento: `CERRAR_REVISION`
- Destino: `ER-90 CERRADO`
- Actor funcional primario: actor competente de cierre
- Precondición: no existen discrepancias activas ni pendientes de resolución.
- Efecto: termina ordinariamente el proceso.
- Rechazo: si existe al menos una discrepancia no terminal.

## 7. Transiciones canónicas de SM-DIS

### DIS-T01 — Registrar discrepancia
- Origen: creación de entidad durante `ER-50 EN_REVISION_ENTRANTE`
- Evento: `REGISTRAR_DISCREPANCIA`
- Destino: `DIS-00 ABIERTA`
- Actor funcional primario: Administración Entrante
- Precondición: objeto revisado identificable y proceso en revisión entrante.
- Efecto: crea una discrepancia trazable vinculada al objeto revisado.
- Rechazo: si el proceso no está en `ER-50`.

### DIS-T02 — Solicitar aclaración
- Origen: `DIS-00 ABIERTA`
- Evento: `SOLICITAR_ACLARACION`
- Destino: `DIS-10 EN_ACLARACION`
- Actor funcional primario: Administración Entrante
- Precondición: discrepancia vigente y no terminal.
- Efecto: habilita respuesta formal de la Administración Saliente.
- Rechazo: si la discrepancia ya está resuelta.

### DIS-T02B — Pasar directamente a valoración
- Origen: `DIS-00 ABIERTA`
- Evento: `INICIAR_VALORACION_DIRECTA`
- Destino: `DIS-20 EN_VALORACION`
- Actor funcional primario: Administración Entrante o actor valorador competente
- Precondición: existen elementos suficientes para valorar la discrepancia sin requerir aclaración.
- Efecto: inicia valoración sin abrir ciclo de aclaración.
- Rechazo: si la información disponible requiere pronunciamiento de la Administración Saliente.

### DIS-T03 — Presentar aclaración
- Origen: `DIS-10 EN_ACLARACION`
- Evento: `PRESENTAR_ACLARACION`
- Destino: `DIS-20 EN_VALORACION`
- Actor funcional primario: Administración Saliente
- Precondición: existe solicitud de aclaración activa.
- Efecto: incorpora una aclaración y la somete a valoración.
- Rechazo: si no existe discrepancia activa en aclaración.

### DIS-T04 — Solicitar aclaración adicional
- Origen: `DIS-20 EN_VALORACION`
- Evento: `REQUERIR_ACLARACION_ADICIONAL`
- Destino: `DIS-10 EN_ACLARACION`
- Actor funcional primario: Administración Entrante o actor valorador competente
- Precondición: la información disponible resulta insuficiente para resolver.
- Efecto: reabre el ciclo de aclaración sin crear una nueva discrepancia.
- Rechazo: si ya existe resolución final.

### DIS-T05A — Resolver como solventada
- Origen: `DIS-20 EN_VALORACION`
- Evento: `RESOLVER_SOLVENTADA`
- Destino: `DIS-90A RESUELTA_SOLVENTADA`
- Actor funcional primario: actor competente de resolución
- Precondición: valoración concluida.
- Efecto: genera resolución final favorable.
- Rechazo: si faltan elementos mínimos de valoración.

### DIS-T05B — Resolver como no solventada
- Origen: `DIS-20 EN_VALORACION`
- Evento: `RESOLVER_NO_SOLVENTADA`
- Destino: `DIS-90B RESUELTA_NO_SOLVENTADA`
- Actor funcional primario: actor competente de resolución
- Precondición: valoración concluida.
- Efecto: genera resolución final no favorable.
- Rechazo: si faltan elementos mínimos de valoración.

### DIS-T05C — Resolver como improcedente
- Origen: `DIS-20 EN_VALORACION`
- Evento: `RESOLVER_IMPROCEDENTE`
- Destino: `DIS-90C RESUELTA_IMPROCEDENTE`
- Actor funcional primario: actor competente de resolución
- Precondición: valoración concluida y procedencia descartada.
- Efecto: genera resolución final por improcedencia.
- Rechazo: si la valoración no sustenta dicha determinación.

## 8. Reglas de transición, terminalidad y coordinación

### 8.1 Regla de transición explícita

Toda transición no definida expresamente en este documento se considerará prohibida por defecto.

La ausencia de una transición autorizada no podrá interpretarse como permiso implícito.

### 8.2 Regresión del proceso

Antes de `ER-40 ENTREGADO`, únicamente se admite la regresión expresamente definida `ER-20 EN_VALIDACION → ER-10 INTEGRACION` mediante `ER-T03`.

Una vez alcanzado `ER-40 ENTREGADO`, no podrá regresarse ordinariamente a PREPARACION, INTEGRACION, EN_VALIDACION o LISTO_PARA_ENTREGA.

Las correcciones posteriores a la entrega deberán conservar la referencia histórica de lo originalmente entregado y no reescribir silenciosamente el estado anterior.

### 8.3 Terminalidad de SM-ER

`ER-90 CERRADO` es estado terminal ordinario.

No admitirá transiciones posteriores dentro de la máquina ordinaria definida por G06.

Cualquier reapertura excepcional deberá ser objeto de una regla específica posterior, con fundamento, actor autorizado y trazabilidad reforzada.

G06 no autoriza reapertura automática de un proceso cerrado.

### 8.4 Terminalidad de SM-DIS

`DIS-90A RESUELTA_SOLVENTADA`, `DIS-90B RESUELTA_NO_SOLVENTADA` y `DIS-90C RESUELTA_IMPROCEDENTE` son estados terminales ordinarios.

Una discrepancia terminal no podrá recibir nuevas aclaraciones ni cambiar de resultado mediante una transición ordinaria.

Cualquier revisión extraordinaria de una resolución deberá conservar la resolución original y será diseñada fuera del flujo ordinario de G06.

### 8.5 Regla de cierre agregado

La transición `ER-T07 CERRAR_REVISION` sólo será válida cuando todas las discrepancias asociadas al proceso se encuentren en un estado terminal de SM-DIS.

Si no existen discrepancias, el proceso podrá cerrar una vez concluida la revisión entrante conforme a las condiciones funcionales aplicables.

La existencia de al menos una discrepancia en `DIS-00`, `DIS-10` o `DIS-20` bloqueará el cierre del proceso.

### 8.6 Regla de creación de discrepancias

Las discrepancias ordinarias sólo podrán crearse mientras SM-ER se encuentre en `ER-50 EN_REVISION_ENTRANTE`.

No podrán crearse nuevas discrepancias después de `ER-90 CERRADO` dentro del flujo ordinario.

### 8.7 Regla de aclaraciones múltiples

Una misma discrepancia podrá recorrer múltiples veces el ciclo `DIS-10 EN_ACLARACION ↔ DIS-20 EN_VALORACION` sin crear una nueva discrepancia.

Cada aclaración deberá conservar identidad y trazabilidad propias.

### 8.8 Atomicidad funcional

Una transición válida deberá producir conjuntamente:

- cambio de estado;
- registro del evento causante;
- identidad del actor;
- instante de ejecución;
- referencia a la entidad afectada;
- estado origen;
- estado destino.

Si cualquiera de los elementos obligatorios falla, la transición deberá considerarse no ejecutada.

### 8.9 Idempotencia conceptual

La repetición accidental del mismo evento no deberá producir transiciones duplicadas ni múltiples efectos equivalentes.

La estrategia técnica de idempotencia será definida durante implementación.

### 8.10 Transiciones prohibidas mínimas

Quedan expresamente prohibidas, entre otras:

- `ER-00 → ER-40` sin integración, validación y preparación para entrega;
- `ER-10 → ER-40` directamente;
- `ER-20 → ER-40` directamente;
- `ER-40 → ER-10` mediante flujo ordinario;
- `ER-50 → ER-90` con discrepancias no terminales;
- creación de discrepancias fuera de `ER-50`;
- `DIS-00 → DIS-90*` sin pasar por valoración;
- `DIS-10 → DIS-90*` sin pasar por valoración;
- salida ordinaria desde cualquier estado `DIS-90*`;
- modificación silenciosa de un estado histórico.

## 9. Cobertura de estados y transiciones

### 9.1 Cobertura de SM-ER

| Estado | Entrada principal | Salida ordinaria | Terminal |
|---|---|---|---|
| `ER-00 PREPARACION` | inicio del proceso | `ER-T01` | No |
| `ER-10 INTEGRACION` | `ER-T01` / `ER-T03` | `ER-T02` | No |
| `ER-20 EN_VALIDACION` | `ER-T02` | `ER-T03` / `ER-T04` | No |
| `ER-30 LISTO_PARA_ENTREGA` | `ER-T04` | `ER-T05` | No |
| `ER-40 ENTREGADO` | `ER-T05` | `ER-T06` | No |
| `ER-50 EN_REVISION_ENTRANTE` | `ER-T06` | `ER-T07` | No |
| `ER-90 CERRADO` | `ER-T07` | ninguna ordinaria | Sí |

### 9.2 Cobertura de SM-DIS

| Estado | Entrada principal | Salida ordinaria | Terminal |
|---|---|---|---|
| `DIS-00 ABIERTA` | `DIS-T01` | `DIS-T02` / `DIS-T02B` | No |
| `DIS-10 EN_ACLARACION` | `DIS-T02` / `DIS-T04` | `DIS-T03` | No |
| `DIS-20 EN_VALORACION` | `DIS-T02B` / `DIS-T03` | `DIS-T04` / `DIS-T05A` / `DIS-T05B` / `DIS-T05C` | No |
| `DIS-90A RESUELTA_SOLVENTADA` | `DIS-T05A` | ninguna ordinaria | Sí |
| `DIS-90B RESUELTA_NO_SOLVENTADA` | `DIS-T05B` | ninguna ordinaria | Sí |
| `DIS-90C RESUELTA_IMPROCEDENTE` | `DIS-T05C` | ninguna ordinaria | Sí |

La cobertura anterior es funcional. No representa todavía tablas físicas, enums, permisos ni estructuras de persistencia.

## 10. Diagramas canónicos

### 10.1 SM-ER — Proceso de Entrega-Recepción

```text
ER-00 PREPARACION
        |
       T01
        v
ER-10 INTEGRACION <-------------------+
        |                              |
       T02                            T03
        v                              |
ER-20 EN_VALIDACION -------------------+
        |
       T04
        v
ER-30 LISTO_PARA_ENTREGA
        |
       T05
        v
ER-40 ENTREGADO
        |
       T06
        v
ER-50 EN_REVISION_ENTRANTE
        |
       T07
        v
ER-90 CERRADO
```

`ER-T03` constituye la única regresión ordinaria anterior a la entrega.

### 10.2 SM-DIS — Discrepancia

```text
                   +--> DIS-10 EN_ACLARACION --T03--+
                   |                               |
DIS-00 ABIERTA ----+                               v
       | T02       |                         DIS-20 EN_VALORACION
       |           |                               |
       |           +-------------------------------+
       |                    T04                    |
       |                                           |
       +--T02B------------------------------------>|
                                                   |
                              +--------------------+--------------------+
                              |                    |                    |
                            T05A                 T05B                 T05C
                              v                    v                    v
                         DIS-90A               DIS-90B               DIS-90C
                         SOLVENTADA            NO_SOLVENTADA         IMPROCEDENTE
```

Los estados `DIS-90A`, `DIS-90B` y `DIS-90C` son terminales ordinarios.

## 11. Alcance y límites de POST-RLS-G06

POST-RLS-G06 define exclusivamente la semántica funcional de estados, eventos y transiciones.

No autoriza implementación productiva ni modificación del comportamiento actual de CATU E-R.

Queda fuera de alcance de G06:

- modificación de `app.js`;
- modificación de HTML o CSS productivo;
- modificación del Service Worker o caché;
- cambio del esquema persistido;
- creación de enums o tablas físicas;
- incorporación productiva de nuevos roles;
- implementación de permisos RBAC;
- migración de workspaces 0.1.x;
- implementación de discrepancias en runtime;
- definición de plazos legales o administrativos;
- reaperturas extraordinarias después de cierre;
- sincronización multiusuario;
- despliegue o publicación de nueva versión.

## 12. Decisiones diferidas

Las siguientes decisiones se resolverán en gates posteriores:

### G06-D01 — RBAC de transiciones
Determinar qué roles concretos podrán ejecutar cada evento y bajo qué segregación de funciones.

### G06-D02 — Persistencia de estados
Definir representación física, versionado y migración de estados en el workspace.

### G06-D03 — Reapertura extraordinaria
Definir si procede reapertura excepcional de procesos o discrepancias terminales y bajo qué controles.

### G06-D04 — Temporalidad normativa
Incorporar, cuando corresponda, plazos, vencimientos y efectos temporales conforme al marco normativo aplicable.

### G06-D05 — Automatismos
Determinar qué transiciones podrán ser automáticas y cuáles exigirán actuación humana expresa.

### G06-D06 — Concurrencia
Definir control de concurrencia y tratamiento de transiciones simultáneas en escenario multiusuario.

### G06-D07 — UX de transición
Definir confirmaciones, advertencias, bloqueos y visualización de estados en interfaz.

## 13. Invariantes heredados

La implementación futura de estas máquinas no podrá degradar:

- compatibilidad controlada con la serie 0.1.x;
- integridad de controles y evaluaciones;
- evidencias existentes;
- validación OIC;
- segregación de funciones;
- trazabilidad;
- operación local-first;
- operación offline acreditada;
- exportaciones y reportes vigentes;
- integridad histórica de actuaciones ya cerradas.

## 14. Criterios de aceptación de POST-RLS-G06

G06 podrá cerrarse cuando:

- existan máquinas separadas para proceso y discrepancias;
- todos los estados canónicos estén identificados;
- todas las transiciones ordinarias estén identificadas;
- se documenten origen, evento y destino de cada transición;
- se definan precondiciones, efectos y causas de rechazo;
- las transiciones no definidas sean prohibidas por defecto;
- se establezcan reglas de terminalidad;
- el cierre agregado bloquee discrepancias no terminales;
- se formalice la posibilidad de aclaraciones múltiples;
- se establezcan atomicidad e idempotencia conceptual;
- existan tablas de cobertura;
- existan diagramas coherentes con las matrices;
- las decisiones diferidas estén expresamente documentadas;
- el cambio permanezca exclusivamente documental;
- el documento sea integrado a `dev/v0.2.0` mediante Pull Request;
- el repositorio quede limpio después de la integración.

## 15. Resultado esperado

Al cierre de POST-RLS-G06 deberá existir una especificación funcional suficiente para diseñar el RBAC Saliente–Entrante y, posteriormente, implementar estados y transiciones sin introducir comportamientos implícitos o contradictorios.

---

**Estado:** Propuesta para revisión.
**Serie:** CATU E-R 0.2.x.
**Gate:** POST-RLS-G06.
**Naturaleza:** documental / workflow / máquina de estados.
