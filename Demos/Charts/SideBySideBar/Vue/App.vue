<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    title="Gross State Product within the Great Lakes Region"
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
      value-field="year2018"
      name="2018"
    />
    <DxSeries
      value-field="year2017"
      name="2017"
    />
    <DxSeries
      value-field="year2016"
      name="2016"
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
} from 'devextreme-vue/chart';
import { grossProductData } from './data.js';

const dataSource = grossProductData;

function onPointClick({ target }) {
  target.select();
}
</script>
<style>
#chart {
  height: 440px;
}
</style>
