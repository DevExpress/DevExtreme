<template>
  <DxPolarChart
    id="chart"
    :data-source="dataSource"
    title="Rose in Polar Coordinates"
  >
    <DxSeries type="line"/>
    <DxArgumentAxis
      :inverted="true"
      :start-angle="90"
      :tick-interval="30"
    />
    <DxExport :enabled="true"/>
    <DxLegend :visible="false"/>
  </DxPolarChart>
</template>
<script>

import {
  DxPolarChart,
  DxSeries,
  DxArgumentAxis,
  DxExport,
  DxLegend
} from 'devextreme-vue/polar-chart';

import { dataSource } from './data.js';

export default {

  components: {
    DxPolarChart,
    DxSeries,
    DxArgumentAxis,
    DxExport,
    DxLegend
  },

  data() {
    return {
      dataSource
    };
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
