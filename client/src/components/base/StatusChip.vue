<script setup>
// Estado de una app (normal / live / soon). El texto puede ser largo: envuelve en vez de recortarse.
defineProps({ type: { type: String, default: 'normal' } })
</script>

<template>
  <span class="chip" :class="`chip--${type}`"><slot /></span>
</template>

<style scoped>
.chip {
  display: inline-block;
  max-width: 100%;
  font-size: 0.74rem;
  font-weight: 600;
  line-height: 1.35;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  color: var(--muted);
  background: var(--surface-2);
  border: 1px solid var(--border);
}
.chip--live {
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
  border-color: rgba(52, 211, 153, 0.3);
}
.chip--soon {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.3);
}
</style>
