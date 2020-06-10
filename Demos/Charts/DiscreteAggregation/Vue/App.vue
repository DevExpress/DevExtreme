<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
  >
    <DxTitle text="Production of Crude Oil">
      <DxSubtitle text="(in Barrels)"/>
    </DxTitle>
    <DxCommonSeriesSettings
      argument-field="state"
      value-field="value"
      type="bar"
    >
      <DxAggregation
        :enabled="true"
        method="sum"
      />
    </DxCommonSeriesSettings>
    <DxArgumentAxis :aggregate-by-category="true"/>
    <DxSeriesTemplate name-field="year"/>
  </DxChart>
</template>
<script>

import DxChart, {
  DxArgumentAxis,
  DxTitle,
  DxSubtitle,
  DxCommonSeriesSettings,
  DxAggregation,
  DxSeriesTemplate
} from 'devextreme-vue/chart';

import { oilProductionData } from './data.js';

export default {
  components: {
    DxChart,
    DxArgumentAxis,
    DxTitle,
    DxSubtitle,
    DxCommonSeriesSettings,
    DxAggregation,
    DxSeriesTemplate
  },

  data() {
    return {
      dataSource: oilProductionData
    };
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
