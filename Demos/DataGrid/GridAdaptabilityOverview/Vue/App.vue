<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="dataSource"
      key-expr="ID"
      :column-hiding-enabled="true"
      :show-borders="true"
    >
      <DxEditing
        :allow-adding="true"
        :allow-updating="true"
        mode="batch"
      />
      <DxGrouping
        :context-menu-enabled="true"
        expand-mode="rowClick"
      />
      <DxGroupPanel
        :visible="true"
        empty-panel-text="Use the context menu of header columns to group data"
      />
      <DxPager
        :allowed-page-sizes="[5, 8, 15, 30]"
        :show-info="true"
        :show-navigation-buttons="true"
        :show-page-size-selector="true"
        :visible="true"
      />
      <DxPaging :page-size="8"/>
      <DxColumnChooser
        :enabled="true"
        mode="select"
      />
      <DxColumn
        :allow-grouping="false"
        :width="130"
        data-field="OrderNumber"
        caption="Invoice Number"
      />
      <DxColumn
        data-field="CustomerStoreCity"
        caption="City"
      />
      <DxColumn
        data-field="CustomerStoreState"
        caption="State"
      />
      <DxColumn data-field="Employee"/>
      <DxColumn
        data-field="OrderDate"
        data-type="date"
      />
      <DxColumn
        data-field="SaleAmount"
        format="currency"
      />
    </DxDataGrid>
  </div>
</template>
<script>
import { DxDataGrid, DxColumn, DxExport, DxEditing, DxGrouping, DxGroupPanel, DxPager, DxPaging, DxColumnChooser } from 'devextreme-vue/data-grid';
import service from './data.js';

export default {
  components: {
    DxDataGrid, DxColumn, DxExport, DxEditing, DxGrouping, DxGroupPanel, DxPager, DxPaging, DxColumnChooser
  },
  data() {
    return {
      dataSource: service.getOrders()
    };
  }
};
</script>
<style scoped>
#gridContainer {
  padding: 10px;
}
</style>
