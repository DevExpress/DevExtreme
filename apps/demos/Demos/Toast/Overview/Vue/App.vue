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
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxToast, type DxToastTypes } from 'devextreme-vue/toast';
import { type DxCheckBoxTypes } from 'devextreme-vue/cjs/check-box';
import { products, type Product } from './data.ts';
import ProductItem from './ProductItem.vue';

const isVisible = ref(false);
const message = ref('');
const type = ref<DxToastTypes.ToastType>('info');

function checkAvailability(e: DxCheckBoxTypes.ValueChangedEvent, product: Product) {
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
