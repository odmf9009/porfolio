<script setup>
import { computed } from 'vue'
import { useSite } from '../composables/useSite'

const { t, loc, projects } = useSite()

// Composición de capturas REALES de las apps (las primeras de cada proyecto que tenga imágenes).
// No se usa la pantalla de una sola app como si fuera la marca del estudio.
const phones = computed(() => {
  const picks = projects.value.filter((p) => p.images.length).slice(0, 3)
  const spots = { 1: ['c'], 2: ['l', 'c'], 3: ['l', 'c', 'r'] }[picks.length] || []
  const depth = { l: 64, c: 30, r: 46 } // más desplazamiento = más "atrás" (se queda rezagada al hacer scroll)
  return picks.map((p, i) => ({
    spot: spots[i],
    depth: depth[spots[i]],
    src: p.images[0].url,
    alt: `${p.name} — ${p.images[0].caption || ''}`.replace(/ — $/, ''),
  }))
})
const delay = { l: 220, c: 80, r: 360 }
</script>

<template>
  <section id="top" class="hero">
    <div class="grid">
      <div class="copy">
        <span v-reveal class="badge">{{ t('heroBadge') }}</span>
        <h1 v-reveal="80" class="title">
          {{ t('heroTitleLead') }} <span class="grad">{{ t('heroTitleGrad') }}</span><br />{{ t('heroTitleRest') }}
        </h1>
        <p v-reveal="160" class="sub" v-html="t('heroSub')" />
        <div v-reveal="240" class="actions">
          <a href="#apps" class="btn btn--primary">{{ t('heroCtaPrimary') }}</a>
          <a href="#contacto" class="btn btn--ghost">{{ t('heroCtaGhost') }}</a>
        </div>
        <div v-reveal="320" class="stats">
          <div class="stat"><span class="num">{{ projects.length }}</span><span class="label">{{ t('statAppsLabel') }}</span></div>
          <div class="stat"><span class="num">{{ t('statMultiNum') }}</span><span class="label">{{ t('statMultiLabel') }}</span></div>
          <div class="stat"><span class="num">{{ t('statRtNum') }}</span><span class="label">{{ t('statRtLabel') }}</span></div>
        </div>
      </div>

      <div v-if="phones.length" class="stage" aria-hidden="false">
        <div v-for="ph in phones" :key="ph.src" v-parallax="ph.depth" class="slot" :class="`slot--${ph.spot}`">
          <figure v-reveal.scale="delay[ph.spot]" class="phone">
            <img :src="ph.src" :alt="ph.alt" width="1000" height="2173" :fetchpriority="ph.spot === 'c' ? 'high' : 'auto'" decoding="async" />
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: clamp(2.5rem, 7vw, 5rem) var(--gutter) 3rem;
}
.grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
}
.badge {
  display: inline-block;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #fbbf24;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.28);
  margin-bottom: 1.4rem;
}
.title {
  font-size: clamp(2.1rem, 4.7vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1.2rem;
}
.sub {
  font-size: clamp(1rem, 2vw, 1.15rem);
  color: var(--muted);
  max-width: 560px;
  margin-bottom: 2rem;
}
.sub :deep(strong) {
  color: var(--text);
}
.actions {
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
  margin-bottom: 2.6rem;
}
.stats {
  display: flex;
  gap: clamp(1.2rem, 4vw, 3rem);
  flex-wrap: wrap;
}
.stat {
  display: flex;
  flex-direction: column;
}
.num {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 1.35rem;
}
.label {
  font-size: 0.85rem;
  color: var(--muted);
}

/* Capturas flotando: tres capas a distinta profundidad */
.stage {
  position: relative;
  width: 100%;
  max-width: 520px;
  aspect-ratio: 1 / 1.12;
  margin-inline: auto;
}
.stage::before {
  content: '';
  position: absolute;
  inset: 12% 8%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.22), rgba(59, 130, 246, 0.12) 55%, transparent 72%);
  filter: blur(40px);
  pointer-events: none;
}
.slot {
  position: absolute;
}
.slot--c {
  width: 46%;
  left: 27%;
  top: 2%;
  z-index: 2;
}
.slot--l {
  width: 36%;
  left: 0;
  top: 20%;
  z-index: 1;
}
.slot--r {
  width: 36%;
  right: 0;
  top: 9%;
  z-index: 1;
}
.phone {
  margin: 0;
  border-radius: clamp(16px, 2.6vw, 26px);
  overflow: hidden;
  border: 1px solid var(--border-strong);
  background: var(--surface-2);
  box-shadow: 0 30px 60px -24px rgba(0, 0, 0, 0.75);
}
.phone img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1000 / 2173;
  object-fit: cover;
}

@media (max-width: 960px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .stage {
    max-width: 420px;
    margin-top: 0.5rem;
  }
}
</style>
