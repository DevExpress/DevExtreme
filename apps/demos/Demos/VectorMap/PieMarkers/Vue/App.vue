<template>
  <DxVectorMap
    id="vector-map"
    :bounds="bounds"
  >
    <DxLayer
      :data-source="mapsWorld"
      :hover-enabled="false"
    />
    <DxLayer
      :data-source="markers"
      name="pies"
      element-type="pie"
      data-field="values"
    />
    <DxLegend
      :customize-text="customizeText"
    >
      <DxSource
        layer="pies"
        grouping="color"
      />
    </DxLegend>
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
    />
  </DxVectorMap>
</template>
<script setup lang="ts">
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import {
  DxVectorMap,
  DxLayer,
  DxLegend,
  DxSource,
  DxTooltip,
} from 'devextreme-vue/vector-map';
import { markers, names } from './data.ts';

const mapsWorld = mapsData.world;
const bounds = [-180, 85, 180, -60];
const customizeTooltip = (info) => ((info.layer.type === 'marker') ? { text: info.attribute('tooltip') } : null);
const customizeText = ({ index }) => names[index];
</script>
<style>
#vector-map {
  height: 440px;
}
</style>
