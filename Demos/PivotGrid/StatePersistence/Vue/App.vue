<template>
  <div id="pivotgrid-demo">
    <div class="desc-container">Expand, filter, sort and perform other operations on&nbsp;the PivotGrid&rsquo;s columns and rows.
      <a @click="onRefreshClick">Refresh</a>
      the web page and note that the PivotGrid&rsquo;s state is&nbsp;automatically persisted.
    </div>
    <DxButton
      id="reset"
      text="Reset the PivotGrid's State"
      @click="() => dataSource.state({})"
    />
    <DxPivotGrid
      id="sales"
      :allow-sorting-by-summary="true"
      :allow-sorting="true"
      :allow-filtering="true"
      :allow-expand-all="true"
      :height="570"
      :show-borders="true"
      :data-source="dataSource"
      :on-context-menu-preparing="onContextMenuPreparing"
    >
      <DxFieldChooser :enabled="true"/>
      <DxFieldPanel :visible="true"/>
      <DxStateStoring
        :enabled="true"
        type="localStorage"
        storage-key="dx-widget-gallery-pivotgrid-storing"
      />
    </DxPivotGrid>
  </div>
</template>
<script>
import DxPivotGrid, {
  DxFieldChooser,
  DxFieldPanel,
  DxStateStoring
} from 'devextreme-vue/pivot-grid';
import DxButton from 'devextreme-vue/button';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import sales from './data.js';

export default {
  components: {
    DxPivotGrid,
    DxFieldChooser,
    DxFieldPanel,
    DxStateStoring,
    DxButton
  },
  data() {
    return {
      showColumnFields: true,
      showDataFields: true,
      showFilterFields: true,
      showRowFields: true,
      allowCrossGroupCalculation: true,
      dataSource: new PivotGridDataSource({
        fields: [{
          caption: 'Region',
          width: 120,
          dataField: 'region',
          area: 'row',
          sortBySummaryField: 'sales'
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
          groupInterval: 'year'
        }, {
          groupName: 'date',
          groupInterval: 'quarter'
        }, {
          dataField: 'sales',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data'
        }],
        store: sales
      })
    };
  },
  methods: {
    onRefreshClick() {
      window.location.reload();
    },
    onContextMenuPreparing(e) {
      var dataSource = e.component.getDataSource(),
        sourceField = e.field;

      if (sourceField) {
        if(!sourceField.groupName || sourceField.groupIndex === 0) {
          e.items.push({
            text: 'Hide field',
            onItemClick: function() {
              var fieldIndex;
              if(sourceField.groupName) {
                fieldIndex = dataSource.getAreaFields(sourceField.area, true)[sourceField.areaIndex].index;
              } else {
                fieldIndex = sourceField.index;
              }

              dataSource.field(fieldIndex, {
                area: null
              });
              dataSource.load();
            }
          });
        }

        if (sourceField.dataType === 'number') {
          var setSummaryType = function(args) {
              dataSource.field(sourceField.index, {
                summaryType: args.itemData.value
              });

              dataSource.load();
            },
            menuItems = [];

          e.items.push({ text: 'Summary Type', items: menuItems });

          ['Sum', 'Avg', 'Min', 'Max'].forEach(summaryType => {
            var summaryTypeValue = summaryType.toLowerCase();

            menuItems.push({
              text: summaryType,
              value: summaryType.toLowerCase(),
              onItemClick: setSummaryType,
              selected: e.field.summaryType === summaryTypeValue
            });
          });
        }
      }
    }
  },
};
</script>
<style scoped>
#pivotgrid-demo > .dx-button {
    margin: 10px 0;
}

#pivotgrid-demo .desc-container a {
    color: #f05b41;
    text-decoration: underline;
    cursor: pointer;
}

#pivotgrid-demo .desc-container a:hover {
    text-decoration: none;
}
</style>
