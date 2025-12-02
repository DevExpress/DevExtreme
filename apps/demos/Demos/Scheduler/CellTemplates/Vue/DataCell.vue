<template>
  <div :class="markDataCell(cellData)">
    <slot/>
  </div>
</template>
<script setup lang="ts">
import Utils from './utils.ts';

defineProps<{
  cellData: Record<string, any>
}>();

function markDataCell(cellData: Record<string, any>) {
  const date = cellData.startDate;
  const isDisableDate = Utils.isHoliday(date) || Utils.isWeekend(date);
  const isDinner = !isDisableDate && Utils.isDinner(date);

  return {
    'disable-date': isDisableDate,
    dinner: isDinner,
  };
}
</script>
