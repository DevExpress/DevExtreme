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
        <img :src="data.Image">
        <div class="item-price">{{ data.Price | formatCurrency }}</div>
        <div class="item-address">{{ data.Address + ", " + data.City + ", " + data.State }}</div>
      </div>
    </template>
  </DxGallery>
</template>
<script>
import { DxGallery } from 'devextreme-vue';
import { gallery } from './data.js';
import Globalize from 'globalize';
import 'devextreme/localization/globalize/currency';

export default {
  components: {
    DxGallery
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
      dataSource: gallery
    };
  },
};
</script>

