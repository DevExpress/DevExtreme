<template>
  <div :class="className(cellData)">
    <div class="current-value">{{ formatCurrency(cellData) }}</div>
    <div class="diff">{{ fixed(abs(cellData), 2) }}</div>
  </div>
</template>
<script>
import {
  DxSparkline,
  DxSize,
  DxTooltip
} from 'devextreme-vue/sparkline';
import localization from 'devextreme/localization';
const { formatNumber } = localization;

const gridCellData = function(value) {
  return value.data[value.column.caption.toLowerCase()];
};

export default {
  components: {
    DxSparkline,
    DxSize,
    DxTooltip
  },
  props: {
    cellData: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    className(value) {
      return gridCellData(value).diff > 0 ? 'inc' : 'dec';
    },
    formatCurrency(value) {
      return formatNumber(gridCellData(value).value, { type: 'currency', currency: 'USD', precision: 2 });
    },
    abs(value) {
      return Math.abs(gridCellData(value).diff);
    },
    fixed(value, precision) {
      return value.toFixed(precision);
    }
  }
};
</script>
