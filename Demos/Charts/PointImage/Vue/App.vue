<template>
  <DxChart
    id="chart"
    :data-source="iceHockeyStatistics"
    :customize-point="customizePoint"
    :title="'Canadian Men’s National Ice Hockey Team\n at the World Championships'"
  >
    <DxCommonSeriesSettings
      argument-field="year"
      value-field="place"
      type="spline"
    >
      <DxPoint :visible="false"/>
    </DxCommonSeriesSettings>
    <DxSeries color="#888888"/>
    <DxArgumentAxis
      :allow-decimals="false"
      :axis-division-factor="60"
    >
      <DxGrid :visible="true"/>
      <DxLabel>
        <DxFormat type="decimal"/>
      </DxLabel>
    </DxArgumentAxis>
    <DxValueAxis :inverted="true">
      <DxGrid :visible="false"/>
      <DxLabel :customize-text="customizeText"/>
    </DxValueAxis>
    <DxExport
      :enabled="true"
      :formats="exportFormats"
    />
    <DxLegend :visible="false"/>
  </DxChart>
</template>
<script setup lang="ts">
import {
  DxChart,
  DxCommonSeriesSettings,
  DxSeries,
  DxArgumentAxis,
  DxGrid,
  DxLabel,
  DxFormat,
  DxValueAxis,
  DxExport,
  DxLegend,
  DxPoint,
} from 'devextreme-vue/chart';
import { iceHockeyStatistics } from './data.js';

const exportFormats = ['PNG', 'PDF', 'JPEG', 'GIF', 'SVG'];

function customizePoint({ value }) {
  if (value === 1) {
    return { image: { url: '../../../../images/Charts/PointImage/icon-medal-gold.png', width: 20, height: 20 }, visible: true };
  }
  if (value === 2) {
    return { image: { url: '../../../../images/Charts/PointImage/icon-medal-silver.png', width: 20, height: 20 }, visible: true };
  }
  if (value === 3) {
    return { image: { url: '../../../../images/Charts/PointImage/icon-medal-bronse.png', width: 20, height: 20 }, visible: true };
  }
  return null;
}
function customizeText({ valueText }) {
  if (valueText === '1') {
    return `${valueText}st place`;
  } if (valueText === '2') {
    return `${valueText}nd place`;
  } if (valueText === '3') {
    return `${valueText}rd place`;
  }
  return `${valueText}th place`;
}
</script>
<style>
#chart {
  height: 440px;
}
</style>
