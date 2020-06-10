<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="orders"
      :show-borders="true"
      key-expr="ID"
    >
      <DxSelection mode="single"/>
      <DxColumn
        :width="130"
        data-field="OrderNumber"
        caption="Invoice Number"
      />
      <DxColumn
        :width="160"
        data-field="OrderDate"
        data-type="date"
      />
      <DxColumn
        :group-index="0"
        data-field="Employee"
      />
      <DxColumn
        data-field="CustomerStoreCity"
        caption="City"
      />
      <DxColumn
        data-field="CustomerStoreState"
        caption="State"
      />
      <DxColumn
        data-field="SaleAmount"
        alignment="right"
        format="currency"
      />
      <DxColumn
        data-field="TotalAmount"
        alignment="right"
        format="currency"
      />

      <DxSummary>
        <DxGroupItem
          column="OrderNumber"
          summary-type="count"
          display-format="{0} orders"
        />
        <DxGroupItem
          :show-in-group-footer="false"
          :align-by-column="true"
          column="SaleAmount"
          summary-type="max"
          value-format="currency"
        />
        <DxGroupItem
          :show-in-group-footer="false"
          :align-by-column="true"
          column="TotalAmount"
          summary-type="max"
          value-format="currency"
        />
        <DxGroupItem
          :show-in-group-footer="true"
          column="TotalAmount"
          summary-type="sum"
          value-format="currency"
          display-format="Total: {0}"
        />
      </DxSummary>
      <DxSortByGroupSummaryInfo summary-item="count"/>
    </DxDataGrid>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxSelection,
  DxSummary,
  DxGroupItem,
  DxSortByGroupSummaryInfo
} from 'devextreme-vue/data-grid';

import service from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSelection,
    DxSummary,
    DxGroupItem,
    DxSortByGroupSummaryInfo
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
