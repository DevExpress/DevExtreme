<template>
  <DxChart
    id="chart"
    :customize-point="customizePoint"
    :customize-label="customizeLabel"
    :data-source="dataSource"
    title="Daily Temperature in May"
  >
    <DxSeries
      argument-field="day"
      value-field="value"
      type="bar"
      color="#e7d19a"
    />
    <DxValueAxis :max-value-margin="0.01">
      <DxVisualRange :start-value="40"/>
      <DxLabel :customize-text="customizeText"/>
      <DxConstantLine
        :width="2"
        :value="lowAverage"
        color="#8c8cff"
        dash-style="dash"
      >
        <DxLabel text="Low Average"/>
      </DxConstantLine>
      <DxConstantLine
        :width="2"
        :value="highAverage"
        color="#ff7c7c"
        dash-style="dash"
      >
        <DxLabel text="High Average"/>
      </DxConstantLine>
    </DxValueAxis>

    <DxLegend :visible="false"/>
    <DxExport :enabled="true"/>
  </DxChart>
</template>
<script setup lang="ts">
import {
  DxChart,
  DxSeries,
  DxValueAxis,
  DxVisualRange,
  DxLabel,
  DxConstantLine,
  DxLegend,
  DxExport,
} from 'devextreme-vue/chart';
import { temperaturesData } from './data.ts';

const highAverage = 77;
const lowAverage = 58;
const dataSource = temperaturesData;
const customizeText = ({ valueText }) => `${valueText}&#176F`;
const customizePoint = ({ value }) => {
  if (value > highAverage) {
    return { color: '#ff7c7c', hoverStyle: { color: '#ff7c7c' } };
  }
  return (value < lowAverage) ? { color: '#8c8cff', hoverStyle: { color: '#8c8cff' } } : null;
};
const customizeLabel = ({ value }) => ((value > highAverage) ? {
  visible: true,
  backgroundColor: '#ff7c7c',
  customizeText: ({ valueText }) => `${valueText}&#176F`,
} : null);
</script>
<style>
#chart {
  height: 440px;
}
</style>
