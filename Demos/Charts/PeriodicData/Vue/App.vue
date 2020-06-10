<template>
  <DxPolarChart
    id="chart"
    :data-source="dataSource"
    title="Archimedean Spiral"
  >
    <DxSeries
      :closed="false"
      type="line"
      name="Function"
    />
    <DxArgumentAxis
      :inverted="true"
      :start-angle="90"
      :tick-interval="45"
      :period="360"
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
