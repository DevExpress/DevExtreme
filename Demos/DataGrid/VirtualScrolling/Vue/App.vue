<template>
  <DxDataGrid
    id="gridContainer"
    :customize-columns="customizeColumns"
    :data-source="dataSource"
    key-expr="id"
    :show-borders="true"
    @content-ready="onContentReady"
  >
    <DxLoadPanel :enabled="true"/>
    <DxScrolling mode="virtual"/>
    <DxSorting mode="none"/>
  </DxDataGrid>
</template>
<script setup lang="ts">
import {
  DxDataGrid, DxScrolling, DxSorting, DxLoadPanel,
} from 'devextreme-vue/data-grid';
import { Column, ContentReadyEvent } from 'devextreme/ui/data_grid';
import { generateData } from './data.ts';

const dataSource = generateData(100000);

const onContentReady = (e: ContentReadyEvent) => {
  e.component.option('loadPanel.enabled', false);
};

const customizeColumns = (columns: Column[]) => {
  columns[0].width = 70;
};
</script>
<style>
#gridContainer {
  height: 440px;
}
</style>
