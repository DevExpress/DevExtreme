<template>
  <div>
    <DxPivotGrid
      id="sales"
      :show-totals-prior="showTotalsPrior"
      :data-field-area="dataFieldArea"
      :row-header-layout="rowHeaderLayout"
      :word-wrap-enabled="false"
      :data-source="dataSource"
      :show-borders="true"
      :height="440"
    >
      <DxFieldChooser :height="500"/>
    </DxPivotGrid>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          id="show-totals-prior"
          :value="false"
          :on-value-changed="onShowTotalsPriorChanged"
          text="Show Totals Prior"
        />
      </div>
      <div class="option">
        <DxCheckBox
          id="data-field-area"
          :value="false"
          :on-value-changed="onDataFieldAreaChanged"
          text="Data Field Headers in Rows"
        />
      </div>
      <div class="option">
        <DxCheckBox
          id="row-header-layout"
          :value="true"
          :on-value-changed="onRowHeaderLayoutChanged"
          text="Tree Row Header Layout"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DxPivotGrid, {
  DxExport,
  DxFieldChooser,
  DxScrolling
} from 'devextreme-vue/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import DxCheckBox from 'devextreme-vue/check-box';

import sales from './data.js';

export default {
  components: {
    DxPivotGrid,
    DxExport,
    DxFieldChooser,
    DxScrolling,
    DxCheckBox
  },
  data() {
    return {
      showTotalsPrior: 'none',
      dataFieldArea: 'column',
      rowHeaderLayout: 'tree',
      dataSource: new PivotGridDataSource({
        fields: [{
          caption: 'Region',
          dataField: 'region',
          expanded: true,
          area: 'row'
        }, {
          caption: 'Country',
          dataField: 'country',
          expanded: true,
          area: 'row'
        }, {
          caption: 'City',
          dataField: 'city',
          area: 'row'
        }, {
          dataField: 'date',
          dataType: 'date',
          area: 'column'
        }, {
          caption: 'Sales',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data'
        }, {
          caption: 'Percent',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          summaryDisplayMode: 'percentOfRowGrandTotal',
          area: 'data'
        }],
        store: sales
      })
    };
  },
  methods: {
    onShowTotalsPriorChanged(data) {
      this.showTotalsPrior = data.value ? 'both' : 'none';
    },

    onDataFieldAreaChanged(data) {
      this.dataFieldArea = data.value ? 'row' : 'column';
    },

    onRowHeaderLayoutChanged(data) {
      this.rowHeaderLayout = data.value ? 'tree' : 'standard';
    }
  },
};
</script>
<style scoped>
.options {
    padding: 20px;
    margin-top: 20px;
    background-color: rgba(191, 191, 191, 0.15);
}

.caption {
    font-size: 18px;
    font-weight: 500;
}

.option:last-child {
  margin-right: 0;
}

.option {
    width: 33%;
    display: inline-block;
    margin-top: 10px;
    margin-right: 4px;
}
</style>
