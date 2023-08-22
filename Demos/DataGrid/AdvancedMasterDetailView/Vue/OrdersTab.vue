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

<script setup lang="ts">
import { ref } from 'vue';
import { DxForm, DxItem, DxLabel } from 'devextreme-vue/form';
import ProductSelectBox from './ProductSelectBox.vue';
import OrderHistory from './OrderHistory.vue';

defineProps<{
  supplierId: number
}>();

const chosenProductId = ref<null | number>(null);
</script>
