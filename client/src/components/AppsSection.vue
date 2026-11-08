<script setup>
import AppCard from './AppCard.vue'
import { useSite } from '../composables/useSite'

const { t, projects } = useSite()
</script>

<template>
  <section id="apps" class="section">
    <div class="section__head" v-reveal>
      <h2 class="section__title">{{ t('appsTitle') }}</h2>
      <p class="section__desc">{{ t('appsDesc') }}</p>
    </div>
    <div class="apps">
      <AppCard v-for="(p, i) in projects" :key="p.slug" v-reveal="(i % 2) * 120" :project="p" />
    </div>
  </section>
</template>

<style scoped>
.apps {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.4rem;
}
/* Si el número de apps es impar, la última ocupa todo el ancho en vez de quedar sola y desalineada. */
.apps > :last-child:nth-child(odd) {
  grid-column: 1 / -1;
}
@media (max-width: 900px) {
  .apps {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
