<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    title="Population: Age Structure"
  >
    <DxCommonSeriesSettings
      argument-field="state"
      type="fullstackedbar"
    />
    <DxSeries
      value-field="maleyoung"
      name="Male: 0-14"
      stack="male"
    />
    <DxSeries
      value-field="malemiddle"
      name="Male: 15-64"
      stack="male"
    />
    <DxSeries
      value-field="maleolder"
      name="Male: 65 and older"
      stack="male"
    />
    <DxSeries
      value-field="femaleyoung"
      name="Female: 0-14"
      stack="female"
    />
    <DxSeries
      value-field="femalemiddle"
      name="Female: 15-64"
      stack="female"
    />
    <DxSeries
      value-field="femaleolder"
      name="Female: 65 and older"
      stack="female"
    />
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
    <DxExport :enabled="true"/>
    <DxTooltip
      :customize-tooltip="customizeTooltip"
      :enabled="true"
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
  DxTooltip,
} from 'devextreme-vue/chart';
import service from './data.js';

const dataSource = service.getMaleAgeData();

const customizeTooltip = ({ percentText, valueText }) => ({ text: `${percentText} - ${valueText}` });
</script>
<style>
#chart {
  height: 440px;
}
</style>
