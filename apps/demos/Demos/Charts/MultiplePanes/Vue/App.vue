<template>
  <DxChart
    id="chart"
    :data-source="weatherData"
    default-pane="bottomPane"
    title="Weather in Glendale, CA"
  >
    <DxCommonSeriesSettings argument-field="month"/>
    <DxSeries
      pane="topPane"
      color="#b0daff"
      type="rangeArea"
      range-value1-field="minT"
      range-value2-field="maxT"
      name="Monthly Temperature Ranges, °C"
    />
    <DxSeries
      pane="topPane"
      value-field="avgT"
      name="Average Temperature, °C"
    >
      <DxLabel
        :visible="true"
        :customize-text="temperatureCustomizeText"
      />
    </DxSeries>
    <DxSeries
      type="bar"
      value-field="prec"
      name="prec, mm"
    >
      <DxLabel
        :visible="true"
        :customize-text="precipitationCustomizeText"
      />
    </DxSeries>

    <DxPane name="topPane"/>
    <DxPane name="bottomPane"/>

    <DxValueAxis pane="bottomPane">
      <DxGrid :visible="true"/>
      <DxTitle text="Precipitation, mm"/>
    </DxValueAxis>
    <DxValueAxis pane="topPane">
      <DxGrid :visible="true"/>
      <DxTitle text="Temperature, °C"/>
    </DxValueAxis>

    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
    <DxExport :enabled="true"/>
  </DxChart>
</template>
<script setup lang="ts">
import DxChart, {
  DxCommonSeriesSettings,
  DxSeries,
  DxPane,
  DxValueAxis,
  DxExport,
  DxLegend,
  DxLabel,
  DxTitle,
  DxGrid,
} from 'devextreme-vue/chart';
import { weatherData } from './data.ts';

const temperatureCustomizeText = ({ valueText }) => `${valueText} °C`;
const precipitationCustomizeText = ({ valueText }) => `${valueText} mm`;
</script>
<style>
#chart {
  height: 440px;
}
</style>
