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
<script>
import { populationData } from './data.js';
import { DxChart, DxSeries, DxLegend, DxAnnotation, DxCommonAnnotationSettings } from 'devextreme-vue/chart';
import AnnotationTemplate from './AnnotationTemplate.vue';

export default {
  components: {
    DxChart, DxSeries, DxLegend, DxAnnotation, DxCommonAnnotationSettings, AnnotationTemplate
  },
  data() {
    return {
      populationData: populationData
    };
  }
};
</script>
<style scoped>
#chart {
    height: 440px;
}
</style>
