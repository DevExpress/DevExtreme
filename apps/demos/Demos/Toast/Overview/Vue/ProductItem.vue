<template>
  <li>
    <img
      :alt="product.Name"
      :src="product.ImageSrc"
    >
    <br>
    <div>{{ product.Name }}</div>
    <DxCheckBox
      @value-changed="onValueChanged"
      text="Available"
    />
  </li>
</template>
<script setup lang="ts">
import { DxCheckBox, type DxCheckBoxTypes } from 'devextreme-vue/check-box';
import { products } from './data.ts';

type Product = typeof products[0];

const props = withDefaults(defineProps<{
  product: Product,
}>(), {
  product: () => ({} as Product),
});

const emit = defineEmits(['checked']);

function onValueChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
  emit('checked', e, props.product);
}
</script>
