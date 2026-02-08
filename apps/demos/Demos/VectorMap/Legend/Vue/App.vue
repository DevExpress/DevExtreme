<template>
  <DxVectorMap
    id="vector-map"
    :bounds="bounds"
  >
    <DxLayer
      :data-source="mapsWorld"
      :color-groups="colorGroups"
      :customize="customizeLayer"
      name="areas"
      color-grouping-field="population"
      palette="Violet"
    >
      <DxLabel
        :enabled="true"
        data-field="name"
      />
    </DxLayer>
    <DxLayer
      :data-source="markers"
      :size-groups="sizeGroups"
      :opacity="0.8"
      name="markers"
      element-type="bubble"
      data-field="value"
    >
      <DxLabel
        :enabled="false"
      />
    </DxLayer>
    <DxLegend
      :customize-items="customizeItems"
      :customize-text="customizeText"
      title="World Population<br/>Percentages"
      horizontal-alignment="left"
      vertical-alignment="bottom"
    >
      <DxSource
        layer="areas"
        grouping="color"
      />
    </DxLegend>
    <DxLegend
      :customize-items="customizeItems"
      :customize-text="customizeMarkers"
      title="City Population"
      marker-shape="circle"
      horizontal-alignment="right"
      vertical-alignment="bottom"
    >
      <DxSource
        layer="markers"
        grouping="size"
      />
    </DxLegend>
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
    />
  </DxVectorMap>
</template>
<script setup lang="ts">
// @ts-ignore
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import {
  DxVectorMap,
  DxLabel,
  DxLayer,
  DxLegend,
  DxSource,
  DxTooltip,
  type DxVectorMapTypes,
} from 'devextreme-vue/vector-map';
import { type MapLayerElement } from 'devextreme/viz/vector_map';
import { populations, markers } from './data.ts';

const colorGroups = [0, 0.5, 0.8, 1, 2, 3, 100];
const mapsWorld: Record<string, unknown> = mapsData.world;
const bounds = [-180, 85, 180, -75];
const sizeGroups = [0, 8000, 10000, 50000];
const customizeTooltip = (info: MapLayerElement) => ({ text: info.attribute('text') });
const customizeMarkers = ({ index }: any) => ['< 8000K', '8000K to 10000K', '> 10000K'][index];
const customizeItems = (items: DxVectorMapTypes.LegendItem[]) => items.reverse();

function customizeText({ index, start, end }: Record<string, any>) {
  if (index === 0) {
    return '< 0.5%';
  }

  return (index === 5) ? '> 3%' : `${start}% to ${end}%`;
}
function customizeLayer(elements: MapLayerElement[]) {
  elements.forEach((element) => {
    const name: string = element.attribute('name');
    const population = populations[name];
    if (population) {
      element.attribute('population', population);
    }
  });
}
</script>
<style>
#vector-map {
  height: 700px;
}
</style>
