<template>
  <div :class="{ inc: cellData.data.change > 0, dec: cellData.data.change < 0 }">
    <span>{{ cellData.text }}</span>
  </div>
</template>

<script setup lang="ts">
import { ColumnCellTemplateData } from 'devextreme/ui/data_grid';

defineProps<{
  cellData: ColumnCellTemplateData
}>();
</script>
