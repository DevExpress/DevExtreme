<template>
  <div>
    <DxMap
      :zoom="11"
      :height="440"
      :controls="true"
      v-model:markers="markers"
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
<script setup lang="ts">
import { ref } from 'vue';
import DxMap from 'devextreme-vue/map';
import DxCheckBox from 'devextreme-vue/check-box';
import DxButton from 'devextreme-vue/button';
import { markersData } from './data.ts';

const markerUrl = 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/maps/map-marker.png';
const markersIcon = ref(markerUrl);
const apiKey = {
  bing: 'Aq3LKP2BOmzWY47TZoT1YdieypN_rB6RY9FqBfx-MDCKjvvWBbT68R51xwbL-AqC',
};
const markers = ref(markersData);
function useCustomMarkers(data) {
  markersIcon.value = data.value ? markerUrl : null;
  markers.value = markersData;
}
function showTooltips() {
  markers.value = markersData.map((item) => {
    const newItem = JSON.parse(JSON.stringify(item));
    newItem.tooltip.isShown = true;
    return newItem;
  });
}

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
