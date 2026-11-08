<script setup>
// Visor ampliado sobre <dialog> nativo: flechas, Esc, deslizar con el dedo, clic fuera para cerrar,
// precarga de vecinas y bloqueo del scroll de la página. Genérico: recibe imágenes y un índice.
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  items: { type: Array, default: () => [] }, // [{ src, alt }]
  index: { type: Number, default: 0 },
  labels: { type: Object, default: () => ({ viewer: 'Images', close: 'Close', previous: 'Previous', next: 'Next' }) },
})
const emit = defineEmits(['update:open', 'update:index', 'closed'])

const dlg = ref(null)
const current = computed(() => props.items[props.index])
const single = computed(() => props.items.length < 2)

function go(i) {
  const n = props.items.length
  if (!n) return
  emit('update:index', (i + n) % n) // da la vuelta al llegar al final
}

watch(
  () => props.open,
  async (open) => {
    await nextTick()
    const el = dlg.value
    if (!el) return
    if (open && !el.open) {
      document.documentElement.classList.add('is-locked')
      el.showModal()
    } else if (!open && el.open) {
      el.close()
    }
  },
)

// Precarga las vecinas para que pasar de una a otra sea instantáneo.
watch(
  () => [props.open, props.index],
  () => {
    if (!props.open) return
    const n = props.items.length
    ;[props.index + 1, props.index - 1].forEach((j) => {
      const it = props.items[(j + n) % n]
      if (it) new Image().src = it.src
    })
  },
)

function onClose() {
  document.documentElement.classList.remove('is-locked')
  emit('update:open', false)
  emit('closed')
}

function onKey(e) {
  if (e.key === 'ArrowRight') { e.preventDefault(); go(props.index + 1) }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); go(props.index - 1) }
}

// Clic en el fondo o en el espacio vacío cierra; en la imagen no.
function onBackdrop(e) {
  if (e.target === dlg.value || e.target.classList.contains('stage')) dlg.value.close()
}

let startX = null
function down(e) { startX = e.clientX }
function up(e) {
  if (startX === null) return
  const dx = e.clientX - startX
  startX = null
  if (Math.abs(dx) > 50) go(props.index + (dx < 0 ? 1 : -1))
}
</script>

<template>
  <dialog ref="dlg" class="viewer" :aria-label="labels.viewer" @close="onClose" @keydown="onKey" @click="onBackdrop">
    <button type="button" class="close" :aria-label="labels.close" @click="dlg.close()">&times;</button>
    <button v-show="!single" type="button" class="nav nav--prev" :aria-label="labels.previous" @click="go(index - 1)">&#8249;</button>
    <figure class="stage" @pointerdown="down" @pointerup="up" @pointercancel="startX = null">
      <img v-if="open && current" :src="current.src" :alt="current.alt" />
      <figcaption aria-live="polite">{{ index + 1 }} / {{ items.length }}</figcaption>
    </figure>
    <button v-show="!single" type="button" class="nav nav--next" :aria-label="labels.next" @click="go(index + 1)">&#8250;</button>
  </dialog>
</template>

<style scoped>
.viewer {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: rgba(6, 8, 13, 0.94);
  color: var(--text);
  overflow: hidden;
}
.viewer[open] {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.viewer::backdrop {
  background: rgba(6, 8, 13, 0.94);
}
.stage {
  margin: 0;
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 4rem 0 1.2rem;
  touch-action: pan-y;
}
.stage img {
  display: block;
  max-width: min(92vw, 560px);
  max-height: calc(100dvh - 8rem);
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 14px;
  user-select: none;
  -webkit-user-drag: none;
}
.stage figcaption {
  font-size: 0.9rem;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.close,
.nav {
  border: 1px solid var(--border-strong);
  background: var(--surface-2);
  color: var(--text);
  cursor: pointer;
  display: grid;
  place-items: center;
  border-radius: 50%;
  line-height: 1;
  padding: 0 0 0.12rem;
}
.close:hover,
.nav:hover {
  border-color: var(--accent);
}
.close {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  width: 48px;
  height: 48px;
  font-size: 1.7rem;
  z-index: 3;
}
.nav {
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  font-size: 1.8rem;
  z-index: 3;
  margin: 0 0.6rem;
}
@media (max-width: 640px) {
  .nav {
    position: absolute;
    bottom: 0.9rem;
    margin: 0;
  }
  .nav--prev {
    left: 1rem;
  }
  .nav--next {
    right: 1rem;
  }
  .stage {
    padding: 3.6rem 0 4.4rem;
  }
  .stage img {
    max-height: calc(100dvh - 9.5rem);
  }
}
</style>
