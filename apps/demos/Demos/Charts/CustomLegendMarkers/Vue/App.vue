<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    title="Noisy and Original Signals"
    @legend-click="onLegendClick"
  >
    <DxCommonSeriesSettings
      argument-field="argument"
    >
      <DxPoint :visible="false"/>
    </DxCommonSeriesSettings>
    <DxSeries
      value-field="originalValue"
      name="Original Signal"
    />
    <DxSeries
      value-field="value"
      name="Noisy Signal"
    />
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
      marker-template="markerTemplate"
    />
    <template #markerTemplate="{ data }">
      <MarkerTemplate :item="data"/>
    </template>
  </DxChart>
</template>
<script setup lang="ts">
import {
  DxChart, DxSeries, DxCommonSeriesSettings, DxPoint, DxLegend, DxChartTypes,
} from 'devextreme-vue/chart';
import { dataSource } from './data.ts';
import MarkerTemplate from './MarkerTemplate.vue';

function onLegendClick({ target }: DxChartTypes.LegendClickEvent) {
  target.isVisible() ? target.hide() : target.show();
}
</script>
<style>
#chart {
  height: 440px;
}
</style>
