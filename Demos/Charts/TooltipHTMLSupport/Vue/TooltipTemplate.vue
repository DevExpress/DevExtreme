<template>
  <div class="state-tooltip">
    <img :src="getImagePath(info.point)"><h4 class="state">{{ info.argument }}</h4>
    <div class="capital">
      <span class="caption">Capital</span>: {{ info.point.data.capital }}
    </div>
    <div>
      <span class="caption">Population</span>: <span class="population">{{ formatNumber(info.value) }}</span> people
    </div>
    <div>
      <span class="caption">Area</span>: <span class="area-km">{{ formatNumber(info.point.data.area) }}</span> km<sup>2</sup> (<span class="area-mi">{{ formatNumber(0.3861 * info.point.data.area) }}</span> mi<sup>2</sup>)
    </div>
  </div>
</template>
<script>

export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    getImagePath(point) {
      return `../../../../images/flags/${point.data.name.replace(/\s/, '')}.svg`;
    },
    formatNumber:  new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format
  },
};
</script>
<style>
.state-tooltip {
    height: 90px;
}

.state-tooltip > img {
    width: 60px;
    height: 40px;
    display: block;
    margin: 0 5px 0 0;
    float: left;
    border: 1px solid rgba(191, 191, 191, 0.25);
}

.state-tooltip > h4 {
    line-height: 40px;
    font-size: 14px;
    margin-bottom: 5px;
}

.state-tooltip .caption {
    font-weight: 500;
}

.state-tooltip sup {
    font-size: 0.8em;
    vertical-align: super;
    line-height: 0;
}
</style>
