<template>
  <DxVectorMap
    id="vector-map"
    :bounds="bounds"
  >
    <DxLayer
      :data-source="usa"
    />
    <DxCommonAnnotationSettings
      type="custom"
      template="annotationTemplate"
    />
    <DxAnnotation
      v-for="state in statesData"
      :coordinates="state.coordinates"
      :offset-x="state.offsetX"
      :offset-y="state.offsetY"
      :data="state.data"
      :key="state.data.name"
    />
    <template #annotationTemplate="{ data }">
      <AnnotationTemplate :annotation="data"/>
    </template>
  </DxVectorMap>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import * as mapsData from 'devextreme-dist/js/vectormap-data/usa.js';
import {
  DxVectorMap,
  DxLayer,
  DxAnnotation,
  DxCommonAnnotationSettings,
} from 'devextreme-vue/vector-map';
import { statesData } from './data.js';
import AnnotationTemplate from './AnnotationTemplate.vue';

const usa = ref(mapsData.usa);
const bounds = ref([-118, 55, -80, 23]);
</script>
<style>
#vector-map {
  height: 440px;
}
</style>
