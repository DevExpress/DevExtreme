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
<script>

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';

import {
  DxVectorMap,
  DxLayer,
  DxSource,
  DxTooltip,
  DxBorder,
  DxFont,
} from 'devextreme-vue/vector-map';

import { countries } from './data.js';

export default {
  components: {
    DxVectorMap,
    DxLayer,
    DxSource,
    DxTooltip,
    DxBorder,
    DxFont,
  },
  data() {
    return {
      worldData: mapsData.world,
      bounds: [-180, 85, 180, -60],
    };
  },
  methods: {
    customizeTooltip(info) {
      const name = info.attribute('name');
      const country = countries[name];
      if (country) {
        return {
          text: `${name}: ${country.totalArea}M km&#178`,
          color: country.color,
        };
      }
      return null;
    },

    click({ target }) {
      if (target && countries[target.attribute('name')]) {
        target.selected(!target.selected());
      }
    },

    customizeLayer(elements) {
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
    },
  },
};
</script>
<style>
#vector-map {
  height: 440px;
}
</style>
