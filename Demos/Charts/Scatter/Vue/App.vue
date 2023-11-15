<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
  >
    <DxCommonSeriesSettings type="scatter"/>
    <DxSeries
      argument-field="x1"
      value-field="y1"
    />
    <DxSeries
      argument-field="x2"
      value-field="y2"
    >
      <DxPoint symbol="triangleDown"/>
    </DxSeries>
    <DxArgumentAxis :tick-interval="5">
      <DxGrid :visible="true"/>
      <DxMinorGrid :visible="true"/>
    </DxArgumentAxis>
    <DxValueAxis :tick-interval="50"/>
    <DxLegend :visible="false"/>
    <DxCommonPaneSettings>
      <DxBorder :visible="true"/>
    </DxCommonPaneSettings>
  </DxChart>
</template>
<script setup lang="ts">
import {
  DxChart,
  DxSeries,
  DxPoint,
  DxCommonSeriesSettings,
  DxLegend,
  DxValueAxis,
  DxArgumentAxis,
  DxGrid,
  DxMinorGrid,
  DxCommonPaneSettings,
  DxBorder,
} from 'devextreme-vue/chart';
import { generateDataSource } from './data.js';

const dataSource = generateDataSource();
</script>
<style>
#chart {
  height: 440px;
}
</style>
