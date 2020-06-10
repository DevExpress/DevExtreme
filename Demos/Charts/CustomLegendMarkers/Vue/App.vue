<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    title="Noisy and Original Signals"
    @legend-click="onLegendClick"
  >
    <DxCommonSeriesSettings
      argument-field="argument"
    >
      <DxPoint :visible="false"/>
    </DxCommonSeriesSettings>
    <DxSeries
      value-field="originalValue"
      name="Original Signal"
    />
    <DxSeries
      value-field="value"
      name="Noisy Signal"
    />
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
      marker-template="markerTemplate"
    />
    <template #markerTemplate="{ data }">
      <MarkerTemplate :item="data"/>
    </template>
  </DxChart>
</template>
<script>
import { DxChart, DxSeries, DxCommonSeriesSettings, DxPoint, DxLegend } from 'devextreme-vue/chart';
import { dataSource } from './data.js';
import MarkerTemplate from './MarkerTemplate.vue';

export default {
  components: {
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxPoint,
    DxLegend,
    MarkerTemplate
  },
  data() {
    return {
      dataSource
    };
  },
  methods: {
    onLegendClick(e) {
      e.target.isVisible() ? e.target.hide() : e.target.show();
    }
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
