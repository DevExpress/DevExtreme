<template>
  <DxDataGrid
    id="gridContainer"
    :data-source="dataSource"
    key-expr="field1"
    :show-borders="true"
    :column-width="100"
  >
    <DxPaging :enabled="false"/>
    <DxScrolling column-rendering-mode="virtual"/>
  </DxDataGrid>
</template>
<script>
import { DxDataGrid, DxScrolling, DxPaging } from 'devextreme-vue/data-grid';
import { generateData } from './data.js';

export default {
  components: {
    DxDataGrid,
    DxScrolling,
    DxPaging
  },
  computed: {
    dataSource() {
      return generateData(50, 500);
    }
  }
};
</script>
<style>
#gridContainer {
    height: 440px;
}
</style>
