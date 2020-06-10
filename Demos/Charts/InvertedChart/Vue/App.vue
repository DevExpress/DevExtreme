<template>
  <DxPolarChart
    id="chart"
    :data-source="dataSource"
    title="Inverted Rose in Polar Coordinates"
  >
    <DxSeries
      type="area"
      name="Function"
    />
    <DxArgumentAxis
      :inverted="true"
      :start-angle="90"
      :tick-interval="30"
    />
    <DxValueAxis :inverted="true"/>
    <DxExport :enabled="true"/>
    <DxLegend :visible="false"/>
  </DxPolarChart>
</template>
<script>

import {
  DxPolarChart,
  DxSeries,
  DxArgumentAxis,
  DxValueAxis,
  DxExport,
  DxLegend
} from 'devextreme-vue/polar-chart';

import { dataSource } from './data.js';

export default {

  components: {
    DxPolarChart,
    DxSeries,
    DxArgumentAxis,
    DxValueAxis,
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
