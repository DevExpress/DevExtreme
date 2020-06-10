<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    palette="Soft"
  >
    <DxCommonSeriesSettings
      :ignore-empty-points="true"
      argument-field="age"
      value-field="number"
      type="bar"
    />
    <DxSeriesTemplate name-field="age"/>
    <DxTitle
      text="Age Breakdown of Facebook Users in the U.S."
      subtitle="as of January 2017"
    />
  </DxChart>
</template>
<script>
import {
  DxChart,
  DxSeriesTemplate,
  DxCommonSeriesSettings,
  DxTitle
} from 'devextreme-vue/chart';

import { dataSource } from './data.js';

export default {
  components: {
    DxChart,
    DxSeriesTemplate,
    DxCommonSeriesSettings,
    DxTitle
  },
  data() {
    return {
      dataSource: dataSource
    };
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
