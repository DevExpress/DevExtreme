<template>
  <div>
    <div class="name">{{ dayOfWeekNames[cellData.date.getDay()] }}</div>
    <div class="number"> {{ cellData.date.getDate() }}</div>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  cellData?: any,
}>(), {
  cellData: () => {},
});
const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>
