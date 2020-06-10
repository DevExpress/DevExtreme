<template>
  <div
    :style="{backgroundImage: 'url(' + itemData.ImageSrc + ')'}"
    class="dx-tile-image"
  />
</template>
<script>
export default {
  props: {
    itemData: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
<style scoped>
  .dx-tile-image {
    height: 100%;
    width: 100%;
    background-position: center;
    background-size: cover;
    display: block;
  }
</style>
