<template>
  <div>
    <DxMap
      :zoom="11"
      :height="440"
      :controls="true"
      v-model:markers="markersData"
      v-model:marker-icon-src="markersIcon"
      width="100%"
      provider="bing"
      :api-key="apiKey"
    />
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          :value="true"
          :on-value-changed="useCustomMarkers"
          text="Use custom marker icons"
        />
      </div>
      <div class="option">
        <DxButton
          :on-click="showTooltips"
          text="Show all tooltips"
        />
      </div>
    </div>
  </div>
</template>
<script>

import DxMap from 'devextreme-vue/map';
import DxCheckBox from 'devextreme-vue/check-box';
import DxButton from 'devextreme-vue/button';
import { markersData } from './data.js';

const markerUrl = 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/maps/map-marker.png';

export default {
  components: {
    DxMap,
    DxCheckBox,
    DxButton,
  },
  data() {
    return {
      markersData,
      markersIcon: markerUrl,
      apiKey: {
        bing: 'Aq3LKP2BOmzWY47TZoT1YdieypN_rB6RY9FqBfx-MDCKjvvWBbT68R51xwbL-AqC',
      },
    };
  },
  methods: {
    useCustomMarkers(data) {
      this.markersIcon = data.value ? markerUrl : null;
      this.markersData = markersData;
    },
    showTooltips() {
      this.markersData = this.markersData.map((item) => {
        const newItem = JSON.parse(JSON.stringify(item));
        newItem.tooltip.isShown = true;
        return newItem;
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
}
</style>
