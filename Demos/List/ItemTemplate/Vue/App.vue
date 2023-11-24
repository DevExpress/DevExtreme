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
<script setup lang="ts">
import DxList from 'devextreme-vue/list';
import ProductInfo from './ProductInfo.vue';
import { products } from './data.js';

const dataSource = products;
</script>
<style>
#app {
  height: 450px;
}

.list-container {
  height: 100%;
}
</style>
