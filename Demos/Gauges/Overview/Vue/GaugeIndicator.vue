<template>
  <DxCircularGauge :value="value">
    <DxSize
      :width="90"
      :height="90"
    />
    <DxValueIndicator color="#f05b41"/>
    <DxGeometry
      :start-angle="startAngle"
      :end-angle="endAngle"
    />
    <DxScale
      :start-value="inverted ? 100 : 0"
      :end-value="inverted ? 0 : 100"
      :tick-interval="50"
    />
  </DxCircularGauge>
</template>
<script>

import DxCircularGauge, {
  DxSize,
  DxValueIndicator,
  DxGeometry,
  DxScale
} from 'devextreme-vue/circular-gauge';

export default {
  components: {
    DxCircularGauge,
    DxSize,
    DxValueIndicator,
    DxGeometry,
    DxScale
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    startAngle: {
      type: Number,
      default: 0
    },
    endAngle: {
      type: Number,
      default: 90
    },
    inverted: {
      type: Boolean,
      default: true
    }
  }
};
</script>
