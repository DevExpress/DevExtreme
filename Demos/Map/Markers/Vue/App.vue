<template>
  <div>
    <DxMap
      :zoom="11"
      :height="440"
      :controls="true"
      v-model:markers="markersData"
      v-model:marker-icon-src="markersIcon"
      center="Brooklyn Bridge,New York,NY"
      width="100%"
      provider="bing"
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

import { markersData } from './data.js';

import DxMap from 'devextreme-vue/map';
import DxCheckBox from 'devextreme-vue/check-box';
import DxButton from 'devextreme-vue/button';

const markerUrl = 'https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png';

export default {
  components: {
    DxMap,
    DxCheckBox,
    DxButton
  },
  data: function() {
    return {
      markersData,
      markersIcon: markerUrl
    };
  },
  methods: {
    useCustomMarkers(data) {
      this.markersIcon = data.value ? markerUrl : null;
      this.markersData = markersData;
    },
    showTooltips() {
      this.markersData = this.markersData.map(function(item) {
        let newItem = JSON.parse(JSON.stringify(item));
        newItem.tooltip.isShown = true;
        return newItem;
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
</style>
