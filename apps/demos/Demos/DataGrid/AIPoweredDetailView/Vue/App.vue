<template>
  <DxDataGrid
    key-expr="ID"
    :data-source="vehicles"
    :show-borders="true"
    :height="500"
    @row-expanding="onRowExpanding"
    @cell-click="onCellClick"
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
      data-field="Model"
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
        ref="detailViewRef"
        :row-data="vehicle"
      />
    </template>
  </DxDataGrid>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DxDataGrid, DxColumn, DxPaging, DxMasterDetail, type DxDataGridTypes } from 'devextreme-vue/data-grid';
import { vehicles, type Vehicle } from './data.ts';
import Category from './Category.vue';
import DetailView from './DetailView.vue';

const detailViewRef = ref<{ abortRequest: () => void } | null>(null);

function onRowExpanding({ component }: DxDataGridTypes.RowExpandingEvent) {
  detailViewRef.value?.abortRequest();
  component.collapseAll(-1);
}

function onCellClick({ column, row, component, key }: DxDataGridTypes.CellClickEvent) {
  if (column.type === 'detailExpand' && row.rowType === 'data') {
    if (row.isExpanded) {
      detailViewRef.value?.abortRequest();
      component.collapseRow(key);
    } else {
      component.expandRow(key);
    }
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
