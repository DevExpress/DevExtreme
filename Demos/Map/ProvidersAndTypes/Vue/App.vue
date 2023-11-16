<template>
  <div>
    <DxMap
      :zoom="14"
      :height="400"
      v-model:type="mapTypeValue"
      center="40.7061, -73.9969"
      width="100%"
      provider="bing"
      :api-key="apiKey"
    />
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Map Type </span>
        <DxSelectBox
          v-model:value="mapTypeValue"
          :data-source="mapTypes"
          :input-attr="{ 'aria-label': 'Map Type' }"
          display-expr="name"
          value-expr="key"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxMap from 'devextreme-vue/map';
import DxSelectBox from 'devextreme-vue/select-box';
import { mapTypes } from './data.js';

const apiKey = {
  bing: 'Aq3LKP2BOmzWY47TZoT1YdieypN_rB6RY9FqBfx-MDCKjvvWBbT68R51xwbL-AqC',
};
const mapTypeValue = ref(mapTypes[0].key);
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
  width: 100px;
}

.option > .dx-selectbox {
  width: 100%;
  max-width: 350px;
  display: inline-block;
  vertical-align: middle;
}
</style>
