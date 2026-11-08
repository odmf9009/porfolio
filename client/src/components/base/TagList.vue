<script setup>
defineProps({ items: { type: Array, default: () => [] } })
</script>

<template>
  <div v-if="items.length" class="tags">
    <span v-for="item in items" :key="item">{{ item }}</span>
  </div>
</template>

<style scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.tags span {
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--muted);
  padding: 0.28rem 0.6rem;
  border-radius: 7px;
  background: var(--surface-2);
  border: 1px solid var(--border);
}
</style>
