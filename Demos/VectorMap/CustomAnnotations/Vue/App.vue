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
<script>

import * as mapsData from 'devextreme/dist/js/vectormap-data/usa.js';

import {
  DxVectorMap,
  DxLayer,
  DxAnnotation,
  DxCommonAnnotationSettings
} from 'devextreme-vue/vector-map';

import { statesData } from './data.js';
import AnnotationTemplate from './AnnotationTemplate.vue';

export default {
  components: {
    DxVectorMap,
    DxLayer,
    DxAnnotation,
    DxCommonAnnotationSettings,
    AnnotationTemplate
  },
  data() {
    return {
      statesData,
      usa: mapsData.usa,
      bounds: [-118, 55, -80, 23]
    };
  }
};
</script>
<style>
#vector-map {
    height: 440px;
}
</style>
