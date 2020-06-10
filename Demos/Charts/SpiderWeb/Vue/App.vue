<template>
  <DxPolarChart
    id="chart"
    :data-source="productionData"
    :use-spider-web="true"
    title="Fruit Production in 2010 (Millions of Tons)"
  >
    <DxCommonSeriesSettings type="line"/>
    <DxSeries
      v-for="fruit in fruitSources"
      :key="fruit.value"
      :value-field="fruit.value"
      :name="fruit.name"
    />
    <DxExport :enabled="true"/>
    <DxTooltip :enabled="true"/>
  </DxPolarChart>
</template>
<script>

import {
  DxPolarChart,
  DxCommonSeriesSettings,
  DxSeries,
  DxExport,
  DxTooltip
} from 'devextreme-vue/polar-chart';

import { fruitSources, productionData } from './data.js';

export default {

  components: {
    DxPolarChart,
    DxCommonSeriesSettings,
    DxSeries,
    DxExport,
    DxTooltip
  },

  data() {
    return {
      fruitSources,
      productionData
    };
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
