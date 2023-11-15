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
      <DxBehavior value-change-mode="onHandleMove"/>
    </DxRangeSelector>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxChart,
  DxCommonSeriesSettings,
  DxPoint,
  DxLegend,
  DxArgumentAxis,
} from 'devextreme-vue/chart';
import {
  DxRangeSelector,
  DxSize,
  DxMargin,
  DxScale,
  DxChart as DxRsChart,
  DxBehavior,
} from 'devextreme-vue/range-selector';
import { zoomingData } from './data.js';

const range = ref([]);
const series = [{
  valueField: 'y1',
}, {
  valueField: 'y2',
}, {
  valueField: 'y3',
}];
</script>
