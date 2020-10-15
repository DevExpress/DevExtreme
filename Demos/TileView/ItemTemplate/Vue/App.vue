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
        <div class="price">{{ formatCurrency(data.Price) }}</div>
        <div
          :style="{ backgroundImage: 'url(' + data.ImageSrc + ')' }"
          class="image"
        />
      </div>
    </template>
  </DxTileView>
</template>
<script>
import DxTileView from 'devextreme-vue/tile-view';
import { homes } from './data.js';

export default {
  components: {
    DxTileView
  },
  data() {
    return {
      dataSource: homes
    };
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
  }
};
</script>

