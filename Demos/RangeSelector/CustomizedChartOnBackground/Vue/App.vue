<template>
  <DxRangeSelector
    id="range-selector"
    :data-source="dataSource"
    v-model:value="range"
    title="Select a Range in the CPU Usage History"
  >
    <DxMargin
      :left="15"
      :right="15"
      :top="50"
    />
    <DxScale
      :minor-tick-interval="0.5"
      :tick-interval="1"
    >
      <DxLabel :customize-text="customizeText"/>
    </DxScale>
    <DxSliderMarker :visible="false"/>
    <DxBackground color="#808080"/>
    <DxChart
      :top-indent="0.05"
      :bottom-indent="0.05"
    >
      <DxSeries
        :width="3"
        color="#ffa500"
        type="line"
        argument-field="x"
        value-field="y"
      />
    </DxChart>
  </DxRangeSelector>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxRangeSelector,
  DxMargin,
  DxScale,
  DxLabel,
  DxSliderMarker,
  DxBackground,
  DxChart,
  DxSeries,
} from 'devextreme-vue/range-selector';
import { dataSource } from './data.js';

const range = ref([0, 5]);

const customizeText = ({ valueText }) => `${valueText} s`;
</script>
<style scoped>
#range-selector {
  height: 270px;
}
</style>
