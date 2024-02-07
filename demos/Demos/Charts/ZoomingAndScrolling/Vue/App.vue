<template>
  <DxChart
    id="chart"
    :data-source="zoomingData"
    palette="Harmony Light"
  >
    <DxSeries value-field="y1"/>
    <DxSeries value-field="y2"/>
    <DxArgumentAxis :visual-range="initialRange"/>
    <DxScrollBar :visible="true"/>
    <DxZoomAndPan argument-axis="both"/>
    <DxLegend :visible="false"/>
  </DxChart>
</template>
<script setup lang="ts">
import {
  DxChart,
  DxSeries,
  DxArgumentAxis,
  DxScrollBar,
  DxZoomAndPan,
  DxLegend,
} from 'devextreme-vue/chart';
import { zoomingData } from './data.ts';

const initialRange = [300, 500];
</script>
<style scoped>
#chart {
  height: 440px;
  width: 100%;
}
</style>
