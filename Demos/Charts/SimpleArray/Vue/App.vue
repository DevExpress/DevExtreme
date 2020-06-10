<template>
  <DxChart
    id="chart"
    :data-source="populationData"
    title="World Population by Decade"
  >
    <DxArgumentAxis :tick-interval="10">
      <DxLabel format="decimal"/>
    </DxArgumentAxis>
    <DxSeries type="bar"/>
    <DxLegend :visible="false"/>
  </DxChart>
</template>
<script>

import DxChart, {
  DxArgumentAxis,
  DxLegend,
  DxLabel,
  DxSeries
} from 'devextreme-vue/chart';

import { populationData } from './data.js';

export default {
  components: {
    DxChart,
    DxArgumentAxis,
    DxLabel,
    DxLegend,
    DxSeries
  },
  data() {
    return {
      populationData
    };
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
