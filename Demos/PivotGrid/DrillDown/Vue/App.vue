<template>
  <div>
    <DxPivotGrid
      id="sales"
      :data-source="dataSource"
      :allow-sorting-by-summary="true"
      :allow-sorting="true"
      :allow-filtering="true"
      :allow-expand-all="true"
      :show-borders="true"
      @cell-click="onCellClick"
    >
      <DxFieldChooser :enabled="false"/>
    </DxPivotGrid>
    <DxPopup
      :width="600"
      :height="400"
      :title="popupTitle"
      v-model:visible="popupVisible"
      @shown="onShown"
      :show-close-button="true"
    >
      <DxDataGrid
        :ref="dataGridRef"
        :width="560"
        :height="300"
        :data-source="drillDownDataSource"
      >
        <DxColumn data-field="region"/>
        <DxColumn data-field="city"/>
        <DxColumn
          data-field="amount"
          data-type="number"
          format="currency"
        />
        <DxColumn
          data-field="date"
          data-type="date"
        />
      </DxDataGrid>
    </DxPopup>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxPivotGrid, DxFieldChooser, DxPivotGridTypes } from 'devextreme-vue/pivot-grid';
import { DxPopup } from 'devextreme-vue/popup';
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import DataSource from 'devextreme/data/data_source';
import { sales } from './data.ts';

const dataSource = new PivotGridDataSource({
  fields: [
    {
      caption: 'Region',
      width: 120,
      dataField: 'region',
      area: 'row',
    },
    {
      caption: 'City',
      dataField: 'city',
      width: 150,
      area: 'row',
    },
    {
      dataField: 'date',
      dataType: 'date',
      area: 'column',
    },
    {
      caption: 'Total',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
    },
  ],
  store: sales,
});
const dataGridRef = ref<DxDataGrid>();
const drillDownDataSource = ref<DataSource>(null);
const popupTitle = ref('');
const popupVisible = ref(false);

function onCellClick(e: DxPivotGridTypes.CellClickEvent) {
  if (e.area === 'data') {
    const pivotGridDataSource = e.component.getDataSource();
    const rowPathLength = e.cell.rowPath.length;
    const rowPathName = e.cell.rowPath[rowPathLength - 1];
    drillDownDataSource.value = pivotGridDataSource.createDrillDownDataSource(e.cell);
    popupTitle.value = `${
      rowPathName || 'Total'
    } Drill Down Data`;
    popupVisible.value = !popupVisible.value;
  }
}
function onShown() {
  dataGridRef.value?.instance?.updateDimensions();
}
</script>
<style scoped>
#sales {
  margin: 20px 0;
}
</style>
