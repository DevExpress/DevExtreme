<template>
  <div>
    <DxPieChart
      id="pie-chart"
      :data-source="populationData"
      palette="Bright"
      title="Top 10 Most Populated States in US"
    >
      <DxSeries
        argument-field="name"
        value-field="population"
      />
      <DxExport
        :enabled="true"
      />
      <DxTooltip
        :enabled="true"
        content-template="tooltipTemplate"
      />
      <template #tooltipTemplate="{ data }">
        <TooltipTemplate :info="data"/>
      </template>
    </DxPieChart>
  </div>
</template>
<script setup lang="ts">
import {
  DxPieChart, DxSeries, DxExport, DxTooltip,
} from 'devextreme-vue/pie-chart';
import { populationData } from './data.ts';
import TooltipTemplate from './TooltipTemplate.vue';
</script>
<style scoped>
#pie-chart {
  height: 440px;
}
</style>
