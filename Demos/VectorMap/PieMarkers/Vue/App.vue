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
<script>

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';

import {
  DxVectorMap,
  DxLabel,
  DxLayer,
  DxLegend,
  DxSource,
  DxTooltip,
} from 'devextreme-vue/vector-map';

import { markers, names } from './data.js';

export default {
  components: {
    DxVectorMap,
    DxLabel,
    DxLayer,
    DxLegend,
    DxSource,
    DxTooltip,
  },
  data() {
    return {
      markers,
      mapsWorld: mapsData.world,
      bounds: [-180, 85, 180, -60],
    };
  },
  methods: {
    customizeTooltip(info) {
      if (info.layer.type === 'marker') {
        return {
          text: info.attribute('tooltip'),
        };
      }
      return null;
    },

    customizeText({ index }) {
      return names[index];
    },
  },
};
</script>
<style>
#vector-map {
  height: 440px;
}
</style>
