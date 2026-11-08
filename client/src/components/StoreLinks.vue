<script setup>
// Botones de descarga de una app. Regla del dueño:
//  - App Store y Google Play: si existen.
//  - Sin Google Play: botón de descarga propia (APK del VPS), SOLO si el archivo existe
//    (el servidor ya vació la url si no responde), más un aviso de que pronto estará en la tienda.
//  - Si falta una tienda, el aviso lo dice con las palabras que el dueño edita en /admin.
import { computed } from 'vue'

const props = defineProps({
  appStore: { type: String, default: '' },
  playStore: { type: String, default: '' },
  apkUrl: { type: String, default: '' },
  apkLabel: { type: String, default: '' },
  soon: { type: Object, default: () => ({}) }, // { play, apple, both }
})

const showApk = computed(() => !props.playStore && !!props.apkUrl)
const note = computed(() => {
  if (!props.appStore && !props.playStore) return props.soon.both
  if (!props.playStore) return props.soon.play
  if (!props.appStore) return props.soon.apple
  return ''
})
</script>

<template>
  <div v-if="appStore || playStore || showApk || note" class="stores">
    <div v-if="appStore || playStore || showApk" class="row">
      <a v-if="appStore" class="store" :href="appStore" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.05 12.5c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.57-2.74-1.78-3.33-1.8-1.42-.14-2.77.83-3.49.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.8-.41 6.94 1.15 9.21.76 1.11 1.67 2.36 2.86 2.31 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.13 2.76-2.25.87-1.29 1.23-2.54 1.25-2.61-.03-.01-2.4-.92-2.42-3.65zM14.8 5.6c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.58.68-1.09 1.77-.95 2.81 1.02.08 2.05-.52 2.68-1.28z" /></svg>
        App Store
      </a>
      <a v-if="playStore" class="store" :href="playStore" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 3.5v17a1 1 0 001.5.86l14-8.5a1 1 0 000-1.72l-14-8.5A1 1 0 005 3.5z" /></svg>
        Google Play
      </a>
      <a v-if="showApk" class="store store--primary" :href="apkUrl" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 20h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        {{ apkLabel }}
      </a>
    </div>
    <p v-if="note" class="note">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
      {{ note }}
    </p>
  </div>
</template>

<style scoped>
.stores {
  display: grid;
  gap: 0.7rem;
  margin-top: 1rem;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.store {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.45rem 1rem;
  border-radius: 10px;
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--text);
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  transition: border-color 0.15s, transform 0.15s, background 0.15s;
}
.store svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.store:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}
.store--primary {
  color: #160a02;
  background: var(--accent);
  border-color: var(--accent);
}
.store--primary:hover {
  background: color-mix(in srgb, var(--accent) 88%, white);
}
.note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.84rem;
  color: #fbbf24;
}
.note svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
</style>
