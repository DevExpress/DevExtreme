<template>
  <DxDataGrid
    id="gridContainer"
    :customize-columns="customizeColumns"
    :data-source="dataSource"
    key-expr="id"
    :show-borders="true"
  >
    <DxLoadPanel :enabled="false"/>
    <DxScrolling mode="infinite"/>
    <DxSorting mode="none"/>
  </DxDataGrid>
</template>
<script>
import { DxDataGrid, DxScrolling, DxSorting, DxLoadPanel } from 'devextreme-vue/data-grid';
import { generateData } from './data.js';

export default {
  components: {
    DxDataGrid,
    DxScrolling,
    DxSorting,
    DxLoadPanel
  },
  computed: {
    dataSource() {
      return generateData(100000);
    }
  },
  methods: {
    customizeColumns(columns) {
      columns[0].width = 70;
    }
  }
};
</script>
<style>
#gridContainer {
    height: 440px;
}
</style>
