<template>
  <DxChart
    id="chart"
    :data-source="medalStatistics"
    :rotated="true"
    point-selection-mode="multiple"
    title="Olympic Medals in 2008"
    @point-click="onPointClick"
  >
    <DxCommonSeriesSettings
      argument-field="country"
      type="stackedbar"
    >
      <DxSelectionStyle>
        <DxHatching direction="left"/>
      </DxSelectionStyle>
    </DxCommonSeriesSettings>
    <DxSeries
      v-for="medal in medalSources"
      :key="medal.value"
      :value-field="medal.value"
      :name="medal.name"
      :color="medal.color"
    />
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
  DxSelectionStyle,
  DxHatching,
  DxSeries,
  DxLegend,
  DxExport,
} from 'devextreme-vue/chart';
import { medalSources, medalStatistics } from './data.js';

function onPointClick({ target: point }) {
  if (point.isSelected()) {
    point.clearSelection();
  } else {
    point.select();
  }
}
</script>
<style>
#chart {
  height: 440px;
}
</style>
