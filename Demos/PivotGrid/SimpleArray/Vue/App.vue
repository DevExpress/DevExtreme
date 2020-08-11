<template>
  <div>
    <div class="long-title">
      <h3>Sales Amount by Region</h3>
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
<script>
import DxPivotGrid, {
  DxExport,
  DxFieldChooser
} from 'devextreme-vue/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import { sales } from './data.js';

export default {
  components: {
    DxPivotGrid,
    DxExport,
    DxFieldChooser
  },
  data() {
    return {
      dataSource: new PivotGridDataSource({
        fields: [
          {
            caption: 'Region',
            width: 120,
            dataField: 'region',
            area: 'row'
          },
          {
            caption: 'City',
            dataField: 'city',
            width: 150,
            area: 'row',
            selector: function(data) {
              return `${data.city } (${ data.country })`;
            }
          },
          {
            dataField: 'date',
            dataType: 'date',
            area: 'column'
          },
          {
            caption: 'Sales',
            dataField: 'amount',
            dataType: 'number',
            summaryType: 'sum',
            format: 'currency',
            area: 'data'
          }
        ],
        store: sales
      })
    };
  }
};
</script>
<style scoped>
#sales {
  margin-top: 80px;
}

.long-title h3 {
  font-family: "Segoe UI Light", "Helvetica Neue Light", "Segoe UI",
    "Helvetica Neue", "Trebuchet MS", Verdana;
  font-weight: 200;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
