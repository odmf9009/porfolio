// Capa de movimiento: aparición al hacer scroll (v-reveal) y parallax (v-parallax).
//
//   v-reveal                 sube y aparece      v-reveal.scale  crece      v-reveal.left / .right  entra de lado
//   v-reveal="140"           con 140 ms de retraso (escalonar hermanos)
//   v-parallax="40"          el elemento se desplaza hasta 40 px MENOS que la página (profundidad)
//   v-parallax.cover="40"    igual, ampliando un 14 % y recortando en el contenedor (imágenes de fondo)
//   v-parallax.page="-0.12"  se desplaza `factor` × el scroll (capas fijas, p. ej. los brillos de fondo)
//
// Reglas: solo transform/opacity (no provocan layout); nada se oculta si el sistema pide menos
// movimiento o el navegador no tiene IntersectionObserver; el estado "oculto" solo existe cuando
// <html class="motion"> está puesto, así que un fallo del script nunca deja contenido invisible.

const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
const enabled = !reduce && 'IntersectionObserver' in window

let io = null
const items = new Set()
let ticking = false

function reveal(el) {
  el.setAttribute('data-in', '')
  const delay = parseInt(el.style.getPropertyValue('--d') || '0', 10)
  // Terminada la transición se suelta el estado inicial para que :hover y demás vuelvan a mandar.
  setTimeout(() => {
    el.removeAttribute('data-reveal')
    el.removeAttribute('data-in')
    el.style.removeProperty('--d')
  }, 1300 + delay)
}

function getObserver() {
  if (io) return io
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        io.unobserve(e.target)
        reveal(e.target)
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
  )
  return io
}

function update() {
  ticking = false
  const vh = window.innerHeight
  const sy = window.scrollY
  for (const it of items) {
    if (it.page) {
      it.el.style.setProperty('--py', `${(sy * it.max).toFixed(1)}px`)
      continue
    }
    const r = it.box.getBoundingClientRect()
    if (r.bottom < -300 || r.top > vh + 300) continue
    const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)))
    it.el.style.setProperty('--py', `${(-p * it.max).toFixed(1)}px`)
  }
}

function schedule() {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(update)
  }
}

export const vReveal = {
  mounted(el, binding) {
    if (!enabled) return
    const kind = Object.keys(binding.modifiers)[0] || ''
    el.setAttribute('data-reveal', kind)
    el.style.setProperty('--d', `${Number(binding.value) || 0}ms`)
    getObserver().observe(el)
  },
  unmounted(el) {
    io?.unobserve(el)
  },
}

export const vParallax = {
  mounted(el, binding) {
    if (!enabled) return
    const cover = binding.modifiers.cover
    el.setAttribute('data-parallax', '')
    el.style.setProperty('--ps', cover ? 1.14 : 1)
    if (cover && el.parentElement) el.parentElement.style.overflow = 'hidden'
    const it = { el, box: el.parentElement || el, max: Number(binding.value) || 40, page: !!binding.modifiers.page }
    el._parallax = it
    items.add(it)
    schedule()
  },
  unmounted(el) {
    items.delete(el._parallax)
  },
}

export function setupMotion(app) {
  app.directive('reveal', vReveal)
  app.directive('parallax', vParallax)
  if (!enabled) return
  document.documentElement.classList.add('motion')
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  // Red de seguridad: si por lo que sea el observador no avisó, lo que ya está a la vista aparece igual.
  setTimeout(() => {
    document.querySelectorAll('[data-reveal]:not([data-in])').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) reveal(el)
    })
  }, 2500)
}
