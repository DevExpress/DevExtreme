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
<script>

const markerPath = {
  'Original Signal': 'M 0 8 C 2 4 7 4 9.5 8 C 11 12 16 12 18 8 L 18 10 C 16 14 11 14 8.5 10 C 7 6 2 6 0 10 Z',
  'Noisy Signal': 'M 18 8 L 12 12 L 7 3 L 0 7.4 L 0 10 L 6 6 L 11 15 L 18 10.6 Z'
};

export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      color: this.item.series.isVisible() ? this.item.marker.fill : '#888',
      d: markerPath[this.item.series.name]
    };
  }
};
</script>
