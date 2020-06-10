<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    title="Australian Medal Count"
  >
    <DxSeries
      value-field="bronze"
      name="Bronze Medals"
      color="#cd7f32"
    />
    <DxSeries
      value-field="silver"
      name="Silver Medals"
      color="#c0c0c0"
    />
    <DxSeries
      value-field="gold"
      name="Gold Medals"
      color="#ffd700"
    />
    <DxCommonSeriesSettings
      type="steparea"
      argument-field="year"
    >
      <DxBorder :visible="false"/>
    </DxCommonSeriesSettings>
    <DxArgumentAxis :value-margins-enabled="false">
      <DxLabel format="decimal"/>
    </DxArgumentAxis>
    <DxExport :enabled="true"/>
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
  </DxChart>
</template>
<script>

import DxChart, {
  DxArgumentAxis,
  DxSeries,
  DxCommonSeriesSettings,
  DxLabel,
  DxLegend,
  DxBorder,
  DxExport
} from 'devextreme-vue/chart';

import { dataSource } from './data.js';

export default {
  components: {
    DxChart,
    DxArgumentAxis,
    DxSeries,
    DxCommonSeriesSettings,
    DxLabel,
    DxLegend,
    DxBorder,
    DxExport
  },
  data() {
    return {
      dataSource
    };
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
