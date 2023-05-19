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
      <DxControlBar
        v-model:pan-visible="panVisible"
        v-model:zoom-visible="zoomVisible"
      />
    </DxVectorMap>
    <div class="options">
      <div class="caption">Options</div>
      <div className="wrapper-option">
        <div className="column">
          <div class="option">
            <span>Continent </span>
            <SelectBox
              :data-source="viewportCoordinates"
              :value="viewportCoordinates[0].coordinates"
              :on-value-changed="continentChanged"
              :input-attr="{ 'aria-label': 'Continent' }"
              value-expr="coordinates"
              display-expr="continent"
              :width="210"
            />
          </div>
          <div class="option">
            <span>Zoom factor </span>
            <TextBox
              :value="zoomFactor"
              :input-attr="{ 'aria-label': 'Zoom' }"
              :read-only="true"
              :width="210"
            />
          </div>
          <div class="option">
            <span>Center </span>
            <TextBox
              :value="center"
              :input-attr="{ 'aria-label': 'Center' }"
              :read-only="true"
              :width="210"
            />
          </div>
        </div>
        <div className="column">
          <div class="option">
            <span>Pan control</span>
            <Switch v-model:value="panVisible"/>
          </div>
          <div class="option">
            <span>Zoom bar</span>
            <Switch v-model:value="zoomVisible"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import {
  DxVectorMap,
  DxLayer,
  DxControlBar,
} from 'devextreme-vue/vector-map';

import TextBox from 'devextreme-vue/text-box';
import SelectBox from 'devextreme-vue/select-box';
import Switch from 'devextreme-vue/switch';

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { viewportCoordinates } from './data.js';

export default {
  components: {
    DxVectorMap,
    DxLayer,
    TextBox,
    SelectBox,
    Switch,
    DxControlBar,
  },
  data() {
    return {
      viewportCoordinates,
      world: mapsData.world,
      bounds: [-180, 85, 180, -60],
      center: '0.000, 46.036',
      zoomFactor: '1.00',
      panVisible: true,
      zoomVisible: true,
    };
  },
  methods: {
    continentChanged({ value }) {
      this.$refs.map.instance.viewport(value);
    },
    centerChanged({ center }) {
      this.center = `${center[0].toFixed(3)}, ${center[1].toFixed(3)}`;
    },
    zoomFactorChanged({ zoomFactor }) {
      this.zoomFactor = zoomFactor.toFixed(2);
    },
  },
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

.wrapper-option {
  display: flex;
  gap: 24px;
  padding-top: 16px;
}

.column {
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.option {
  display: flex;
  align-items: center;
  min-height: 34px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option > span {
  width: 140px;
}
</style>
