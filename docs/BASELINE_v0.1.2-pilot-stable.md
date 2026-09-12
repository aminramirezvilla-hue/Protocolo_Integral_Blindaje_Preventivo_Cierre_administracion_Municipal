# CATU E-R
## Baseline v0.1.2-pilot-stable

**Producto:** PWA CATU E-R — Blindaje Preventivo Municipal  
**Modo:** Administración Saliente  
**Tipo:** Piloto funcional local-first  
**Fecha de congelamiento:** 11 de septiembre de 2026  
**Baseline normativa:** C2 / Fase IV — corte 10-09-2026  
**Controles activos:** 84  
**Control especial:** R086  
**Repositorio:** Protocolo_Integral_Blindaje_Preventivo_Cierre_administracion_Municipal

---

## 1. Objeto de la baseline

La presente baseline identifica la primera versión estable del piloto funcional
local-first de CATU E-R después de concluir satisfactoriamente la campaña de
pruebas P0–P3.

La baseline congela el comportamiento funcional probado antes de iniciar la
campaña P4 de ampliación, calibración y validación con una muestra mayor de
controles.

---

## 2. Alcance funcional validado

La versión incluye:

- PWA instalable y desplegada mediante GitHub Pages.
- Modo Administración Saliente.
- 84 controles activos derivados de la matriz normativa C2.
- Dashboard ejecutivo.
- IPER-CATU.
- Semaforización y criticidad.
- Registro de evidencia mediante metadatos, vínculo Drive/OneDrive y fotografía local.
- Escenarios de incumplimiento.
- Rutas A, B y C.
- Plan de acciones.
- Roles de interfaz del piloto.
- Validación OIC.
- Alertas internas.
- Funcionamiento offline parcial.
- Persistencia mediante IndexedDB.
- Exportación CSV.
- Exportación Excel compatible.
- Respaldo y restauración JSON.
- Reporte ejecutivo imprimible / PDF.
- Control especial R086 de vigencia normativa.

---

## 3. Campaña P0–P3

| ID | Prueba | Resultado |
|---|---|---|
| P0 | Despliegue GitHub Pages | APROBADO |
| P1.1 | Conforme + evidencia + validación OIC + cierre | APROBADO |
| P1.2 | Crítico + escenario + ruta + acción + alertas | APROBADO |
| P1.3 | Metadatos + vínculo Drive/OneDrive | APROBADO |
| P1.4 | Fotografía local + persistencia | APROBADO después de hotfix v0.1.1 |
| P2.1 | Lectura offline | APROBADO |
| P2.2 | Escritura offline | APROBADO |
| P2.3 | Persistencia después de recarga offline | APROBADO |
| P3.1 | Respaldo JSON | APROBADO |
| P3.2 | Exportación CSV | APROBADO |
| P3.3 | Exportación Excel compatible | APROBADO |
| P3.4 | Reporte ejecutivo / PDF | APROBADO después de hotfix v0.1.2 |
| P3.5 | Restauración del respaldo JSON | APROBADO |

---

## 4. Incidencias del piloto

### P1-INC-001 — Duplicación de evidencia fotográfica

**Descripción:** una segunda activación durante el procesamiento asíncrono de
una fotografía podía generar registros duplicados.

**Corrección:** hotfix v0.1.1.

**Medidas incorporadas:**

- bloqueo temporal del botón Guardar;
- estado visual “Guardando…”;
- prevención de reentrada;
- detección de duplicados exactos;
- función Eliminar local;
- función Depurar duplicados.

**Re-prueba:** APROBADA.

---

### P3-INC-002 — Página inicial vacía en reporte PDF Safari

**Descripción:** Safari desplazaba el contenido del reporte a una segunda
página debido a reglas CSS de impresión incompatibles con la composición del
contenedor principal.

**Corrección:** hotfix v0.1.2.

**Medidas incorporadas:**

- ajuste de reglas `break-inside`;
- exclusión de elementos interactivos de impresión;
- protección de KPIs y filas;
- formato Carta vertical;
- actualización de caché Service Worker.

**Re-prueba:** APROBADA. El reporte resultante se genera en una sola página
para el estado probado.

---

## 5. Resultado del piloto

**Estado:** PILOTO FUNCIONAL LOCAL-FIRST ESTABLE.

La versión v0.1.2-pilot-stable constituye la referencia funcional previa al
inicio de P4.

---

## 6. Limitaciones conocidas

Esta baseline:

- no proporciona autenticación multiusuario real;
- no sincroniza datos entre dispositivos;
- utiliza IndexedDB local;
- mantiene fotografías localmente;
- utiliza Drive/OneDrive únicamente mediante vínculos;
- no constituye certificación legal;
- no sustituye auditoría ni resolución del OIC;
- utiliza IPER-CATU como indicador interno de gestión;
- mantiene R086 como alerta mientras el calendario normativo no esté validado.

---

## 7. Política posterior a la baseline

Ninguna modificación funcional deberá alterar esta baseline.

Los cambios posteriores deberán desarrollarse como:

- v0.1.3-dev, o
- versión posterior correspondiente.

La baseline v0.1.2-pilot-stable se preservará mediante tag Git y GitHub Release.
