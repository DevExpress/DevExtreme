<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    palette="Soft"
  >
    <DxCommonSeriesSettings
      :bar-padding="0.5"
      argument-field="state"
      type="bar"
    />
    <DxSeries
      value-field="year1970"
      name="1970"
    />
    <DxSeries
      value-field="year1980"
      name="1980"
    />
    <DxSeries
      value-field="year1990"
      name="1990"
    />
    <DxSeries
      value-field="year2000"
      name="2000"
    />
    <DxSeries
      value-field="year2008"
      name="2008"
    />
    <DxSeries
      value-field="year2009"
      name="2009"
    />
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
    <DxExport :enabled="true"/>
    <DxTitle
      text="Oil Production"
      subtitle="(in millions tonnes)"
    />
  </DxChart>
</template>
<script>
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxLegend,
  DxExport,
  DxTitle
} from 'devextreme-vue/chart';

import { dataSource } from './data.js';

export default {
  components: {
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxLegend,
    DxExport,
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
