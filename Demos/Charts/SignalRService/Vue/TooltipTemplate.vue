<template>
  <div class="tooltip-template">
    <div>{{ pointInfo.argumentText }}</div>
    <div><span>Open: </span>
      {{ formatCurrency(prices.openValue, "USD") }}
    </div>
    <div><span>High: </span>
      {{ formatCurrency(prices.highValue, "USD") }}
    </div>
    <div><span>Low: </span>
      {{ formatCurrency(prices.lowValue, "USD") }}
    </div>
    <div><span>Close: </span>
      {{ formatCurrency(prices.closeValue, "USD") }}
    </div>
    <div><span>Volume: </span>
      {{ formatNumber(volume.value, { maximumFractionDigits: 0 }) }}
    </div>
  </div>
</template>
<script>

export default {
  props: {
    pointInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      volume: this.pointInfo.points.filter(point => point.seriesName === 'Volume')[0],
      prices: this.pointInfo.points.filter(point => point.seriesName !== 'Volume')[0]
    };
  },
  methods: {
    formatCurrency: new Intl.NumberFormat('en-US',
      { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }
    ).format,

    formatNumber: new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0
    }).format
  },
};
</script>
<style>
.tooltip-template span {
    font-weight: 500;
}
</style>
