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
<script setup lang="ts">
import { ref } from 'vue';
import { countriesGDP } from './data.js';
import PieChart from './PieChart.vue';

const props = withDefaults(defineProps<{
  info?: Record<string, any>
}>(), {
  info: () => ({}),
});
const name = props.info.attribute('name');
const countryGDPData = countriesGDP[name];
const pieData = ref(countryGDPData ? [
  { name: 'industry', value: countryGDPData.industry },
  { name: 'services', value: countryGDPData.services },
  { name: 'agriculture', value: countryGDPData.agriculture },
] : null);
const totalGDP = countryGDPData && countryGDPData.total;

const format = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
}).format;

const getTotalGDPText = () => `Nominal GDP: $${format(totalGDP)}M`;
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

