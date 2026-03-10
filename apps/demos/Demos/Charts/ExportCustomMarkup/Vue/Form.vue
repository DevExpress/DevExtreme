<template>
  <div class="custom_markup_container">
    <svg
      version="1.1"
      width="820px"
      height="420px"
    >
      <path
        d="M 0 0 L 820 0 L 820 420 L 0 420 L 0 0"
        stroke="#999999"
        stroke-width="1"
        stroke-linecap="butt"
        fill="white"
        stroke-linejoin="miter"
      />
      <path
        d="M 13 407 L 128 407 L 232 39 L 13 39"
        fill="#6D39C3"
      />
      <path
        d="M 46 381 L 161 381 L 265 13 L 46 13"
        opacity="0.5"
        fill="#6D39C3"
      />
      <text
        transform="translate(30,89)"
        class="custom_markup_text custom_markup_text--title"
      >
        <tspan
          x="0"
          y="0"
        >Export </tspan>
        <tspan
          x="0"
          y="38"
        >Custom</tspan>
        <tspan
          x="0"
          y="76"
        >Markup</tspan>
      </text>
      <text
        transform="translate(32,199)"
        class="custom_markup_text custom_markup_text--subtitle"
      >
        <tspan
          x="0"
          y="0"
        >Export a chart with</tspan>
        <tspan
          x="0"
          y="19.2"
        >custom elements</tspan>
      </text>
    </svg>
  </div>
</template>
<script setup lang="ts">

defineExpose({
  getMarkup(): HTMLElement {
    // @ts-ignore
    return this.$el;
  },
});
</script>
<style>
.custom_markup_text {
  fill: #ffffff;
  font-family: 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif;
}

.custom_markup_text--title {
  font-size: 36px;
  font-weight: bold;
}

.custom_markup_text--subtitle {
  font-size: 14px;
  opacity: 0.8;
}
</style>
