<template>
  <div>
    <div class="desc-container">
      Right-click (or&nbsp;touch and hold) the "Relative Sales" field
      and select an&nbsp;item from the appeared context menu to&nbsp;change the
      <b>"summaryDisplayMode"</b> option.
    </div>
    <DxPivotGrid
      id="sales"
      :allow-sorting-by-summary="true"
      :allow-sorting="true"
      :allow-expand-all="true"
      :show-borders="true"
      :data-source="dataSource"
      :on-context-menu-preparing="onContextMenuPreparing"
    >
      <DxFieldChooser :enabled="false"/>
      <DxFieldPanel
        :show-filter-fields="false"
        :allow-field-dragging="false"
        :visible="true"
      />
    </DxPivotGrid>
  </div>
</template>
<script>
import DxPivotGrid, {
  DxFieldChooser,
  DxFieldPanel
} from 'devextreme-vue/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import sales from './data.js';

export default {
  components: {
    DxPivotGrid,
    DxFieldChooser,
    DxFieldPanel
  },
  data() {
    return {
      allowCrossGroupCalculation: true,
      summaryDisplayModes: [
        { text: 'None', value: 'none' },
        { text: 'Absolute Variation', value: 'absoluteVariation' },
        { text: 'Percent Variation', value: 'percentVariation' },
        { text: 'Percent of Column Total', value: 'percentOfColumnTotal' },
        { text: 'Percent of Row Total', value: 'percentOfRowTotal' },
        { text: 'Percent of Column Grand Total', value: 'percentOfColumnGrandTotal' },
        { text: 'Percent of Row Grand Total', value: 'percentOfRowGrandTotal' },
        { text: 'Percent of Grand Total', value: 'percentOfGrandTotal' }
      ],
      dataSource: new PivotGridDataSource({
        fields: [{
          caption: 'Region',
          width: 120,
          dataField: 'region',
          area: 'row'
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
          caption: 'Relative Sales',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          area: 'data',
          summaryDisplayMode: 'percentOfColumnGrandTotal'
        }],
        store: sales
      })
    };
  },
  methods: {
    onContextMenuPreparing(e) {
      if(e.field && e.field.dataField === 'amount') {
        this.summaryDisplayModes.forEach(mode => {
          e.items.push({
            text: mode.text,
            selected: e.field.summaryDisplayMode === mode.value,
            onItemClick: () => {
              var format,
                caption = mode.value === 'none' ? 'Total Sales' : 'Relative Sales';
              if (mode.value === 'none'
                  || mode.value === 'absoluteVariation') {
                format = 'currency';
              }
              this.dataSource.field(e.field.index, {
                summaryDisplayMode: mode.value,
                format: format,
                caption: caption
              });

              this.dataSource.load();
            }
          });

        });
      }
    }
  },
};
</script>
<style scoped>
.desc-container {
    margin-bottom: 10px;
}
</style>
