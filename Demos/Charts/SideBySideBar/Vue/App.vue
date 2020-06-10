<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    title="Gross State Product within the Great Lakes Region"
    @pointClick="onPointClick"
  >
    <DxCommonSeriesSettings
      argument-field="state"
      type="bar"
      hover-mode="allArgumentPoints"
      selection-mode="allArgumentPoints"
    >
      <DxLabel :visible="true">
        <DxFormat
          :precision="0"
          type="fixedPoint"
        />
      </DxLabel>
    </DxCommonSeriesSettings>
    <DxSeries
      value-field="year2004"
      name="2004"
    />
    <DxSeries
      value-field="year2001"
      name="2001"
    />
    <DxSeries
      value-field="year1998"
      name="1998"
    />
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
    <DxExport :enabled="true"/>
  </DxChart>
</template>
<script>
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxLabel,
  DxFormat,
  DxLegend,
  DxExport
} from 'devextreme-vue/chart';
import { grossProductData } from './data.js';

export default {
  components: {
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxLabel,
    DxFormat,
    DxLegend,
    DxExport
  },
  data() {
    return {
      dataSource: grossProductData
    };
  },
  methods: {
    onPointClick({ target }) {
      target.select();
    }
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
