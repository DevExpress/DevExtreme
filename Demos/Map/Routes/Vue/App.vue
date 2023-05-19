<template>
  <div>
    <DxMap
      :zoom="14"
      :height="440"
      :controls="true"
      :markers="markersData"
      v-model:routes="routesData"
      width="100%"
      provider="bing"
      :api-key="apiKey"
    />
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Set mode </span>
        <DxSelectBox
          :items="routeModes"
          :input-attr="{ 'aria-label': 'Mode' }"
          :on-value-changed="updateRoutesMode"
          value="driving"
        />
      </div>
      <div class="option">
        <span>Route color </span>
        <DxSelectBox
          :items="routeColors"
          :input-attr="{ 'aria-label': 'Color' }"
          :on-value-changed="updateRoutesColor"
          value="blue"
        />
      </div>
    </div>
  </div>
</template>
<script>

import DxMap from 'devextreme-vue/map';
import DxSelectBox from 'devextreme-vue/select-box';
import { markersData, routesData } from './data.js';

export default {
  components: {
    DxMap,
    DxSelectBox,
  },
  data() {
    return {
      markersData,
      routesData,
      routeModes: ['driving', 'walking'],
      routeColors: ['blue', 'green', 'red'],
      apiKey: {
        bing: 'Aq3LKP2BOmzWY47TZoT1YdieypN_rB6RY9FqBfx-MDCKjvvWBbT68R51xwbL-AqC',
      },
    };
  },
  methods: {
    updateRoutesMode({ value: mode }) {
      this.routesData = this.routesData.map((item) => {
        item.mode = mode;
        return item;
      });
    },
    updateRoutesColor({ value: color }) {
      this.routesData = this.routesData.map((item) => {
        item.color = color;
        return item;
      });
    },
  },
};
</script>
<style>
.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  margin-top: 20px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.option > span {
  display: inline-block;
  width: 90px;
}

.option > .dx-selectbox {
  width: 100%;
  max-width: 350px;
  display: inline-block;
  vertical-align: middle;
}
</style>
