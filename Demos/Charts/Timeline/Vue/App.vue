<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    :rotated="true"
    :bar-group-padding="0.2"
  >
    <DxArgumentAxis :categories="categories">
      <DxTick :visible="false"/>
    </DxArgumentAxis>
    <DxTitle
      text="The British Monarchy"
      subtitle="An Abbreviated Timeline"
    />
    <DxCommonSeriesSettings
      argument-field="monarch"
      type="rangebar"
      range-value1-field="start"
      range-value2-field="end"
      bar-overlap-group="monarchs"
      :min-bar-size="4"
    />
    <DxSeriesTemplate name-field="house"/>
    <DxAnimation :enabled="false"/>
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    >
      <DxTitle text="Royal Houses"/>
    </DxLegend>
  </DxChart>
</template>
<script setup lang="ts">
import {
  DxChart,
  DxCommonSeriesSettings,
  DxArgumentAxis,
  DxAnimation,
  DxTick,
  DxSeriesTemplate,
  DxLegend,
  DxTitle,
} from 'devextreme-vue/chart';
import dataSource from './data.js';

const categories = ['Royal Houses'];
</script>
<style>
#chart {
  height: 440px;
}
</style>
