<template>
  <DxRangeSelector
    id="range-selector"
    v-model:value="range"
    title="Select House Price Range"
  >
    <DxMargin :top="50"/>
    <DxScale
      :start-value="15000"
      :end-value="150000"
      :minor-tick-interval="500"
      :tick-interval="15000"
    >
      <DxMinorTick :visible="false"/>
      <DxLabel format="currency"/>
    </DxScale>
    <DxSliderMarker format="currency"/>
  </DxRangeSelector>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxRangeSelector,
  DxMargin,
  DxScale,
  DxMinorTick,
  DxLabel,
  DxSliderMarker,
} from 'devextreme-vue/range-selector';

const range = ref([40000, 80000]);
</script>
<style scoped>
#range-selector {
  height: 210px;
}
</style>
