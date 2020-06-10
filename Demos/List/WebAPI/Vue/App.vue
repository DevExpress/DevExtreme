<template>
  <div class="list-container">
    <DxList
      :data-source="dataSource"
      :grouped="true"
      :collapsible-groups="true"
      :show-selection-controls="true"
      height="600"
      selection-mode="multiple"
      page-load-mode="scrollBottom"
    >
      <template #item="{ data: item }">
        <ProductInfo :item="item"/>
      </template>
    </DxList>
  </div>
</template>
<script>
import ProductInfo from './ProductInfo.vue';
import DxList from 'devextreme-vue/list';

import DataSource from 'devextreme/data/data_source';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const dataSource = new DataSource({
  store: createStore({
    loadUrl: 'https://js.devexpress.com/Demos/Mvc/api/ListData/Orders'
  }),
  sort: 'ProductName',
  group: 'Category.CategoryName',
  paginate: true,
  pageSize: 1,
  filter: ['UnitPrice', '>', 15]
});

export default {
  components: {
    DxList,
    ProductInfo
  },
  data() {
    return {
      dataSource
    };
  }
};
</script>
