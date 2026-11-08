<script setup>
// Selector de idioma genérico: botones con aria-pressed. No sabe de dónde vienen los idiomas.
defineProps({
  modelValue: { type: String, required: true },
  options: { type: Array, required: true }, // [{ value: 'en', label: 'EN' }]
  label: { type: String, default: 'Language' },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="lang" role="group" :aria-label="label">
    <svg class="lang__globe" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9S14.5 18.5 12 21C9.5 18.5 8.5 15 8.5 12S9.5 5.5 12 3z" stroke="currentColor" stroke-width="1.5" />
    </svg>
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      class="lang__opt"
      :class="{ 'is-active': o.value === modelValue }"
      :aria-pressed="o.value === modelValue"
      @click="$emit('update:modelValue', o.value)"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<style scoped>
.lang {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  padding: 0.18rem;
  background: var(--surface-2);
}
.lang__globe {
  width: 16px;
  height: 16px;
  margin: 0 0.3rem;
  color: var(--muted);
  flex-shrink: 0;
}
.lang__opt {
  min-width: 36px;
  min-height: 32px;
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--muted);
  padding: 0.22rem 0.5rem;
  border: 0;
  border-radius: 999px;
  background: none;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}
.lang__opt:hover {
  color: var(--text);
}
.lang__opt.is-active {
  background: var(--accent);
  color: #160a02;
}
@media (pointer: coarse), (max-width: 600px) {
  .lang__opt {
    min-width: 44px;
    min-height: 44px;
  }
}
</style>
