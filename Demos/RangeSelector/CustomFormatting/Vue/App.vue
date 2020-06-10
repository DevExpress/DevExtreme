<template>
  <DxRangeSelector
    id="range-selector"
    title="Select a Lead Concentration in Water"
  >
    <DxMargin :top="50"/>
    <DxScale
      :minor-tick-interval="0.001"
      :tick-interval="0.005"
      :start-value="0.004563"
      :end-value="0.04976"
    >
      <DxLabel>
        <DxFormat
          :precision="3"
          type="fixedPoint"
        />
      </DxLabel>
    </DxScale>
    <DxSliderMarker
      :customize-text="customizeText"
    >
      <DxFormat
        :precision="4"
        type="fixedPoint"
      />
    </DxSliderMarker>
    <DxBehavior :snap-to-ticks="false"/>
  </DxRangeSelector>
</template>
<script>
import {
  DxRangeSelector,
  DxMargin,
  DxScale,
  DxLabel,
  DxSliderMarker,
  DxFormat,
  DxBehavior
} from 'devextreme-vue/range-selector';

export default {
  components: {
    DxRangeSelector,
    DxMargin,
    DxScale,
    DxLabel,
    DxSliderMarker,
    DxFormat,
    DxBehavior
  },
  methods: {
    customizeText({ valueText }) {
      return `${valueText} mg/L`;
    }
  }
};
</script>
<style scoped>
#range-selector {
  height: 210px;
}
</style>
