<template>
  <DxVectorMap
    id="vector-map"
    :bounds="bounds"
    :max-zoom-factor="3"
    title="Sea Currents"
  >
    <DxLayer
      :data-source="mapsWorld"
      :hover-enabled="false"
    />
    <DxLayer
      :data-source="streamsData"
      :color-groups="colorGroups"
      :hover-enabled="false"
      :palette="streamsPalette"
      color-grouping-field="tag"
      border-color="none"
      name="water"
    />
    <DxLegend
      :customize-text="customizeText"
      horizontal-alignment="right"
      vertical-alignment="top"
    >
      <DxSource
        layer="water"
        grouping="color"
      />
      <DxFont :size="14"/>
    </DxLegend>
    <DxExport :enabled="true"/>
  </DxVectorMap>
</template>
<script>

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';

import {
  DxVectorMap,
  DxExport,
  DxLayer,
  DxLegend,
  DxSource,
  DxFont,
} from 'devextreme-vue/vector-map';

import { streamsData } from './data.js';

export default {
  components: {
    DxVectorMap,
    DxExport,
    DxLayer,
    DxLegend,
    DxSource,
    DxFont,
  },
  data() {
    return {
      streamsData,
      mapsWorld: mapsData.world,
      bounds: [-180, 85, 180, -75],
      colorGroups: [0, 1, 2],
      streamsPalette: ['#3c20c8', '#d82020'],
    };
  },
  methods: {
    customizeText({ color }) {
      if (color === '#3c20c8') {
        return 'Cold';
      }
      return 'Warm';
    },
  },
};
</script>
<style>
#vector-map {
  height: 550px;
}
</style>
