<template>
  <DxTreeMap
    id="treemap"
    :data-source="citiesPopulation"
    title="The Most Populated Cities by Continents"
    id-field="id"
    parent-field="parentId"
  >
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
      format="thousands"
    />
  </DxTreeMap>
</template>

<script setup lang="ts">
import DxTreeMap, { DxTooltip } from 'devextreme-vue/tree-map';
import { citiesPopulation } from './data.js';

const customizeTooltip = ({ node, node: { data: { name, country } }, valueText }) => (
  {
    text: node.isLeaf()
      ? `<span class="city">${name}</span> (${country})<br/>Population: ${valueText}`
      : null,
  });
</script>

<style>
#treemap {
  height: 500px;
}

.city {
  font-weight: 500;
}
</style>
