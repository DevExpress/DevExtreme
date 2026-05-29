<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    palette="Soft"
  >
    <DxCommonSeriesSettings
      :bar-padding="0.5"
      argument-field="state"
      type="bar"
    />
    <DxSeries
      value-field="year1990"
      name="1990"
    />
    <DxSeries
      value-field="year2000"
      name="2000"
    />
    <DxSeries
      value-field="year2010"
      name="2010"
    />
    <DxSeries
      value-field="year2020"
      name="2020"
    />
    <DxSeries
      value-field="year2021"
      name="2021"
    />
    <DxSeries
      value-field="year2022"
      name="2022"
    />
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
    <DxExport :enabled="true"/>
    <DxTitle
      text="Oil Production"
      subtitle="(in millions tonnes)"
    />
  </DxChart>
</template>
<script setup lang="ts">
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxLegend,
  DxExport,
  DxTitle,
} from 'devextreme-vue/chart';
import { dataSource } from './data.ts';
</script>
<style>
#chart {
  height: 440px;
}
</style>
