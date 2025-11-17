<template>
  <div class="employee__wrapper">
    <div class="employee__img-wrapper">
      <img
        :src="`../../../../images/employees/new/${firstName} ${lastName}.jpg`"
        :alt="`${firstName} ${lastName}`"
      >
    </div>
    <div class="employee__text-wrapper">
      <div class="employee__text">{{ firstName }}</div>
      <div class="employee__text">{{ lastName }}</div>
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
.employee__wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.employee__img-wrapper {
  width: 40px;
  height: 40px;
  border: var(--dx-border-width) solid var(--dx-color-border);
  border-radius: 50%;
  cursor: pointer;
}

.employee__img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
}

.employee__text-wrapper {
  width: calc(100% - 48px);
}

.employee__text {
  margin: 0;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
