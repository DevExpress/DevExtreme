<template>
  <DxDataGrid
    id="gridContainer"
    :remote-operations="{ groupPaging: true }"
    :word-wrap-enabled="true"
    :data-source="dataSource"
    :show-borders="true"
  >
    <DxScrolling
      mode="virtual"
    />

    <DxGroupPanel :visible="true"/>
    <DxGrouping :auto-expand-all="false"/>

    <DxColumn
      :width="75"
      data-field="Id"
      data-type="number"
    />
    <DxColumn
      :width="150"
      data-field="ProductSubcategoryName"
      caption="Subcategory"
    />
    <DxColumn
      :width="150"
      :group-index="0"
      data-field="StoreName"
      caption="Store"
    />
    <DxColumn
      :width="120"
      :group-index="1"
      data-field="ProductCategoryName"
      caption="Category"
    />
    <DxColumn
      data-field="ProductName"
      caption="Product"
    />
    <DxColumn
      :width="100"
      data-field="DateKey"
      caption="Date"
      data-type="date"
      format="yyyy-MM-dd"
    />
    <DxColumn
      :width="100"
      data-field="SalesAmount"
      caption="Amount"
      format="currency"
    />
    <DxSummary>
      <DxGroupItem
        column="Id"
        summary-type="count"
      />
    </DxSummary>
  </DxDataGrid>
</template>
<script>
import { DxDataGrid, DxScrolling, DxColumn, DxGrouping, DxGroupPanel, DxSummary, DxGroupItem } from 'devextreme-vue/data-grid';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxScrolling,
    DxGrouping,
    DxGroupPanel,
    DxSummary,
    DxGroupItem
  },
  data() {
    return {
      dataSource: AspNetData.createStore({
        key: 'Id',
        loadUrl: 'https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/Sales'
      })
    };
  }
};
</script>
<style>
#gridContainer {
  height: 420px;
  width: 100%;
}
</style>
