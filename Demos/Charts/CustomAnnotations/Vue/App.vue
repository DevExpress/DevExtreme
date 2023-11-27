<template>
  <div>
    <DxChart
      id="chart"
      :data-source="populationData"
      title="Top 5 Most Populated States in US"
    >
      <DxSeries
        type="bar"
        argument-field="name"
        value-field="population"
        name="Population"
      />

      <DxLegend
        :visible="false"
      />
      <DxCommonAnnotationSettings
        :allow-dragging="true"
        type="custom"
        series="Population"
        template="annotationTemplate"
      />
      <DxAnnotation
        v-for="data in populationData"
        :argument="data.name"
        :data="data"
        :key="data.name"
      />
      <template #annotationTemplate="{ data }">
        <AnnotationTemplate :annotation="data"/>
      </template>
    </DxChart>
  </div>
</template>
<script setup lang="ts">
import {
  DxChart, DxSeries, DxLegend, DxAnnotation, DxCommonAnnotationSettings,
} from 'devextreme-vue/chart';
import { populationData } from './data.ts';
import AnnotationTemplate from './AnnotationTemplate.vue';
</script>
<style scoped>
#chart {
  height: 440px;
}
</style>
