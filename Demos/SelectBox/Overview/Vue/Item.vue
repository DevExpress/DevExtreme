<template>
  <div class="custom-item">
    <img :src="itemData.ImageSrc">
    <div class="product-name">
      {{ itemData.Name }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    itemData: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
