<template>
  <DxVectorMap
    id="vector-map"
    :bounds="bounds"
    @click="click"
  >
    <DxLayer
      :data-source="worldData"
      :customize="customizeLayer"
    />
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
    >
      <DxBorder :visible="true"/>
      <DxFont color="#fff"/>
    </DxTooltip>
  </DxVectorMap>
</template>
<script setup lang="ts">
// @ts-ignore
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import {
  DxVectorMap,
  DxLayer,
  DxTooltip,
  DxBorder,
  DxFont,
  type DxVectorMapTypes,
} from 'devextreme-vue/vector-map';
import { countries } from './data.ts';

const worldData = mapsData.world;
const bounds = [-180, 85, 180, -60];

function customizeTooltip(info: any) {
  const name = info.attribute('name');
  const country = countries[name];

  if (country) {
    return {
      text: `${name}: ${country.totalArea}M km&#178`,
      color: country.color,
    };
  }
  return {};
}
function click(e: DxVectorMapTypes.ClickEvent) {
  if (e.target && countries[e.target.attribute('name')]) {
    e.target.selected(!e.target.selected());
  }
}
function customizeLayer(elements: any[]) {
  elements.forEach((element) => {
    const country = countries[element.attribute('name')];
    if (country) {
      element.applySettings({
        color: country.color,
        hoveredColor: '#e0e000',
        selectedColor: '#008f00',
      });
    }
  });
}
</script>
<style>
#vector-map {
  height: 440px;
}
</style>
