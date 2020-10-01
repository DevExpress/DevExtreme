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
    >
      <DxDataGrid
        :ref="dataGridRefName"
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
<script>
import { DxPivotGrid, DxFieldChooser } from 'devextreme-vue/pivot-grid';
import { DxPopup } from 'devextreme-vue/popup';
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import { sales } from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxPivotGrid,
    DxFieldChooser,
    DxPopup
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
            area: 'row'
          },
          {
            dataField: 'date',
            dataType: 'date',
            area: 'column'
          },
          {
            caption: 'Total',
            dataField: 'amount',
            dataType: 'number',
            summaryType: 'sum',
            format: 'currency',
            area: 'data'
          }
        ],
        store: sales
      }),
      dataGridRefName: 'dataGrid',
      drillDownDataSource: null,
      popupTitle: '',
      popupVisible: false
    };
  },
  computed: {
    dataGrid: function() {
      return this.$refs[this.dataGridRefName].instance;
    }
  },
  methods: {
    onCellClick(e) {
      if (e.area == 'data') {
        var pivotGridDataSource = e.component.getDataSource(),
          rowPathLength = e.cell.rowPath.length,
          rowPathName = e.cell.rowPath[rowPathLength - 1];
        this.drillDownDataSource = pivotGridDataSource.createDrillDownDataSource(e.cell);
        this.popupTitle = `${
          rowPathName ? rowPathName : 'Total'
        } Drill Down Data`;
        this.popupVisible = !this.popupVisible;
      }
    },
    onShown() {
      this.dataGrid.updateDimensions();
    }
  }
};
</script>
<style scoped>
#sales {
  margin: 20px 0;
}
</style>
