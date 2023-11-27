<template>
  <DxPieChart
    id="pie"
    :data-source="olympicMedals"
    type="doughnut"
    title="Olympic Medals in 2008"
    palette="Soft Pastel"
    @point-click="pointClickHandler"
  >
    <DxSeries
      argument-field="country"
      value-field="medals"
    >
      <DxHoverStyle color="#ffd700"/>
    </DxSeries>
    <DxExport :enabled="true"/>
    <DxLegend
      :margin="0"
      horizontal-alignment="right"
      vertical-alignment="top"
    />
  </DxPieChart>
</template>
<script setup lang="ts">
import DxPieChart, {
  DxLegend,
  DxSeries,
  DxExport,
  DxHoverStyle,
} from 'devextreme-vue/pie-chart';
import { olympicMedals } from './data.ts';

function pointClickHandler({ target }) {
  target.select();
}
</script>
<style>
#pie {
  height: 440px;
}
</style>
