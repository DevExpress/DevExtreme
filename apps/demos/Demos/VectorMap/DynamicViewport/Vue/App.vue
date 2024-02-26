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
            <DxSelectBox
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
            <DxTextBox
              :value="currentZoomFactor"
              :input-attr="{ 'aria-label': 'Zoom' }"
              :read-only="true"
              :width="210"
            />
          </div>
          <div class="option">
            <span>Center </span>
            <DxTextBox
              :value="currentCenter"
              :input-attr="{ 'aria-label': 'Center' }"
              :read-only="true"
              :width="210"
            />
          </div>
        </div>
        <div className="column">
          <div class="option">
            <span>Pan control</span>
            <DxSwitch v-model:value="panVisible"/>
          </div>
          <div class="option">
            <span>Zoom bar</span>
            <DxSwitch v-model:value="zoomVisible"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxVectorMap,
  DxLayer,
  DxControlBar,
} from 'devextreme-vue/vector-map';

import DxTextBox from 'devextreme-vue/text-box';
import DxSelectBox from 'devextreme-vue/select-box';
import DxSwitch from 'devextreme-vue/switch';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { viewportCoordinates } from './data.ts';

const world = mapsData.world;
const bounds = [-180, 85, 180, -60];
const currentCenter = ref('0.000, 46.036');
const currentZoomFactor = ref('1.00');
const panVisible = ref(true);
const zoomVisible = ref(true);
const map = ref();

function continentChanged({ value }) {
  map.value.instance.viewport(value);
}
function centerChanged({ center }) {
  currentCenter.value = `${center[0].toFixed(3)}, ${center[1].toFixed(3)}`;
}
function zoomFactorChanged({ zoomFactor }) {
  currentZoomFactor.value = zoomFactor.toFixed(2);
}
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
