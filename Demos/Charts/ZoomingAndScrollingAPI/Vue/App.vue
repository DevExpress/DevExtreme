<template>
  <div>
    <DxChart
      :data-source="zoomingData"
      :series="series"
      palette="Harmony Light"
    >
      <DxCommonSeriesSettings>
        <DxPoint :size="7"/>
      </DxCommonSeriesSettings>
      <DxLegend :visible="false"/>
      <DxArgumentAxis :visual-range="range"/>
    </DxChart>
    <DxRangeSelector
      :data-source="zoomingData"
      v-model:value="range"
    >
      <DxSize :height="120"/>
      <DxMargin :left="10"/>
      <DxScale :minor-tick-count="1"/>
      <DxRsChart
        :series="series"
        palette="Harmony Light"
      />
      <DxBehavior call-value-changed="onMoving"/>
    </DxRangeSelector>
  </div>
</template>
<script>
import { zoomingData } from './data.js';
import {
  DxChart,
  DxCommonSeriesSettings,
  DxPoint,
  DxLegend,
  DxArgumentAxis
} from 'devextreme-vue/chart';
import {
  DxRangeSelector,
  DxSize,
  DxMargin,
  DxScale,
  DxChart as DxRsChart,
  DxBehavior
} from 'devextreme-vue/range-selector';

export default {
  components: {
    DxChart,
    DxCommonSeriesSettings,
    DxPoint,
    DxLegend,
    DxArgumentAxis,
    DxRangeSelector,
    DxSize,
    DxMargin,
    DxScale,
    DxRsChart,
    DxBehavior
  },
  data() {
    return {
      zoomingData,
      range: [],
      series: [{
        valueField: 'y1'
      }, {
        valueField: 'y2'
      }, {
        valueField: 'y3'
      }]
    };
  }
};
</script>
