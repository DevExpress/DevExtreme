<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    title="Gross State Product within the Great Lakes Region (Billions USD)"
    @pointClick="onPointClick"
  >
    <DxCommonSeriesSettings
      argument-field="state"
      type="bar"
      hover-mode="allArgumentPoints"
      selection-mode="allArgumentPoints"
    >
      <DxLabel :visible="true">
        <DxFormat
          :precision="0"
          type="fixedPoint"
        />
      </DxLabel>
    </DxCommonSeriesSettings>
    <DxSeries
      value-field="year2024"
      name="2024"
    />
    <DxSeries
      value-field="year2023"
      name="2023"
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
  </DxChart>
</template>
<script setup lang="ts">
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxLabel,
  DxFormat,
  DxLegend,
  DxExport,
  type DxChartTypes,
} from 'devextreme-vue/chart';
import { grossProductData } from './data.ts';

const dataSource = grossProductData;

function onPointClick({ target }: DxChartTypes.PointClickEvent): void {
  target.select();
}
</script>
<style>
#chart {
  height: 440px;
}
</style>
