<template>
  <div :class="className(cellData)">
    <div class="current-value">{{ formatCurrency(cellData) }}</div>
    <div class="diff">{{ fixed(abs(cellData), 2) }}</div>
  </div>
</template>
<script setup lang="ts">
import { formatNumber } from 'devextreme/localization';

withDefaults(defineProps<{
  cellData?: object
}>(), {
  cellData: () => {},
});

function className(value) {
  return gridCellData(value).diff > 0 ? 'inc' : 'dec';
}
function formatCurrency(value) {
  return formatNumber(gridCellData(value).value, { type: 'currency', currency: 'USD', precision: 2 });
}
function abs(value) {
  return Math.abs(gridCellData(value).diff);
}
function fixed(value, precision) {
  return value.toFixed(precision);
}
const gridCellData = function(value) {
  return value.data[value.column.caption.toLowerCase()];
};
</script>
