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
<script>

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';

import {
  DxVectorMap,
  DxLayer,
  DxLegend,
  DxSource,
} from 'devextreme-vue/vector-map';

import { populations } from './data.js';

export default {
  components: {
    DxVectorMap,
    DxLayer,
    DxLegend,
    DxSource,
  },
  data() {
    return {
      mapsWorld: mapsData.world,
      bounds: [-180, 85, 180, -60],
      colorGroups: [0, 0.5, 0.8, 1, 2, 3, 100],
    };
  },
  methods: {
    customizeLayer(elements) {
      elements.forEach((element) => {
        element.attribute('population', populations[element.attribute('name')]);
      });
    },
    customizeText(itemInfo) {
      let text;
      if (itemInfo.index === 0) {
        text = '< 0.5%';
      } else if (itemInfo.index === 5) {
        text = '> 3%';
      } else {
        text = `${itemInfo.start}% to ${itemInfo.end}%`;
      }
      return text;
    },
  },
};
</script>
<style>
#vector-map {
  height: 440px;
}
</style>
