<template>
  <DxVectorMap
    id="vector-map"
    :max-zoom-factor="4"
    :projection="projection"
  >
    <DxLayer
      :data-source="buildingData"
      :hover-enabled="false"
      name="building"
    />
    <DxLayer
      :data-source="roomsData"
      :border-width="1"
      name="rooms"
      color="transparent"
    >
      <DxLabel
        :enabled="true"
        data-field="name"
      />
    </DxLayer>
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
    />
  </DxVectorMap>
</template>
<script>

import {
  DxVectorMap,
  DxLayer,
  DxLabel,
  DxTooltip
} from 'devextreme-vue/vector-map';

import { roomsData, buildingData } from './data.js';

export default {
  components: {
    DxVectorMap,
    DxLayer,
    DxLabel,
    DxTooltip
  },
  data() {
    return {
      roomsData,
      buildingData,
      projection: {
        to: ([l, lt]) => [l / 100, lt / 100],
        from: ([x, y]) => [x * 100, y * 100]
      }
    };
  },

  methods: {
    customizeTooltip(info) {
      if (info.layer.name === 'rooms') {
        return { text: `Square: ${info.attribute('square')} ft&#178` };
      }
    }
  }
};
</script>
<style>
#vector-map {
    height: 400px;
}
</style>
