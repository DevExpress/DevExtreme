<template>
  <DxChart
    id="chart"
    :customize-point="customizePoint"
    :data-source="dataSource"
    title="Relative Masses of the Heaviest Solar System Objects"
  >
    <DxSeries
      argument-field="name"
      value-field="mass"
      type="scatter"
    >
      <DxPoint :size="20"/>
    </DxSeries>
    <DxValueAxis
      type="logarithmic"
      title="Mass Relative to the Earth"
    />
    <DxArgumentAxis>
      <DxGrid :visible="true"/>
      <DxLabel
        :rotation-angle="20"
        overlapping-behavior="rotate"
      />
    </DxArgumentAxis>
    <DxLegend :visible="false"/>
    <DxExport :enabled="true"/>
    <DxCommonPaneSettings>
      <DxBorder :visible="true"/>
    </DxCommonPaneSettings>
    <DxTooltip :enabled="true"/>
  </DxChart>
</template>
<script setup lang="ts">
import {
  DxChart,
  DxSeries,
  DxValueAxis,
  DxLabel,
  DxLegend,
  DxExport,
  DxGrid,
  DxArgumentAxis,
  DxTooltip,
  DxCommonPaneSettings,
  DxBorder,
  DxPoint,
} from 'devextreme-vue/chart';
import { dataSource } from './data.ts';

function customizePoint({ data: { type } }) {
  let color;
  let hoverStyle;

  switch (type) {
    case 'Star':
      color = 'red';
      hoverStyle = { border: { color: 'red' } };
      break;
    case 'Satellite':
      color = 'gray';
      hoverStyle = { border: { color: 'gray' } };
      break;
    default:
      break;
  }
  return { color, hoverStyle };
}
</script>
<style>
#chart {
  height: 440px;
}
</style>
