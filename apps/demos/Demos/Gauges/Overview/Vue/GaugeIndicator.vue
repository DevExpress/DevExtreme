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
<script setup lang="ts">
import DxCircularGauge, {
  DxSize,
  DxValueIndicator,
  DxGeometry,
  DxScale,
} from 'devextreme-vue/circular-gauge';

withDefaults(defineProps<{
  value?: number
  startAngle?: number
  endAngle?: number
  inverted?: boolean
}>(), {
  value: 0,
  startAngle: 0,
  endAngle: 90,
  inverted: true,
});
</script>
