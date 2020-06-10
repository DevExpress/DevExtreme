<template>
  <DxChart
    id="chart"
    :data-source="inflationData"
    palette="Violet"
    title="Annual Inflation Rate in 2010 and 2011"
  >
    <DxCommonSeriesSettings
      argument-field="date"
      type="rangearea"
    />
    <DxSeries
      range-value1-field="val2010"
      range-value2-field="val2011"
      name="2010 - 2011"
    />

    <DxArgumentAxis :value-margins-enabled="false">
      <DxLabel format="month"/>
    </DxArgumentAxis>
    <DxValueAxis
      :tick-interval="0.5"
      :value-margins-enabled="false"
    >
      <DxVisualRange
        start-value="0.5"
        end-value="4"
      />
      <DxLabel :customize-text="customizeLabelText">
        <DxFormat
          :precision="2"
          type="fixedPoint"
        />
      </DxLabel>
    </DxValueAxis>

    <DxExport :enabled="true"/>
    <DxLegend :visible="false"/>
  </DxChart>
</template>
<script>

import DxChart, {
  DxCommonSeriesSettings,
  DxSeries,
  DxArgumentAxis,
  DxValueAxis,
  DxLabel,
  DxVisualRange,
  DxFormat,
  DxExport,
  DxLegend
} from 'devextreme-vue/chart';
import { inflationData } from './data.js';

export default {
  components: {
    DxChart,
    DxCommonSeriesSettings,
    DxSeries,
    DxArgumentAxis,
    DxValueAxis,
    DxLabel,
    DxVisualRange,
    DxFormat,
    DxExport,
    DxLegend
  },
  data() {
    return {
      inflationData
    };
  },
  methods: {
    customizeLabelText({ valueText }) {
      return `${valueText} %`;
    }
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
