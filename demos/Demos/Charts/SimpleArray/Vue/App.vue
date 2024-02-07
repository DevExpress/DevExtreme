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
<script setup lang="ts">
import DxChart, {
  DxArgumentAxis,
  DxLegend,
  DxLabel,
  DxSeries,
} from 'devextreme-vue/chart';
import { populationData } from './data.ts';
</script>
<style>
#chart {
  height: 440px;
}
</style>
