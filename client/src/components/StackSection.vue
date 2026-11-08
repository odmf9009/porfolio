<script setup>
import TagList from './base/TagList.vue'
import { useSite } from '../composables/useSite'
import { stack } from '../config/stack'

const { t } = useSite()
</script>

<template>
  <section id="stack" class="section">
    <div class="section__head" v-reveal>
      <h2 class="section__title">{{ t('stackTitle') }}</h2>
      <p class="section__desc">{{ t('stackDesc') }}</p>
    </div>
    <div class="stack">
      <article v-for="(c, i) in stack" :key="c.title" v-reveal="(i % 2) * 100" class="card">
        <h3>{{ t(c.title) }}</h3>
        <p v-html="t(c.body)" />
        <TagList :items="c.tech" />
      </article>
    </div>
  </section>
</template>

<style scoped>
.stack {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.4rem;
}
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.8rem;
}
@media (max-width: 760px) {
  .stack {
    grid-template-columns: minmax(0, 1fr);
  }
}
h3 {
  font-size: 1.15rem;
  margin-bottom: 0.7rem;
}
p {
  color: var(--muted);
  font-size: 0.95rem;
  margin-bottom: 1.2rem;
}
p :deep(strong) {
  color: var(--text);
}
</style>
