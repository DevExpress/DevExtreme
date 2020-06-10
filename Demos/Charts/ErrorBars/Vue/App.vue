<template>
  <DxChart
    id="chart"
    :data-source="weatherData"
    default-pane="bottom"
  >
    <DxCommonSeriesSettings argument-field="month"/>
    <DxSeries
      pane="top"
      value-field="avgT"
      name="Average Temperature, °C"
    >
      <DxValueErrorBar
        :line-width="1"
        :opacity="0.8"
        low-value-field="avgLowT"
        high-value-field="avgHighT"
      />
    </DxSeries>
    <DxSeries
      pane="bottom"
      value-field="avgH"
      type="bar"
      name="Average Humidity, %"
    >
      <DxValueErrorBar
        :value="3"
        :line-width="1"
        type="fixed"
      />
    </DxSeries>

    <DxPane name="top"/>
    <DxPane name="bottom"/>

    <DxArgumentAxis>
      <DxLabel display-mode="stagger"/>
    </DxArgumentAxis>
    <DxValueAxis pane="top">
      <DxGrid :visible="true"/>
      <DxTitle text="Temperature, °C"/>
    </DxValueAxis>
    <DxValueAxis
      :tick-interval="50"
      pane="bottom"
    >
      <DxGrid :visible="true"/>
      <DxTitle text="Humidity, %"/>
    </DxValueAxis>

    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
    <DxExport :enabled="true"/>
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
    />
    <DxTitle text="Weather in Los Angeles, California"/>
  </DxChart>
</template>
<script>

import DxChart, {
  DxCommonSeriesSettings,
  DxSeries,
  DxValueErrorBar,
  DxPane,
  DxArgumentAxis,
  DxValueAxis,
  DxExport,
  DxLegend,
  DxLabel,
  DxTitle,
  DxTooltip,
  DxGrid
} from 'devextreme-vue/chart';
import { weatherData } from './data.js';

export default {
  components: {
    DxChart,
    DxCommonSeriesSettings,
    DxSeries,
    DxValueErrorBar,
    DxPane,
    DxArgumentAxis,
    DxValueAxis,
    DxExport,
    DxLegend,
    DxLabel,
    DxTitle,
    DxTooltip,
    DxGrid
  },

  data() {
    return {
      weatherData
    };
  },

  methods: {
    customizeTooltip(pointInfo) {
      return {
        text: `${pointInfo.seriesName}: ${pointInfo.value
        } (range: ${pointInfo.lowErrorValue
        } - ${pointInfo.highErrorValue})`
      };
    }
  }
};
</script>
<style>
#chart {
	height: 440px;
}
</style>
