<template>
  <div>
    <DxPivotGrid
      id="sales"
      :allow-filtering="true"
      :allow-sorting="true"
      :allow-sorting-by-summary="true"
      :height="570"
      :show-borders="true"
      :data-source="dataSource"
    >
      <DxHeaderFilter
        :allow-search="allowSearch"
        :show-relevant-values="showRelevantValues"
        :width="300"
        :height="400"
      />
      <DxFieldChooser
        :allow-search="true"
      />
      <DxFieldPanel
        :visible="true"
      />
    </DxPivotGrid>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="allowSearch"
          text="Allow Search"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="showRelevantValues"
          text="Show Relevant Values"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { DxPivotGrid, DxHeaderFilter, DxFieldChooser, DxFieldPanel } from 'devextreme-vue/pivot-grid';
import { DxCheckBox } from 'devextreme-vue/check-box';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import XmlaStore from 'devextreme/ui/pivot_grid/xmla_store';

export default {
  components: {
    DxPivotGrid, DxHeaderFilter, DxFieldChooser, DxFieldPanel,
    DxCheckBox
  },
  data() {
    return {
      allowSearch: true,
      showRelevantValues: true,
      dataSource: new PivotGridDataSource({
        fields: [
          { dataField: '[Product].[Category]', area: 'column' },
          { dataField: '[Product].[Subcategory]', area: 'column' },
          { dataField: '[Customer].[City]', area: 'row' },
          { dataField: '[Measures].[Internet Total Product Cost]', area: 'data', format: 'currency' },
          {
            dataField: '[Customer].[Country]',
            area: 'filter',
            filterValues: ['[Customer].[Country].&[United Kingdom]']
          },
          {
            dataField: '[Ship Date].[Calendar Year]',
            area: 'filter',
            filterValues: ['[Ship Date].[Calendar Year].&[2004]']
          }
        ],
        store: new XmlaStore({
          type: 'xmla',
          url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
          catalog: 'Adventure Works DW Standard Edition',
          cube: 'Adventure Works'
        })
      })
    };
  }
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
