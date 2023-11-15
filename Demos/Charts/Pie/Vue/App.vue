<template>
  <DxPieChart
    id="pie"
    :data-source="areas"
    palette="Bright"
    title="Area of Countries"
    @point-click="pointClickHandler($event)"
    @legend-click="legendClickHandler($event)"
  >
    <DxSeries
      argument-field="country"
      value-field="area"
    >
      <DxLabel :visible="true">
        <DxConnector
          :visible="true"
          :width="1"
        />
      </DxLabel>
    </DxSeries>
    <DxSize :width="500"/>
    <DxExport :enabled="true"/>
  </DxPieChart>
</template>

<script setup lang="ts">
import DxPieChart, {
  DxSize,
  DxSeries,
  DxLabel,
  DxConnector,
  DxExport,
  DxPieChartTypes,
} from 'devextreme-vue/pie-chart';
import { areas } from './data.js';

function pointClickHandler(e: DxPieChartTypes.PointClickEvent) {
  toggleVisibility(e.target);
}
function legendClickHandler(e: DxPieChartTypes.LegendClickEvent) {
  const arg = e.target;
  const item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

  toggleVisibility(item);
}
function toggleVisibility(item) {
  item.isVisible() ? item.hide() : item.show();
}
</script>

<style>
#pie {
  height: 440px;
}

#pie * {
  margin: 0 auto;
}
</style>
