<template>
  <DxDataGrid
    id="grid"
    :data-source="dataSource"
    key-expr="OrderNumber"
    :show-borders="true"
  />
</template>
<script>

import DxDataGrid from 'devextreme-vue/data-grid';
import { orders } from './data.js';

export default {
  components: {
    DxDataGrid
  },
  data() {
    return {
      dataSource: orders
    };
  }
};
</script>
<style>
   #grid{
    height: 440px;
}
</style>
