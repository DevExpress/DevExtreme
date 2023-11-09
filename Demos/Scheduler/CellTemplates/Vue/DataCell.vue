<template>
  <div :class="markDataCell(cellData)">
    <slot/>
  </div>
</template>
<script setup lang="ts">
import Utils from './utils.ts';

withDefaults(defineProps<{
  cellData?: any
}>(), {
  cellData: () => {},
});

function markDataCell(cellData) {
  const date = cellData.startDate;
  const isDisableDate = Utils.isHoliday(date) || Utils.isWeekend(date);
  const isDinner = !isDisableDate && Utils.isDinner(date);

  return {
    'disable-date': isDisableDate,
    dinner: isDinner,
  };
}
</script>
