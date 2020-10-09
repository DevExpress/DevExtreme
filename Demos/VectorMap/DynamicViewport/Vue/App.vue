<template>
  <div>
    <DxVectorMap
      id="vector-map"
      ref="map"
      :bounds="bounds"
      @center-changed="centerChanged"
      @zoom-factor-changed="zoomFactorChanged"
    >
      <DxLayer
        :data-source="world"
      />

    </DxVectorMap>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Continent </span>
        <SelectBox
          :data-source="viewportCoordinates"
          :value="viewportCoordinates[0].coordinates"
          :on-value-changed="continentChanged"
          value-expr="coordinates"
          display-expr="continent"
        />
      </div>
      <div class="option">
        <span>Zoom factor </span>
        <TextBox
          :value="zoomFactor"
          :read-only="true"
        />
      </div>
      <div class="option">
        <span>Center </span>
        <TextBox
          :value="center"
          :read-only="true"
        />
      </div>
    </div>
  </div>
</template>
<script>

import {
  DxVectorMap,
  DxLayer
} from 'devextreme-vue/vector-map';

import TextBox from 'devextreme-vue/text-box';
import SelectBox from 'devextreme-vue/select-box';

import { viewportCoordinates } from './data.js';
import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';

export default {
  components: {
    DxVectorMap,
    DxLayer,
    TextBox,
    SelectBox
  },
  data() {
    return {
      viewportCoordinates,
      world: mapsData.world,
      bounds: [-180, 85, 180, -60],
      center: '0.000, 46.036',
      zoomFactor: '1.00'
    };
  },
  methods:{
    continentChanged({ value }) {
      this.$refs['map'].instance.viewport(value);
    },
    centerChanged({ center }) {
      this.center = `${center[0].toFixed(3)}, ${center[1].toFixed(3)}`;
    },
    zoomFactorChanged({ zoomFactor }) {
      this.zoomFactor = zoomFactor.toFixed(2);
    }
  }
};
</script>
<style>
#vector-map {
    height: 420px;
}

.options {
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    margin-top: 20px;
}

.option {
    margin-top: 10px;
}

.caption {
    font-size: 18px;
    font-weight: 500;
}

.option > span {
    width: 144px;
    display: inline-block;
}

.option > .dx-widget {
    display: inline-block;
    vertical-align: middle;
    width: 210px;
}
</style>
