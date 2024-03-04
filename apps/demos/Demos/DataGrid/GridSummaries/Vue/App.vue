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
        :width="160"
        data-field="SaleAmount"
        alignment="right"
        format="currency"
      />
      <DxSummary>
        <DxTotalItem
          column="OrderNumber"
          summary-type="count"
        />
        <DxTotalItem
          :customize-text="customizeDate"
          column="OrderDate"
          summary-type="min"
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
<script setup lang="ts">
import {
  DxDataGrid,
  DxColumn,
  DxSelection,
  DxSummary,
  DxTotalItem, DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import { formatDate } from 'devextreme/localization';
import { orders } from './data.ts';

const customizeDate = (itemInfo: DxDataGridTypes.SummaryItemTextInfo) => `First: ${formatDate(itemInfo.value as Date, 'MMM dd, yyyy')}`;
</script>
<style scoped>
#gridContainer {
  height: 440px;
}
</style>
