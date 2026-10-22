/** Laboratorio de Frontend · Clase 4 · Registro de intentos de los 11 grupos.
 *
 * CÓMO INSTALARLO (5 minutos, igual que el portal de entregas):
 *  1. Abra la hoja de cálculo «Lab Frontend C4»:
 *     https://docs.google.com/spreadsheets/d/10eF3-hIR20sslZXKzKjknkTZal-5B0dS4UljOLh8tao/edit
 *     (ya existe, con la pestaña LabC4 y sus encabezados).
 *  2. Extensiones → Apps Script. Borre lo que haya y pegue este archivo completo.
 *  3. Botón «Implementar» → «Nueva implementación» → tipo «Aplicación web».
 *     - Ejecutar como: Yo.
 *     - Quién tiene acceso: Cualquier persona.
 *  4. Copie la URL que termina en /exec y péguela en la línea ENDPOINT del index.html.
 *
 * La contraseña del docente NO está aquí ni en el HTML: solo esta huella SHA-256
 * de "usuario:contraseña". El navegador calcula la huella y este script la compara.
 * La contraseña en claro no se escribe en ningún archivo: solo usted la conoce.
 */
const SHEET_ID = "10eF3-hIR20sslZXKzKjknkTZal-5B0dS4UljOLh8tao";
const HASH_DOCENTE = "8b961ca30234e3d67466576a72d3d9b5602ef8330d8fb2bdbd3ed9396a26d6cc";
const HOJA = "LabC4";
const MAX_INTENTOS = 2;
const RETOS = ["estados","contrato","parser","detener","errores","renderizado","secretos","accesibilidad"];

function hoja_() {
  // openById funciona tanto si el script está conectado a la hoja como si es
  // independiente; getActiveSpreadsheet() devolvía null en un script suelto.
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let h = ss.getSheetByName(HOJA);
  if (!h) { h = ss.insertSheet(HOJA); h.appendRow(["fecha","grupo","reto","intento","puntaje","detalle"]); }
  return h;
}

function doPost(e) {
  let out;
  try {
    const d = JSON.parse(e.postData.contents);

    if (d.accion === "intento") {
      const grupo = String(d.grupo);
      const reto = String(d.reto);
      if (!/^([1-9]|1[01])$/.test(grupo)) throw "grupo_invalido";
      if (RETOS.indexOf(reto) < 0) throw "reto_invalido";
      const p = Math.max(0, Math.min(100, Math.round(Number(d.puntaje) || 0)));
      const det = String(d.detalle || "").slice(0, 120);

      // El candado evita que dos envíos simultáneos del mismo grupo se cuelen.
      const lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        const h = hoja_();
        const filas = h.getDataRange().getValues();
        let usados = 0;
        for (let i = 1; i < filas.length; i++)
          if (String(filas[i][1]) === grupo && filas[i][2] === reto) usados++;
        if (usados >= MAX_INTENTOS) {
          out = { ok: false, error: "sin_intentos", usados: usados };
        } else {
          h.appendRow([new Date(), grupo, reto, usados + 1, p, det]);
          out = { ok: true, intento: usados + 1, usados: usados + 1 };
        }
      } finally { lock.releaseLock(); }

    } else if (d.accion === "resultados") {
      const cred = String(d.credencial || "").toLowerCase();
      if (cred !== HASH_DOCENTE) out = { ok: false, error: "credencial" };
      else {
        const filas = hoja_().getDataRange().getValues().slice(1).map(function (r) {
          return { fecha: r[0], grupo: String(r[1]), reto: r[2], intento: r[3], puntaje: r[4], detalle: r[5] };
        });
        out = { ok: true, filas: filas };
      }

    } else out = { ok: false, error: "accion_desconocida" };
  } catch (err) {
    out = { ok: false, error: String(err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, servicio: "lab-frontend-c4", hoja: HOJA }))
    .setMimeType(ContentService.MimeType.JSON);
}