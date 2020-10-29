<template>
  <DxForm
    label-location="top"
    class="form-container"
  >
    <DxItem template="select-box">
      <DxLabel text="Product"/>
    </DxItem>
    <template #select-box>
      <ProductSelectBox
        :supplier-id="supplierId"
        @product-changed="chosenProductId = $event"
      />
    </template>

    <DxItem template="order-history">
      <DxLabel text="Order History"/>
    </DxItem>
    <template #order-history="{ data }">
      <OrderHistory
        :product-id="chosenProductId"
      />
    </template>
  </DxForm>
</template>

<script>

import { DxForm, DxItem, DxLabel } from 'devextreme-vue/form';
import ProductSelectBox from './ProductSelectBox.vue';
import OrderHistory from './OrderHistory.vue';

export default {
  components: { DxForm, DxItem, DxLabel, ProductSelectBox, OrderHistory },
  props: {
    supplierId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      chosenProductId: null
    };
  }
};
</script>
