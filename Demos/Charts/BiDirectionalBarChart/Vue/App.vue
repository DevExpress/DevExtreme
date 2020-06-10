<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    :rotated="true"
    :bar-group-width="18"
    title="Population Pyramid For Norway 2016"
  >
    <DxCommonSeriesSettings
      argument-field="age"
      type="stackedbar"
    />
    <DxSeries
      value-field="male"
      name="Male"
      color="#3F7FBF"
    />
    <DxSeries
      value-field="female"
      name="Female"
      color="#F87CCC"
    />
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
    />
    <DxValueAxis>
      <DxLabel :customize-text="customizeLabel"/>
    </DxValueAxis>
    <DxLegend
      :margin="{left: 50}"
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
  </DxChart>
</template>
<script>

import DxChart, {
  DxCommonSeriesSettings,
  DxValueAxis,
  DxLabel,
  DxLegend,
  DxSeries,
  DxTooltip
} from 'devextreme-vue/chart';

import { dataSource } from './data.js';

export default {
  components: {
    DxChart,
    DxCommonSeriesSettings,
    DxValueAxis,
    DxLabel,
    DxLegend,
    DxSeries,
    DxTooltip
  },
  data() {
    return {
      dataSource
    };
  },
  methods: {
    customizeTooltip({ valueText }) {
      return { text: Math.abs(valueText) };
    },
    customizeLabel({ value }) {
      return `${Math.abs(value)}%`;
    }
  }
};
</script>
<style>
#chart {
    height: 549px;
    width: 820px;
    margin: 0 auto;
}
</style>
