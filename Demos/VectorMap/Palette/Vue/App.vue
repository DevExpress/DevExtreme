<template>
  <DxVectorMap
    id="vector-map"
    :bounds="bounds"
  >
    <DxLayer
      :data-source="mapsWorld"
      :color-groups="colorGroups"
      :customize="customizeLayer"
      palette="Violet"
      name="areas"
      color-grouping-field="population"
    />
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
    />
    <DxLegend
      :customize-text="customizeText"
    >
      <DxSource
        layer="areas"
        grouping="color"
      />
    </DxLegend>
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
import { populations } from './data.js';

const mapsWorld = mapsData.world;
const bounds = [-180, 85, 180, -60];
const colorGroups = [0, 0.5, 0.8, 1, 2, 3, 100];

const customizeTooltip = (arg) => ((arg.attribute('population'))
  ? { text: `${arg.attribute('name')}: ${arg.attribute('population')}% of world population` } : null);

const customizeText = ({ index, start, end }) => {
  if (index === 0) {
    return '< 0.5%';
  }

  return (index === 5) ? '> 3%' : `${start}% to ${end}%`;
};
function customizeLayer(elements) {
  elements.forEach((element) => {
    element.attribute('population', populations[element.attribute('name')]);
  });
}
</script>
<style>
#vector-map {
  height: 440px;
}
</style>
