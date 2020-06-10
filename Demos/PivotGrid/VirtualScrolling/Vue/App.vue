<template>
  <div>
    <DxPivotGrid
      id="sales"
      :allow-sorting-by-summary="true"
      :allow-sorting="true"
      :allow-filtering="true"
      :allow-expand-all="true"
      :height="560"
      :show-borders="true"
      :data-source="dataSource"
    >
      <DxFieldChooser :enabled="false"/>
      <DxScrolling mode="virtual"/>
    </DxPivotGrid>
  </div>
</template>
<script>
import DxPivotGrid, {
  DxFieldChooser,
  DxScrolling
} from 'devextreme-vue/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import sales from './data.js';

export default {
  components: {
    DxPivotGrid,
    DxFieldChooser,
    DxScrolling
  },
  data() {
    return {
      dataSource: new PivotGridDataSource({
        fields: [{
          caption: 'Region',
          width: 120,
          dataField: 'region',
          area: 'row',
          expanded: true
        }, {
          caption: 'City',
          dataField: 'city',
          width: 150,
          area: 'row'
        }, {
          dataField: 'date',
          dataType: 'date',
          area: 'column'
        }, {
          groupName: 'date',
          groupInterval: 'year',
          expanded: true
        }, {
          groupName: 'date',
          groupInterval: 'quarter',
          expanded: true
        }, {
          caption: 'Total',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data'
        }],
        store: sales
      })
    };
  }
};
</script>
