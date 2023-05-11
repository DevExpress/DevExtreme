<template>
  <DxVectorMap
    id="vector-map"
    :projection="customProjection"
    title="Wagner VI projection"
  >
    <DxLayer
      :data-source="world"
    />
    <DxLayer
      :data-source="coordLinesData"
      :hover-enabled="false"
      :border-width="1"
      color="#aaa"
    />

    <DxExport :enabled="true"/>
  </DxVectorMap>
</template>
<script>

import {
  DxVectorMap,
  DxLayer,
  DxExport,
} from 'devextreme-vue/vector-map';

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { coordLinesData } from './data.js';

const RADIANS = Math.PI / 180;
const WAGNER_6_P_LAT = Math.PI / Math.sqrt(3);
const WAGNER_6_U_LAT = 2 / Math.sqrt(3) - 0.1;

export default {
  components: {
    DxVectorMap,
    DxLayer,
    DxExport,
  },
  data() {
    return {
      coordLinesData,
      world: mapsData.world,
      customProjection: {
        aspectRatio: 2,
        to(coordinates) {
          const x = coordinates[0] * RADIANS;
          const y = Math.min(Math.max(coordinates[1] * RADIANS, -WAGNER_6_P_LAT), +WAGNER_6_P_LAT);
          const t = y / Math.PI;
          return [
            (x / Math.PI) * Math.sqrt(1 - 3 * t * t),
            (y * 2) / Math.PI,
          ];
        },
        from(coordinates) {
          const x = coordinates[0];
          const y = Math.min(Math.max(coordinates[1], -WAGNER_6_U_LAT), +WAGNER_6_U_LAT);
          const t = y / 2;
          return [
            (x * Math.PI) / Math.sqrt(1 - 3 * t * t) / RADIANS,
            (y * Math.PI) / 2 / RADIANS,
          ];
        },
      },
    };
  },
};
</script>
<style>
#vector-map {
  height: 400px;
}
</style>
