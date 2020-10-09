<template>
  <div>
    <DxMap
      :zoom="14"
      :height="440"
      :controls="true"
      :markers="markersData"
      v-model:routes="routesData"
      center="Brooklyn Bridge,New York,NY"
      width="100%"
      provider="bing"
    />
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Set mode </span>
        <DxSelectBox
          :items="routeModes"
          :on-value-changed="updateRoutesMode"
          value="driving"
        />
      </div>
      <div class="option">
        <span>Route color </span>
        <DxSelectBox
          :items="routeColors"
          :on-value-changed="updateRoutesColor"
          value="blue"
        />
      </div>
    </div>
  </div>
</template>
<script>

import { markersData, routesData } from './data.js';

import DxMap from 'devextreme-vue/map';
import DxSelectBox from 'devextreme-vue/select-box';

export default {
  components: {
    DxMap,
    DxSelectBox
  },
  data: function() {
    return {
      markersData,
      routesData,
      routeModes: ['driving', 'walking'],
      routeColors: ['blue', 'green', 'red']
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
    }
  }
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
}

.option > span {
  display: inline-block;
  width: 94px;
}

.option > .dx-selectbox {
  width: 100%;
  max-width: 350px;
  display: inline-block;
  vertical-align: middle;
}
</style>
