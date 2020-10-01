<template>
  <DxRangeSelector
    id="range-selector"
    v-model:value="range"
    title="Select a Time Period"
  >
    <DxMargin
      :top="50"
      :bottom="0"
    />
    <DxBackground>
      <DxImage
        url="../../../../images/RangeSelector/background.png"
        location="full"
      />
    </DxBackground>
    <DxIndent
      :left="65"
      :right="65"
    />
    <DxSliderMarker
      :placeholder-height="30"
      format="shorttime"
    />
    <DxScale
      :start-value="startValue"
      :end-value="endValue"
      :placeholder-height="20"
    >
      <DxTickInterval :hours="2"/>
      <DxMinorTickInterval :hours="1"/>
      <DxLabel format="shorttime"/>
    </DxScale>
  </DxRangeSelector>
</template>
<script>
import {
  DxRangeSelector,
  DxMargin,
  DxBackground,
  DxImage,
  DxIndent,
  DxSliderMarker,
  DxScale,
  DxTickInterval,
  DxMinorTickInterval,
  DxLabel
} from 'devextreme-vue/range-selector';

export default {
  components: {
    DxRangeSelector,
    DxMargin,
    DxBackground,
    DxImage,
    DxIndent,
    DxSliderMarker,
    DxScale,
    DxTickInterval,
    DxMinorTickInterval,
    DxLabel
  },
  data() {
    return {
      startValue: new Date(2012, 8, 29, 0, 0, 0),
      endValue: new Date(2012, 8, 29, 24, 0, 0),
      range: [new Date(2012, 8, 29, 11, 0, 0), new Date(2012, 8, 29, 17, 0, 0)]
    };
  }
};
</script>
<style scoped>
#range-selector {
  height: 300px;
}
</style>
