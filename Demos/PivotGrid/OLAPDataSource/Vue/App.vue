<template>
  <div>
    <div class="long-title">
      <h3>Sales Statistics</h3>
    </div>
    <DxPivotGrid
      :allow-sorting-by-summary="true"
      :allow-sorting="true"
      :allow-filtering="true"
      :allow-expand-all="true"
      :height="570"
      :show-borders="true"
      :data-source="dataSource"
    >
      <DxFieldChooser
        :enabled="true"
        :allow-search="true"
      />
    </DxPivotGrid>
  </div>
</template>
<script>
import DxPivotGrid, {
  DxExport,
  DxFieldChooser,
} from 'devextreme-vue/pivot-grid';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import XmlaStore from 'devextreme/ui/pivot_grid/xmla_store';

export default {
  components: {
    DxPivotGrid,
    DxExport,
    DxFieldChooser,
  },
  data() {
    return {
      dataSource: new PivotGridDataSource({
        fields: [
          { dataField: '[Product].[Category]', area: 'row' },
          {
            dataField: '[Product].[Subcategory]',
            area: 'row',
            headerFilter: {
              search: {
                enabled: true,
              },
            },
          },
          { dataField: '[Ship Date].[Calendar Year]', area: 'column' },
          { dataField: '[Ship Date].[Month of Year]', area: 'column' },
          { dataField: '[Measures].[Reseller Freight Cost]', area: 'data', format: 'currency' },
        ],
        store: new XmlaStore({
          type: 'xmla',
          url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
          catalog: 'Adventure Works DW Standard Edition',
          cube: 'Adventure Works',
        }),
      }),
    };
  },
};
</script>
<style scoped>
.long-title h3 {
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
  margin-bottom: 20px;
}
</style>
