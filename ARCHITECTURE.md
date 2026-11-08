# ARCHITECTURE — Portafolio

## Flujo
```
Mongo (projects, contents, users)
   │  siteData.getSiteData()          lista blanca de campos + textos en/es con las ediciones del panel aplicadas
   ├─► GET /api/site  (JSON)          también lo usa Vite en desarrollo
   └─► GET /  → client/dist/index.html con <script id="site-data" type="application/json"> inyectado,
               <title>, <meta description> y <html lang> según la cookie `lang`
                    │
                    ▼  Vue 3 (client/src)  useSite() lee #site-data (o pide /api/site) → componentes
```
El bloque `site-data` es JSON, no código: la CSP (`script-src 'self'`) no lo bloquea y la página pinta sin segunda petición.
Si `client/dist/index.html` no existe, `/` renderiza el EJS antiguo.

## Contrato `/api/site`
```
{ texts: { en: {<clave>: "…"}, es: {…} },          // ~45 claves (src/utils/i18n.js); `inline()` deja solo <strong><em><br>
  projects: [{ slug, name, tagline{en,es}, description{en,es}, statusLabel{en,es}, statusType: normal|live|soon,
               accent, accent2, icon, features{en[],es[]}, tech[], platforms{ios,android},
               images[{url,caption}], storeLinks{appStore,playStore},
               directDownload{url,label{en,es}} }],   // url vacía si el archivo del VPS no responde
  year }
```
Solo proyectos `published: true`, ordenados por `order`. Nunca `metrics`, `_id` ni fechas.

## Textos editables (panel → Contenido)
`src/utils/contentFields.js` lista las claves editables; `i18n.js` tiene los valores por defecto. Orden de resolución:
override de la BD > texto por defecto del idioma > inglés. Nuevas claves: `storeSoonPlay`, `storeSoonApple`, `storeSoonBoth`, `apkLabel`.

## Reglas de las tiendas (`StoreLinks.vue`)
| App Store | Google Play | APK existe | Muestra |
|---|---|---|---|
| sí | sí | — | los dos botones |
| sí | no | sí | App Store + **Descargar APK** + «Muy pronto en Google Play» |
| sí | no | no | App Store + «Muy pronto en Google Play» |
| no | no | no | solo «Muy pronto en la App Store y Google Play» |
| no | sí | — | Google Play + «Muy pronto en la App Store» |

## Estructura del cliente
```
client/
  index.html            plantilla (noindex pendiente de decisión, #site-data, fuentes)
  vite.config.js        proxy dev → Express (PORTFOLIO_API, por defecto :4100)
  public/favicon.svg    monograma V/FL
  src/
    main.js  App.vue    montaje; App provee el único visor ampliado (provide 'viewer')
    style.css           tokens, botones, secciones, estados de movimiento
    composables/useSite.js   estado global: datos, idioma (cookie `lang`), t(), loc(), setLang()
    directives/motion.js     v-reveal, v-parallax (.cover, .page)
    config/ui.js stack.js    etiquetas a11y; tarjetas de servicios
    components/base/    genéricos: ShotsCarousel, ImageViewer, StatusChip, TagList, LangSwitch, AppIcon, BrandMark, SkeletonBlock
    components/         SiteNav, HeroSection, AppsSection, AppCard, StoreLinks, StackSection, AboutSection, CtaSection, SiteFooter
```

## Idioma
Por defecto inglés (como antes). Cookie `lang` (`en|es`): la escribe el selector de Vue y la lee el servidor para `<title>`/`<html lang>`.
La ruta antigua `/lang/:lang` sigue existiendo.
