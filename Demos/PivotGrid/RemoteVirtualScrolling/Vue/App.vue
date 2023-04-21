<template>
  <div>
    <div class="long-title">
      <h3>Sales Statistics</h3>
    </div>
    <DxPivotGrid
      :allow-sorting="true"
      :allow-filtering="true"
      :height="570"
      :show-borders="true"
      :data-source="dataSource"
    >
      <DxFieldPanel
        :visible="true"
        :show-filter-fields="false"
      />
      <DxFieldChooser
        :allow-search="true"
      />
      <DxHeaderFilter>
        <DxSearch :enabled="true"/>
      </DxHeaderFilter>
      <DxScrolling
        mode="virtual"
      />
    </DxPivotGrid>
  </div>
</template>
<script>
import DxPivotGrid, {
  DxFieldPanel,
  DxFieldChooser,
  DxHeaderFilter,
  DxSearch,
  DxScrolling,
} from 'devextreme-vue/pivot-grid';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import XmlaStore from 'devextreme/ui/pivot_grid/xmla_store';

export default {
  components: {
    DxPivotGrid,
    DxFieldPanel,
    DxFieldChooser,
    DxHeaderFilter,
    DxSearch,
    DxScrolling,
  },
  data() {
    return {
      dataSource: new PivotGridDataSource({
        paginate: true,
        fields: [
          { dataField: '[Customer].[Customer]', area: 'row' },
          { dataField: '[Ship Date].[Calendar Year]', area: 'column' },
          { dataField: '[Ship Date].[Month of Year]', area: 'column' },
          { dataField: '[Measures].[Internet Sales Amount]', area: 'data' },
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
