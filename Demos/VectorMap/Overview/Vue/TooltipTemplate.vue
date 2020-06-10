<template>
  <div>
    <h4>{{ name }}</h4>
    <div
      v-if="totalGDP"
      id="nominal"
    >{{ getTotalGDPText() }}</div>
    <PieChart
      v-if="pieData"
      id="gdp-sectors"
      :data="pieData"
    />
    <div v-else>No economic development data</div>
  </div>
</template>
<script>

import { countriesGDP } from './data.js';
import PieChart from './PieChart.vue';

export default {
  components: { PieChart },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const name = this.info.attribute('name');
    const countryGDPData = countriesGDP[name];
    const totalGDP = countryGDPData && countryGDPData.total;
    return {
      name,
      countryGDPData,
      totalGDP,
      pieData: countryGDPData ? [
        { name: 'industry', value: countryGDPData.industry },
        { name: 'services', value: countryGDPData.services },
        { name: 'agriculture', value: countryGDPData.agriculture }
      ] : null
    };
  },
  methods: {
    format: new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0
    }).format,
    getTotalGDPText() {
      return `Nominal GDP: $${this.format(this.totalGDP)}M`;
    }
  },
};
</script>
<style>
h4 {
    font-size: 14px;
    margin-bottom: 5px;
}
#gdp-sectors {
    width: 400px;
    height: 200px;
}
</style>

