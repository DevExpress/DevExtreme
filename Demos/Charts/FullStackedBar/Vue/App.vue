<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
  >
    <DxCommonSeriesSettings
      argument-field="country"
      type="fullstackedbar"
    />
    <DxTitle
      text="Energy Consumption in 2004"
      subtitle="(Millions of Tons, Oil Equivalent)"
    />
    <DxSeries
      value-field="hydro"
      name="Hydro-electric"
    />
    <DxSeries
      value-field="oil"
      name="Oil"
    />
    <DxSeries
      value-field="gas"
      name="Natural gas"
    />
    <DxSeries
      value-field="coal"
      name="Coal"
    />
    <DxSeries
      value-field="nuclear"
      name="Nuclear"
    />
    <DxLegend
      vertical-alignment="top"
      horizontal-alignment="center"
      item-text-position="right"
    />
    <DxExport :enabled="true"/>
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
    />
  </DxChart>
</template>
<script>
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxValueAxis,
  DxTitle,
  DxLegend,
  DxExport,
  DxTooltip
} from 'devextreme-vue/chart';

import service from './data.js';

export default {
  components: {
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxValueAxis,
    DxTitle,
    DxLegend,
    DxExport,
    DxTooltip
  },
  data() {
    return {
      dataSource: service.dataSource()
    };
  },
  methods: {
    customizeTooltip(pointInfo) {
      return {
        text: `${pointInfo.percentText} years: ${pointInfo.valueText}`
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
