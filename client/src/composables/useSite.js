// Estado global del sitio: datos públicos (textos en/es + proyectos) e idioma activo.
// Los datos llegan dentro del HTML (bloque #site-data, lo inyecta Express); si no están
// (modo desarrollo con Vite) se piden a /api/site.
import { computed, reactive, watch } from 'vue'

const LANGS = ['en', 'es']
const state = reactive({ site: null, lang: initialLang(), loading: false, error: false })

function initialLang() {
  const m = document.cookie.match(/(?:^|;\s*)lang=(en|es)\b/)
  return m ? m[1] : 'en'
}

function readEmbedded() {
  try {
    return JSON.parse(document.getElementById('site-data')?.textContent || 'null')
  } catch {
    return null
  }
}

async function load() {
  state.error = false
  state.site = readEmbedded()
  if (state.site) return
  state.loading = true
  try {
    const res = await fetch('/api/site', { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(String(res.status))
    state.site = await res.json()
  } catch {
    state.error = true
  } finally {
    state.loading = false
  }
}

// Texto de contenido en el idioma activo (con el inglés como respaldo).
function t(key) {
  const texts = state.site?.texts
  return texts?.[state.lang]?.[key] || texts?.en?.[key] || ''
}

// Campo localizado { en, es } (o { en: [], es: [] }) con respaldo al inglés.
function loc(field) {
  if (!field) return ''
  const v = field[state.lang]
  if (Array.isArray(field.en)) return v?.length ? v : field.en
  return v || field.en || ''
}

function setLang(lang) {
  if (!LANGS.includes(lang)) return
  state.lang = lang
  document.cookie = `lang=${lang};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
}

// El título y la descripción de la pestaña siguen al idioma.
watch(
  () => [state.lang, state.site],
  () => {
    document.documentElement.lang = state.lang
    if (!state.site) return
    document.title = t('metaTitle') || document.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('metaDesc'))
  },
  { immediate: true },
)

export function useSite() {
  return {
    state,
    LANGS,
    load,
    t,
    loc,
    setLang,
    lang: computed(() => state.lang),
    projects: computed(() => state.site?.projects ?? []),
    year: computed(() => state.site?.year ?? new Date().getFullYear()),
  }
}
