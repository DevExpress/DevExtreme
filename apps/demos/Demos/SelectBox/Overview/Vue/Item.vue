<template>
  <div class="custom-item">
    <img
      alt="Product name"
      :src="itemData.ImageSrc"
    >
    <div class="product-name">
      {{ itemData.Name }}
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  itemData?: Record<string, any>
}>(), {
  itemData: () => {},
});
</script>
