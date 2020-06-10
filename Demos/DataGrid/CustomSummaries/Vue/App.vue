<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="orders"
      :show-borders="true"
      :selected-row-keys="[1, 4, 7]"
      key-expr="ID"
      @selection-changed="onSelectionChanged"
    >
      <DxPaging :enabled="false"/>
      <DxSelection mode="multiple"/>
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
      <DxSummary :calculate-custom-summary="calculateSelectedRow">
        <DxTotalItem
          name="SelectedRowsSummary"
          summary-type="custom"
          value-format="currency"
          display-format="Sum: {0}"
          show-in-column="SaleAmount"
        />
      </DxSummary>
    </DxDataGrid>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxSelection,
  DxSummary,
  DxTotalItem
} from 'devextreme-vue/data-grid';

import service from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxSelection,
    DxSummary,
    DxTotalItem
  },
  data() {
    return {
      orders: service.getOrders()
    };
  },
  methods: {
    calculateSelectedRow(options) {
      if (options.name === 'SelectedRowsSummary') {
        if (options.summaryProcess === 'start') {
          options.totalValue = 0;
        } else if (options.summaryProcess === 'calculate') {
          if (options.component.isRowSelected(options.value.ID)) {
            options.totalValue = options.totalValue + options.value.SaleAmount;
          }
        }
      }
    },
    onSelectionChanged(e) {
      e.component.refresh(true);
    }
  }
};
</script>
<style scoped>
#gridContainer {
    height: 440px;
    margin-bottom: 10px;
}
</style>
