<template>
  <DxVectorMap
    id="vector-map"
    :bounds="bounds"
  >
    <DxLayer
      :data-source="mapsWorld"
      :hover-enabled="false"
      name="areas"
      color-grouping-field="population"
    />
    <DxLayer
      :data-source="markers"
      :size-groups="sizeGroups"
      :min-size="20"
      :max-size="40"
      :opacity="0.8"
      name="bubbles"
      element-type="bubble"
      data-field="value"
    />
    <DxLegend
      :customize-items="customizeItems"
      :customize-text="customizeText"
      marker-shape="circle"
    >
      <DxSource
        layer="bubbles"
        grouping="size"
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

import { markers } from './data.js';

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
      sizeGroups: [0, 8000, 10000, 50000],
    };
  },
  methods: {
    customizeTooltip(info) {
      if (info.layer.type === 'marker') {
        return { text: info.attribute('tooltip') };
      }
      return null;
    },

    customizeText({ index }) {
      return ['< 8000K', '8000K to 10000K', '> 10000K'][index];
    },

    customizeItems(items) {
      return items.reverse();
    },
  },
};
</script>
<style>
#vector-map {
  height: 440px;
}
</style>
