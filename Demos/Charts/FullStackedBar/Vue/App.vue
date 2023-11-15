<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
  >
    <DxCommonSeriesSettings
      argument-field="country"
      type="fullstackedbar"
    />
    <DxTitle
      text="Energy Consumption in 2004"
      subtitle="(Millions of Tons, Oil Equivalent)"
    />
    <DxSeries
      value-field="hydro"
      name="Hydro-electric"
    />
    <DxSeries
      value-field="oil"
      name="Oil"
    />
    <DxSeries
      value-field="gas"
      name="Natural gas"
    />
    <DxSeries
      value-field="coal"
      name="Coal"
    />
    <DxSeries
      value-field="nuclear"
      name="Nuclear"
    />
    <DxLegend
      vertical-alignment="top"
      horizontal-alignment="center"
      item-text-position="right"
    />
    <DxExport :enabled="true"/>
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
    />
  </DxChart>
</template>
<script setup lang="ts">
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxTitle,
  DxLegend,
  DxExport,
  DxTooltip,
} from 'devextreme-vue/chart';
import service from './data.js';

const dataSource = service.dataSource();

const customizeTooltip = ({ percentText, valueText }) => ({ text: `${percentText}`, years: `${valueText}` });
</script>
<style>
#chart {
  height: 440px;
}
</style>
