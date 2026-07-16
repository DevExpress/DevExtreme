<template>
  <div>
    <div class="long-title">
      <h2>Sales Amount by Region</h2>
    </div>
    <DxPivotGrid
      id="sales"
      :allow-sorting-by-summary="true"
      :allow-sorting="true"
      :allow-filtering="true"
      :allow-expand-all="true"
      :height="440"
      :show-borders="true"
      :data-source="dataSource"
    >
      <DxFieldChooser :enabled="false"/>
    </DxPivotGrid>
  </div>
</template>
<script setup lang="ts">
import DxPivotGrid, {
  DxFieldChooser,
} from 'devextreme-vue/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
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
      selector(data: Record<string, unknown>) {
        return `${data.city} (${data.country})`;
      },
    },
    {
      dataField: 'date',
      dataType: 'date',
      area: 'column',
    },
    {
      caption: 'Sales',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
    },
  ],
  store: sales,
});
</script>
<style scoped>
#sales {
  margin-top: 80px;
}

.long-title h2 {
  font-family:
    "Segoe UI Light",
    "Helvetica Neue Light",
    "Segoe UI",
    "Helvetica Neue",
    "Trebuchet MS",
    Verdana;
  font-weight: 200;
  font-size: 28px;
  text-align: center;
  margin: 28px 0 20px;
}
</style>
