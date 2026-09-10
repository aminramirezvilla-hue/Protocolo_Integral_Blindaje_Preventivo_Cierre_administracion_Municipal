# Estrategia de piloto en GitHub Pages

## Objetivo

Probar la PWA con el menor costo y complejidad posibles antes de incorporar un backend multiusuario.

## Repositorio

Propietario conectado: `aminramirezvilla-hue`  
Nombre definido: `Protocolo_Integral_Blindaje_Preventivo_Cierre_administracion_Municipal`

URL prevista:

`https://aminramirezvilla-hue.github.io/Protocolo_Integral_Blindaje_Preventivo_Cierre_administracion_Municipal/`

## Configuración recomendada

- Visibilidad del repositorio: puede ser público para el piloto **si sólo contiene código y documentación genérica**.
- Rama: `main`.
- GitHub Pages: **Source = GitHub Actions**; workflow `.github/workflows/deploy-pages.yml`.
- No almacenar datos reales en el repositorio.

## Campaña P0–P5

### P0 — Despliegue

- habilitar GitHub Pages con Source = GitHub Actions;
- ejecutar el workflow de despliegue;
- verificar manifest y service worker;
- abrir en Safari iPhone, Chrome Android y navegador de escritorio;
- instalar en al menos un dispositivo.

**Salida:** sitio accesible, instalable y sin errores de consola críticos.

### P1 — Smoke funcional

Probar `R001`, un control financiero, uno de obra, uno de RH y `R086`.

- cambiar estatus;
- registrar evidencia;
- cambiar perfil OIC;
- validar cierre;
- confirmar dashboard;
- exportar CSV/Excel/JSON;
- imprimir reporte PDF.

**Salida:** cálculos y navegación consistentes.

### P2 — Prueba offline

- cargar PWA en línea;
- activar modo avión;
- consultar controles;
- modificar uno;
- tomar una fotografía local;
- recargar la app.

**Salida:** app shell y estado local conservados.

### P3 — Prueba de usabilidad

Aplicar 10–15 controles con 3–5 usuarios piloto, preferentemente de Tesorería, Obras, RH, Patrimonio y OIC.

Medir:

- minutos por control;
- campos confusos;
- número de toques para actualizar;
- dificultad de localizar controles;
- utilidad del dashboard;
- utilidad real de fotografía y enlace.

### P4 — Diagnóstico integral

Aplicar 84 controles o justificar No aplica.

**Salida:** reporte ejecutivo completo y cartera de acciones.

### P5 — Decisión Beta

Registrar defectos y clasificar:

- Bloqueante;
- Alto;
- Medio;
- Mejora.

Sólo después se decide activar backend multiusuario.

## Criterios para no sobredimensionar la PWA

No agregar una función porque “sería útil” de manera abstracta. Cada nueva capacidad debe responder a una fricción observada en el piloto.

Posponer salvo evidencia de necesidad:

- geolocalización;
- firma manuscrita;
- QR scanner universal;
- subida de expedientes completos;
- WhatsApp;
- workflows de aprobación multinivel;
- notificaciones push remotas.

## Decisión sobre multiusuario

El piloto local no debe confundirse con la versión comercial multiusuario. Si P0–P5 confirma valor, v0.2 incorporará Supabase. La PWA seguirá alojada en GitHub Pages; por tanto, agregar autenticación/sincronización **no obliga** a abandonar la arquitectura ligera.
