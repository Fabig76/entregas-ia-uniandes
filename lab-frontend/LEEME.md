# Laboratorio de Frontend · versión para GitHub Pages

Dos archivos:
- `index.html` — el laboratorio que usan los grupos y el panel del docente.
- `Codigo.gs` — el servidor en Google Apps Script que guarda los intentos.

## Por qué hace falta el Apps Script

GitHub Pages solo entrega archivos: una página no puede guardarse a sí misma, y lo que
se guarda en el navegador de un grupo no lo ve nadie más. Los intentos viajan a una
hoja de cálculo suya a través del Apps Script, igual que en el portal de entregas.

## Pasos (10 minutos)

1. **El servidor.** Abra `sheets.new`, nombre la hoja «Lab Frontend C4»,
   Extensiones → Apps Script, pegue `Codigo.gs`, Implementar → Nueva implementación →
   Aplicación web → Ejecutar como **Yo** · Acceso: **Cualquier persona**. Copie la URL `/exec`.
2. **La página.** En `index.html`, busque la línea
   `const ENDPOINT = "PEGUE_AQUI_LA_URL_DE_SU_APPS_SCRIPT";`
   y pegue la URL entre las comillas.
3. **Publicar.** Suba `index.html` a su repositorio de GitHub Pages
   (por ejemplo en una carpeta `lab-frontend/` del repositorio de entregas:
   quedará en `https://fabig76.github.io/entregas-ia-uniandes/lab-frontend/`).
4. **Probar antes de la clase.** Abra la página, elija un grupo de prueba, envíe un
   intento y entre como docente a verificar que aparezca. Borre después esas filas
   de prueba en la hoja `LabC4`.

## Cómo funciona

- **Grupos.** Al abrir, cada grupo elige su número (1–11). Tras el primer envío, el
  grupo queda fijado en ese navegador.
- **Intentos.** Cada reto tiene un botón «Enviar intento» con el puntaje tal como está
  en ese momento. Son 2 intentos por reto; el servidor también los cuenta, así que
  editar la página no da intentos extra. Tras el segundo, el reto se bloquea.
- **Docente.** Pestaña «Docente» → usuario y contraseña. La contraseña no está en
  ningún archivo: el navegador calcula su huella SHA-256 y el servidor la compara.
  El panel muestra cuatro indicadores (envíos totales, grupos activos, promedio
  general y quién lidera), medallas para los tres mejores grupos, una barra de
  progreso en cada celda y columnas ordenables (clic en el encabezado).
- **Respaldo.** Todo queda también en la hoja de cálculo `LabC4`, fila por fila.

## Límites honestos

- Un grupo podría elegir el número de otro grupo: el control es social (están en
  salas con usted), no criptográfico.
- Si el grupo cambia de navegador o borra los datos del sitio, el bloqueo local se
  pierde, pero el servidor sigue contando: al tercer envío responde «sin_intentos».
