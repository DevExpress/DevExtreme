<template>
  <svg>
    <circle
      :r="pieChart.getInnerRadius() - 6"
      cx="100"
      cy="100"
      fill="#eee"
    />
    <image
      :href="getImagePath(country)"
      x="70"
      y="58"
      width="60"
      height="40"
    />
    <text
      :style="{fontSize: 18, fill:&quot;#494949&quot;}"
      text-anchor="middle"
      x="100"
      y="120"
    >
      <tspan x="100">{{ country }}</tspan><tspan
        :style="{ fontWeight: 600 }"
        x="100"
        dy="20px"
      >{{ calculateTotal(pieChart) }}</tspan>
    </text>
  </svg>
</template>
<script>

const formatNumber = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0
}).format;

export default {
  props: {
    pieChart: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      country: this.pieChart.getAllSeries()[0].getVisiblePoints()[0].data.country
    };
  },
  methods: {
    getImagePath(country) {
      return `../../../../images/flags/${ country.replace(/\s/, '').toLowerCase() }.svg`;
    },

    calculateTotal(pieChart) {
      return formatNumber(pieChart.getAllSeries()[0].getVisiblePoints().reduce((s, p) => s + p.originalValue, 0));
    }
  }
};
</script>
