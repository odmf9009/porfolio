<script setup>
import { onMounted, provide, reactive } from 'vue'
import SiteNav from './components/SiteNav.vue'
import HeroSection from './components/HeroSection.vue'
import AppsSection from './components/AppsSection.vue'
import StackSection from './components/StackSection.vue'
import AboutSection from './components/AboutSection.vue'
import CtaSection from './components/CtaSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import ImageViewer from './components/base/ImageViewer.vue'
import SkeletonBlock from './components/base/SkeletonBlock.vue'
import { computed } from 'vue'
import { useSite } from './composables/useSite'
import { ui } from './config/ui'

const { state, load, lang } = useSite()
const u = computed(() => ui[lang.value])

// Un único visor ampliado para todo el sitio; las tarjetas lo abren con viewer.open(items, índice, elemento).
const viewer = reactive({ open: false, items: [], index: 0, trigger: null })
provide('viewer', {
  open(items, index, trigger) {
    viewer.items = items
    viewer.index = index
    viewer.trigger = trigger
    viewer.open = true
  },
})
function onViewerClosed() {
  viewer.trigger?.focus() // devuelve el foco a la miniatura pulsada
  viewer.trigger = null
}

onMounted(load)
</script>

<template>
  <div class="bg-grid" aria-hidden="true" />
  <div v-parallax.page="-0.1" class="bg-glow bg-glow--1" aria-hidden="true" />
  <div v-parallax.page="-0.18" class="bg-glow bg-glow--2" aria-hidden="true" />

  <template v-if="state.site">
    <SiteNav />
    <main>
      <HeroSection />
      <AppsSection />
      <StackSection />
      <AboutSection />
      <CtaSection />
    </main>
    <SiteFooter />
    <ImageViewer
      v-model:open="viewer.open"
      v-model:index="viewer.index"
      :items="viewer.items"
      :labels="{ viewer: u.viewer, close: u.close, previous: u.previous, next: u.next }"
      @closed="onViewerClosed"
    />
  </template>

  <div v-else-if="state.error" class="boot" role="alert">
    <p>{{ u.loadError }}</p>
    <button type="button" class="btn btn--ghost" @click="load">{{ u.retry }}</button>
  </div>

  <div v-else class="boot boot--loading" aria-busy="true">
    <SkeletonBlock width="60%" height="3.2rem" />
    <SkeletonBlock width="80%" height="1.2rem" />
    <div class="boot__cards">
      <SkeletonBlock height="22rem" radius="18px" />
      <SkeletonBlock height="22rem" radius="18px" />
    </div>
  </div>
</template>

<style scoped>
.bg-grid {
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 54px 54px;
  opacity: 0.35;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%);
}
.bg-glow {
  position: fixed;
  z-index: -1;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.35;
  pointer-events: none;
}
.bg-glow--1 {
  top: -160px;
  left: -120px;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, #f97316, transparent 70%);
}
.bg-glow--2 {
  top: 340px;
  right: -160px;
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, #3b82f6, transparent 70%);
}
.boot {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 6rem var(--gutter);
  display: grid;
  gap: 1.2rem;
  justify-items: start;
}
.boot--loading {
  justify-items: stretch;
}
.boot__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 1.4rem;
  margin-top: 2rem;
}
</style>
