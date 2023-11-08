<template>
  <div>
    <DxPivotGrid
      id="sales"
      :allow-sorting-by-summary="true"
      :allow-sorting="true"
      :allow-filtering="true"
      :height="490"
      :show-borders="true"
      :data-source="gridDataSource"
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
      {{ ' ' }}
      <div class="option">
        <DxCheckBox
          id="show-row-fields"
          :value="true"
          :on-value-changed="OnShowDataFieldsChanged"
          text="Show Row Fields"
        />
      </div>
      {{ ' ' }}
      <div class="option">
        <DxCheckBox
          id="show-column-fields"
          :value="true"
          :on-value-changed="OnShowFilterFieldsChanged"
          text="Show Column Fields"
        />
      </div>
      {{ ' ' }}
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
<script setup lang="ts">
import { ref } from 'vue';
import DxPivotGrid, {
  DxFieldChooser,
  DxFieldPanel,
} from 'devextreme-vue/pivot-grid';
import DxCheckBox from 'devextreme-vue/check-box';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import sales from './data.ts';

const showColumnFields = ref(true);
const showDataFields = ref(true);
const showFilterFields = ref(true);
const showRowFields = ref(true);
const gridDataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    width: 120,
    dataField: 'region',
    area: 'row',
  }, {
    caption: 'City',
    dataField: 'city',
    width: 150,
    area: 'row',
    selector(data) {
      return `${data.city} (${data.country})`;
    },
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column',
  }, {
    dataField: 'sales',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
  }],
  store: sales,
});

function OnShowColumnFieldsChanged(e) {
  showColumnFields.value = e.value;
}
function OnShowDataFieldsChanged(e) {
  showDataFields.value = e.value;
}
function OnShowFilterFieldsChanged(e) {
  showFilterFields.value = e.value;
}
function OnShowRowFieldsChanged(e) {
  showRowFields.value = e.value;
}
function onContextMenuPreparing(e) {
  const dataSource = e.component.getDataSource();
  const sourceField = e.field;

  if (sourceField) {
    if (!sourceField.groupName || sourceField.groupIndex === 0) {
      e.items.push({
        text: 'Hide field',
        onItemClick() {
          let fieldIndex: number;

          if (sourceField.groupName) {
            fieldIndex = dataSource
              .getAreaFields(sourceField.area, true)[sourceField.areaIndex]
              .index;
          } else {
            fieldIndex = sourceField.index;
          }

          dataSource.field(fieldIndex, {
            area: null,
          });
          dataSource.load();
        },
      });
    }

    if (sourceField.dataType === 'number') {
      const setSummaryType = function(args) {
        dataSource.field(sourceField.index, {
          summaryType: args.itemData.value,
        });

        dataSource.load();
      };
      const menuItems: Record<string, any>[] = [];

      e.items.push({ text: 'Summary Type', items: menuItems });

      ['Sum', 'Avg', 'Min', 'Max'].forEach((summaryType) => {
        const summaryTypeValue = summaryType.toLowerCase();

        menuItems.push({
          text: summaryType,
          value: summaryType.toLowerCase(),
          onItemClick: setSummaryType,
          selected: e.field.summaryType === summaryTypeValue,
        });
      });
    }
  }
}
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
}
</style>
