<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    palette="Violet"
  >
    <DxSeriesTemplate
      :customize-series="customizeSeries"
      name-field="year"
    />
    <DxCommonSeriesSettings
      argument-field="country"
      value-field="oil"
      type="bar"
    />
    <DxTitle text="Oil Production">
      <DxSubtitle text="(in millions tonnes)"/>
    </DxTitle>
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
    <DxExport :enabled="true"/>
  </DxChart>
</template>
<script>

import DxChart, {
  DxLegend,
  DxSeriesTemplate,
  DxTitle,
  DxSubtitle,
  DxCommonSeriesSettings,
  DxExport
} from 'devextreme-vue/chart';

import { dataSource } from './data.js';

export default {
  components: {
    DxChart,
    DxLegend,
    DxSeriesTemplate,
    DxTitle,
    DxSubtitle,
    DxCommonSeriesSettings,
    DxExport
  },
  data() {
    return {
      dataSource
    };
  },
  methods: {
    customizeSeries(seriesName) {
      return seriesName === 2009 ? { type: 'line', label: { visible: true }, color: '#ff3f7a' } : {};
    }
  }
};
</script>
<style>
#chart {
    height: 440px;
    width: 100%;
}
</style>
