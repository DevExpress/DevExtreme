<template>
  <DxChart
    id="chart"
    :data-source="oilPrices"
    palette="Violet"
    title="Crude Oil Prices in 2005"
  >
    <DxCommonSeriesSettings
      argument-field="date"
      type="rangebar"
    />
    <DxSeries
      range-value1-field="aVal1"
      range-value2-field="aVal2"
      name="ANS West Coast"
    />
    <DxSeries
      range-value1-field="tVal1"
      range-value2-field="tVal2"
      name="West Texas Intermediate"
    />

    <DxArgumentAxis>
      <DxLabel format="month"/>
    </DxArgumentAxis>
    <DxValueAxis title="$ per barrel"/>

    <DxExport :enabled="true"/>
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
  </DxChart>
</template>
<script>

import DxChart, {
  DxCommonSeriesSettings,
  DxSeries,
  DxArgumentAxis,
  DxValueAxis,
  DxLabel,
  DxExport,
  DxLegend
} from 'devextreme-vue/chart';
import { oilPrices } from './data.js';

export default {
  components: {
    DxChart,
    DxCommonSeriesSettings,
    DxSeries,
    DxArgumentAxis,
    DxValueAxis,
    DxLabel,
    DxExport,
    DxLegend
  },
  data() {
    return {
      oilPrices
    };
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
