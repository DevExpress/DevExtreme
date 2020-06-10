<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    title="Male Age Structure"
  >
    <DxCommonSeriesSettings
      argument-field="state"
      type="stackedbar"
    />
    <DxValueAxis position="right">
      <DxTitle text="millions"/>
    </DxValueAxis>
    <DxSeries
      value-field="young"
      name="0-14"
    />
    <DxSeries
      value-field="middle"
      name="15-64"
    />
    <DxSeries
      value-field="older"
      name="65 and older"
    />
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
      item-text-position="top"
    />
    <DxExport :enabled="true"/>
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
      location="edge"
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
      dataSource: service.getMaleAgeData()
    };
  },
  methods: {
    customizeTooltip(pointInfo) {
      return {
        text: `${pointInfo.seriesName} years: ${pointInfo.valueText}`
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
