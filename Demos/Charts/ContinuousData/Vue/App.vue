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
<script setup lang="ts">
import {
  DxPolarChart,
  DxSeries,
  DxArgumentAxis,
  DxExport,
  DxLegend,
} from 'devextreme-vue/polar-chart';
import { dataSource } from './data.js';
</script>
<style>
#chart {
  height: 440px;
}
</style>
