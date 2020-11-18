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
<script>
import {
  DxChart,
  DxSeries,
  DxValueAxis,
  DxVisualRange,
  DxLabel,
  DxConstantLine,
  DxLegend,
  DxExport
} from 'devextreme-vue/chart';

import { temperaturesData } from './data.js';

export default {

  components: {
    DxChart,
    DxSeries,
    DxValueAxis,
    DxVisualRange,
    DxLabel,
    DxConstantLine,
    DxLegend,
    DxExport
  },

  data() {
    return {
      highAverage: 77,
      lowAverage: 58,
      dataSource: temperaturesData
    };
  },

  methods: {

    customizePoint({ value }) {
      if (value > this.highAverage) {
        return { color: '#ff7c7c', hoverStyle: { color: '#ff7c7c' } };
      } else if (value < this.lowAverage) {
        return { color: '#8c8cff', hoverStyle: { color: '#8c8cff' } };
      }
    },

    customizeLabel({ value }) {
      if (value > this.highAverage) {
        return {
          visible: true,
          backgroundColor: '#ff7c7c',
          customizeText: function({ valueText }) {
            return `${valueText}&#176F`;
          }
        };
      }
    },

    customizeText({ valueText }) {
      return `${valueText}&#176F`;
    }
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
