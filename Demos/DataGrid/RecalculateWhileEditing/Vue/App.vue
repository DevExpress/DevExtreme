<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="orders"
      :show-borders="true"
      :repaint-changes-only="true"
      key-expr="ID"
    >
      <DxEditing
        :allow-adding="true"
        :allow-updating="true"
        :allow-deleting="true"
        mode="batch"
      />

      <DxColumn
        :width="130"
        data-field="OrderNumber"
        caption="Invoice Number"
      />
      <DxColumn
        data-field="OrderDate"
        data-type="date"
      />
      <DxColumn data-field="Employee"/>
      <DxColumn
        data-field="CustomerStoreCity"
        caption="City"
      />
      <DxColumn
        data-field="CustomerStoreState"
        caption="State"
      />
      <DxColumn
        :editor-options="{ format: 'currency' }"
        data-field="SaleAmount"
        alignment="right"
        format="currency"
      />
      <DxSummary :recalculate-while-editing="true">
        <DxTotalItem
          column="OrderNumber"
          summary-type="count"
        />
        <DxTotalItem
          column="SaleAmount"
          summary-type="sum"
          value-format="currency"
        />
      </DxSummary>
    </DxDataGrid>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxSummary,
  DxTotalItem
} from 'devextreme-vue/data-grid';

import service from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxSummary,
    DxTotalItem
  },
  data() {
    return {
      orders: service.getOrders()
    };
  }
};
</script>
<style scoped>
#gridContainer {
    height: 440px;
}
</style>
