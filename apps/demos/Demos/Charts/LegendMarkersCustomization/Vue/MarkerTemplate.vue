<template>
  <svg>
    <rect
      :x="0"
      :y="0"
      :width="18"
      :height="18"
      :fill="color"
      :opacity="0.3"
    />
    <path
      :d="d"
      :fill="color"
    />
  </svg>
</template>
<script setup lang="ts">
const props = withDefaults(defineProps<{
  item?: Record<string, any>
}>(), {
  item: () => ({}),
});

const markerPath = {
  'Original Signal': 'M 0 8 C 2 4 7 4 9.5 8 C 11 12 16 12 18 8 L 18 10 C 16 14 11 14 8.5 10 C 7 6 2 6 0 10 Z',
  'Noisy Signal': 'M 18 8 L 12 12 L 7 3 L 0 7.4 L 0 10 L 6 6 L 11 15 L 18 10.6 Z',
};
const color = props.item.series.isVisible() ? props.item.marker.fill : '#888';
const d = markerPath[props.item.series.name];
</script>
