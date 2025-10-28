<template>
  <div :class="markDateCell(cellData, currentView)">
    {{ cellData.text }}
  </div>
</template>
<script setup lang="ts">
import Utils from './utils.ts';

withDefaults(defineProps<{
  cellData?: any
  currentView?: string
}>(), {
  cellData: () => {},
  currentView: '',
});

function markDateCell(cellData: Record<string, any>, currentView: string) {
  const isDisabled = currentView === 'month'
    ? Utils.isWeekend(cellData.date)
    : Utils.isDisableDate(cellData.date);
  return { 'disable-date': isDisabled };
}
</script>
