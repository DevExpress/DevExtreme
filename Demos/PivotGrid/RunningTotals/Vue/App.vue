<template>
  <div>
    <DxPivotGrid
      id="sales"
      :allow-sorting-by-summary="true"
      :allow-sorting="true"
      :allow-filtering="true"
      :allow-expand-all="true"
      :show-borders="true"
      :data-source="dataSource"
      :show-column-totals="false"
      show-totals-prior="rows"
    >
      <DxFieldChooser :enabled="false"/>
      <DxScrolling mode="virtual"/>
    </DxPivotGrid>
  </div>
</template>
<script setup lang="ts">
import DxPivotGrid, {
  DxFieldChooser,
  DxScrolling,
} from 'devextreme-vue/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import sales from './data.js';

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    width: 120,
    dataField: 'region',
    area: 'row',
  }, {
    caption: 'City',
    dataField: 'city',
    width: 150,
    area: 'row',
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column',
  }, {
    groupName: 'date',
    groupInterval: 'year',
    expanded: true,
  }, {
    groupName: 'date',
    groupInterval: 'quarter',
    expanded: true,
  }, {
    groupName: 'date',
    groupInterval: 'month',
    visible: false,
  }, {
    caption: 'Total',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
  }, {
    caption: 'Running Total',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
    runningTotal: 'row',
    allowCrossGroupCalculation: true,
  }],
  store: sales,
});
</script>
<style scoped>
#sales {
  margin: 20px 0;
}
</style>
