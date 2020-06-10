<template>
  <DxChart
    id="chart"
    :data-source="grossProductData"
    :sticky-hovering="false"
    title="Great Lakes Gross State Product"
  >
    <DxCommonSeriesSettings
      type="spline"
      argument-field="state"
      hover-mode="includePoints"
    >
      <DxPoint hover-mode="allArgumentPoints"/>
    </DxCommonSeriesSettings>
    <DxSeries
      v-for="year in yearSources"
      :key="year.value"
      :value-field="year.value"
      :name="year.name"
    />
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
      hover-mode="excludePoints"
    />
    <DxExport :enabled="true"/>
  </DxChart>
</template>
<script>

import {
  DxChart,
  DxCommonSeriesSettings,
  DxSeries,
  DxExport,
  DxLegend,
  DxPoint
} from 'devextreme-vue/chart';

import { yearSources, grossProductData } from './data.js';

export default {

  components: {
    DxChart,
    DxCommonSeriesSettings,
    DxSeries,
    DxExport,
    DxLegend,
    DxPoint
  },

  data() {
    return {
      yearSources,
      grossProductData
    };
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
