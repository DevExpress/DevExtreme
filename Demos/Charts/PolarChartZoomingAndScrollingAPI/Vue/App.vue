<template>
  <div>
    <DxPolarChart
      id="zoomedChart"
      :data-source="dataSource"
      title="Stochastic Process"
    >
      <DxCommonSeriesSettings
        :closed="false"
        argument-field="argument"
      />
      <DxSeries
        type="scatter"
        name="Test results"
        value-field="value"
      >
        <DxPoint :size="8"/>
      </DxSeries>
      <DxSeries
        type="line"
        name="Expected average"
        value-field="originalValue"
      >
        <DxPoint :visible="false"/>
      </DxSeries>
      <DxArgumentAxis
        :start-angle="90"
        :tick-interval="30"
      />
      <DxValueAxis :visual-range="visualRange"/>
      <DxExport :enabled="true"/>
      <DxLegend
        hover-mode="excludePoints"
        vertical-alignment="top"
        horizontal-alignment="center"
      />
    </DxPolarChart>
    <DxRangeSelector
      v-model:value="visualRange"
    >
      <DxSize :height="100"/>
      <DxMargin
        :top="10"
        :left="60"
        :bottom="10"
        :right="50"
      />
      <DxScale
        :start-value="0"
        :end-value="8"
        :minor-tick-interval="0.1"
        :tick-interval="1"
      >
        <DxMinorTick :visible="false"/>
      </DxScale>
      <DxBehavior call-value-changed="onMoving"/>
    </DxRangeSelector>
  </div>
</template>
<script>
import DxPolarChart, {
  DxCommonSeriesSettings,
  DxSeries,
  DxPoint,
  DxArgumentAxis,
  DxValueAxis,
  DxExport,
  DxLegend
} from 'devextreme-vue/polar-chart';

import DxRangeSelector, {
  DxSize,
  DxMargin,
  DxScale,
  DxMinorTick,
  DxBehavior
} from 'devextreme-vue/range-selector';

import { dataSource } from './data.js';

export default {
  components: {
    DxPolarChart,
    DxCommonSeriesSettings,
    DxSeries,
    DxPoint,
    DxArgumentAxis,
    DxValueAxis,
    DxExport,
    DxLegend,
    DxRangeSelector,
    DxSize,
    DxMargin,
    DxScale,
    DxMinorTick,
    DxBehavior
  },
  data() {
    return {
      dataSource,
      visualRange: {
        startValue: 0,
        endValue: 8
      }
    };
  }
};
</script>
<style>
#zoomedChart {
	height: 440px;
	width: 100%;
}
</style>
