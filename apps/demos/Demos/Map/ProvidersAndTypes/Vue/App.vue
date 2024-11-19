<template>
  <div>
    <DxMap
      :zoom="14"
      :height="400"
      v-model:type="mapTypeValue"
      center="40.7061, -73.9969"
      width="100%"
      v-model:provider="mapProviderValue"
      :api-key="apiKey"
    />
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Map Provider </span>
        <DxSelectBox
          v-model:value="mapProviderValue"
          :data-source="mapProviders"
          :input-attr="{ 'aria-label': 'Map Provider' }"
          display-expr="name"
          value-expr="key"
        />
      </div>
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
import { mapTypes, mapProviders } from './data.ts';

const apiKey = {
  azure: '6N8zuPkBsnfwniNAJkldM3cUgm3lXg3y9gkIKy59benICnnepK4DJQQJ99AIACYeBjFllM6LAAAgAZMPGFXE',
  bing: 'Aq3LKP2BOmzWY47TZoT1YdieypN_rB6RY9FqBfx-MDCKjvvWBbT68R51xwbL-AqC',
  google: 'AIzaSyBIw1-l1otL9v1bY-OR4p9w21l1VLu9L2k',
};
const mapTypeValue = ref(mapTypes[0].key);
const mapProviderValue = ref(mapProviders[0].key);
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
