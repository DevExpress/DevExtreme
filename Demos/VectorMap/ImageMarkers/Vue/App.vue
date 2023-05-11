<template>
  <DxVectorMap
    id="vector-map"
    :bounds="bounds"
  >
    <DxLayer
      :data-source="usa"
      :hover-enabled="false"
      border-color="#ffffff"
    />
    <DxLayer
      :data-source="weatherData"
      :size="51"
      data-field="url"
      element-type="image"
      type="marker"
    >
      <DxLabel
        data-field="text"
      >
        <DxFont :size="14"/>
      </DxLabel>
    </DxLayer>
    <dx-loading-indicator :show="true"/>
  </DxVectorMap>
</template>
<script>

import * as mapsData from 'devextreme-dist/js/vectormap-data/usa.js';

import {
  DxVectorMap,
  DxLabel,
  DxLayer,
  DxFont,
} from 'devextreme-vue/vector-map';

import { weatherData } from './data.js';

export default {
  components: {
    DxVectorMap,
    DxLabel,
    DxLayer,
    DxFont,
  },
  data() {
    return {
      weatherData,
      usa: mapsData.usa,
      bounds: [-118, 52, -80, 20],
    };
  },
};
</script>
<style>
#vector-map {
  height: 440px;
}
</style>
