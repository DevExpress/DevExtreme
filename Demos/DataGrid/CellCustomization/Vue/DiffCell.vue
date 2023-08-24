<template>
  <div :class="className">
    <div class="current-value">{{ currencyFormat }}</div>
    <div class="diff">{{ difference }}</div>
  </div>
</template>
<script setup lang="ts">
import { formatNumber } from 'devextreme/localization';
import { Column } from 'devextreme/ui/data_grid';

import { WeekData, DiffValueProperties } from './data.ts';

const props = defineProps<{
  column: Column,
  rowData: WeekData,
}>();

const getCellData = () => {
  const property = props.column.caption!.toLowerCase() as DiffValueProperties;

  return props.rowData![property];
};

const cellData = getCellData();

const className = cellData.diff > 0 ? 'inc' : 'dec';
const currencyFormat = formatNumber(cellData.value, { type: 'currency', currency: 'USD', precision: 2 });
const difference = Math.abs(cellData.diff).toFixed(2);
</script>
