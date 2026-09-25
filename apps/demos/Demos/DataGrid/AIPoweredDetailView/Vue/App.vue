<template>
  <DxDataGrid
    key-expr="ID"
    :data-source="vehicles"
    :show-borders="true"
    :height="500"
    @row-expanding="onRowExpanding"
    @row-collapsing="onRowCollapsing"
    @cell-click="onCellClick"
    @cell-prepared="onCellPrepared"
  >
    <DxPaging :page-size="10"/>

    <DxColumn
      type="detailExpand"
      cell-template="detail-expand-cell"
    />
    <template #detail-expand-cell>
      <div class="dx-icon-sparkle"/>
    </template>
    <DxColumn
      caption="Model"
      :calculate-cell-value="calculateModel"
    />
    <DxColumn
      data-field="Price"
      format="currency"
      alignment="left"
    />
    <DxColumn
      caption="Category"
      :min-width="180"
      cell-template="category-cell"
    />
    <template #category-cell="{ data: { data: vehicle } }">
      <Category
        :id="vehicle.CategoryID"
        :name="vehicle.CategoryName"
      />
    </template>
    <DxColumn data-field="Modification"/>
    <DxColumn data-field="Horsepower"/>
    <DxColumn
      data-field="BodyStyleName"
      caption="Body Style"
    />

    <DxMasterDetail
      :enabled="true"
      template="master-detail"
    />
    <template #master-detail="{ data: { data: vehicle } }">
      <DetailView
        :row-data="vehicle"
        :register-abort-request="registerAbortRequest"
        :unregister-abort-request="unregisterAbortRequest"
      />
    </template>
  </DxDataGrid>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formatMessage } from 'devextreme/localization';
import { DxDataGrid, DxColumn, DxPaging, DxMasterDetail, type DxDataGridTypes } from 'devextreme-vue/data-grid';
import { vehicles } from './data.ts';
import type { AbortRequest, Vehicle } from './types.ts';
import Category from './Category.vue';
import DetailView from './DetailView.vue';

const activeAbortRequest = ref<AbortRequest | null>(null);

function registerAbortRequest(abortRequest: AbortRequest) {
  activeAbortRequest.value = abortRequest;
}

function unregisterAbortRequest(abortRequest: AbortRequest) {
  if (activeAbortRequest.value === abortRequest) {
    activeAbortRequest.value = null;
  }
}

function onRowExpanding({ component }: DxDataGridTypes.RowExpandingEvent) {
  component.collapseAll(-1);
}

function onRowCollapsing() {
  activeAbortRequest.value?.();
  activeAbortRequest.value = null;
}

function onCellClick({ column, row, rowType, component, key }: DxDataGridTypes.CellClickEvent) {
  if (column.type === 'detailExpand' && rowType === 'data') {
    if (row.isExpanded) {
      component.collapseRow(key);
    } else {
      component.expandRow(key);
    }
  }
}

function onCellPrepared({ rowType, column, cellElement, row }: DxDataGridTypes.CellPreparedEvent) {
  if (rowType === 'data' && column.type === 'detailExpand') {
    const ariaLabelCollapse = formatMessage('dxDataGrid-ariaCollapse');
    const ariaLabelExpand = formatMessage('dxDataGrid-ariaExpand');
    const ariaLabel = row.isExpanded ? ariaLabelCollapse : ariaLabelExpand;
    cellElement.setAttribute('aria-label', ariaLabel);
  }
}

function calculateModel(data: Vehicle) {
  return `${data.TrademarkName} ${data.Name}`;
}
</script>

<style>
.demo-container {
  margin: 20px;
}

.dx-command-expand .dx-icon-sparkle {
  cursor: pointer;
  text-align: center;
  font-size: var(--dx-font-size-icon);
  color: var(--dx-color-primary);
}

.dx-master-detail-cell {
  background-color: unset !important;
}
</style>
