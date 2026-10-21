# CATU E-R — Apertura controlada del ciclo 0.2.0

## Identificación

- Producto: CATU E-R — Blindaje Preventivo Municipal
- Versión estable precedente: 0.1.8
- Rama estable: `release/v0.1.8`
- Rama de mantenimiento: `maint/v0.1.x`
- Rama de desarrollo: `dev/v0.2.0`
- Tipo de cambio: documental / gobernanza
- Gate: POST-RLS-G03

## Objeto

Formalizar la apertura de la línea de desarrollo 0.2.0 después de la
liberación estable CATU E-R 0.1.8.

Este cambio no modifica lógica funcional, datos, controles, reglas de negocio,
Service Worker, caché, runtime ni comportamiento de la PWA.

## Modelo post-release

La estrategia de ramas queda constituida por:

- `release/v0.1.8`: baseline estable acreditada.
- `maint/v0.1.x`: mantenimiento correctivo de la serie 0.1.x.
- `dev/v0.2.0`: desarrollo evolutivo de la siguiente versión.
- ramas de trabajo: integración mediante Pull Request.

## Principio de gobernanza

Los cambios sobre la línea `dev/v0.2.0` deberán incorporarse mediante ramas
de trabajo y Pull Request conforme al ruleset post-release activo.

## Estado inicial

Al momento de apertura del ciclo 0.2.0, las ramas stable, maintenance y
development convergen en la misma baseline estable.

La primera divergencia de `dev/v0.2.0` se realizará exclusivamente mediante
este cambio documental de apertura.
