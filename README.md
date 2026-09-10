# CATU E-R — Protocolo Integral de Blindaje Preventivo y Cierre de Administración Municipal

PWA **mobile-first**, instalable y ligera para apoyar la ejecución y seguimiento del protocolo CATU de preparación para la entrega-recepción municipal en Guerrero.

## Estado

**Versión piloto:** `v0.1.0-pilot`  
**Modo liberado:** Administración **saliente**  
**Baseline normativa:** C2 / Fase IV, verificada al **10-09-2026**  
**Controles activos:** 84 (`R001–R086`, excluyendo los controles retirados/sustituidos de Fase II)  
**Control especial:** `R086` — revalidación normativa/calendario 2027.

> El IPER-CATU es un indicador interno de gestión. No equivale a certificación legal, auditoría, resolución administrativa ni dictamen de autoridad.

## Qué funciona en este piloto

- PWA instalable desde Chrome/Edge y añadible a pantalla de inicio en Safari iOS/iPadOS.
- App shell y baseline disponibles sin conexión después de la primera carga.
- 84 controles normativamente validados.
- Semáforo: No evaluado / Conforme / Subsanable / Crítico / No subsanable / No aplica.
- Evaluación de evidencia y cálculo automático del **IPER-CATU**.
- Cinco perfiles operativos de interfaz: Administrador municipal, Coordinador E-R, Responsable de área, Revisor/OIC y Consultor CATU.
- Registro de metadatos y vínculos a expedientes Drive/OneDrive.
- Captura opcional de fotografía comprimida **local** para trabajo de campo.
- Plan de acciones, responsables, fechas compromiso, avance y riesgo residual.
- Alertas internas por controles críticos, evidencia incompleta y vencimientos.
- Dashboard móvil y reporte ejecutivo imprimible/guardable como PDF.
- Exportación CSV, Excel compatible (`.xls`) y respaldo JSON.
- Capacidad piloto de hasta **25 perfiles locales por espacio de trabajo**.

## Límite deliberado del piloto

Esta versión usa **IndexedDB en el dispositivo**. Los perfiles permiten probar roles y flujo de trabajo, pero **no constituyen autenticación multiusuario real** ni sincronización entre teléfonos/computadoras.

Para la fase multiusuario se propone mantener exactamente este frontend en GitHub Pages y agregar **Supabase Auth + PostgreSQL con Row Level Security (RLS)**. Los documentos oficiales continuarían en Google Drive/OneDrive; el backend sólo almacenaría metadatos, vínculos, estatus, evidencias referenciales y bitácora.

## Despliegue en GitHub Pages

Repositorio previsto:

`Protocolo_Integral_Blindaje_Preventivo_Cierre_administracion_Municipal`

Como el proyecto no usa compilador ni dependencias Node, puede publicarse directamente desde la rama `main` y carpeta `/ (root)`.

1. Ir a **Settings → Pages**.
2. En **Build and deployment**, seleccionar **Deploy from a branch**.
3. Elegir `main` y `/ (root)` y guardar.
4. Esperar la publicación y abrir:

`https://aminramirezvilla-hue.github.io/Protocolo_Integral_Blindaje_Preventivo_Cierre_administracion_Municipal/`

La aplicación usa rutas relativas (`./`), por lo que funciona correctamente bajo el subdirectorio de GitHub Pages.

## Prueba mínima recomendada

1. Abrir la PWA y confirmar que muestra `84` controles y alerta `R086`.
2. Ir a **Controles**, abrir `R001` y marcarlo `Conforme` + `Completa verificada`.
3. Cambiar al perfil **Revisor/OIC** en **Más** y validar `R001`.
4. Confirmar que aparece como cerrado y que el dashboard recalcula.
5. Cambiar otro control a `Crítico` y asignar fecha compromiso.
6. Confirmar su aparición en **Acciones** y **Alertas**.
7. Registrar una evidencia con enlace Drive/OneDrive y, opcionalmente, fotografía local.
8. Abrir **Reporte ejecutivo** y usar **Imprimir / Guardar PDF**.
9. Exportar CSV y respaldo JSON.
10. Instalar la PWA y repetir consulta sin conexión.

## Documentación

- [`docs/AVANCE_FASES_I_IV.md`](docs/AVANCE_FASES_I_IV.md)
- [`docs/SRS_MVP_PWA.md`](docs/SRS_MVP_PWA.md)
- [`docs/ARQUITECTURA_MODELO_DATOS.md`](docs/ARQUITECTURA_MODELO_DATOS.md)
- [`docs/PILOTO_GITHUB_PAGES.md`](docs/PILOTO_GITHUB_PAGES.md)
- [`backend/supabase/schema.sql`](backend/supabase/schema.sql) — propuesta para fase multiusuario, **no requerida por v0.1**.

## Seguridad

- Nunca subir expedientes municipales, contraseñas, tokens privados ni secretos al repositorio.
- El código puede ser público; los datos del municipio se generan en tiempo de ejecución.
- En el piloto, los datos quedan en el navegador. Un borrado de datos del navegador puede eliminar el diagnóstico local: generar respaldo JSON periódicamente.
- Los enlaces Drive/OneDrive deben conservar sus permisos institucionales y no convertirse en enlaces públicos salvo decisión expresa del Ayuntamiento.
- En la futura configuración Supabase, **nunca** colocar `service_role` en el frontend. El acceso debe controlarse con RLS.

---

**CATU — Centro de Auditoría Técnica y Urbana**  
Instrumento técnico de apoyo a la gestión preventiva de la entrega-recepción municipal.
