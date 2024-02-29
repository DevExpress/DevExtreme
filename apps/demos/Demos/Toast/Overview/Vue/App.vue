<template>
  <div id="product-list">
    <div class="header">Product List</div>

    <ul>
      <ProductItem
        v-for="product in products"
        :key="product.ID"
        :product="product"
        @checked="checkAvailability"
      />
    </ul>

    <DxToast
      v-model:visible="isVisible"
      v-model:message="message"
      v-model:type="type"
      :display-time="600"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxToast } from 'devextreme-vue/toast';
import { products } from './data.ts';
import ProductItem from './ProductItem.vue';

const isVisible = ref(false);
const message = ref('');
const type = ref('info');

function checkAvailability(e, product) {
  type.value = e.value ? 'success' : 'error';
  message.value = product.Name + (e.value ? ' is available' : ' is not available');
  isVisible.value = true;
}
</script>
<style>
.header {
  font-size: 34px;
  text-align: center;
}

#product-list {
  padding: 10px;
}

#product-list ul {
  text-align: center;
  list-style-type: none;
  margin: 20px 0;
}

#product-list ul li {
  display: inline-block;
  width: 160px;
  margin: 10px;
}

#product-list ul li img {
  width: 100px;
}

.dx-toast-content {
  min-width: 300px;
  max-width: 400px;
}
</style>
