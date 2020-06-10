<template>
  <div class="list-container">
    <DxList
      :data-source="dataSource"
      height="100%"
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

import { products } from './data.js';

export default {
  components: {
    DxList,
    ProductInfo
  },
  data() {
    return {
      dataSource: products
    };
  }
};
</script>
<style>
.list-container {
    min-height: 440px;
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
}
</style>
