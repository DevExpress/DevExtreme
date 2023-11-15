<template>
  <DxChart
    id="chart"
    :data-source="medalsInfo"
    title="France Olympic Medals"
  >
    <DxSeries
      value-field="gold"
      name="Gold Medals"
      color="#ffd700"
    />
    <DxSeries
      value-field="silver"
      name="Silver Medals"
      color="#c0c0c0"
    />
    <DxCommonSeriesSettings
      argument-field="year"
      type="steparea"
    >
      <DxPoint :visible="true"/>
    </DxCommonSeriesSettings>
    <DxArgumentAxis>
      <DxLabel format="decimal"/>
    </DxArgumentAxis>
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
    <DxExport :enabled="true"/>
  </DxChart>
</template>
<script setup lang="ts">
import DxChart, {
  DxArgumentAxis,
  DxLabel,
  DxLegend,
  DxSeries,
  DxCommonSeriesSettings,
  DxExport,
  DxPoint,
} from 'devextreme-vue/chart';
import { medalsInfo } from './data.js';
</script>
<style>
#chart {
  height: 440px;
  width: 100%;
}
</style>
