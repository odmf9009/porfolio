# CLAUDE.md — Portafolio de Ventures FL Studio

Web pública del estudio (https://krbusinessventures.org) + panel `/admin`. Repo PÚBLICO: https://github.com/odmf9009/porfolio
(nunca subir `.env`, claves, `public/uploads/` ni nada con datos personales). Servidor: `/var/www/porfolio`, pm2 `porfolio`.
Lee `ARCHITECTURE.md` (contratos, estructura) y `README.md` (instalación) antes de tocar código.

**Idioma**: responde y comenta en español (con tildes). Identificadores de código tal cual.

## Qué es cada parte
- **Web pública** = `client/` (Vue 3 + Vite). Express sirve `client/dist` e inyecta los datos en el HTML.
- **Panel `/admin`** = EJS + Express + Mongo (`views/admin`, `src/routes/admin.js`). NO se rediseña: el dueño edita aquí textos
  (Contenido, en/es), apps (nombre, estado, enlaces de tienda, descarga propia, imágenes) y usuarios. La web nueva lee esos mismos datos.
- `views/public/index.ejs` es solo el RESPALDO si `client/dist` no está compilado.

## Reglas que no se negocian
1. **Honestidad**: nada inventado (clientes, citas, cifras, estados). El estado de cada app se verifica contra App Store Connect /
   Google Play antes de cambiar textos. Lo que no existe no se muestra.
2. **Tiendas por app** (`StoreLinks.vue`): enlace a App Store y a Google Play si existen. Sin Google Play → botón de descarga propia
   (APK del VPS) SOLO si el archivo responde (el servidor vacía `directDownload.url` si no, ver `downloadAvailability.js`) + aviso
   «Muy pronto en Google Play». Nunca un botón que lleve a un 404.
3. **Privacidad**: `/api/site` es lista blanca (`siteData.js`); no salen `metrics`, ids ni fechas. Textos del panel: solo
   `<strong> <em> <br>` (se sanea en servidor). Enlaces: solo http(s) o rutas propias.
4. **Secretos**: jamás imprimir ni commitear `.env`. Imágenes de apps van a `public/uploads/` (fuera de git).
5. **El logo es el monograma «V / FL»** (`BrandMark.vue`, `client/public/favicon.svg`). No usar la pantalla de una app como si fuera la marca.
6. **El diseño lo decide el dueño**: le gusta el aspecto actual (azul marino, naranja, titular con degradado, tarjetas con carrusel).
   Se evoluciona, no se reemplaza. Las 3 maquetas Taste (sala oscura / hoja de contactos / nombre monumento) se descartaron.

## Patrones del frontend (síguelos)
- `components/base/` es genérico (props y eventos, sin acceso a datos): `ShotsCarousel`, `ImageViewer`, `StatusChip`, `TagList`,
  `LangSwitch`, `AppIcon`, `BrandMark`, `SkeletonBlock`. Compón en vez de duplicar; revisa `base/` antes de crear algo.
- Los componentes de dominio (`AppCard`, `StoreLinks`, secciones) leen del singleton `composables/useSite.js` (`t()`, `loc()`, `projects`).
- Config en `src/config/` (`ui.js` = etiquetas de accesibilidad no editables; `stack.js` = tarjetas de servicios).
- **Movimiento** (`directives/motion.js`): `v-reveal` (aparición al scroll) y `v-parallax`. Solo `transform`/`opacity`; se desactiva con
  `prefers-reduced-motion`; el estado "oculto" solo existe con `<html class="motion">`, así que un fallo nunca deja contenido invisible
  (la lección del bug de `script.js` de 2026-11-08). No combinar `v-reveal` y `v-parallax` en el mismo elemento (ambos usan `transform`).
- Estilos: tokens y base en `style.css`; lo específico en `<style scoped>`. Objetivos táctiles ≥ 44 px, sin scroll horizontal 320–1920.

## Comandos
```
cd client && npm run build          # genera client/dist (Express lo sirve)
MONGODB_URI=mongodb://127.0.0.1:27017/<bd> PORT=4100 node server.js     # servidor local (usa una BD de prueba)
cd client && npm run dev            # Vite en :5174 con proxy a :4100 (/api, /uploads, /admin)
```
Sin MongoDB local no hay datos: la web se alimenta de `/api/site`. Para probar, sembrar una BD `porfolio_test` con los proyectos
(sin tocar la de producción) y copiar capturas a `public/uploads/` (están en .gitignore).

## Verificar antes de dar algo por hecho
Playwright a 320, 390, 768, 1024, 1440 y 1920 de ancho: sin desbordes, sin errores de consola, imágenes cargadas, visor ampliado
(clic, flechas, Esc, foco de vuelta), carrusel, cambio de idioma, menú móvil, `reducedMotion: 'reduce'` (nada oculto) y la lógica de
tiendas por app. Mostrar al dueño en local ANTES de desplegar.

## Despliegue (servidor propio, PM2)
```
git push origin main
# en el servidor (/var/www/porfolio):
git pull origin main
npm install                                   # si cambió package.json
cd client && npm install && npm run build && cd ..   # si cambió client/
pm2 restart porfolio
```
`client/dist` y `client/package-lock.json` están en .gitignore (se compilan en el servidor). Antes de cambios grandes, copia en `/root/backups/`.
Tras desplegar, comprobar en producción con el navegador y `/api/site`. Si en producción hay textos editados en /admin que aún nombran
ToFast o PromOff, hay que corregirlos desde Contenido (los valores por defecto ya no los mencionan, pero lo editado manda).

## Indexación (decidido el 2026-11-08: la web SÍ se indexa)
`client/index.html` lleva `robots: index, follow`, canonical y Open Graph (el servidor inyecta título/descripción según el idioma;
`SITE_URL` fija la URL pública). `public/robots.txt` permite todo salvo `/admin` y `/api/`; `public/sitemap.xml` lista la portada. El panel
`/admin` responde siempre con `X-Robots-Tag: noindex, nofollow`. Para volver a ocultar el sitio: `noindex` en `index.html` y
`Disallow: /` en `robots.txt`. Tras desplegar, dar de alta el sitio en Google Search Console (acción del dueño).

## Pendiente
- Subir los APK firmados (FixRadar, CurbRadar, SkillFix) en el cuadro de mando; los botones de descarga salen solos cuando el archivo existe.
- Imágenes de Invoice Snap (hay 10 capturas) y de Habanera (faltan) si se quieren en el portafolio.
