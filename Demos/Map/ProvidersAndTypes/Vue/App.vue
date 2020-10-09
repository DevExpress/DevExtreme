<template>
  <div>
    <DxMap
      :zoom="14"
      :height="400"
      v-model:type="mapTypeValue"
      center="Brooklyn Bridge,New York,NY"
      width="100%"
      provider="bing"
    >
      <DxKey
        :bing="keys.bing"
        :google="keys.google"
        :google-static="keys.googleStatic"
      />
    </DxMap>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Map Type </span>
        <DxSelectBox
          v-model:value="mapTypeValue"
          :data-source="mapTypes"
          display-expr="name"
          value-expr="key"
        />
      </div>
    </div>
  </div>
</template>
<script>

import { DxMap, DxKey } from 'devextreme-vue/map';
import DxSelectBox from 'devextreme-vue/select-box';
import { mapTypes } from './data.js';

export default {
  components: {
    DxMap,
    DxSelectBox,
    DxKey
  },
  data() {
    return {
      keys: {
        // NOTE: Specify your map API keys for every used provider
        //bing: "YOUR_BING_MAPS_API_KEY",
        //google: "YOUR_GOOGLE_MAPS_API_KEY",
        //googleStatic: "YOUR_GOOGLE_STATIC_MAPS_API_KEY"
      },
      mapTypes,
      mapTypeValue: mapTypes[0].key
    };
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
    width: 104px;
}

.option > .dx-selectbox {
    width: 100%;
    max-width: 350px;
    display: inline-block;
    vertical-align: middle;
}
</style>
