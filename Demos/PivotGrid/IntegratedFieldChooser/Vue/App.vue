<template>
  <div>
    <DxPivotGrid
      ref="grid"
      :data-source="dataSource"
      :allow-sorting-by-summary="true"
      :allow-sorting="true"
      :allow-filtering="true"
      :show-borders="true"
      :height="470"
    >
      <DxFieldChooser
        :enabled="true"
        :allow-search="true"
        :apply-changes-mode="applyChangesMode"
      />
    </DxPivotGrid>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Apply Changes Mode:</span>
        <DxSelectBox
          :items="applyChangesModes"
          :width="180"
          v-model:value="applyChangesMode"
        />
      </div>
    </div>
  </div>
</template>
<script>

import {
  DxPivotGrid,
  DxFieldChooser
} from 'devextreme-vue/pivot-grid';

import {
  DxSelectBox
} from 'devextreme-vue/select-box';

export default {
  components: {
    DxPivotGrid,
    DxFieldChooser,
    DxSelectBox
  },
  data() {
    return {
      dataSource: {
        fields: [
          { dataField: '[Product].[Category]', area: 'row' },
          {
            dataField: '[Product].[Subcategory]',
            area: 'row',
            headerFilter: {
              allowSearch: true
            }
          },
          { dataField: '[Ship Date].[Calendar Year]', area: 'column' },
          { dataField: '[Ship Date].[Month of Year]', area: 'column' },
          { dataField: '[Measures].[Customer Count]', area: 'data' }
        ],
        store: {
          type: 'xmla',
          url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
          catalog: 'Adventure Works DW Standard Edition',
          cube: 'Adventure Works'
        }
      },
      applyChangesModes: ['instantly', 'onDemand'],
      applyChangesMode: 'instantly'
    };
  }
};
</script>
<style>
.options {
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    margin-top: 20px;
}

.caption {
    font-size: 18px;
    font-weight: 500;
}

.option {
    margin-top: 10px;
}

.dx-selectbox {
    margin-top: 5px;
}
</style>
