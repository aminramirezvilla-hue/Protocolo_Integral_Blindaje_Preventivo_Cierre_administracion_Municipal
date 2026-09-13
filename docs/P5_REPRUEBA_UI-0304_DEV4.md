# CATU E-R — Re-prueba P5-UI-0304 sobre 0.1.4-dev.4

## Identificación

- Rama: `dev/v0.1.4`
- Runtime probado: `0.1.4-dev.4`
- Navegador: Safari en macOS
- Fecha: 2026-09-13
- Control usado: `R074 — Obligaciones de transparencia, datos personales y archivos`
- Regla relacionada: `P5-0301 — Coherencia entre Estatus diagnóstico y Estatus evidencia`
- Incidencia UX: `P5-UI-0304 — mensaje de validación oculto detrás del modal`

## Objetivo

Comprobar que una validación bloqueante de consistencia se muestre dentro del `<dialog>` activo en Safari y sea completamente visible para el usuario, sin depender del toast global situado detrás de la capa superior del modal.

## Precondiciones observadas

1. La vista **Más → PWA y seguridad** muestra `0.1.4-dev.4`.
2. El bloque informativo indica `Hardening P5 · validación visible en modal`.
3. Se abre `R074` con un perfil autorizado para edición general.

## Procedimiento ejecutado

1. Establecer `Estatus diagnóstico = Conforme`.
2. Mantener `Estatus evidencia = Insuficiente`.
3. Conservar `Escenario detectado = Sin incidencia` y `Ruta de tratamiento = No aplica` para aislar la regla objeto de prueba.
4. Intentar guardar la combinación contradictoria.
5. Observar el mensaje de validación dentro del propio modal.

## Resultado observado

La aplicación mostró dentro del modal, inmediatamente antes de las acciones, el mensaje:

`P5-0301: No se puede guardar: un control Conforme requiere evidencia completa. Complete/verifique la evidencia o cambie el estatus diagnóstico.`

El mensaje es visible, legible y no queda oculto por la capa superior de `<dialog>` en Safari.

La segunda evidencia visual confirma además que el runtime desplegado es `0.1.4-dev.4` y que el parche de hardening está activo.

## Resultado final

- Runtime `0.1.4-dev.4` visible: **PASS**.
- Mensaje de validación dentro del modal: **PASS**.
- Mensaje totalmente legible en Safari: **PASS**.
- La corrección no depende del toast global: **PASS**.

**P5-UI-0304 = CERRADA / PASS.**

## Decisión posterior

Se libera la continuación de la subcampaña `P5.3 — Integridad de estados y reglas de negocio` con el siguiente caso pendiente de la matriz:

`P5-0304 — Control accionable sin fecha compromiso`.
