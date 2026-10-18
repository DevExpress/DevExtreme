<template>
  <div :class="categoryClass">{{ name }}</div>
</template>

<script setup lang="ts">
const { id } = defineProps<{
  id: number,
  name: string,
}>();

const categoryClass = `category__wrapper category-${id}__bg-color`;
</script>

<style>
.category__wrapper {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 24px;
}

.category-1__bg-color {
  background-color: rgb(from var(--dx-color-warning) r g b / 24%);
}

.category-2__bg-color {
  background-color: rgb(from var(--dx-color-primary) r g b / 24%);
}

.category-3__bg-color {
  background-color: rgb(from var(--dx-color-danger) r g b / 24%);
}

.category-4__bg-color {
  background-color: rgb(from var(--dx-color-success) r g b / 24%);
}
</style>
