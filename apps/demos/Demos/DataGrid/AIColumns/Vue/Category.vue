<template>
  <div class="category__wrapper">{{ category }}</div>
</template>

<script setup lang="ts">
defineProps<{
  category: string,
}>();
</script>

<style scoped>
.category__wrapper {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 24px;
  background-color: var(--dx-color-separator);
}
</style>
