<template>
  <div :class="`status status--${status.toLowerCase()}`">
    <div class="status__indicator"/>
    <div>{{ status }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  status: string,
}>();
</script>

<style scoped>
.status {
  display: flex;
  align-items: center;
}

.status--salaried {
  color: var(--dx-color-success);
}

.status--commission {
  color: var(--dx-color-warning);
}

.status--terminated {
  color: var(--dx-color-danger);
}

.status__indicator {
  background-color: currentcolor;
  margin-right: 8px;
  border-radius: 50%;
  height: 12px;
  width: 12px;
}
</style>
