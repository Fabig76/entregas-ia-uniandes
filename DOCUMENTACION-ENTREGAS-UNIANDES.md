# Entregas Semanales del Proyecto · Seminario IA Generativa · UNIANDES 2026

Documentación técnica para mantenimiento y ajustes futuros.
Última actualización: 20-oct-2026 (Versión 4 desplegada).

---

## 1. Qué es

Plataforma pública (GitHub Pages) donde los estudiantes suben, cada semana, un
`.zip` con el avance de su proyecto del seminario. El `.zip` se guarda en una
carpeta de Google Drive del docente y cada envío queda registrado en una Hoja de
cálculo de Google. El docente entra con usuario/contraseña a una pestaña
protegida para ver todas las entregas.

- Estudiantes: suben el `.zip` (sin login).
- Docente: ve tablero con totales, estado de cada grupo y descarga/CSV.

---

## 2. Arquitectura

```
Estudiante  →  GitHub Pages (index.html)  →  Apps Script Web App (doPost)
                    │                              │
                    │  reintento 3x (frontend)     ├─ crea .zip en Drive (carpeta por entrega)
                    │                              └─ appendRow en Google Sheets «Entregas»
                    │
              Docente → pestaña «Docente» → doGet?a=datos&h=HUELLA → lee Sheet
```

- **Frontend**: un solo archivo `index.html` (contiene el frontend Y, embebido
  en un bloque `<script type="text/plain" id="gas-code">`, el código del backend).
- **Backend**: Google Apps Script, proyecto *standalone* (no ligado al Sheet),
  usa `SpreadsheetApp.openById(SHEET_ID)`.
- **Persistencia**: Google Sheets (registro) + Google Drive (archivos .zip).
- **Autenticación docente**: hash SHA-256 de `usuario:contraseña` comparado con
  `HUELLA_DOCENTE`. La contraseña real NO está en el archivo (solo el hash).

Costo: 0 (GitHub Pages + Apps Script + Sheets + Drive gratis).

---

## 3. Dónde está cada pieza

| Pieza | Dato |
|---|---|
| Sitio en vivo | https://fabig76.github.io/entregas-ia-uniandes/ |
| Repositorio GitHub | https://github.com/Fabig76/entregas-ia-uniandes (rama `main`) |
| Copia local de trabajo | `/root/work/entregas-ia-uniandes/` |
| Proyecto Apps Script | «Entregas M2 UNIANDES» — script ID `1z_QJfRPcyK9Sg-62Oz8RyiSuaWJP50WwSX-cTDL99CFH2lNMxU2NMNKE` |
| ID de implementación | `AKfycbwOPxpRZZes9d7vBXOlEhhxEnBdHuOwkKHjXVQiqKNvrLxHrFdfJrvlDifaGO0fYEVWtg` |
| URL web app (ENDPOINT) | https://script.google.com/macros/s/AKfycbwOPxpRZZes9d7vBXOlEhhxEnBdHuOwkKHjXVQiqKNvrLxHrFdfJrvlDifaGO0fYEVWtg/exec |
| Hoja de cálculo | `SHEET_ID = 1dzpNs56mv2e2nDTByvcQD6PTKpAdpA3alA-ykicDJqA` · hoja «Entregas» |
| Carpeta Drive de .zip | «Seminario IA Generativa · Entregas 2026» (la crea `configurar()`) |
| Carpeta Drive de respaldos de código | «Encuesta Módulo 2 UNIANDES» (ID `1lp7F7qFI60OQ25zey99i8xVW-VMQ-F51`) |
| Archivo de código v4 en Drive | «Codigo_ENTREGAS_v4_2026-10-20_trycatch.gs» (ID `1xXGccyDL8U1Ns69ig2LM3H6KsvihmoMG`) |

Credenciales de acceso a Google para el agente (Drive/Sheets): token en
`/root/.hermes/google_token.json` y rclone remoto `gdrive:`.

---

## 4. Configuración clave (constantes en `index.html`)

Aparecen DOS veces: en el bloque `gas-code` (backend) y en el `<script>` principal
(frontend). Cualquier cambio de calendario/casos hay que hacerlo en **ambos**.

| Constante | Valor | Nota |
|---|---|---|
| `ENDPOINT` | URL del web app de arriba | pegada en el `<script>` principal (línea ~383) |
| `HUELLA_DOCENTE` | `8b961ca30234e3d67466576a72d3d9b5602ef8330d8fb2bdbd3ed9396a26d6cc` | hash SHA-256 de `usuario:contraseña` |
| `SHEET_ID` | `1dzpNs56mv2e2nDTByvcQD6PTKpAdpA3alA-ykicDJqA` | solo en gas-code (openById) |
| `RAIZ` | `Seminario IA Generativa · Entregas 2026` | carpeta Drive de entregas |
| `MAX_MB` | 20 | límite del .zip |
| `CASOS` | 11 grupos (ver sección 5) | en ambos bloques |
| `ENTREGAS` | 4 semanas (ver sección 6) | en ambos bloques |

Zona horaria: UTC-5 (America/Guayaquil / es-EC). Las fechas límite llevan offset `-05:00`.

---

## 5. Casos / grupos (11)

1. Titulación y normativa académica
2. Reclamos de consumo
3. Triaje de soporte tecnológico
4. Planificador turístico
5. Orientación sobre dengue
6. Pliegos de contratación pública
7. Beneficios y liquidaciones laborales
8. Simulador de situaciones viales
9. Asistente para productores de cacao
10. Revisor de código seguro
11. Calendario tributario RIMPE

---

## 6. Calendario de entregas

| N | Tema | Límite (lunes) | Prórroga (miércoles) | Obligatorios |
|---|---|---|---|---|
| 1 | Definición del problema y diseño de la solución | 19-oct 23:59 | 21-oct 23:59 | 11 |
| 2 | MVP e integración con IA generativa | 26-oct 23:59 | 28-oct 23:59 | 14 |
| 3 | RAG, agente y calidad | 02-nov 23:59 | 04-nov 23:59 | 14 |
| 4 | Versión final desplegada | 09-nov 23:59 | 11-nov 23:59 | 14 |

Estados: **A tiempo** (≤ límite) · **Con prórroga** (≤ prórroga) · **Tardía** (después).

---

## 7. Cómo desplegar / re-desplegar

### 7.1 Frontend (GitHub Pages)

```bash
cd /root/work/entregas-ia-uniandes
# editar index.html ...
git add index.html && git commit -m "..." && git push origin main
```

GitHub Pages publica `main` en ~1 min. Verificar:
`curl -sL https://fabig76.github.io/entregas-ia-uniandes/ | grep -c 'INTENTOS = 3'`

### 7.2 Backend (Apps Script) — CRÍTICO: no basta con guardar

El código del backend vive en el bloque `gas-code` de `index.html`. Para
aplicarlo al backend en Google hay que:

1. Extraer el bloque `gas-code` (o usar el botón «Copiar código de Apps Script»
   de la pestaña Docente).
2. En script.google.com → proyecto «Entregas M2 UNIANDES», borrar todo y pegar.
3. Guardar.
4. **Implementar → Administrar implementaciones → Editar (lápiz) → en «Versión»
   elegir «Nueva versión» → Implementar.**

⚠️ Al **Editar** la implementación existente, el ID y la URL `/exec` NO cambian.
Si en cambio usas **Nueva implementación**, Google genera un ID/URL NUEVOS y
entonces hay que actualizar `ENDPOINT` en `index.html` y volver a publicar.

⚠️ El nombre "v4" de los archivos de respaldo es una etiqueta NUESTRA; el
contador «Versión N» de Google es independiente. No confundir.

---

## 8. Historial de bugs / fixes

| # | Commit | Problema | Fix |
|---|---|---|---|
| 1 | `243d363` | Sheets convertía `"12/12"` en fecha | Emitir `"12 de 12"` |
| 2 | `bb81f55` | Reintento automático 3x (ayudó a cortes breves, pero NO era la causa real) | Reintento 3x + mensajes claros |
| 3 | `28d7f1c` | Errores de servidor devolvían HTML ilegible | try/catch en doGet/doPost → JSON legible (aportado por analista) |
| 4 | `a3c9049` | **CAUSA REAL** de «Se perdió la conexión»: la barra de progreso (`x.upload.onprogress`) forzaba un preflight CORS (OPTIONS) que Apps Script responde con 405 | Quitar la barra de progreso + dedup al reintentar (aportado por analista) |

---

## 9. Lecciones / pitfalls (leer antes de tocar)

1. **Barra de progreso de subida = preflight CORS = 405.** Registrar
   `x.upload.onprogress` convierte la petición en "no simple" y el navegador
   manda antes un OPTIONS que Apps Script responde con 405 SIN cabeceras CORS →
   `x.onerror` → «Se perdió la conexión». NUNCA registrar `x.upload.onprogress`
   contra Apps Script. (Causa real del bug de los estudiantes.)
2. **El anti-bot de Google SÍ existe, pero solo para curl/datacenter** (405 +
   HTML `ppConfig`). No afecta a navegadores reales. No confundir ese 405 con el
   del pitfall 1. Para probar el backend, usar `browser_console`, nunca `curl`
   para POST.
3. **Guardar ≠ desplegar.** Editar el código de Apps Script no actualiza el web
   app desplegado hasta hacer «Editar → Nueva versión».
4. **`getActiveSpreadsheet()` no existe en proyectos standalone.** Usar
   `openById(SHEET_ID)`.
5. **Sheets auto-convierte `N/N` a fecha.** Usar `"N de N"`.
6. **`node --check` no detecta errores de runtime** (ReferenceError). Verificar
   siempre con navegador tras desplegar.
7. **Cambios de calendario/casos van en DOS sitios** (gas-code + script principal).

Detalle de la causa real y el fix: ver skill `static-web-app-with-apps-script`,
referencia `references/upload-progress-cors-preflight.md`.

---

## 10. Cómo verificar (smoke test)

Backend sano (con `browser_console`, no curl):

```js
const E = "https://script.google.com/macros/s/AKfycbwOPxpRZZes9d7vBXOlEhhxEnBdHuOwkKHjXVQiqKNvrLxHrFdfJrvlDifaGO0fYEVWtg/exec";
await fetch(E + "?a=publico").then(r => r.text());            // {"ok":true,"publico":[...]}
await fetch(E + "?a=datos&h=<HUELLA>").then(r => r.text());   // {"ok":true,"filas":[...]}
// try/catch activo (debe devolver JSON "Error en el servidor...", no HTML):
await fetch(E, {method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"},
  body: JSON.stringify({entrega:1,grupo:1,proyecto:"t",repo:"https://github.com/fabig76/entregas-ia-uniandes",
  checks:[],totalChecks:0,comentario:"prueba trycatch version 4",nombreArchivo:"t.zip",datos:"!!!bad!!!"})}).then(r=>r.text());
```

---

## 11. Recetas de ajustes comunes

### Cambiar fechas / prórrogas
Editar el array `ENTREGAS` en **ambos** bloques (gas-code y script principal).
Redeploy backend (sección 7.2) + push frontend (7.1).

### Agregar / quitar un caso
Editar `CASOS` (y el `<select>` de grupos si es frontend) en ambos bloques.
Ajustar `ENTREGAS[].obligatorios` si cambia la lista de verificación.

### Cambiar la contraseña del docente
1. Calcular `SHA-256("usuario:contraseña")` (p. ej. con `sha256sum` o en el
   navegador: `crypto.subtle.digest("SHA-256", ...)`).
2. Reemplazar `HUELLA_DOCENTE` (gas-code) y `HUELLA` (script principal).
3. Redeploy backend + push frontend.

### Cambiar el tamaño máximo
Editar `MAX_MB` en ambos bloques. El chequeo es doble: cliente (antes de subir)
y servidor (en `doPost_`).

### Cambiar el ENDPOINT (solo si se creó implementación NUEVA)
Reemplazar la constante `ENDPOINT` del script principal y push a GitHub Pages.

### Borrar entregas de prueba
Pestaña Docente del sitio → tabla → eliminar fila (o directamente en la hoja
«Entregas» de Sheets).

---

## 12. Estado actual (20-oct-2026)

- ✅ Frontend corregido con la CAUSA REAL resuelta: sin barra de progreso (commit `a3c9049`).
- ✅ Backend Versión 4 con try/catch devolviendo JSON (desplegado).
- ✅ Subida de estudiante verificada al primer intento (fix confirmado end-to-end).
- ✅ Hoja «Entregas» y carpeta Drive limpiadas de datos de prueba (10 archivos borrados).
- Pendiente del docente: avisar a los grupos que ya pueden subir.
- El backend en exe.dev quedó en pausa (spec en `SPEC-BACKEND-EXE-DEV.md`; no urgente tras este fix).
