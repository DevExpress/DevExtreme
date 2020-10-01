<template>
  <DxRangeSelector
    id="range-selector"
    v-model:value="range"
    title="Select a Vacation Period"
  >
    <DxMargin :top="50"/>
    <DxScale
      :start-value="startValue"
      :end-value="endValue"
    >
      <DxMinorTick :visible="false"/>
      <DxMinorTickInterval :days="1"/>
      <DxTickInterval :weeks="1"/>
      <DxMinRange :weeks="1"/>
      <DxMaxRange :months="1"/>
    </DxScale>
    <DxSliderMarker format="monthAndDay"/>
  </DxRangeSelector>
</template>
<script>
import {
  DxRangeSelector,
  DxMargin,
  DxScale,
  DxMinorTick,
  DxMinorTickInterval,
  DxTickInterval,
  DxMinRange,
  DxMaxRange,
  DxSliderMarker
} from 'devextreme-vue/range-selector';

export default {
  components: {
    DxRangeSelector,
    DxMargin,
    DxScale,
    DxMinorTick,
    DxMinorTickInterval,
    DxTickInterval,
    DxMinRange,
    DxMaxRange,
    DxSliderMarker
  },
  data() {
    return {
      startValue: new Date(2011, 1, 1),
      endValue: new Date(2011, 6, 1),
      range: [new Date(2011, 1, 5), new Date(2011, 2, 5)]
    };
  }
};
</script>
<style scoped>
#range-selector {
  height: 250px;
}
</style>
