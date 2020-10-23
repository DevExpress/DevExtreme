<template>
  <svg class="annotation">
    <image
      :href="getImagePath()"
      width="60"
      height="40"
    />
    <rect
      x="0"
      y="0"
      class="border"
    />
    <text
      x="70"
      y="25"
      class="state"
    >{{ annotation.argument }}</text>
    <text
      x="0"
      y="60"
    >
      <tspan class="caption">Capital:</tspan><tspan class="capital" dx="5">{{ data.capital }}</tspan><tspan
        dy="14"
        x="0"
        class="caption"
      >Population:</tspan><tspan class="population" dx="5">{{ formatNumber(data.population) }}</tspan><tspan
        dy="14"
        x="0"
        class="caption"
      >Area:</tspan><tspan class="area" dx="5">{{ formatNumber(data.area) }}</tspan><tspan dx="5">km</tspan><tspan
        class="sup"
        dy="-2"
      >2</tspan>
    </text>
  </svg>
</template>
<script>

export default {
  props: {
    annotation: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      data: this.annotation.data
    };
  },
  methods: {
    getImagePath() {
      return `../../../../images/flags/${this.data.name.replace(/\s/, '')}.svg`;
    },
    formatNumber:  new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0
    }).format
  }
};
</script>
<style>
.annotation {
    font-size: 12px;
}
.border {
  width: 60px;
  height: 40px;
  stroke: rgba(191, 191, 191, 0.25);
  stroke-width: 1px;
  fill: transparent;
}
.state {
    font-weight: 500;
    font-size: 14px;
}
.caption {
    font-weight: 500;
}
.sup {
    font-size: 0.8em;
}
</style>
