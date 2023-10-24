<template>
  <div :class="markDateCell(cellData, currentView)">
    {{ cellData.text }}
  </div>
</template>
<script setup lang="ts">
import Utils from './utils.js';

withDefaults(defineProps<{
  cellData?: any
  currentView?: string
}>(), {
  cellData: () => {},
  currentView: '',
});

function markDateCell(cellData, currentView) {
  const isDisabled = currentView === 'month'
    ? Utils.isWeekend(cellData.date)
    : Utils.isDisableDate(cellData.date);
  return { 'disable-date': isDisabled };
}
</script>
