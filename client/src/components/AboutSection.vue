<script setup>
import { useSite } from '../composables/useSite'

const { t } = useSite()
const points = ['aboutList1', 'aboutList2', 'aboutList3', 'aboutList4']
</script>

<template>
  <section id="about" class="section">
    <div class="about">
      <div v-reveal class="text">
        <h2 class="section__title">{{ t('aboutTitle') }}</h2>
        <p v-html="t('aboutP1')" />
        <p v-html="t('aboutP2')" />
      </div>
      <ul class="list">
        <li v-for="(k, i) in points" :key="k" v-reveal.right="i * 90">
          <span>{{ String(i + 1).padStart(2, '0') }}</span> {{ t(k) }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.about {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2.5rem;
  align-items: center;
}
.text p {
  color: var(--muted);
  margin-top: 1rem;
  font-size: 1.02rem;
}
.text :deep(strong) {
  color: var(--text);
}
.text :deep(em) {
  color: var(--accent);
  font-style: normal;
}
.list {
  list-style: none;
  display: grid;
  gap: 0.8rem;
}
.list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  font-weight: 500;
}
.list span {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  color: var(--accent);
  font-size: 0.9rem;
}
@media (max-width: 820px) {
  .about {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
