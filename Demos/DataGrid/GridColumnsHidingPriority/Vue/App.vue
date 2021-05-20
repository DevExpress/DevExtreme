<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="dataSource"
      key-expr="ID"
      :column-hiding-enabled="true"
      :show-borders="true"
    >
      <DxColumn
        :width="130"
        data-field="OrderNumber"
        caption="Invoice Number"
      />
      <DxColumn
        :hiding-priority="0"
        data-field="CustomerStoreCity"
        caption="City"
      />
      <DxColumn
        :hiding-priority="1"
        data-field="CustomerStoreState"
        caption="State"
      />
      <DxColumn data-field="Employee"/>
      <DxColumn
        :hiding-priority="2"
        data-field="OrderDate"
        data-type="date"
      />
      <DxColumn
        data-field="SaleAmount"
        format="currency"
      />
    </DxDataGrid>
  </div>
</template>
<script>
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';
import service from './data.js';

export default {
  components: {
    DxDataGrid, DxColumn
  },
  data() {
    return {
      dataSource: service.getOrders()
    };
  }
};
</script>
<style scoped>
#gridContainer {
  padding: 10px;
}
</style>
