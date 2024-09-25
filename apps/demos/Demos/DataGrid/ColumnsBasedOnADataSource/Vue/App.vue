<template>
  <DxDataGrid
    id="grid"
    :data-source="orders"
    key-expr="OrderNumber"
    :show-borders="true"
  >
    <DxPager :visible="true"/>
  </DxDataGrid>
</template>
<script setup lang="ts">
import { DxDataGrid, DxPager } from 'devextreme-vue/data-grid';
import { orders } from './data.ts';

</script>
<style>
#grid {
  height: 440px;
}
</style>
