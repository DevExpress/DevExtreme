<template>
  <DxRangeSelector
    id="range-selector"
    :data-source="dataSource"
    v-model:value="range"
    title="Select a Range in the Costs and Revenues History"
  >
    <DxMargin :top="50"/>
    <DxScale>
      <DxMinorTickInterval :days="1"/>
      <DxTickInterval :days="7"/>
    </DxScale>
    <DxChart>
      <DxSeries
        argument-field="t"
        value-field="costs"
      />
      <DxSeries
        argument-field="t"
        value-field="income"
      />
      <DxValueAxis :min="0"/>
    </DxChart>
  </DxRangeSelector>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import {
  DxRangeSelector,
  DxMargin,
  DxScale,
  DxTickInterval,
  DxMinorTickInterval,
  DxChart,
  DxSeries,
  DxValueAxis,
} from 'devextreme-vue/range-selector';
import { dataSource } from './data.ts';

const range = reactive([new Date(2011, 11, 25), new Date(2012, 0, 1)]);
</script>
<style scoped>
#range-selector {
  height: 310px;
}
</style>
