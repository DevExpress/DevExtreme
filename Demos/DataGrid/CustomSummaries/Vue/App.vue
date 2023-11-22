<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="orders"
      :show-borders="true"
      :selected-row-keys="selectedRowKeys"
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
        :width="160"
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
<script setup lang="ts">
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxSelection,
  DxSummary,
  DxTotalItem,
  DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import { orders } from './data.ts';

const selectedRowKeys = [1, 4, 7];

const calculateSelectedRow = (options: DxDataGridTypes.CustomSummaryInfo) => {
  if (options.name === 'SelectedRowsSummary') {
    if (options.summaryProcess === 'start') {
      options.totalValue = 0;
    }

    const isRowSelected = options.component.isRowSelected(options.value?.ID);

    if (options.summaryProcess === 'calculate' && isRowSelected) {
      options.totalValue += options.value.SaleAmount;
    }
  }
};

const onSelectionChanged = (e: DxDataGridTypes.SelectionChangedEvent) => {
  e.component.refresh(true);
};
</script>
<style scoped>
#gridContainer {
  height: 440px;
  margin-bottom: 10px;
}
</style>
