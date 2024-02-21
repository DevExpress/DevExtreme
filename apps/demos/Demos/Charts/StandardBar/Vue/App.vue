<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
  >
    <DxSeries
      argument-field="day"
      value-field="oranges"
      name="My oranges"
      type="bar"
      color="#ffaa66"
    />
  </DxChart>
</template>
<script setup lang="ts">
import { DxChart, DxSeries } from 'devextreme-vue/chart';
import { dataSource } from './data.ts';
</script>
<style>
#chart {
  height: 440px;
}
</style>
