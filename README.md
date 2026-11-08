# Portfolio — Ventures FL Studio (Node + Express + MongoDB)

App full-stack con **web pública** (el portfolio) y **panel de administración** protegido por login.
Los proyectos y sus imágenes se gestionan desde el panel y se guardan en MongoDB.

## Stack
- **Node.js + Express** — servidor y rutas.
- **MongoDB + Mongoose** — proyectos, usuarios y sesiones.
- **Vue 3 + Vite** (`client/`) — la web pública. Express sirve lo compilado (`client/dist`) y le inyecta los datos.
- **EJS** — el panel `/admin` y, como respaldo, la web pública antigua si `client/dist` aún no se ha compilado.
- **express-session + connect-mongo** — login por usuario/contraseña con sesión en Mongo.
- **bcryptjs** — hash de contraseñas.
- **multer** — subida de imágenes (a `public/uploads/`).
- **helmet + express-rate-limit** — cabeceras de seguridad y límite de intentos de login.

## Puesta en marcha
```bash
cd porfolio
cp .env.example .env      # ajusta SESSION_SECRET, ADMIN_PASSWORD, MONGODB_URI
npm install
cd client && npm install && npm run build && cd ..   # compila la web pública (Vue)
npm run seed              # crea el admin inicial + las 5 apps
npm start                 # http://localhost:4000
```

- **Web pública:** `http://localhost:4000/`
- **Panel:** `http://localhost:4000/admin` (usuario/contraseña del `.env`, por defecto `admin` / `admin1234`).

> Cambia la contraseña del admin tras el primer acceso (panel → Usuarios).

## Estructura
```
server.js                 arranque, seguridad, sesiones
src/
  config/db.js            conexión a MongoDB
  models/User.js          usuarios del panel (bcrypt, roles admin/editor)
  models/Project.js       apps del portfolio (+ campos metrics/storeLinks para el futuro)
  middleware/auth.js      requireAuth / requireAdmin
  middleware/upload.js    subida de imágenes (multer)
  routes/public.js        web pública (sirve client/dist con los datos inyectados; EJS como respaldo)
  routes/api.js           GET /api/site (textos en/es + proyectos publicados, solo campos públicos)
  utils/siteData.js       arma esa respuesta (lista blanca de campos, textos saneados)
  routes/auth.js          login / logout
  routes/admin.js         CRUD de proyectos, imágenes y usuarios
  utils/icons.js          set de iconos SVG
  seed.js                 admin + 5 apps
client/                   web pública en Vue 3 + Vite (ver ARCHITECTURE.md)
views/                    EJS (admin; public/index.ejs = respaldo)
public/                   css, js y uploads (imágenes subidas)
```

## Funcionalidades del panel
- Login con usuario/contraseña (sesión en Mongo).
- Crear, editar y **eliminar** proyectos (nombre, eslogan, descripción, estado, colores, icono, funciones, tecnologías, plataformas, orden, publicado/oculto).
- **Subir y borrar imágenes** por proyecto (se muestran en la tarjeta de la web).
- **Gestión de usuarios** (crear, cambiar contraseña, eliminar; roles admin/editor).

## Preparado para escalar (no implementado aún)
- El modelo `Project` ya incluye `metrics` (usuarios activos, ingresos, moneda) y `storeLinks`.
- El panel reserva el apartado **"Métricas & Monetización"** para el futuro cuadro de mando
  (usuarios por app y lo que monetizan). Se añadirá sin reestructurar.

## Desplegar
Al ser Node, se despliega en tu servidor con **pm2** (como el backend de FixRadar):
```bash
# primera vez
pm2 start server.js --name porfolio
# actualizar (el servidor es un checkout de GitHub)
git pull origin main
npm install                                   # solo si cambió package.json
cd client && npm install && npm run build && cd ..   # solo si cambió client/
pm2 restart porfolio
```
Sirve detrás de nginx y apunta un dominio o una ruta. Asegúrate de un `MONGODB_URI`,
`SESSION_SECRET` fuerte y `NODE_ENV=production` (activa cookies seguras).
```
