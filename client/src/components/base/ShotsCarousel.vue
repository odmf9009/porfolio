<script setup>
// Carrusel horizontal de capturas (scroll-snap). Genérico: recibe imágenes y avisa cuál se pulsa.
// Sin JavaScript cada miniatura sigue siendo un enlace a la imagen grande.
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  items: { type: Array, required: true }, // [{ src, alt }]
  label: { type: String, default: '' },
  prevLabel: { type: String, default: 'Previous' },
  nextLabel: { type: String, default: 'Next' },
  openLabel: { type: Function, default: (i, n) => `Open ${i}/${n}` },
})
const emit = defineEmits(['open'])

const track = ref(null)
const canPrev = ref(false)
const canNext = ref(false)
let ro = null

function sync() {
  const el = track.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  const overflow = max > 4
  canPrev.value = overflow && el.scrollLeft > 2
  canNext.value = overflow && el.scrollLeft < max - 2
}

function step(dir) {
  const el = track.value
  const slide = el.querySelector('.slide')
  const w = slide ? slide.getBoundingClientRect().width + 10 : 140
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollBy({ left: dir * w * 2, behavior: reduce ? 'auto' : 'smooth' })
}

onMounted(async () => {
  await nextTick()
  sync()
  ro = new ResizeObserver(sync)
  ro.observe(track.value)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <div class="shots" role="group" aria-roledescription="carousel" :aria-label="label">
    <ul ref="track" class="track" @scroll.passive="sync">
      <li v-for="(it, i) in props.items" :key="it.src" class="slide">
        <a
          class="open"
          :href="it.src"
          target="_blank"
          rel="noopener"
          :aria-label="openLabel(i + 1, props.items.length)"
          @click.prevent="emit('open', i, $event.currentTarget)"
        >
          <img :src="it.src" :alt="it.alt" width="1000" height="2173" loading="lazy" decoding="async" @load="sync" />
        </a>
      </li>
    </ul>
    <button v-show="canPrev" type="button" class="nav nav--prev" :aria-label="prevLabel" @click="step(-1)">&#8249;</button>
    <button v-show="canNext" type="button" class="nav nav--next" :aria-label="nextLabel" @click="step(1)">&#8250;</button>
  </div>
</template>

<style scoped>
.shots {
  position: relative;
}
.track {
  display: flex;
  gap: 0.6rem;
  list-style: none;
  padding: 0.2rem 0 0.6rem;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
}
.track::-webkit-scrollbar {
  display: none;
}
.slide {
  flex: 0 0 auto;
  scroll-snap-align: start;
}
.open {
  display: block;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  cursor: zoom-in;
  outline-offset: 3px;
}
.open img {
  display: block;
  height: var(--shot-h, 280px);
  width: auto;
  aspect-ratio: 1000 / 2173;
  object-fit: cover;
  background: var(--surface-2);
  transition: transform 0.25s ease;
}
.open:hover img {
  transform: scale(1.03);
}
.nav {
  position: absolute;
  top: calc(50% - 0.3rem);
  transform: translateY(-50%);
  z-index: 2;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border-strong);
  background: var(--surface-2);
  color: var(--text);
  font-size: 1.5rem;
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0 0 0.12rem;
}
.nav:hover {
  border-color: var(--accent);
}
.nav--prev {
  left: 6px;
}
.nav--next {
  right: 6px;
}
@media (hover: none) {
  .nav {
    display: none; /* en pantallas táctiles se desliza con el dedo */
  }
}
@media (prefers-reduced-motion: reduce) {
  .open img {
    transition: none;
  }
  .open:hover img {
    transform: none;
  }
}
</style>
