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
        <div class="price">{{ data.Price | formatCurrency }}</div>
        <div
          :style="{ backgroundImage: 'url(' + data.ImageSrc + ')' }"
          class="image"
        />
      </div>
    </template>
  </DxTileView>
</template>
<script>
import { DxTileView } from 'devextreme-vue';
import { homes } from './data.js';
import Globalize from 'globalize';
import 'devextreme/localization/globalize/currency';

export default {
  components: {
    DxTileView
  },
  filters: {
    formatCurrency(value) {
      return Globalize.formatCurrency(value, 'USD', {
        maximumFractionDigits: 0
      });
    }
  },
  data() {
    return {
      dataSource: homes
    };
  }
};
</script>

