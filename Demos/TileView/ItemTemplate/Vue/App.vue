<template>
  <DxTileView
    :items="dataSource"
    :height="390"
    :base-item-height="120"
    :base-item-width="185"
    :item-margin="10"
  >
    <template #item="{ data }">
      <div class="dx-tile-content">
        <div class="price">{{ currencyFormatter.format(data.Price) }}</div>
        <div
          :style="{ backgroundImage: 'url(' + data.ImageSrc + ')' }"
          class="image"
        />
      </div>
    </template>
  </DxTileView>
</template>
<script setup lang="ts">
import DxTileView from 'devextreme-vue/tile-view';
import { homes } from './data.js';

const dataSource = homes;
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
</script>

