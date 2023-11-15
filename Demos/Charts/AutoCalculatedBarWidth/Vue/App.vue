<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    palette="Soft"
    title="Percent of Total Energy Production"
  >
    <DxCommonSeriesSettings
      :ignore-empty-points="true"
      argument-field="state"
      type="bar"
    />
    <DxSeries
      value-field="oil"
      name="Oil Production"
    />
    <DxSeries
      value-field="gas"
      name="Gas Production"
    />
    <DxSeries
      value-field="coal"
      name="Coal Production"
    />
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
    <DxExport :enabled="true"/>
  </DxChart>
</template>
<script setup lang="ts">
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxLegend,
  DxExport,
} from 'devextreme-vue/chart';
import { dataSource } from './data.js';
</script>
<style>
#chart {
  height: 440px;
}
</style>
