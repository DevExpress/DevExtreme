<template>
  <div>
    <DxPivotGrid
      id="sales"
      :allow-sorting-by-summary="true"
      :allow-sorting="true"
      :allow-filtering="true"
      :height="490"
      :show-borders="true"
      :data-source="dataSource"
      :on-context-menu-preparing="onContextMenuPreparing"
    >
      <DxFieldChooser :height="500"/>
      <DxFieldPanel
        :show-column-fields="showColumnFields"
        :show-data-fields="showDataFields"
        :show-filter-fields="showFilterFields"
        :show-row-fields="showRowFields"
        :allow-field-dragging="true"
        :visible="true"
      />
    </DxPivotGrid>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          id="show-data-fields"
          :value="true"
          :on-value-changed="OnShowColumnFieldsChanged"
          text="Show Data Fields"
        />
      </div>
      <div class="option">
        <DxCheckBox
          id="show-row-fields"
          :value="true"
          :on-value-changed="OnShowDataFieldsChanged"
          text="Show Row Fields"
        />
      </div>
      <div class="option">
        <DxCheckBox
          id="show-column-fields"
          :value="true"
          :on-value-changed="OnShowFilterFieldsChanged"
          text="Show Column Fields"
        />
      </div>
      <div class="option">
        <DxCheckBox
          id="show-filter-fields"
          :value="true"
          :on-value-changed="OnShowRowFieldsChanged"
          text="Show Filter Fields"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DxPivotGrid, {
  DxFieldChooser,
  DxFieldPanel
} from 'devextreme-vue/pivot-grid';
import DxCheckBox from 'devextreme-vue/check-box';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import sales from './data.js';

export default {
  components: {
    DxPivotGrid,
    DxFieldChooser,
    DxFieldPanel,
    DxCheckBox
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
          area: 'row'
        }, {
          caption: 'City',
          dataField: 'city',
          width: 150,
          area: 'row',
          selector: function(data) {
            return `${data.city} (${data.country})`;
          }
        }, {
          dataField: 'date',
          dataType: 'date',
          area: 'column'
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
    OnShowColumnFieldsChanged(e) {
      this.showColumnFields = e.value;
    },
    OnShowDataFieldsChanged(e) {
      this.showDataFields = e.value;
    },
    OnShowFilterFieldsChanged(e) {
      this.showFilterFields = e.value;
    },
    OnShowRowFieldsChanged(e) {
      this.showRowFields = e.value;
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
#sales {
    max-height: 570px;
}

.options {
    padding: 20px;
    margin-top: 20px;
    background-color: rgba(191, 191, 191, 0.15);
}

.caption {
    font-size: 18px;
    font-weight: 500;
}

.option {
    width: 24%;
    display: inline-block;
    margin-top: 10px;
    margin-right: 4px;
}
</style>
