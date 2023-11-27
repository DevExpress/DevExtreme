<template>
  <DxGallery
    :data-source="dataSource"
    :height="440"
    :loop="true"
    :show-indicator="false"
    width="100%"
  >
    <template #item="{ data }">
      <div class="content">
        <img
          :alt="data.Address"
          :src="data.Image"
        >
        <div class="item-price">{{ formatCurrency(data.Price) }}</div>
        <div class="item-address">{{ data.Address + ", " + data.City + ", " + data.State }}</div>
      </div>
    </template>
  </DxGallery>
</template>
<script setup lang="ts">
import DxGallery from 'devextreme-vue/gallery';
import { gallery } from './data.ts';

const dataSource = gallery;
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => currencyFormatter.format(value);
</script>

