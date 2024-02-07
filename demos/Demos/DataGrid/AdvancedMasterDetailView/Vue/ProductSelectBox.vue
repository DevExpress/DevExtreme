<template>
  <DxSelectBox
    :defer-rendering="false"
    :data-source="dataSource"
    :input-attr="{ 'aria-label': 'Product' }"
    :value="productId"
    value-expr="ProductID"
    display-expr="ProductName"
    @valueChanged="$emit('product-changed', $event.value)"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DxSelectBox from 'devextreme-vue/select-box';

import { createStore } from 'devextreme-aspnet-data-nojquery';

import { Product } from './data.ts';

defineEmits(['product-changed']);

const props = defineProps<{
  supplierId: number
}>();

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView';

const dataSource = createStore({
  key: 'ProductID',
  loadParams: { SupplierID: props.supplierId },
  loadUrl: `${url}/GetProductsBySupplier`,
  onLoaded: setDefaultValue,
});

const productId = ref(null);

function setDefaultValue(items: Product[]) {
  const firstItem = items[0];

  if (firstItem && productId.value === null) {
    productId.value = firstItem.ProductID;
  }
}
</script>
