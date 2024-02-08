<template>
  <DxChart
    id="chart"
    :data-source="statisticsData"
    series-selection-mode="multiple"
    title="Internet Explorer Statistics"
    @series-click="onSeriesClick"
  >
    <DxCommonSeriesSettings
      argument-field="year"
      type="stackedarea"
    />
    <DxSeries
      v-for="version in versionSources"
      :key="version.value"
      :value-field="version.value"
      :name="version.name"
    />
    <DxCommonAxisSettings :value-margins-enabled="false"/>
    <DxArgumentAxis type="discrete"/>
    <DxValueAxis>
      <DxLabel>
        <DxFormat
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
  DxCommonAxisSettings,
  DxArgumentAxis,
  DxValueAxis,
  DxLabel,
  DxFormat,
  DxLegend,
  DxExport,
} from 'devextreme-vue/chart';
import { versionSources, statisticsData } from './data.ts';

function onSeriesClick({ target: series }) {
  if (series.isSelected()) {
    series.clearSelection();
  } else {
    series.select();
  }
}
</script>
<style>
#chart {
  height: 440px;
}
</style>
