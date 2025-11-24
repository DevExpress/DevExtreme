<template>
  <DxDataGrid
    :data-source="sales"
    key-expr="Id"
    :allow-column-reordering="true"
    :row-alternation-enabled="true"
    :show-borders="true"
    :width="'100%'"
    @content-ready="onContentReady"
  >
    <DxColumn
      :group-index="0"
      data-field="Product"
    />
    <DxColumn
      data-field="Amount"
      caption="Sale Amount"
      data-type="number"
      format="currency"
      alignment="right"
    />
    <DxColumn
      :allow-grouping="false"
      data-field="Discount"
      caption="Discount %"
      data-type="number"
      format="percent"
      alignment="right"
      cell-template="discountCellTemplate"
      css-class="bullet"
    />
    <DxColumn
      data-field="SaleDate"
      data-type="date"
    />
    <DxColumn
      data-field="Region"
      data-type="string"
    />
    <DxColumn
      data-field="Sector"
      data-type="string"
    />
    <DxColumn
      data-field="Channel"
      data-type="string"
    />
    <DxColumn
      :width="150"
      data-field="Customer"
      data-type="string"
    />

    <DxGroupPanel :visible="true"/>
    <DxSearchPanel
      :visible="true"
      :highlight-case-sensitive="true"
    />
    <DxGrouping :auto-expand-all="false"/>
    <DxPager
      :visible="true"
      :allowed-page-sizes="pageSizes"
      :show-page-size-selector="true"
    />
    <DxPaging :page-size="10"/>
    <template #discountCellTemplate="{ data: cellData }">
      <DiscountCell :cell-data="cellData"/>
    </template>
  </DxDataGrid>
</template>
<script setup lang="ts">
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import DiscountCell from './DiscountCell.vue';
import { sales } from './data.ts';

const pageSizes = [10, 25, 50, 100];

let collapsed = false;

const onContentReady = (e: DxDataGridTypes.ContentReadyEvent) => {
  if (!collapsed) {
    e.component.expandRow(['EnviroCare']);
    collapsed = true;
  }
};
</script>
