<template>
  <svg class="annotation">
    <image
      :href="getImagePath()"
      width="60"
      height="40"
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
      <tspan class="caption">Capital:</tspan><tspan dx="5">{{ data.capital }}</tspan><tspan
        dy="14"
        x="0"
        class="caption"
      >Population:</tspan><tspan dx="5">{{ formatNumber(data.population) }}</tspan><tspan
        dy="14"
        x="0"
        class="caption"
      >Area:</tspan><tspan dx="5">{{ formatNumber(data.area) }}</tspan><tspan dx="5">km</tspan><tspan
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
      return `../../../../images/flags/${this.data.name.replace(/\s/, '').toLowerCase()}.gif`;
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
