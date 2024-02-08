<template>
  <div :class="{ inc: cellData.data.change > 0, dec: cellData.data.change < 0 }">
    <span>{{ cellData.text }}</span>
  </div>
</template>

<script setup lang="ts">
import { DxDataGridTypes } from 'devextreme-vue/data-grid';

defineProps<{
  cellData: DxDataGridTypes.ColumnCellTemplateData
}>();
</script>
