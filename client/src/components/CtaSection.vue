<script setup>
import { useSite } from '../composables/useSite'

const { t } = useSite()
</script>

<template>
  <section id="contacto" class="section">
    <div v-reveal.scale class="cta">
      <h2>{{ t('ctaTitle') }}</h2>
      <p>{{ t('ctaText') }}</p>
      <a :href="`mailto:${t('contactEmail')}`" class="btn btn--primary">{{ t('ctaBtn') }}</a>
    </div>
  </section>
</template>

<style scoped>
.cta {
  position: relative;
  overflow: hidden;
  text-align: center;
  background: linear-gradient(135deg, var(--surface), var(--surface-2));
  border: 1px solid var(--border-strong);
  border-radius: 26px;
  padding: clamp(2.5rem, 6vw, 4rem);
}
.cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.18), transparent 60%);
  pointer-events: none;
}
.cta > * {
  position: relative;
}
h2 {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  margin-bottom: 0.6rem;
}
p {
  color: var(--muted);
  margin-bottom: 1.8rem;
}
</style>
