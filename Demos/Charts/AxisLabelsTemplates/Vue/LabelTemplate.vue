<template>
  <svg overflow="visible">
    <image
      filter="url(#DevExpress_shadow_filter)"
      y="0"
      width="60"
      height="40"
      :href="getFilePath(data.valueText)"
    />
    <text
      class="template-text"
      x="30"
      y="59"
      text-anchor="middle"
    >
      {{ data.valueText }}
    </text>
  </svg>
</template>
<script>

export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    getFilePath: (text) => `../../../../images/flags/3x2/${text.toLowerCase().replace(' ', '')}.svg`
  }
};
</script>
<style scoped>
.template-text {
    fill: #767676;
    font-family: "Segoe UI", "Helvetica Neue", "Trebuchet MS", Verdana, sans-serif;
    font-weight: 400;
    font-size: 13px;
}
</style>
