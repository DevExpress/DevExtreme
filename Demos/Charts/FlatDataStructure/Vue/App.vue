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

<script>

import DxTreeMap, { DxTooltip } from 'devextreme-vue/tree-map';
import { citiesPopulation } from './data.js';

export default {
  components: {
    DxTreeMap,
    DxTooltip
  },
  data() {
    return {
      citiesPopulation
    };
  },
  methods: {
    customizeTooltip(arg) {
      const data = arg.node.data;

      return {
        text: arg.node.isLeaf() ?
          `<span class="city">${data.name}</span> (${data.country})<br/>Population: ${arg.valueText}` :
          null
      };
    }
  }
};
</script>

<style>
#treemap {
    height: 500px;
}
.city {
    font-weight: 500;
}
</style>
