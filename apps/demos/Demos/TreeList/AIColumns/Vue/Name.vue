<template>
  <div class="name__wrapper">
    <div class="name__img-wrapper">
      <img
        :src="`../../../../images/employees/new/${firstName} ${lastName}.jpg`"
        :alt="`${firstName} ${lastName}`"
      >
    </div>
    <div class="name__text-wrapper">
      <div>{{ firstName }}</div>
      <div>{{ lastName }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  firstName: string;
  lastName: string;
}>();
</script>

<style scoped>
.name__wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name__img-wrapper {
  width: 40px;
  height: 40px;
  border: var(--dx-border-width) solid var(--dx-color-border);
  border-radius: 50%;
  cursor: pointer;
}

.name__img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
}

.name__text-wrapper {
  width: calc(100% - 48px);
}
</style>
