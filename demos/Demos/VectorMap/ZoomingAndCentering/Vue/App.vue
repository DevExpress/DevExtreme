<template>
  <div>
    <DxVectorMap
      id="vector-map"
      ref="vectorMap"
      :bounds="bounds"
      @click="markerClick"
    >
      <DxLayer
        :data-source="mapsWorld"
        :hover-enabled="false"
      />
      <DxLayer :data-source="markers"/>
      <DxTooltip
        :enabled="true"
        :customize-tooltip="customizeTooltip"
      />
    </DxVectorMap>
    <DxButton
      id="reset"
      text="Reset"
      @click="reset"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import {
  DxVectorMap,
  DxLayer,
  DxTooltip,
} from 'devextreme-vue/vector-map';
import {
  DxButton,
} from 'devextreme-vue/button';
import { markers } from './data.ts';

const mapsWorld = mapsData.world;
const bounds = [-180, 85, 180, -60];
const vectorMap = ref();

function customizeTooltip(info) {
  if (info.layer.type === 'marker') {
    return { text: info.attribute('name') };
  }
  return null;
}
function markerClick(e) {
  if (e.target?.layer.type === 'marker') {
    e.component.center(e.target.coordinates()).zoomFactor(10);
  }
}
function reset() {
  const vectorMapInstance = vectorMap.value.instance;
  vectorMapInstance.center(null);
  vectorMapInstance.zoomFactor(null);
}
</script>
<style>
#vector-map {
  height: 420px;
}

#reset {
  margin: 10px 2px;
}
</style>
