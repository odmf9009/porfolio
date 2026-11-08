<script setup>
// Monograma del estudio: V sobre FL. Es el logo real; no se sustituye por la pantalla de ninguna app.
defineProps({ size: { type: Number, default: 38 } })
</script>

<template>
  <span class="mark" :style="{ '--s': size + 'px' }" aria-hidden="true">V<span class="accent">FL</span></span>
</template>

<style scoped>
.mark {
  display: grid;
  place-items: center;
  align-content: center;
  width: var(--s);
  height: var(--s);
  border-radius: calc(var(--s) * 0.29);
  background: linear-gradient(135deg, var(--surface-2), #0c1017);
  border: 1px solid var(--border-strong);
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: calc(var(--s) * 0.3);
  line-height: 1.05;
  flex-shrink: 0;
}
</style>
