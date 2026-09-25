# CATU E-R — Contrato de Respaldo Institucional v1

## 1. Identificación

- Formato: CATU-ER-BACKUP
- Versión de formato: 1
- Etapa: P6
- Baseline técnica de origen: P5-BL-003
- Baseline normativa: C2/Fase IV
- Verificada: 2026-09-10
- Controles activos: 84

## 2. Huella normativa

### controls-1.json
SHA-256:
5f7495ce8c9a047895c1aac37fb1c4bb3774c53c0d0016f8524a8a2ba6bf00ec

### controls-2.json
SHA-256:
db72ddd2fe24c574ed01cf8af540b73de949b3ff8270d4b9173cd357815a0b69

### controls-3.json
SHA-256:
ee831fcdfd420e257f78dab2ad8ac77b4907351c427046fb9bec62f2ae027c8a

### Huella compuesta

Orden normativo obligatorio:
1. controls-1.json
2. controls-2.json
3. controls-3.json

SHA-256 compuesto:
64f3a3149ecfb571323b17a37492a33a2d97d7f2d0757742da9bab971e164b6a

## 3. Estructura lógica

El respaldo institucional deberá contener:

- format
- formatVersion
- createdAt
- application
- normativeBaseline
- workspace
- integrity
- payload

El payload conservará íntegramente el estado lógico de la PWA:

- workspace
- users
- currentUserId
- assessments
- evidence
- config
- auditLog
- updatedAt

Las fotografías embebidas en evidence.photoData forman parte del payload
y, por tanto, quedan incluidas en su control de integridad.

## 4. Reglas de compatibilidad

Un respaldo sólo podrá restaurarse automáticamente cuando:

1. format sea CATU-ER-BACKUP.
2. formatVersion sea soportada.
3. El documento sea estructuralmente válido.
4. La huella SHA-256 del payload coincida.
5. La baseline normativa sea compatible.
6. Los 84 controles de la baseline puedan identificarse de forma consistente.
7. assessments, evidence, auditLog, users y workspace posean tipos válidos.

Una incompatibilidad de baseline no podrá aceptarse silenciosamente.

## 5. Principio de no destrucción

La importación nunca modificará el estado vigente hasta concluir todas las
validaciones previas.

Antes de cualquier restauración se generará un snapshot de seguridad del
estado local existente.

Ante error de validación o escritura, la operación deberá abortarse sin
alterar el estado previamente persistido.

## 6. Restauración controlada

Secuencia obligatoria:

1. Seleccionar archivo.
2. Leer sin escribir.
3. Parsear JSON.
4. Validar formato y versión.
5. Validar esquema lógico.
6. Validar baseline normativa.
7. Recalcular y validar integridad SHA-256.
8. Validar semánticamente el payload.
9. Mostrar previsualización de restauración.
10. Solicitar confirmación explícita.
11. Crear snapshot preventivo.
12. Escribir estado.
13. Leer nuevamente desde IndexedDB.
14. Comparar resultado persistido.
15. Registrar la restauración en auditLog.
16. Renderizar el estado confirmado.

## 7. Política de integridad

Algoritmo inicial:
SHA-256 mediante Web Crypto API.

La huella del payload se calculará sobre una representación JSON
determinista/canónica definida por la implementación P6.

No deberá calcularse sobre un JSON cuya serialización pueda variar por
formato, espaciado o orden no controlado de propiedades.

## 8. Política de baseline

Identificador:
C2/Fase IV

verifiedAt:
2026-09-10

activeControls:
84

La identificación temporal verifiedAt no sustituye la huella criptográfica.

La huella normativa compuesta será el identificador técnico fuerte utilizado
por P6 para comprobar compatibilidad.

## 9. Reglas de auditoría

La restauración deberá generar al menos:

- timestamp
- usuario/perfil
- archivo de origen
- versión de formato
- baseline declarada
- resultado de integridad
- resultado de compatibilidad
- resultado final de restauración

No se eliminará el auditLog contenido en el respaldo sin dejar trazabilidad
de la propia restauración.

## 10. Estado

Contrato arquitectónico candidato a congelamiento EV-P6-006.
No constituye todavía implementación funcional.
