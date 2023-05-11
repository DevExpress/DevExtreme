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

import { populations, markers } from './data.js';

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
      populations,
      colorGroups: [0, 0.5, 0.8, 1, 2, 3, 100],
      mapsWorld: mapsData.world,
      bounds: [-180, 85, 180, -75],
      sizeGroups: [0, 8000, 10000, 50000],
    };
  },
  methods: {
    customizeText(itemInfo) {
      if (itemInfo.index === 0) {
        return '< 0.5%';
      } if (itemInfo.index === 5) {
        return '> 3%';
      }
      return `${itemInfo.start}% to ${itemInfo.end}%`;
    },

    customizeTooltip(info) {
      return {
        text: info.attribute('text'),
      };
    },

    customizeMarkers({ index }) {
      return ['< 8000K', '8000K to 10000K', '> 10000K'][index];
    },

    customizeItems(items) {
      return items.reverse();
    },

    customizeLayer(elements) {
      elements.forEach((element) => {
        const name = element.attribute('name');
        const population = this.populations[name];
        if (population) {
          element.attribute('population', population);
        }
      });
    },
  },
};
</script>
<style>
#vector-map {
  height: 700px;
}
</style>
