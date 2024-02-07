<template>
  <DxChart
    id="chart"
    :data-source="catBreedsData"
    :rotated="true"
    title="Most Popular US Cat Breeds"
    @done="onDone"
    @point-click="onPointClick"
  >
    <DxCommonSeriesSettings
      argument-field="breed"
      type="bar"
    />
    <DxSeries
      value-field="count"
      name="breeds"
      color="#a3d6d2"
    >
      <DxSelectionStyle color="#ec2e7a">
        <DxHatching direction="none"/>
      </DxSelectionStyle>
    </DxSeries>
    <DxLegend :visible="false"/>
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
  DxChartTypes,
} from 'devextreme-vue/chart';
import { catBreedsData } from './data.ts';

function onDone({ component }) {
  component.getSeriesByPos(0).getPointsByArg('Siamese')[0].select();
}
function onPointClick({ target: point }: DxChartTypes.PointClickEvent) {
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
