<template>
  <DxChart
    id="chart"
    :data-source="exportData"
    :rotated="true"
    title="Economy - Export Change"
    @point-click="onPointClick"
    @legend-click="onLegendClick"
  >
    <DxCommonSeriesSettings
      argument-field="country"
      type="bar"
      hover-mode="allArgumentPoints"
      selection-mode="allArgumentPoints"
    >
      <DxLabel :visible="true">
        <DxFormat
          :precision="1"
          type="percent"
        />
      </DxLabel>
    </DxCommonSeriesSettings>
    <DxSeries
      value-field="year2007"
      name="2007 - 2008"
    />
    <DxSeries
      value-field="year2008"
      name="2008 - 2009"
    />
    <DxValueAxis>
      <DxLabel>
        <DxFormat
          :precision="1"
          type="percent"
        />
      </DxLabel>
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
  DxLabel,
  DxFormat,
  DxValueAxis,
  DxLegend,
  DxExport,
  DxChartTypes,
} from 'devextreme-vue/chart';
import { exportData } from './data.js';

function onPointClick({ target: point }: DxChartTypes.PointClickEvent) {
  point.select();
}
function onLegendClick({ target: series }: DxChartTypes.LegendClickEvent) {
  if (series.isVisible()) {
    series.hide();
  } else {
    series.show();
  }
}
</script>
<style>
#chart {
  height: 440px;
}
</style>
