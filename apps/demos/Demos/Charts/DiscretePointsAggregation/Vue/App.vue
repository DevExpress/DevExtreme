<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
  >
    <DxTitle text="Production of Crude Oil">
      <DxSubtitle text="(in Barrels)"/>
    </DxTitle>
    <DxCommonSeriesSettings
      argument-field="state"
      value-field="value"
      type="bar"
    >
      <DxAggregation
        :enabled="true"
        method="sum"
      />
    </DxCommonSeriesSettings>
    <DxSeriesTemplate name-field="year"/>
  </DxChart>
</template>
<script setup lang="ts">
import DxChart, {
  DxTitle,
  DxSubtitle,
  DxCommonSeriesSettings,
  DxAggregation,
  DxSeriesTemplate,
} from 'devextreme-vue/chart';
import { oilProductionData } from './data.ts';

const dataSource = oilProductionData;
</script>
<style>
#chart {
  height: 440px;
}
</style>
