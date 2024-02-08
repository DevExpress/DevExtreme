<template>
  <DataCell
    class="dx-scheduler-date-table-cell-text"
    :cell-data="cellData"
  >
    {{ day() }}
  </DataCell>
</template>
<script setup lang="ts">
import DataCell from './DataCell.vue';

const props = withDefaults(defineProps<{
  cellData?: any
}>(), {
  cellData: () => {},
});

function day() {
  return props.cellData.startDate.getDate();
}
</script>
