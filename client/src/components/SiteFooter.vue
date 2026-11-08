<script setup>
import BrandMark from './base/BrandMark.vue'
import { useSite } from '../composables/useSite'

const { projects, year } = useSite()
</script>

<template>
  <footer class="footer">
    <div class="inner">
      <BrandMark />
      <p>© {{ year }} Ventures FL Studio · {{ projects.map((p) => p.name).join(' · ') }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
  margin-top: 2rem;
}
.inner {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 2rem var(--gutter);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
p {
  color: var(--muted);
  font-size: 0.85rem;
}
</style>
