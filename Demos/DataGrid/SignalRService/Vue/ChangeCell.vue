<template>
  <div :class="{ inc: cellData.data.change > 0, dec: cellData.data.change < 0 }">
    <span class="current-value">{{ cellData.text }}</span>
    <span class="arrow"/>
    <span class="diff">{{ cellData.data.percentChange.toFixed(2) }}%</span>
  </div>
</template>

<script setup lang="ts">
import { ColumnCellTemplateData } from 'devextreme/ui/data_grid';

defineProps<{
  cellData: ColumnCellTemplateData
}>();
</script>
