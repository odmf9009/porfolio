<script setup>
import { computed, inject } from 'vue'
import AppIcon from './base/AppIcon.vue'
import StatusChip from './base/StatusChip.vue'
import TagList from './base/TagList.vue'
import ShotsCarousel from './base/ShotsCarousel.vue'
import StoreLinks from './StoreLinks.vue'
import { useSite } from '../composables/useSite'
import { ui } from '../config/ui'

const props = defineProps({ project: { type: Object, required: true } })
const { t, loc, lang } = useSite()
const viewer = inject('viewer')

const p = computed(() => props.project)
const u = computed(() => ui[lang.value])
const shots = computed(() => p.value.images.map((i) => ({ src: i.url, alt: i.caption || p.value.name })))
const features = computed(() => loc(p.value.features) || [])
const soon = computed(() => ({ play: t('storeSoonPlay'), apple: t('storeSoonApple'), both: t('storeSoonBoth') }))
</script>

<template>
  <article class="app" :style="{ '--accent': p.accent, '--accent-2': p.accent2 }">
    <header class="top">
      <div class="icon"><AppIcon :name="p.icon" /></div>
      <div class="id">
        <h3>{{ p.name }}</h3>
        <p v-if="loc(p.tagline)" class="tag">{{ loc(p.tagline) }}</p>
      </div>
    </header>

    <StatusChip v-if="loc(p.statusLabel)" :type="p.statusType" class="status">{{ loc(p.statusLabel) }}</StatusChip>

    <p v-if="loc(p.description)" class="desc">{{ loc(p.description) }}</p>

    <ul v-if="features.length" class="features">
      <li v-for="f in features" :key="f">{{ f }}</li>
    </ul>

    <ShotsCarousel
      v-if="shots.length"
      class="shots"
      :items="shots"
      :label="u.shotsOf(p.name)"
      :prev-label="u.previousShots"
      :next-label="u.nextShots"
      :open-label="(i, n) => u.enlarge(i, n, p.name)"
      @open="(i, el) => viewer.open(shots, i, el)"
    />

    <footer class="foot">
      <TagList :items="p.tech" />
      <div class="plat" :aria-label="u.platforms">
        <svg v-if="p.platforms.ios" viewBox="0 0 24 24" role="img" aria-label="iOS"><title>iOS</title><path fill="currentColor" d="M17.05 12.5c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.57-2.74-1.78-3.33-1.8-1.42-.14-2.77.83-3.49.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.8-.41 6.94 1.15 9.21.76 1.11 1.67 2.36 2.86 2.31 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.13 2.76-2.25.87-1.29 1.23-2.54 1.25-2.61-.03-.01-2.4-.92-2.42-3.65zM14.8 5.6c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.58.68-1.09 1.77-.95 2.81 1.02.08 2.05-.52 2.68-1.28z" /></svg>
        <svg v-if="p.platforms.android" viewBox="0 0 24 24" role="img" aria-label="Android"><title>Android</title><path fill="currentColor" d="M17.6 9.5l1.4-2.4a.3.3 0 10-.5-.3l-1.4 2.44A8.6 8.6 0 0012 8.2c-1.98 0-3.8.48-5.1 1.24L5.5 7a.3.3 0 10-.5.3l1.4 2.4C3.9 10.9 2.4 13 2.4 15.5h19.2c0-2.5-1.5-4.6-4-6zM7.6 13.6a.9.9 0 110-1.8.9.9 0 010 1.8zm8.8 0a.9.9 0 110-1.8.9.9 0 010 1.8z" /></svg>
      </div>
    </footer>

    <StoreLinks
      :app-store="p.storeLinks.appStore"
      :play-store="p.storeLinks.playStore"
      :apk-url="p.directDownload.url"
      :apk-label="loc(p.directDownload.label) || t('apkLabel')"
      :soon="soon"
    />
  </article>
</template>

<style scoped>
.app {
  --shot-h: 300px;
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, var(--surface), var(--surface-2));
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: clamp(1.3rem, 3vw, 1.8rem);
  overflow: hidden;
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
}
/* Capas decorativas (borde con degradado y brillo): no deben interceptar clics. */
.app::before,
.app::after {
  content: '';
  position: absolute;
  pointer-events: none;
}
.app::before {
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(140deg, color-mix(in srgb, var(--accent) 55%, transparent), transparent 45%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
}
.app::after {
  top: -40%;
  right: -30%;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent), transparent 70%);
  opacity: 0.16;
  transition: opacity 0.3s;
}
.app > * {
  position: relative;
  z-index: 1;
}
@media (hover: hover) {
  .app:hover {
    transform: translateY(-6px);
    border-color: transparent;
    box-shadow: 0 24px 50px -20px rgba(0, 0, 0, 0.7);
  }
  .app:hover::before {
    opacity: 1;
  }
  .app:hover::after {
    opacity: 0.3;
  }
}
.top {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 0.9rem;
}
.icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, var(--surface));
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
}
.icon svg {
  width: 28px;
  height: 28px;
}
.id {
  min-width: 0;
}
h3 {
  font-size: 1.25rem;
  font-weight: 700;
}
.tag {
  font-size: 0.85rem;
  color: var(--muted);
}
.status {
  align-self: flex-start;
  margin-bottom: 1rem;
}
.desc {
  color: var(--muted);
  font-size: 0.95rem;
  margin-bottom: 1.1rem;
}
.features {
  list-style: none;
  margin-bottom: 1.3rem;
  display: grid;
  gap: 0.5rem;
}
.features li {
  position: relative;
  padding-left: 1.5rem;
  font-size: 0.9rem;
}
.features li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: var(--accent);
  transform: rotate(45deg);
}
.shots {
  margin-top: auto; /* alinea los carruseles al fondo cuando las tarjetas tienen distinto texto */
  margin-bottom: 0.4rem;
}
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1.1rem;
  border-top: 1px solid var(--border);
}
.plat {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}
.plat svg {
  width: 22px;
  height: 22px;
  color: var(--text);
  opacity: 0.75;
}
@media (max-width: 520px) {
  .app {
    --shot-h: 250px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .app,
  .app::before,
  .app::after {
    transition: none;
  }
  .app:hover {
    transform: none;
  }
}
</style>
