<template>
  <DxDataGrid
    id="gridContainer"
    :remote-operations="true"
    :word-wrap-enabled="true"
    :data-source="dataSource"
    :show-borders="true"
  >
    <DxScrolling
      mode="virtual"
      row-rendering-mode="virtual"
    />
    <DxPaging :page-size="100"/>
    <DxHeaderFilter
      :visible="true"
    >
      <DxSearch
        :enabled="true"
      />
    </DxHeaderFilter>

    <DxColumn
      data-field="Id"
      width="90"
    />
    <DxColumn
      data-field="StoreName"
      caption="Store"
      width="150"
    />
    <DxColumn
      data-field="ProductCategoryName"
      caption="Category"
      width="120"
    />
    <DxColumn
      data-field="ProductName"
      caption="Product"
    />
    <DxColumn
      data-field="DateKey"
      caption="Date"
      data-type="date"
      format="yyyy-MM-dd"
      width="110"
    />
    <DxColumn
      data-field="SalesAmount"
      caption="Amount"
      format="currency"
      width="100"
    >
      <DxHeaderFilter :group-interval="1000"/>
    </DxColumn>
  </DxDataGrid>
</template>
<script setup lang="ts">
import {
  DxDataGrid, DxScrolling, DxPaging, DxColumn, DxHeaderFilter, DxSearch,
} from 'devextreme-vue/data-grid';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

const dataSource = AspNetData.createStore({
  key: 'Id',
  loadUrl: 'https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/Sales',
});
</script>
<style>
#gridContainer {
  height: 440px;
}
</style>
