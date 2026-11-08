<script setup>
// Bloque de carga con brillo y desenfoque; respeta "reducir movimiento".
defineProps({ height: { type: String, default: '1rem' }, width: { type: String, default: '100%' }, radius: { type: String, default: '10px' } })
</script>

<template>
  <span class="sk" :style="{ height, width, borderRadius: radius }" aria-hidden="true" />
</template>

<style scoped>
.sk {
  display: block;
  background: linear-gradient(100deg, var(--surface) 30%, var(--surface-2) 50%, var(--surface) 70%);
  background-size: 220% 100%;
  filter: blur(0.6px);
  animation: sk 1.4s ease-in-out infinite;
}
@keyframes sk {
  from {
    background-position: 120% 0;
  }
  to {
    background-position: -120% 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sk {
    animation: none;
  }
}
</style>
