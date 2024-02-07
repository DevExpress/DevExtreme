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
<script setup lang="ts">
import {
  DxVectorMap,
  DxLayer,
  DxLabel,
  DxTooltip,
} from 'devextreme-vue/vector-map';
import { roomsData, buildingData } from './data.ts';

const projection = {
  to: ([l, lt]) => [l / 100, lt / 100],
  from: ([x, y]) => [x * 100, y * 100],
};

const customizeTooltip = (info) => (info.layer.name === 'rooms'
  ? { text: `Square: ${info.attribute('square')} ft&#178` }
  : null);
</script>
<style>
#vector-map {
  height: 400px;
}
</style>
