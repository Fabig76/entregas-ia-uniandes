# Entregas semanales del proyecto · Seminario IA Generativa · UNIANDES

Portal público para que los 11 grupos suban su avance semanal en `.zip`. Cada entrega se guarda en una carpeta de Google Drive del docente y queda registrada en una Google Sheet. El docente ve una matriz con el estado de cada grupo (verde/azul/ámbar/rojo).

## URL

https://fabig76.github.io/entregas-ia-uniandes/

## Calendario (fecha oficial lunes · prórroga miércoles, 23:59 hora de Ecuador)

| Entrega | Semana | Tema | Fecha oficial | Prórroga |
|---|---|---|---|---|
| 1 | Semana 1 | Definición y diseño | lunes 19 oct | miércoles 21 oct |
| 2 | Semana 2 | MVP e integración con IA | lunes 26 oct | miércoles 28 oct |
| 3 | Semana 3 | RAG, agente y calidad | lunes 2 nov | miércoles 4 nov |
| 4 | Final | Versión final desplegada | lunes 9 nov | miércoles 11 nov |

**Nada se cierra**: un grupo puede subir cualquier entrega en cualquier momento, incluso adelantarla.

## Estados (según cuándo llega)

- 🟢 **Verde "A tiempo"** — hasta el lunes 23:59
- 🔵 **Azul "Con prórroga"** — martes a miércoles 23:59
- 🟠 **Ámbar "Tardía"** — después del miércoles (se sigue recibiendo igual)
- 🔴 **Rojo "Sin entrega"** — solo en el panel del docente, cuando pasó el miércoles sin subir nada

La cuenta regresiva muestra primero la fecha oficial y, al pasar, el tiempo restante de prórroga.

## Arquitectura

```
[Grupo sube .zip] → GitHub Pages (index.html)
                       │  POST (base64 del .zip, ≤20 MB)
                       ▼
              Apps Script Web App
                       │  crea archivo en Drive (carpeta por entrega)
                       │  registra fila en Sheet "Entregas"
                       ▼
              Google Drive + Google Sheet
```

- **Sheet**: hoja `Entregas` (17 columnas), fila 1 congelada, header azul.
- **Drive**: carpeta raíz `Seminario IA Generativa · Entregas 2026` con una subcarpeta por entrega (se crean con `configurar()` o en la primera subida).
- **Apps Script**: standalone, usa `SpreadsheetApp.openById(SHEET_ID)` (no `getActiveSpreadsheet`).

## Configuración (una sola vez)

1. Crear un Apps Script project **standalone** en https://script.google.com/home
2. Pegar el código del bloque `gas-code` (también se copia desde la pestaña Docente)
3. Ejecutar la función `configurar` (crea las carpetas de Drive y pide permisos)
4. Implementar › Nueva implementación › Aplicación web (Ejecutar como: Yo · Acceso: Cualquier persona)
5. Copiar la URL `/exec` en `const ENDPOINT` de `index.html` y publicar

## Cambiar fechas

Las fechas viven en **dos** lugares que deben coincidir:
- `const ENTREGAS` del bloque Apps Script (campos `limite` y `prorroga`)
- `const ENTREGAS` del frontend (campos `limite`, `prorroga`, `prorrogaFecha`)

## Cambiar la contraseña del docente

Solo está el hash SHA-256 (`HUELLA` / `HUELLA_DOCENTE`). Si rota, hay que regenerar el hash y re-desplegar el Apps Script.

## Backup en Drive

Carpeta "Encuesta Módulo 2 UNIANDES": `Codigo_ENTREGAS_v3_2026-10-20_openById.gs`
